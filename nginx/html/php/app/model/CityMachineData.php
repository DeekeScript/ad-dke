<?php

namespace app\model;

use app\validate\User as ValidateUser;
use Exception;
use think\exception\ValidateException;
use think\facade\Config;
use think\facade\Db;
use think\Model;

class CityMachineData extends Model
{
    public const ROLE_TYPE = [0, 1, 2]; //分别对应管理员，代理，用户
    public const TYPE = [0, 1, 2, 3]; //1年，1月，3天，3月
    public function getList(array $params)
    {
        $where = [['md.deleted', '=', 0], ['md.date', '=', strtotime(date('Y-m-d', strtotime('-1 day')))]];
        if (isset($params['machine_id']) && $params['machine_id']) {
            $where[] = ['m.id', 'like', $params['machine_id'] . '%'];
        }

        if (isset($params['name']) && $params['name']) {
            $where[] = ['m.name', 'like', $params['name'] . '%'];
        }

        if (isset($params['account']) && $params['account']) {
            $where[] = ['md.account', 'like', $params['account'] . '%'];
        }

        //如果是代理则展示代理下面的用户，否则返回空数据
        if ($params['role_type'] === self::ROLE_TYPE[1]) {
            $where[] = ['md.agent_user_id', '=', $params['user_id']];
        }

        $total = self::alias('md')->join(Config::get('database.prefix') . (new Machine())->getTable() . ' m', 'm.id = md.machine_id')->where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }

        $data = self::alias('md')->field(['md.machine_id, m.name, md.created_at, md.focus_count, md.id'])
            ->join(Config::get('database.prefix') . (new Machine())->getTable() . ' m', 'm.id = md.machine_id')->where($where)->order('md.id desc')->select()->toArray();
        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        if (!isset($params['type'])) {
            $params['type'] = 0;
        }

        Db::startTrans();
        try {
            $model = self::where([
                ['machine_id', '=', $params['machine_id']],
                ['agent_user_id', '=', $params['agent_user_id']],
                ['account', '=', $params['account']],
                ['deleted', '=', 0],
                ['date', '=', strtotime(date('Y-m-d', time()))],
            ])->find();

            if (!$model) {
                $model = new self();
            }

            $model->setAttr('account', $params['account']);
            $model->setAttr('machine_id', $params['machine_id']);
            $model->setAttr('agent_user_id', $params['agent_user_id']);
            $model->setAttr('focus_count', $params['focus_count']);
            $model->setAttr('inc_focus_count', $params['inc_focus_count']);
            $model->setAttr('dec_focus_count', $params['dec_focus_count']);
            $model->setAttr('comment_count', $params['comment_count']);

            $model->setAttr('zan_count', $params['zan_count']);
            $model->setAttr('zan_comment_count', $params['zan_comment_count']);
            $model->setAttr('refresh_video_count', $params['refresh_video_count']);
            $model->setAttr('new_works_user_count', $params['new_works_user_count']);
            $model->setAttr('date', strtotime(date('Y-m-d', time())));
            $model->setAttr('created_at', time());

            $model->save();
            Db::commit();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            Db::rollback();
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function statistics(int $date)
    {
        $data = self::field([
            'sum(inc_focus_count) as inc_focus_count',
            'sum(dec_focus_count) as dec_focus_count',
            'sum(comment_count) as comment_count',
            'sum(zan_count) as zan_count',
            'sum(zan_comment_count) as zan_comment_count',
            'sum(refresh_video_count) as refresh_video_count',
            'sum(new_works_user_count) as new_works_user_count',
        ])->where([
            ['deleted', '=', 0],
            ['date', '>=', strtotime(date('Y-m-d', strtotime('-' . $date . ' days')))],
            ['date', '<', strtotime(date('Y-m-d'))],
        ])->group('machine_id')->find();

        return ['code' => 0, 'data' =>  $data ? $data->toArray() : [
            'inc_focus_count' => 0,
            'dec_focus_count' => 0,
            'comment_count' => 0,
            'zan_count' => 0,
            'zan_comment_count' => 0,
            'refresh_video_count' => 0,
            'new_works_user_count' => 0,
        ]];
    }
}
