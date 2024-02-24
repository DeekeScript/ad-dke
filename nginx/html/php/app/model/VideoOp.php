<?php

namespace app\model;

use app\validate\Agent as ValidateAgent;
use app\validate\Machine as ValidateMachine;
use Exception;
use think\exception\ValidateException;
use think\Model;

class VideoOp extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];

        if (isset($params['video_id']) && $params['video_id']) {
            $where[] = ['video_id', '=', $params['video_id']];
        }

        if (isset($params['type'])) {
            $where[] = ['type', '=', $params['type']];
        }

        if (isset($params['startTime'])) {
            $where[] = ['created_at', '>=', (int)strtotime($params['startTime'])];
        }

        if (isset($params['endTime'])) {
            $where[] = ['created_at', '<', (int)strtotime($params['endTime'])];
        }

        if (isset($params['machine_id'])) {
            $where[] = ['machine_id', '=', (int)$params['machine_id']];
        }

        if (User::ROLE_TYPE[0] === $params['role_type'] && isset($params['agent_user_id'])) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (User::ROLE_TYPE[2] !== $params['role_type'] && isset($params['p_user_id'])) {
            $where[] = ['user_id', '=', $params['p_user_id']];
        }

        if (User::ROLE_TYPE[1] === $params['role_type']) {
            $where[] = ['agent_user_id', '=', $params['user_id']];
            $where[] = ['user_id', '=', 0];
        } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
            $where[] = ['user_id', '=', $params['user_id']];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('id desc')->select()->toArray();

        if ($data) {
            $ids = array_column($data, 'video_id');
            $videos = (new Video())->whereIn('id', $ids)->field(['id', 'title'])->select()->toArray();
            $videos = array_column($videos, 'title', 'id');
            $data = array_map(static function ($item) use ($videos) {
                $item['title'] = $videos[$item['video_id']] ?? '-';
                return $item;
            }, $data);
        }

        return ['total' => $total, 'data' => $data];
    }

    public function remove(array $params, int $id)
    {
        try {
            $where = [['id', '=', $id], ['deleted', '=', 0]];
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
