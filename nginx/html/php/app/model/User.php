<?php

namespace app\model;

use app\validate\User as ValidateUser;
use Exception;
use think\exception\ValidateException;
use think\facade\Cache;
use think\facade\Db;
use think\Model;

class User extends Model
{
    public const ROLE_TYPE = [0, 1, 2]; //分别对应管理员，代理，用户
    public const TYPE = [0, 1, 2, 3]; //1年，1月，3天，3月
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['name']) && $params['name']) {
            $where[] = ['name', 'like', $params['name'] . '%'];
        }

        if (isset($params['mobile']) && $params['mobile']) {
            $where[] = ['mobile', 'like', $params['mobile'] . '%'];
        }

        //如果是代理则展示代理下面的用户，否则返回空数据
        if ($params['role_type'] === self::ROLE_TYPE[1]) {
            $where[] = ['agent_user_id', '=', $params['user_id']];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->field(['id', 'name', 'mobile', 'state', 'role_type', 'type', 'created_at'])->order('id desc')->select()->toArray();
        $machine = (new Machine())->where([['user_id', 'in', array_column($data, 'id')]])->field(['user_id', 'id', 'name'])->select()->toArray();
        $data = array_map(function ($item) use ($machine) {
            $item['machine_id'] = [];
            $item['machine_name'] = [];
            foreach ($machine as $m) {
                if ($m['user_id'] === $item['id']) {
                    $item['machine_id'][] = $m['id'];
                    $item['machine_name'][] = $m['name'];
                }
            }
            return $item;
        }, $data);

        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        if (!isset($params['type'])) {
            $params['type'] = 0;
        }

        try {
            validate(ValidateUser::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        $salt = rand(10000, 99999);

        if (self::where([['name', '=', $params['name']], ['deleted', '=', 0]])->count()) {
            //return ['code' => 1, 'msg' => '名称已被使用'];
        }

        if (self::where([['mobile', '=', $params['mobile']], ['deleted', '=', 0]])->count()) {
            return ['code' => 1, 'msg' => '手机号已被使用'];
        }

        Db::startTrans();
        try {
            $model = new self();
            $model->setAttr('name', $params['name']);
            $model->setAttr('role_type', $params['role_type'] + 1); //代理商只能添加商户，管理员只能添加代理商
            $model->setAttr('type', $params['type']);
            $model->setAttr('mobile', $params['mobile']);
            $model->setAttr('state', $params['state']);
            $model->setAttr('password', sha1($params['password'] . $salt));
            $model->setAttr('salt', $salt);
            $model->setAttr('created_at', time());

            //如果是代理则把代理数据填入
            if ($params['role_type'] === self::ROLE_TYPE[1]) {
                $model->setAttr('agent_user_id', $params['user_id']);
            }
            $model->save();

            $machines = (new Machine())->where([['id', 'in', $params['machine_id']]])->select();
            foreach ($machines as $machine) {
                if ($machine->getAttr('user_id')) {
                    throw new Exception('机器已经被添加，请重新打开添加页面重试');
                }
                $machine->setAttr('user_id', $model->getAttr('id'));
                $machine->save();
            }

            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function edit(array $params)
    {
        if (!isset($params['type'])) {
            $params['type'] = 0;
        }

        if (!isset($params['id']) || empty($params['id'])) {
            return ['code' => 1, 'msg' => '操作有误'];
        }

        try {
            validate(ValidateUser::class)->scene('edit')->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getError()];
        }

        if (self::where([['name', '=', $params['name']], ['id', '<>', $params['id']], ['deleted', '=', 0]])->count()) {
            return ['code' => 1, 'msg' => '名称已被使用'];
        }

        if (self::where([['mobile', '=', $params['mobile']], ['id', '<>', $params['id']], ['deleted', '=', 0]])->count()) {
            return ['code' => 1, 'msg' => '手机号已被使用'];
        }

        if ($params['id'] === $params['user_id'] && $params['state'] === 0) {
            return ['code' => 1, 'msg' => '不能将自己的状态改为关闭'];
        }

        Db::startTrans();
        try {
            $where = [['id', '=', $params['id']], ['deleted', '=', 0]];
            if ($params['role_type'] === User::ROLE_TYPE[1]) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '用户不存在'];
            }

            $model->setAttr('name', $params['name']);
            $model->setAttr('mobile', $params['mobile']);
            $model->setAttr('type', $params['type']);
            $model->setAttr('state', $params['state']);
            if (isset($params['password']) && $params['password']) {
                $salt = rand(10000, 99999);
                $model->setAttr('password', sha1($params['password'] . $salt));
                $model->setAttr('salt', $salt);
            }

            $model->save();
            if (isset($params['machine_id']) && $params['machine_id']) {
                $machines = (new Machine())->where([['id', 'in', $params['machine_id']]])->select();
                foreach ($machines as $machine) {
                    if ($machine->getAttr('user_id') && $machine->getAttr('user_id') !== $model->getAttr('id')) {
                        throw new Exception('机器已经被添加，请重新打开添加页面重试');
                    }
                    $machine->setAttr('user_id', $model->getAttr('id'));
                    $machine->save();
                }

                $machines = (new Machine())->where([['id', 'notin', $params['machine_id']], ['user_id', '=', $model->getAttr('id')]])->select();
                foreach ($machines as $machine) {
                    $machine->setAttr('user_id', 0);
                    $machine->save();
                    $token = uniqid('token:' . $machine->getAttr('id'));
                    Cache::store('redis')->delete('token:' . $machine->getAttr('id'));
                }
            }

            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function remove(array $params, int $id)
    {
        try {
            Db::startTrans();
            $where = [['deleted', '=', 0], ['id', '=', $id]];
            if (self::ROLE_TYPE[1] === $params['role_type']) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $where[] = ['user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '不存在'];
            }
            $model->deleted = 1;
            $model->save();

            $machines = Machine::where([
                'user_id' => $id,
                'deleted' => 0,
            ])->select();

            if ($machines) {
                foreach ($machines as $machine) {
                    $machine->setAttr('user_id', 0);
                    $machine->save();
                }
            }

            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function editPassword(array $data)
    {
        if (!isset($data['old_password'], $data['password'], $data['repeat_password'])) {
            return ['code' => 1, 'msg' => '操作有误'];
        }

        if ($data['password'] !== $data['repeat_password']) {
            return ['code' => 1, 'msg' => '两次密码输入不一致'];
        }

        $model = self::where([['deleted', '=', 0], ['id', '=', $data['id']]])->find();
        if (!$model) {
            return ['code' => 1, 'msg' => '操作有误'];
        }

        if (sha1($data['old_password'] . $model->getAttr('salt')) !== $model->getAttr('password')) {
            return ['code' => 1, 'msg' => '原密码错误'];
        }

        $salt = rand(10000, 99999);
        try {
            $model->setAttr('salt', $salt);
            $model->setAttr('password', sha1($data['password'] . $salt));
            $model->save();
            return ['code' => 0, 'msg' => '修改成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function login(array $params)
    {
        $user = self::where([
            ['mobile', '=', $params['mobile']],
            ['role_type', '=', $params['role_type']],
            ['state', '=', 1],
            ['deleted', '=', 0]
        ])->find();

        if (!$user) {
            return ['code' => 1, 'msg' => '手机号或者密码错误'];
        }

        if ($user->getAttr('password') !== sha1($params['password'] . $user->getAttr('salt'))) {
            return ['code' => 1, 'msg' => '用户名或者密码错误'];
        }

        if (!$user->getAttr('token')) {
            $user->setAttr('token', md5(microtime(true) . ';' . $user->getAttr('id')));
        }

        $user->save();

        return ['code' => 0, 'msg' => '成功', 'data' => [
            'mobile' => $user->getAttr('mobile'),
            'name' => $user->getAttr('name'),
            'id' => $user->getAttr('id'),
            'token' => $user->getAttr('token'),
            'role_type' => $user->getAttr('role_type')
        ]];
    }

    public function findOneByToken(string $token)
    {
        $user = self::where([
            ['token', '=', $token],
            ['state', '=', 1],
            ['deleted', '=', 0]
        ])->field(['role_type', 'id', 'name', 'mobile'])->find();

        if ($user) {
            return $user->toArray();
        }
        return [];
    }

    public function getIdByUserId(int $id)
    {
        $res = self::where([['id', '=', $id], ['deleted', '=', 0]])->find();
        if ($res) {
            return $res->getAttr('agent_user_id');
        }
        return 0;
    }

    public function getEndTime(int $type, int $baseTime)
    {
        $time = [
            strtotime('+1 year', $baseTime),
            strtotime('+1 month', $baseTime),
            strtotime('+3 day', $baseTime),
            strtotime('+3 month', $baseTime),
        ];

        return $time[$type];
    }
}
