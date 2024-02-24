<?php

namespace app\model;

use app\validate\User as ValidateUser;
use Exception;
use think\exception\ValidateException;
use think\facade\Db;
use think\Model;

class CityFocusUser extends Model
{
    public const ROLE_TYPE = [0, 1, 2]; //分别对应管理员，代理，用户
    public const TYPE = [0, 1, 2, 3]; //1年，1月，3天，3月
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0], ['is_cancel', '=', 0]];
        if (isset($params['account']) && $params['account']) {
            $where[] = ['account', 'like', $params['account'] . '%'];
        }

        if (isset($params['account']) && $params['account']) {
            $where[] = ['account', 'like', $params['account'] . '%'];
        }

        //如果是代理则展示代理下面的用户，否则返回空数据
        if ($params['role_type'] === self::ROLE_TYPE[1]) {
            $where[] = ['agent_user_id', '=', $params['user_id']];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('id desc')->select()->toArray();
        $machine = (new Machine())->where([['user_id', 'in', array_column($data, 'id')]])->field(['user_id', 'id', 'name'])->select()->toArray();
        $data = array_map(function ($item) use ($machine) {
            $item['machine_id'] = [];
            $item['machine_name'] = [];
            foreach ($machine as $m) {
                if ($m['user_id'] === $item['id']) {
                    $item['machine_id'][] = $m['id'];
                    $item['machine_name'][] = $m['name'];
                }
            }
            return $item;
        }, $data);

        return ['total' => $total, 'data' => $data];
    }

    public function accountExist(array $params)
    {
        if (!isset($params['type'])) {
            $params['type'] = 0;
        }

        if (self::where([
            ['agent_user_id', '=', $params['agent_user_id']],
            ['account', '=', $params['account']],
            ['deleted', '=', 0],
            ['is_cancel', '=', 0]
        ])->count()) {
            return ['code' => 0, 'msg' => '重复'];
        }
        return ['code' => 1, 'msg' => '不重复'];
    }

    public function cancelFocus(array $params)
    {
        $model = self::where([
            ['deleted', '=', 0],
            ['account', '=', $params['account']],
            ['agent_user_id', '=', $params['agent_user_id']],
            ['machine_id', '=', $params['machine_id']],
            ['is_cancel', '=', 0]
        ])->find();

        if (!$model) {
            return ['code' => 1, 'msg' => '记录不存在'];
        }
        $model->setAttr('is_cancel', 1);
        return ['code' => 0, 'msg' => '成功'];
    }

    public function add(array $params)
    {
        if (!isset($params['type'])) {
            $params['type'] = 0;
        }

        if (self::where([
            ['agent_user_id', '=', $params['agent_user_id']],
            ['account', '=', $params['account']],
            ['deleted', '=', 0],
            ['is_cancel', '=', 0]
        ])->count()) {
            return ['code' => 1, 'msg' => '已经关注'];
        }

        Db::startTrans();
        try {
            $model = new self();
            $model->setAttr('machine_id', $params['machine_id']);
            $model->setAttr('agent_user_id', $params['agent_user_id']); //代理商只能添加商户，管理员只能添加代理商
            $model->setAttr('account', $params['account']);
            $model->setAttr('nickname', $params['nickname']);
            $model->setAttr('age', $params['age']);
            $model->setAttr('gender', $params['gender']);
            $model->setAttr('zan_count', $params['zan_count']);
            $model->setAttr('fans_count', $params['fans_count']);
            $model->setAttr('focus_count', $params['focus_count']);
            $model->setAttr('introduce', $params['introduce']);
            $model->setAttr('works_count', $params['works_count']);
            $model->setAttr('distance', $params['distance']);
            $model->setAttr('works_url', $params['works_url']);
            $model->setAttr('created_at', time());

            $model->save();
            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function edit(array $params)
    {
        if (!isset($params['type'])) {
            $params['type'] = 0;
        }

        if (!isset($params['account']) || empty($params['account'])) {
            return ['code' => 1, 'msg' => '操作有误'];
        }

        Db::startTrans();
        try {
            $where = [['account', '=', $params['account']], ['deleted', '=', 0], ['is_cancel', '=', 0], ['agent_user_id', '=', $params['agent_user_id']]];
            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '用户不存在'];
            }

            $model->setAttr('nickname', $params['nickname']);
            $model->setAttr('age', $params['age']);
            $model->setAttr('gender', $params['gender']);
            $model->setAttr('zan_count', $params['zan_count']);
            $model->setAttr('fans_count', $params['fans_count']);
            $model->setAttr('focus_count', $params['focus_count']);
            $model->setAttr('introduce', $params['introduce']);
            if ((int)$model->getAttr('works_count') === (int)$params['works_count']) {
                $model->setAttr('no_works_day', $model->getAttr('no_works_day') + 1);
            } else {
                $model->setAttr('no_works_day', 0);
            }

            $model->setAttr('works_count', $params['works_count']);
            //$model->setAttr('distance', $params['distance']);
            //$model->setAttr('works_url', $params['works_url']);
            $model->setAttr('created_at', time());
            $model->setAttr('is_cancel', $model->getAttr('no_works_day') >= 7); //7次没有更新就取消关注
            $model->save();

            Db::commit();
            //是否连续15天没有发视频
            return ['code' => 0, 'msg' => '成功', 'data' => ['cancelFocus' => $model->getAttr('no_works_day') >= 7]];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function remove(array $params)
    {
        try {
            Db::startTrans();
            $where = [['deleted', '=', 0], ['id', '=', $params['id'] ?? 0]];
            if (self::ROLE_TYPE[1] === $params['role_type']) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $where[] = ['user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '不存在'];
            }
            $model->deleted = 1;
            $model->save();
            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
