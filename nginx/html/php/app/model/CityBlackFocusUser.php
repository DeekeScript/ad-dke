<?php

namespace app\model;

use app\validate\User as ValidateUser;
use Exception;
use think\exception\ValidateException;
use think\facade\Config;
use think\facade\Db;
use think\Model;

class CityBlackFocusUser extends Model
{
    public const ROLE_TYPE = [0, 1, 2]; //分别对应管理员，代理，用户
    public const TYPE = [0, 1, 2, 3]; //1年，1月，3天，3月
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['b.deleted', '=', 0]];
        if (isset($params['account']) && $params['account']) {
            $where[] = ['u.account', 'like', $params['account'] . '%'];
        }

        if (isset($params['nickname']) && $params['nickname']) {
            $where[] = ['u.nickname', 'like', $params['nickname'] . '%'];
        }

        //如果是代理则展示代理下面的用户，否则返回空数据
        if ($params['role_type'] === self::ROLE_TYPE[1]) {
            $where[] = ['b.agent_user_id', '=', $params['user_id']];
        }

        $total = self::alias('b')->join(Config::get('database.prefix') . (new CityFocusUser())->getTable() . ' u', 'u.id = b.dy_user_id')->where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::alias('b')->field(['u.account, u.nickname, u.machine_id, b.dy_user_id, b.created_at, b.id'])
            ->join(Config::get('database.prefix') . (new CityFocusUser())->getTable() . ' u', 'u.id = b.dy_user_id')->where($where)->order('b.id desc')->select()->toArray();
        return ['total' => $total, 'data' => $data];
    }

    public function getAccount(array $params = [])
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['agent_user_id'])) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (isset($params['machine_id'])) {
            $where[] = ['machine_id', '=', $params['machine_id']];
        }

        $res = self::field('dy_user_id')->where($where)->select()->toArray();
        if (!$res) {
            return [];
        }

        $res = CityFocusUser::where([['id', 'in', array_column($res, 'account')]])->field(['account'])->select()->toArray();
        return array_column($res, 'account');
    }

    public function blackFocusUser(array $params)
    {
        Db::startTrans();
        try {
            $cityUser = (new CityFocusUser())->where([['id', '=', $params['id']]])->find();
            if (!$cityUser) {
                Db::rollback();
                return ['code' => 1, 'msg' => '操作有误'];
            }

            $cityUser->setAttr('deleted', 1);
            $cityUser->save();

            $model = new self();
            $model->setAttr('machine_id', $cityUser->getAttr('machine_id'));
            $model->setAttr('agent_user_id', $cityUser->getAttr('agent_user_id')); //代理商只能添加商户，管理员只能添加代理商
            $model->setAttr('dy_user_id', $cityUser->getAttr('id'));
            $model->setAttr('created_at', time());
            $model->save();
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
                }
            }

            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function remove(array $params)
    {
        try {
            Db::startTrans();
            $where = [['deleted', '=', 0], ['id', '=', $params['id'] ?? 0]];

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '不存在'];
            }
            $model->deleted = 1;
            $model->save();
            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
