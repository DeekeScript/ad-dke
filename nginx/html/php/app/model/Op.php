<?php

namespace app\model;

use app\validate\Agent as ValidateAgent;
use Exception;
use think\exception\ValidateException;
use think\Model;

class Op extends Model
{
    //操作，0点赞视频，1点赞评论，2评论，3关注，4私信，5访问主页,6刷视频
    const TYPE = [0, 1, 2, 3, 4, 5, 6];
    public function getAllTimestamp(array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['user_id']) && $params['user_id']) {
            $where[] = ['user_id', '=', $params['user_id']];
        }

        if (isset($params['machine_id']) && $params['machine_id']) {
            $where[] = ['machine_id', '=', $params['machine_id']];
        }

        if (isset($params['agent_user_id']) && $params['agent_user_id']) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (isset($params['type'])) {
            $where[] = ['type', '=', (int)$params['type']];
        }

        if (!isset($params['start_time'])) {
            $where[] = ['created_at', '>=', strtotime(date('Y-m-d'))];
        } else {
            $where[] = ['created_at', '>=', strtotime($params['start_time'])];
        }

        // $total = self::where($where)->count();
        // if ($total === 0) {
        //     return ['total' => 0, 'data' => []];
        // }
        $data = self::where($where)->field('created_at')->order('id asc')->select()->toArray();
        if (!$data) {
            return [];
        }

        return array_column($data, 'created_at');
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
            $model->setAttr('created_at', time());
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
