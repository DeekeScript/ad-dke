<?php

namespace app\model;

use app\validate\Agent as ValidateAgent;
use app\validate\Machine as ValidateMachine;
use Exception;
use think\exception\ValidateException;
use think\facade\Db;
use think\Model;

class Machine extends Model
{

    public function generateSecret(int $id)
    {
        return sha1('secret:' . $id . ':' . microtime(true));
    }

    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['name']) && $params['name']) {
            $where[] = ['name', 'like', $params['name'] . '%'];
        }

        if (isset($params['mid']) && $params['mid']) {
            $where[] = ['mid', '=', $params['mid']];
        }

        if (isset($params['id']) && $params['id']) {
            $where[] = ['id', '=', $params['id']];
        }

        if (User::ROLE_TYPE[0] === $params['role_type'] && isset($params['agent_user_id'])) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (User::ROLE_TYPE[2] !== $params['role_type'] && $params['p_user_id']) {
            $where[] = ['user_id', '=', $params['p_user_id']];
        }

        if (User::ROLE_TYPE[1] === $params['role_type']) {
            $where[] = ['agent_user_id', '=', $params['user_id']];
        } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
            $where[] = ['user_id', '=', $params['user_id']];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('id desc')->select()->toArray();

        if ($data) {
            $ids = array_column($data, 'user_id');
            $agents = (new Agent())->whereIn('id', $ids)->field(['user_id', 'name'])->select()->toArray();
            $agents = array_column($agents, 'name', 'user_id');
            $data = array_map(static function ($item) use ($agents) {
                $item['agent_name'] = $agents[$item['user_id']] ?? '-';
                return $item;
            }, $data);
        }

        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        //代理商
        if (User::ROLE_TYPE[1] === $params['role_type']) {
            $params['agent_user_id'] = $params['user_id'];
        }

        $params['secret'] = $this->generateSecret($params['agent_user_id']);
        try {
            $agent_user_id = 0;
            validate(ValidateMachine::class)->check($params);
            if (User::ROLE_TYPE[0] === $params['role_type']) {
                $agent = (new Agent())->where('user_id', $params['agent_user_id'])->find();
                if (!$agent) {
                    return ['code' => 1, 'msg' => '代理商不存在'];
                }
                $agent_user_id = $agent->getAttr('user_id');
            }
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        try {
            Db::startTrans();
            if (self::where([['name', '=', $params['name']], ['agent_user_id', '=', $params['agent_user_id']]])->count()) {
                throw new Exception('名称不能重复');
            }

            if (!(new Agent())->incMachine($params['agent_user_id'], -1)) {
                throw new Exception('代理商机器数量不足，请联系管理员添加');
            }

            $model = new self();
            $model->setAttr('id', $this->generateId());
            $model->setAttr('name', $params['name']);
            $model->setAttr('number', $params['number'] ?? '001');
            $model->setAttr('secret', $params['secret']);
            $model->setAttr('type', $params['type']);
            if (User::ROLE_TYPE[0] === $params['role_type']) {
                $model->setAttr('agent_user_id', $agent_user_id);
            } else {
                $model->setAttr('agent_user_id', $params['user_id']);
            }

            $model->setAttr('desc', $params['desc'] ?? '');
            $model->setAttr('created_at', time());
            $model->setAttr('start_time', time());
            $model->setAttr('end_time', strtotime('+1 year'));
            $model->save();
            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    private function generateId()
    {
        $id = self::where('deleted', 0)->max('id');
        $model = self::where('id', $id)->find();
        return $id + round(rand(0, 1)) + ceil((time() - ($model ? $model->getAttr('created_at') : 0)) / 600);
    }

    public function edit(array $params)
    {
        if (!isset($params['id']) || empty($params['id'])) {
            return ['code' => 1, 'msg' => '操作有误'];
        }

        $agent_user_id = 0;
        try {
            validate(ValidateMachine::class)->scene('edit')->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getError()];
        }

        $mWhere = [
            ['name', '=', $params['name']],
            ['id', '<>', $params['id']],
        ];

        //代理商
        if (User::ROLE_TYPE[1] === $params['role_type']) {
            $mWhere[] = ['agent_user_id', '=', $params['user_id']];
        }

        try {
            Db::startTrans();
            if (self::where($mWhere)->count()) {
                throw new Exception('名称不能重复');
            }

            $where = [['id', '=', $params['id']], ['deleted', '=', 0]];
            if ($params['role_type'] === User::ROLE_TYPE[1]) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            } elseif ($params['role_type'] === User::ROLE_TYPE[2]) {
                $where[] = ['user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '不存在'];
            }

            if (User::ROLE_TYPE[0] === $params['role_type']) {
                $agent_user_id = $model->getAttr('agent_user_id');
            }

            $model->setAttr('name', $params['name']);
            $model->setAttr('number', $params['number'] ?? '001');
            $model->setAttr('type', $params['type']);
            if (User::ROLE_TYPE[0] === $params['role_type']) {
                $model->setAttr('agent_user_id', $agent_user_id);
                //$model->setAttr('mid', $params['mid']);
            } else {
                $model->setAttr('agent_user_id', $params['user_id']);
            }
            $model->setAttr('desc', $params['desc'] ?? '');
            $model->save();
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
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $where[] = ['user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '不存在'];
            }
            if (!(new Agent())->incMachine($model->getAttr('agent_user_id'), 1)) {
                throw new Exception('代理商机器数量不足，请联系管理员添加');
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

    public function getMachine(array $params, int $type = 0)
    {
        $where = [['deleted', '=', 0]];

        if (User::ROLE_TYPE[0] === $params['role_type'] && isset($params['agent_user_id'])) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (User::ROLE_TYPE[2] !== $params['role_type'] && isset($params['p_user_id'])) {
            $where[] = ['user_id', '=', $params['p_user_id']];
        }

        if (User::ROLE_TYPE[1] === $params['role_type']) {
            $where[] = ['agent_user_id', '=', $params['user_id']];
        } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
            $where[] = ['user_id', '=', $params['user_id']];
        }
        $data = self::where($where)->field(['id', 'name', 'user_id'])->order('agent_user_id desc ,id desc')->select()->toArray();
        return ['data' => array_map(function ($item) {
            return ['label' => $item['name'], 'value' => $item['id'], 'disabled' => !!$item['user_id']];
        }, $data)];
    }
}
