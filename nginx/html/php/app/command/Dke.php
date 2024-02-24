<?php

declare(strict_types=1);

namespace app\command;

use app\model\Agent;
use app\model\Contact;
use app\model\DouyinMethod;
use app\model\GrabKeyword;
use app\model\GrabKeywordPhone;
use app\model\Video;
use app\model\VideoComment;
use app\model\VideoDouyin;
use app\model\VideoOp;
use Exception;
use IRedis;
use think\console\Command;
use think\console\Input;
use think\console\input\Argument;
use think\console\input\Option;
use think\console\Output;

class Dke extends Command
{
    protected function configure()
    {
        // 指令配置
        $this->setName('dke')
            ->addArgument('action', Argument::OPTIONAL, "your action")
            ->addOption('params', null, Option::VALUE_REQUIRED, 'params name')
            ->setDescription('Linux后台任务');
    }

    protected function execute(Input $input, Output $output)
    {
        // 指令输出
        // dump($input->getArguments());
        $reflect = new \ReflectionObject($this);
        $action = $input->getArgument('action');
        if (!$action) {
            $output->writeln('请输入action， 如php think dke action');
        }

        if (!$reflect->getMethod($action)) {
            $output->writeln('找不到对应的方法');
        }

        $output->writeln(json_encode($this->$action(), JSON_UNESCAPED_UNICODE));
    }

    //处理7天的数据
    public function delData()
    {
        try {
            //视频数据移除
            $model = new Video();
            $videoData = $model->where([
                ['deleted', '=', 0],
                ['created_at', '<=', time() - 7 * 86400]
            ])->limit(1000)->select();

            foreach ($videoData as $video) {
                $video->setAttr('deleted', 0);
                $video->save();
            }

            //抖音号
            $model = new VideoDouyin();
            $douyinData = $model->where([
                ['deleted', '=', 0],
                ['created_at', '<=', time() - 7 * 86400]
            ])->limit(1000)->select();

            foreach ($douyinData as $douyin) {
                $douyin->setAttr('deleted', 0);
                $douyin->save();
            }

            $model = new VideoComment();
            $videoComment = $model->where([
                ['deleted', '=', 0],
                ['created_at', '<=', time() - 7 * 86400]
            ])->limit(1000)->select();

            foreach ($videoComment as $comment) {
                $comment->setAttr('deleted', 0);
                $comment->save();
            }

            $model = new VideoOp();
            $videoOp = $model->where([
                ['deleted', '=', 0],
                ['created_at', '<=', time() - 7 * 86400]
            ])->limit(1000)->select();

            foreach ($videoOp as $op) {
                $op->setAttr('deleted', 0);
                $op->save();
            }
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
        return ['code' => 0, 'msg' => '成功'];
    }

    //10分钟执行一次  一天前的数据都会清空一次
    public function dealDouyinConfig()
    {
        $model = new DouyinMethod();
        $where = [
            ['deleted', '=', 0],
            ['created_at', '<=', time() - 86400],
        ];
        //查找一天内的数据
        $total = $model->where($where)->count();
        if (!$total) {
            return ['code' => 0, 'msg' => '完成了' . $total . '条'];
        }

        $limit = 1000;
        $tTotal = $total;
        while ($total > 0) {
            $res = $model->where($where)->limit(0, $limit)->select();
            foreach ($res as $r) {
                $r->setAttr('deleted', 1);
                $r->save();
            }
            $total -= $limit;
        }

        return ['code' => 0, 'msg' => '完成了' . $tTotal . '条'];
    }

    public function test()
    {
        $data = (new GrabKeywordPhone())->updateListByContact(3, 1, [
            'minTotal' => 3,
            'contact_id' => 1,
            'agent_user_id' => 14,
            'type' => [0], //只需要普通手机号
        ]);

        var_dump($data);
        exit;
    }

    public function addAgentMachine()
    {
        $model = new Agent();
        $res = $model->addAgentMachine(6, 10); //给黄威的代理每天增加10个账号
        return $res;
    }

    //清理未处理的数据  每分钟一次
    public function clearGrabKeywordPhone()
    {
        $items = (new GrabKeywordPhone())->where([
            ['deleted', '=', 0],
            ['op_suc', '=', 0],
            ['op_at', '>', 0],
            ['op_at', '<', time() - 300] //5分钟之前的数据就重置
        ])->limit(0, 1000)->select();

        foreach ($items as $item) {
            $item->setAttr('contact_id', 0);
            $item->setAttr('op_at', 0);
            $item->save();
        }
        return true;
    }

    //更新操作状态  每分钟一次
    public function updateOpSuc()
    {
        $redis = \IRedis::instance();
        if (!$redis->lock('command_dke_updateOpSuc', 1, 3600)) {
            return false;
        }

        try {
            $items = (new Contact())->where([
                ['deleted', '=', 0],
                ['status', '=', 1],
                ['detail_update', ' =', 0]
            ])->select();

            foreach ($items as $item) {
                (new GrabKeywordPhone())->updateOpSuc([
                    'agent_user_id' => $item->getAttr('agent_user_id'),
                    'contact_id' => $item->getAttr('contact_id'),
                ]);
                $item->setAttr('detail_update', 1);
                $item->save();
            }
        } catch (Exception $e) {
            //异常处理
        }
        $redis->unLock('command_dke_updateOpSuc');
        return true;
    }

    //如果2小时没有解决关键词，即将关键词释放掉  每分钟执行一次
    public function clearKeyword()
    {
        $keywords = (new GrabKeyword())->where([
            ['lock', '=', 1],
            ['status', '=', 0],
            ['lock_at', '<', time() - 7200]
        ])->select();

        foreach ($keywords as $keyword) {
            $keyword->setAttr('lock', 0);
            $keyword->setAttr('lock_at', 0);
            $keyword->save();
        }
        return true;
    }
}
