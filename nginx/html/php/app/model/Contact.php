<?php

namespace app\model;

use app\validate\Agent as ValidateAgent;
use Exception;
use think\exception\ValidateException;
use think\Model;

class Contact extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['agent_user_id']) && $params['agent_user_id']) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (isset($params['machine_id']) && $params['machine_id']) {
            $where[] = ['machine_id', '=', $params['machine_id']];
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
            $model = new self();
            $model->setAttr('machine_id', $params['machine_id']);
            $model->setAttr('user_id', $params['user_id']);
            $model->setAttr('agent_user_id', $params['agent_user_id']);
            $model->setAttr('created_at', time());
            $model->save();
            return ['code' => 0, 'msg' => '成功', 'id' => $model->getAttr('id')];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function editStatus(int $machineId, int $agentUserId, int $status)
    {
        try {
            $model = self::where([
                ['machine_id', '=', $machineId],
                ['agent_user_id', '=', $agentUserId],
            ])->where('deleted', 0)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '记录不存在'];
            }
            $model->setAttr('status', $status);
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
