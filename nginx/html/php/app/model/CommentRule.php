<?php

namespace app\model;

use app\validate\CommentRule as ValidateCommentRule;
use Exception;
use think\exception\ValidateException;
use think\Model;

class CommentRule extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['name']) && $params['name']) {
            $where[] = ['name', 'like', $params['name'] . '%'];
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

        if ($data) {
            $users = User::where([['id', 'in', array_column($data, 'user_id')]])->field(['id', 'name'])->select()->toArray();
            if ($users) {
                $users = array_column($users, 'name', 'id');
            }

            $province = Province::field(['id', 'name'])->select()->toArray();
            if ($province) {
                $province = array_column($province, 'name', 'id');
            }

            $data = array_map(static function ($item) use ($users, $province) {
                $item['userName'] = $users[$item['user_id']] ?? '-';
                $provinceIds = json_decode($item['province_id']);
                $item['province_name'] = [];
                if (is_array($provinceIds) && $provinceIds) {
                    foreach ($provinceIds as $pid) {
                        $item['province_name'][] = $province[$pid] ?? '不限制';
                    }
                }

                return $item;
            }, $data);
        }

        return ['total' => $total, 'data' => $data];
    }

    public function commentRules(array $params)
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

        $res = self::where($where)->field(['id', 'name'])->order('id desc')->select()->toArray();
        if (!$res) {
            return [];
        }

        return array_map(function ($item) {
            return ['label' => $item['name'], 'value' => $item['id']];
        }, $res);
    }

    public function add(array $params)
    {
        try {
            validate(ValidateCommentRule::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        try {
            $model = new self();
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $model->setAttr('agent_user_id', $params['user_id']);
                $where[] = ['user_id', '=', 0];
            } else {
                $model->setAttr('user_id', $params['user_id']);
                $model->setAttr('agent_user_id', (new User())->getIdByUserId($params['user_id']));
            }
            $model->setAttr('name', $params['name']);
            $model->setAttr('nickname_type', json_encode($params['nickname_type']));
            $model->setAttr('min_comment', $params['comment_range'][0] ?? 0);
            $model->setAttr('max_comment', $params['comment_range'][1] ?? 0);

            if ($model->getAttr('max_comment') > 255) {
                throw new Exception('评论最大长度不得大于255');
            }

            $model->setAttr('max_zan', $params['zan_range'][1] ?? 0);
            $model->setAttr('min_zan', $params['zan_range'][0] ?? 0);

            $model->setAttr('contain', $params['contain']);
            $model->setAttr('no_contain', $params['no_contain']);
            $model->setAttr('in_time', $params['in_time']);
            $model->setAttr('province_id', json_encode($params['province_id']));

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
            validate(ValidateCommentRule::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getError()];
        }

        try {
            $where = [['id', '=', $params['id']], ['deleted', '=', 0]];
            if ($params['role_type'] === User::ROLE_TYPE[1]) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            } elseif ($params['role_type'] === User::ROLE_TYPE[2]) {
                $where[] = ['user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '评论规则不存在'];
            }

            $model->setAttr('name', $params['name']);
            $model->setAttr('nickname_type', json_encode($params['nickname_type']));
            $model->setAttr('min_comment', $params['comment_range'][0] ?? 0);
            $model->setAttr('max_comment', $params['comment_range'][1] ?? 0);

            if ($model->getAttr('max_comment') > 255) {
                throw new Exception('评论最大长度不得大于255');
            }

            $model->setAttr('max_zan', $params['zan_range'][1] ?? 0);
            $model->setAttr('min_zan', $params['zan_range'][0] ?? 0);

            $model->setAttr('contain', $params['contain']);
            $model->setAttr('no_contain', $params['no_contain']);
            $model->setAttr('in_time', $params['in_time']);
            $model->setAttr('province_id', json_encode($params['province_id']));
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
            if ($params['role_type'] === User::ROLE_TYPE[1]) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            } elseif ($params['role_type'] === User::ROLE_TYPE[2]) {
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
