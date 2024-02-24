<?php

namespace app\model;

use Exception;
use think\Model;

class DouyinMethod extends Model
{
    public function privateClose(array $params)
    {
        $where = [
            ['deleted', '=', 0],
            ['douyin', '=', $params['account']],
            ['agent_user_id', '=', $params['agent_user_id']],
            ['machine_id', '=', $params['machine_id']],
            ['user_id', '=', $params['user_id']],
            ['private_close', '=', 1],
        ];

        return  self::where($where)->count() ? true : false;
    }

    public function add(array $params)
    {
        try {
            $model = new self();
            $model->setAttr('douyin', $params['account']);
            $model->setAttr('user_id', $params['user_id']);
            $model->setAttr('agent_user_id', $params['agent_user_id']);
            $model->setAttr('machine_id', $params['machine_id']);
            $model->setAttr('created_at', time());
            $model->setAttr('private_close', 1);
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
