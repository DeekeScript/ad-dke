<?php

namespace app\model;

use app\validate\GrabKeyword as ValidateGrabKeyword;
use app\validate\Task as ValidateTask;
use Exception;
use think\exception\ValidateException;
use think\Model;

class GrabKeyword extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['keyword']) && $params['keyword']) {
            $where[] = ['keyword', 'like', $params['keyword'] . '%'];
        }

        if (isset($params['status'])) {
            $where[] = ['status', '=', (int)$params['status']];
        }

        if (isset($params['desc']) && $params['desc']) {
            $where[] = ['desc', 'like', $params['desc'] . '%'];
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
        $data = self::where($where)->page($page, $limit)->order('agent_user_id desc, id desc')->select()->toArray();
        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        try {
            validate(ValidateGrabKeyword::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        try {
            $model = new self();
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $model->setAttr('agent_user_id', $params['user_id']);
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $model->setAttr('user_id', $params['user_id']);
                $model->setAttr('agent_user_id', (new User())->getIdByUserId($params['user_id']));
            }

            $model->setAttr('keyword', $params['keyword']);
            $model->setAttr('desc', $params['desc']);
            $model->setAttr('pass_rate', $params['pass_rate'] ?? 0);
            $model->setAttr('suc_rate', $params['suc_rate'] ?? 0);
            $model->setAttr('status', $params['status'] ?? 0);
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

        try {
            validate(ValidateGrabKeyword::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getError()];
        }

        try {
            $where = [['id', '=', $params['id']], ['deleted', '=', 0]];
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
                $where[] = ['user_id', '=', 0];
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $where[] = ['user_id', '=', $params['user_id']];
            }
            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '记录不存在'];
            }
            $model->setAttr('keyword', $params['keyword']);
            $model->setAttr('desc', $params['desc']);
            $model->setAttr('pass_rate', $params['pass_rate'] ?? 0);
            $model->setAttr('suc_rate', $params['suc_rate'] ?? 0);
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
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

    public function getKeyword(array $params)
    {
        $redis = \IRedis::instance();
        if (!$redis->lock('lock_keyword_' . $params['agent_user_id'], 1)) {
            return [];
        }

        $model = self::where([
            ['agent_user_id', '=', $params['agent_user_id']],
            ['deleted', '=', 0],
            ['lock', '=', 0],
            ['lock_at', '=', 0],
        ])->order('id asc')->find();

        if (!$model) {
            return [];
        }
        $model->setAttr('lock', 1);
        $model->setAttr('lock_at', time());
        $model->save();
        return ['keyword' => $model->getAttr('keyword'), 'id' => $model->getAttr('id')];
    }

    public function editStatus(int $id, int $status): array
    {
        try {
            $model = self::where([['id', '=', $id], ['deleted', '=', 0]])->find();
            if ($model) {
                $model->setAttr('status', $status);
                $model->save();
            }
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
