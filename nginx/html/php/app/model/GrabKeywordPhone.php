<?php

namespace app\model;

use app\validate\GrabKeywordPhone as ValidateGrabKeywordPhone;
use Exception;
use think\exception\ValidateException;
use think\Model;

class GrabKeywordPhone extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['mobile']) && $params['mobile']) {
            $where[] = ['mobile', 'like', $params['mobile'] . '%'];
        }

        if (isset($params['wx'])) {
            $where[] = ['wx', 'like', $params['wx'] . '%'];
        }

        if (isset($params['account']) && $params['account']) {
            $where[] = ['account', 'like', $params['account'] . '%'];
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
        $ids = array_column($data, 'keyword_id');
        $keywords = GrabKeyword::where([['id', 'in', $ids]])->select()->toArray();
        $tmp = array_column($keywords, 'keyword', 'id');
        $data = array_map(static function ($item) use ($tmp) {
            $item['keyword'] = $tmp[$item['keyword_id']] ?? '-';
            return $item;
        }, $data);
        return ['total' => $total, 'data' => $data];
    }

    public function updateListByContact($limit, $page, $params)
    {
        $where[] = ['contact_id', '=', 0];
        $where[] = ['deleted', '=', 0];

        if (isset($params['agent_user_id']) && $params['agent_user_id']) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (isset($params['machine_id']) && $params['machine_id']) {
            $where[] = ['machine_id', '=', $params['machine_id']];
        }

        if (isset($params['type'])) {
            $where[] = ['type', 'in', $params['type']];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return [];
        }

        if (isset($params['minTotal']) && $total < $params['minTotal']) {
            return [];
        }

        $data = self::where($where)->page($page, $limit)->order('type desc,id desc')->select();
        foreach ($data as $item) {
            $item->setAttr('contact_id', $params['contact_id']);
            $item->setAttr('op_time', time());
            $item->save();
        }

        $res = $data->toArray();
        $items = [];
        foreach ($res as $item) {
            $items[] = ['mb' => $item['mobile'], 'wx' => $item['wx'], 'nick' => $item['nickname']];
        }

        return $items;
    }

    public function add(array $params)
    {
        try {
            validate(ValidateGrabKeywordPhone::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        try {
            if (self::where([
                ['account', '=', $params['account']],
                ['mobile', '=', $params['mobile']],
                ['agent_user_id', '=', $params['agent_user_id']]
            ])->count()) {
                return ['code' => 0, 'msg' => '已存在'];
            }

            //查看电话号或者微信是否正常
            if ($params['mobile'] && !preg_match("/1\d{10}/", $params['mobile'])) {
                return ['code' => 0, 'msg' => '手机号有误'];
            }

            if ($params['wx'] && (preg_match("/\d{2}-\d{2}/", $params['wx']) || preg_match("/\d{3}cm$/", $params['wx']) || preg_match("/\d{3}kg$/", $params['wx']))) {
                return ['code' => 0, 'msg' => '微信有误'];
            }

            $model = new self();
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $model->setAttr('agent_user_id', $params['user_id']);
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $model->setAttr('user_id', $params['user_id']);
                $model->setAttr('agent_user_id', (new User())->getIdByUserId($params['user_id']));
            }

            $model->setAttr('keyword_id', $params['keyword_id']);
            $model->setAttr('user_id', $params['user_id']);
            $model->setAttr('agent_user_id', ($params['agent_user_id']));
            $model->setAttr('account', ($params['account']));
            $model->setAttr('nickname', ($params['nickname']));
            $model->setAttr('gender', ($params['gender']));
            $model->setAttr('age', ($params['age']));
            $model->setAttr('wx', ($params['wx']));
            $model->setAttr('mobile', ($params['mobile']));
            $model->setAttr('zan_count', $params['zan_count']);
            $model->setAttr('focus_count', $params['focus_count']);
            $model->setAttr('fans_count', $params['fans_count']);
            $model->setAttr('work_count', $params['work_count']);
            $model->setAttr('machine_id', $params['machine_id']);
            $model->setAttr('qw_status', $params['qw_status'] ?? 0);
            $model->setAttr('wx_status', $params['wx_status'] ?? 0);
            $model->setAttr('desc', $params['desc']);
            $model->setAttr('ip', $params['ip']);
            $model->setAttr('type', $params['type']);
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
            validate(ValidateGrabKeywordPhone::class)->check($params);
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
            $model->setAttr('keyword_id', $params['keyword_id']);
            $model->setAttr('user_id', $params['user_id']);
            $model->setAttr('agent_user_id', $params['agent_user_id']);
            $model->setAttr('account', $params['account']);
            $model->setAttr('nickname', $params['nickname']);
            $model->setAttr('gender', $params['gender']);
            $model->setAttr('age', $params['age']);
            $model->setAttr('wx', $params['wx']);
            $model->setAttr('mobile', ($params['mobile']));
            $model->setAttr('zan_count', $params['zan_count']);
            $model->setAttr('focus_count', $params['focus_count']);
            $model->setAttr('fans_count', $params['fans_count']);
            $model->setAttr('work_count', $params['work_count']);
            $model->setAttr('machine_id', $params['machine_id']);
            $model->setAttr('qw_status', $params['qw_status'] ?? 0);
            $model->setAttr('wx_status', $params['wx_status'] ?? 0);
            $model->setAttr('desc', $params['desc']);
            $model->setAttr('ip', $params['ip']);
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

    public function updatePhone($params)
    {
        $models = self::where([['contact_id', '=', $params['id']], ['deleted', '=', 0], ['agent_user_id', '=', $params['agent_user_id']]])->select();
        foreach ($models as $model) {
            if ($model) {
                $model->setAttr('qw_status', $params['qw_status'] ?? 0);
                $model->setAttr('wx_status', $params['wx_status'] ?? 0);
                $model->setAttr('status', 1);
                $model->save();
            }
        }

        return ['code' => 1, 'msg' => '记录不存在'];
    }

    public function updateOpSuc($params)
    {
        $models = self::where([['contact_id', '=', $params['id']], ['deleted', '=', 0], ['agent_user_id', '=', $params['agent_user_id']]])->select();
        foreach ($models as $model) {
            if ($model) {
                $model->setAttr('op_suc', 1);
                $model->save();
            }
        }

        return ['code' => 1, 'msg' => '记录不存在'];
    }

    /**
     * 更新手机号和微信
     */
    public function updateMobileWx(array $params, $userId)
    {
        try {
            if (!isset($params['mobile'], $params['wx'])) {
                return ['code' => 1, 'msg' => '参数有误'];
            }

            $model = self::where([['id', '=', $params['id']], ['deleted', '=', 0], ['agent_user_id', '=', $userId]])->find();
            if (isset($params['mobile']) && $params['mobile']) {
                $model->setAttr('mobile', $params['mobile']);
                $model->setAttr('wx', '');
                $model->setAttr('type', 0);
            }

            if (isset($params['wx']) && $params['wx']) {
                $model->setAttr('wx', $params['wx']);
                $model->setAttr('mobile', '');
                $model->setAttr('type', 2);
            }

            $model->setAttr('wx_status', $params['wx_status'] ?? 0);
            $model->setAttr('qw_status', $params['qw_status'] ?? 0);
            $model->setAttr('status', 1);
            $model->save();
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => '失败'];
        }

        return ['code' => 0, 'msg' => '成功'];
    }

    public function setStatus(string $mobile, int $type, $params)
    {
        $where = [
            ['deleted', '=', 0],
            ['agent_user_id', '=', $params['agent_user_id']],
        ];

        if ($type == 0) {
            $where[] = ['mobile', '=', $mobile];
        } else {
            $where[] = ['wx', '=', $mobile];
        }

        $models = self::where($where)->select();
        foreach ($models as $model) {
            $model->setAttr('wx_status', $params['wx_status'] ?? 0);
            $model->setAttr('status', $params['status'] ?? 0);
            $model->save();
        }
        return ['code' => 0, 'msg' => '成功'];
    }

    public function downloadPhone(int $limit = 60, int $agentUserId)
    {
        $count = (new GrabKeywordPhone())->where([
            ['agent_user_id', '=', $agentUserId],
            ['deleted', '=', 0],
            ['wx_status', '=', 0],
            ['type', '=', 0],
        ])->count();

        if ($count < $limit) {
            return ['code' => 1, 'msg' => '数据不足' . $limit . '条'];
        }

        $datas = (new GrabKeywordPhone())->where([
            ['agent_user_id', '=', $agentUserId],
            ['deleted', '=', 0],
            ['wx_status', '=', 0],
            ['type', '=', 0],
        ])->limit(0, $limit)->select();

        foreach ($datas as $data) {
            $data->setAttr('wx_status', 2);
            $data->save();
        }

        $datas = $datas->toArray();
        for ($i = 0; $i < $limit; $i++) {
            if ($i > $limit / 2) {
                $datas[$i]['nickname'] = 'T_' . $datas[$i]['nickname'];
            }
        }
        return ['code' => 0, 'data' => $datas];
    }
}
