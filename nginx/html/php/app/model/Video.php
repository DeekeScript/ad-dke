<?php

namespace app\model;

use app\validate\Agent as ValidateAgent;
use app\validate\Machine as ValidateMachine;
use Exception;
use think\exception\ValidateException;
use think\Model;

class Video extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['title']) && $params['title']) {
            $where[] = ['title', 'like', $params['title'] . '%'];
        }

        if (isset($params['nickname']) && $params['nickname']) {
            $where[] = ['nickname', '=', $params['nickname']];
        }

        if (isset($params['type'])) {
            $where[] = ['type', '=', (int)$params['type']];
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
            $ids = array_column($data, 'agent_user_id');
            $agents = (new Agent())->whereIn('user_id', $ids)->field(['user_id', 'name'])->select()->toArray();
            $agents = array_column($agents, 'name', 'user_id');

            $taskIds = array_column($data, 'task_id');
            $tasks = (new Task())->whereIn('id', $taskIds)->field(['id', 'name'])->select()->toArray();
            $tasks = array_column($tasks, 'name', 'id');

            $data = array_map(static function ($item) use ($agents, $tasks) {
                $item['agent_name'] = $agents[$item['agent_user_id']] ?? '-';
                $item['task_name'] = $tasks[$item['task_id']] ?? '-';
                $item['task'] = $tasks;
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

    public function getSum(array $params)
    {
        $where = [];
        if (isset($where['user_id'])) {
            $where[] = ['user_id', '=', $params['user_id']];
        }

        if (isset($where['agent_user_id'])) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (isset($where['machine_id'])) {
            $where[] = ['machine_id', '=', $params['machine_id']];
        }

        if (isset($where['task_id'])) {
            $where[] = ['task_id', '=', $params['task_id']];
        }

        $num = self::where($where)->count('id');
        $where[] = ['type', '=', 1];

        return [
            'videoCount' => $num,
            'targetVideoCount' => self::where($where)->count('id'),
        ];
    }
}
