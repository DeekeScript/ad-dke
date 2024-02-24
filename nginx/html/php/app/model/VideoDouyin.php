<?php

namespace app\model;

use app\validate\VideoDouyin as ValidateVideoDouyin;
use Exception;
use think\exception\ValidateException;
use think\Model;

class VideoDouyin extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];

        if (isset($params['video_id']) && $params['video_id']) {
            $where[] = ['video_id', '=', $params['video_id']];
        }

        if (isset($params['type']) && $params['type']) {
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
        $province = (new Province())->select()->toArray();
        if ($province) {
            $province = array_column($province, 'name', 'id');
        }

        if ($data) {
            $ids = array_column($data, 'video_id');
            $videos = (new Video())->whereIn('id', $ids)->field(['id', 'title'])->select()->toArray();
            $videos = array_column($videos, 'title', 'id');
            $data = array_map(static function ($item) use ($videos, $province) {
                $item['title'] = $videos[$item['video_id']] ?? '';
                $item['province_name'] = $province[$item['province_id']] ?? '';
                return $item;
            }, $data);
        }

        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        try {
            validate(ValidateVideoDouyin::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        try {
            $model = new self();
            $model->setAttr('nickname', $params['nickname']);
            $model->setAttr('douyin', $params['douyin']);
            $model->setAttr('zan_count', $params['zan_count']);
            $model->setAttr('focus_count', $params['focus_count']);
            $model->setAttr('fans_count', $params['fans_count']);
            $model->setAttr('type', $params['type'] ?? 2);
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $model->setAttr('agent_user_id', $params['agent_user_id']);
            } else {
                $model->setAttr('user_id', $params['user_id']);
                $model->setAttr('agent_user_id', (new User())->getIdByUserId($params['user_id']));
            }

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
            validate(ValidateVideoDouyin::class)->scene('edit')->check($params);
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
                return ['code' => 1, 'msg' => '代理商不存在'];
            }
            $model->setAttr('nickname', $params['nickname']);
            $model->setAttr('douyin', $params['douyin']);
            $model->setAttr('zan_count', $params['zan_count']);
            $model->setAttr('focus_count', $params['focus_count']);
            $model->setAttr('fans_count', $params['fans_count']);
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
}
