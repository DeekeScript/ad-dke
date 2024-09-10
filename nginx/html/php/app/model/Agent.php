<?php

namespace app\model;

use app\validate\Agent as ValidateAgent;
use Exception;
use think\exception\ValidateException;
use think\Model;

class Agent extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['name']) && $params['name']) {
            $where[] = ['name', 'like', $params['name'] . '%'];
        }

        if (isset($params['weixin']) && $params['weixin']) {
            $where[] = ['weixin', 'like', $params['weixin'] . '%'];
        }

        if (isset($params['douyin']) && $params['douyin']) {
            $where[] = ['douyin', 'like', $params['douyin'] . '%'];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('id desc')->select()->toArray();
        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        try {
            validate(ValidateAgent::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        $user = User::where([['id', '=', $params['user_id']], ['deleted', '=', '0']])->find();
        if (!$user || $user->getAttr('role_type') !== 1) {
            return ['code' => 1, 'msg' => '当前用户不符合条件'];
        }

        if (self::where([['user_id', '=', $params['user_id']], ['deleted', '=', 0]])->count()) {
            return ['code' => 1, 'msg' => '当前用户已经被绑定'];
        }

        try {
            $model = new self();
            $model->setAttr('name', $params['name']);
            $model->setAttr('user_id', $params['user_id']);
            $model->setAttr('mobile', $params['mobile']);
            $model->setAttr('weixin', $params['weixin']);
            $model->setAttr('douyin', $params['douyin'] ?? '');
            $model->setAttr('machine_count', $params['add_machine_count'] ?? 0);
            $model->setAttr('all_machine_count', $params['add_machine_count'] ?? 0);
            $model->setAttr('pay_money', $params['pay_money'] ?? 0);
            $model->setAttr('desc', $params['desc'] ?? '');
            $model->setAttr('open_wx', $params['open_wx'] ?? 0);
            $model->setAttr('created_at', time());
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function edit(array $params)
    {
        if (!isset($params['id']) || empty($params['id'])) {
            return ['code' => 1, 'msg' => '操作有误'];
        }

        $user = User::where([['id', '=', $params['user_id']], ['deleted', '=', '0']])->find();
        if (!$user || $user->getAttr('role_type') !== 1) {
            return ['code' => 1, 'msg' => '当前用户不符合条件'];
        }

        if (self::where([['user_id', '=', $params['user_id']], ['deleted', '=', 0], ['id', '<>', $params['id']]])->count()) {
            return ['code' => 1, 'msg' => '当前用户已经被绑定'];
        }

        try {
            validate(ValidateAgent::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getError()];
        }

        try {
            $model = self::where('id', $params['id'])->where('deleted', 0)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '代理商不存在'];
            }
            $model->setAttr('name', $params['name']);
            $model->setAttr('user_id', $params['user_id']);
            $model->setAttr('mobile', $params['mobile']);
            $model->setAttr('weixin', $params['weixin']);
            $model->setAttr('douyin', $params['douyin'] ?? '');
            $model->setAttr('machine_count', ($params['add_machine_count'] ?? 0) + $model->getAttr('machine_count'));
            $model->setAttr('all_machine_count', ($params['add_machine_count'] ?? 0) + $model->getAttr('all_machine_count'));
            $model->setAttr('pay_money', $params['pay_money'] ?? 0);
            $model->setAttr('desc', $params['desc'] ?? '');
            $model->setAttr('open_wx', $params['open_wx'] ?? 0);
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function addAgentMachine(int $id, int $machineCount = 0)
    {
        try {
            $model = self::where('id', $id)->where('deleted', 0)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '代理商不存在'];
            }
            $model->setAttr('machine_count', $machineCount + $model->getAttr('machine_count'));
            $model->setAttr('all_machine_count', $machineCount + $model->getAttr('all_machine_count'));
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function remove(int $id)
    {
        try {
            $model = self::where('id', $id)->where('deleted', 0)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '不存在'];
            }
            $model->deleted = 1;
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    //$count 为负数就是在减机器
    public function incMachine(int $user_id, int $count)
    {
        $agent = self::where('user_id', $user_id)->find();
        if ($agent) {
            if ($agent->getAttr('machine_count') + $count < 0) {
                return false;
            }

            $agent->setAttr('machine_count', $agent->getAttr('machine_count') + $count);
            $agent->save();
            return true;
        }
        return false;
    }

    public function machineCount(int $user_id)
    {
        $model = self::where([['deleted', '=', '0'], ['user_id', '=', $user_id]])->find();
        return $model ? $model->getAttr('machine_count') : 0;
    }

    public function getOpenWx(int $user_id)
    {
        $model = self::where([['deleted', '=', '0'], ['user_id', '=', $user_id]])->find();
        return $model ? $model->getAttr('open_wx') : 0;
    }
}
