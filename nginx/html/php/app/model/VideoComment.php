<?php

namespace app\model;

use app\validate\Agent as ValidateAgent;
use app\validate\Machine as ValidateMachine;
use Exception;
use think\exception\ValidateException;
use think\Model;

class VideoComment extends Model
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

        $total = VideoOp::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = VideoOp::where($where)->page($page, $limit)->order('id desc')->select()->toArray();

        if ($data) {
            $ids = array_column($data, 'video_id');
            $videos = (new Video())->whereIn('id', $ids)->field(['id', 'title'])->select()->toArray();
            $videos = array_column($videos, 'title', 'id');

            //评论详情
            $commentIds = array_column($data, 'video_comment_id');
            $videoComment = self::where([['deleted', '=', 0], ['id', 'in', $commentIds]])->field([
                'id', 'keyword', 'no_keyword', 'province_id', 'in_time', 'desc', 'douyin', 'nickname', 'created_at'
            ])->select()->toArray();

            $province = [];
            if ($videoComment) {
                $videoComment = array_column($videoComment, null, 'id');
                $proviceId = array_column($videoComment, 'province_id');
                if ($proviceId) {
                    $province = Province::where([['id', 'in', $proviceId]])->field(['id', 'name'])->select()->toArray();
                    if ($province) {
                        $province = array_column($province, 'name', 'id');
                    }
                }
            }
            $data = array_map(static function ($item) use ($videos, $videoComment, $province) {
                $tmp = $videoComment[$item['video_comment_id']] ?? [];
                $item['title'] = $videos[$item['video_id']] ?? '';
                $item['keyword'] = $tmp['keyword'] ?? '';
                $item['no_keyword'] = $tmp['no_keyword'] ?? '';
                $item['desc'] = $tmp['desc'] ?? '';
                $item['province_name'] = $province[$tmp['province_id'] ?? 0] ?? '';
                $item['in_time'] = $tmp['in_time'] ?? 0;
                $item['nickname'] = $tmp['nickname'] ?? 0;
                $item['douyin'] = $tmp['douyin'] ?? 0;
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
