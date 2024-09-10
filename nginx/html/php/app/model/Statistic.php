<?php

namespace app\model;

use Exception;
use think\Model;

class Statistic extends Model
{
    public function getList(int $limit, int $page, array $params)
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
            $where[] = ['user_id', '=', 0];
        } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
            $where[] = ['user_id', '=', $params['user_id']];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('id desc')->select()->toArray();
        return ['total' => $total, 'data' => $data];
    }

    public function statistic(array $params)
    {
        $today = strtotime(date('Y-m-d'));
        if (!isset($params['date']) || !$params['date']) {
            $params['date'] = 1;
        }
        $historyDay =  $today - $params['date'] * 86400;
        $where = [['deleted', '=', 0]];
        $where[] = ['date', '>=', $historyDay];
        $where[] = ['date', '<', $today];

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

        $data = self::where($where)->field([
            'SUM(view_video) as view_video',
            'SUM(target_video) as target_video',
            'SUM(zan_comment) as zan_comment',
            'SUM(private_user) + SUM(private_comment_user) as private_user',
            'SUM(focus_user) + SUM(focus_comment_user)  as focus_user',
            'SUM(view_user) as view_user',
            'SUM(comment) + SUM(comment_comment) as comment',
            'SUM(zan) as zan'
        ])->find();
        return ['data' => $data ? $data->toArray() : []];
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

    //type = 0操作视频，type=1 操作评论
    public function updateStatistic(array $params, int $type = 0)
    {
        $date = strtotime(date('Y-m-d', time()));
        try {

            $opWhere = [
                ['deleted', '=', 0],
                ['user_id', '=', $params['user_id']],
                ['agent_user_id', '=', $params['agent_user_id']],
                ['task_id', '=', $params['task_id']],
                ['machine_id', '=', $params['machine_id']],
            ];

            $where = $opWhere;
            $where[] = ['date', '=', $date];

            $statisticModel = self::where($where)->find();
            if (!$statisticModel) {
                $statisticModel = new self();
                foreach ($where as $k => $v) {
                    $statisticModel->setAttr($v[0], $v[2]);
                }
                $statisticModel->setAttr('created_at', time());
            }

            if (isset($params['is_zan']) && $params['is_zan']) {
                if ($type === 0) {
                    $statisticModel->setAttr('zan', 1 + ($statisticModel->getAttr('zan') ?: 0));
                } else {
                    $statisticModel->setAttr('zan_comment', 1 + ($statisticModel->getAttr('zan') ?: 0));
                }
            }

            if (isset($params['is_comment']) && $params['is_comment']) {
                if ($type === 0) {
                    $statisticModel->setAttr('comment', 1 + ($statisticModel->getAttr('comment') ?: 0));
                } else {
                    $statisticModel->setAttr('comment_comment', 1 + ($statisticModel->getAttr('comment_comment') ?: 0));
                }
            }

            if (isset($params['is_focus']) && $params['is_focus']) {
                if ($type === 0) {
                    $statisticModel->setAttr('focus_user', 1 + ($statisticModel->getAttr('focus_user') ?: 0));
                } else {
                    $statisticModel->setAttr('focus_comment_user', 1 + ($statisticModel->getAttr('focus_comment_user') ?: 0));
                }
            }

            if (isset($params['is_private_msg']) && $params['is_private_msg']) {
                if ($type === 0) {
                    $statisticModel->setAttr('private_user', 1 + ($statisticModel->getAttr('private_user') ?: 0));
                } else {
                    $statisticModel->setAttr('private_comment_user', 1 + ($statisticModel->getAttr('private_comment_user') ?: 0));
                }
            }

            if (isset($params['view_video']) && $params['view_video']) {
                $statisticModel->setAttr('view_video', 1 + ($statisticModel->getAttr('view_video') ?: 0));
            }

            if (isset($params['target_video']) && $params['target_video']) {
                $statisticModel->setAttr('target_video', 1 + ($statisticModel->getAttr('target_video') ?: 0));
            }

            if (isset($params['view_user']) && $params['view_user']) {
                $statisticModel->setAttr('view_user', 1 + ($statisticModel->getAttr('view_user') ?: 0));
            }

            $statisticModel->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
