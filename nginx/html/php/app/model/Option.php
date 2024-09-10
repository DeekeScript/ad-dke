<?php

namespace app\model;

use Exception;
use think\Model;

class Option extends Model
{
    public const APK = 'apk';
    public const CONTACT_SETTING = 'contact_setting';
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('id desc')->select()->toArray();
        return ['total' => $total, 'data' => $data];
    }

    public function get(string $key)
    {
        $data = self::where([['key', '=', $key]])->find();
        if (!$data) {
            return false;
        }
        return $data->getAttr('value');
    }

    public function add(array $params)
    {
        try {
            $model = self::where([
                [
                    'key', '=', $params['key']
                ],
            ])->find();

            if (!$model) {
                $model = new self();
            }

            $model->setAttr('key', $params['key']);
            $model->setAttr('value', $params['value']);
            $model->setAttr('created_at', time());
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function getSetting(int $agent_user_id)
    {
        $res = $this->get(Option::CONTACT_SETTING . '_' . $agent_user_id);
        if ($res) {
            return json_decode($res, true);
        }

        return [
            'machine_count' => '5',
            'contact_count' => '2000',
            'contact_add_count' => '20',
            'search_add_count' => 30,
            'add_contact_friend_count' => 5,
            'add_search_friend_count' => 1,
            'add_friend_sec' => 450,
        ];
    }
}
