<?php

namespace app\model;

use app\validate\Log as ValidateLog;
use Exception;
use think\exception\ValidateException;
use think\Model;

class Log extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['type'])) {
            $where[] = ['type', '=', $params['type'] ?? 0];
        }

        if (isset($params['machine_id'])) {
            $where[] = ['machine_id', '=', $params['machine_id'] ?? 0];
        }

        if (isset($params['user_id'])) {
            $where[] = ['user_id', '=', $params['user_id'] ?? 0];
        }

        if (isset($params['agent_user_id'])) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id'] ?? 0];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->field(['id', 'type', 'desc', 'user_id', 'agent_user_id', 'created_at'])->order('id desc')->select()->toArray();

        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        try {
            validate(ValidateLog::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        try {
            $model = new self();
            $model->setAttr('desc', $params['desc']);
            $model->setAttr('agent_user_id', $params['agent_user_id'] ?? 0);
            $model->setAttr('user_id', $params['user_id'] ?? 0);
            $model->setAttr('type', $params['type']); //代理商只能添加商户，管理员只能添加代理商
            $model->setAttr('created_at', time());
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function remove(array $params, int $id)
    {
        try {
            $where = [['deleted', '=', 0], ['id', '=', $id]];
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
                $where[] = ['user_id', '=', 0];
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $where[] = ['user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
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
}
