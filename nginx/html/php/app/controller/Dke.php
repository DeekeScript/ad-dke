<?php

namespace app\controller;

use app\model\Agent;
use app\model\CityBlackFocusUser;
use app\model\CityFocusUser;
use app\model\CityFocusUserOp;
use app\model\CityMachineData;
use app\model\CommentRule;
use app\model\Contact;
use app\model\DouyinMethod;
use app\model\GrabKeyword;
use app\model\GrabKeywordPhone;
use app\model\LiveCode;
use app\model\LiveMessage;
use app\model\Machine;
use app\model\Op;
use app\model\Option;
use app\model\Province;
use app\model\Speech;
use app\model\SpeechLib;
use app\model\Statistic;
use app\model\Task;
use app\model\User;
use app\model\UserRule;
use app\model\Video;
use app\model\VideoComment;
use app\model\VideoDouyin;
use app\model\VideoOp;
use app\model\VideoRule;
use app\model\Log;
use app\validate\Video as ValidateVideo;
use app\validate\VideoComment as ValidateVideoComment;
use app\validate\VideoDouyin as ValidateVideoDouyin;
use app\validate\VideoOp as ValidateVideoOp;
use Exception;
use Qcloud\Cos\Client;
use think\App;
use think\facade\Cache;
use think\facade\Db;

class Dke
{
    private $secret;
    private $mobile;
    private $machineId;
    private $timestamp;
    private $data;
    private $user; //role_type  id
    private $limitKey = 'system_api_limit'; //一分钟一个mobile只能调用30次接口，否则不执行

    /**@var  App $app */
    private $app;

    public function __construct(App $app)
    {
        $this->app = $app;
        if ($app->request->method() === 'POST') {
            if ($app->request->post('content')) {
                $this->data = json_decode(urldecode(base64_decode($app->request->post('content'))), true);
                $this->mobile = $this->data['mobile'] ?? '';
                $this->secret = $this->data['secret'] ?? '';
                $this->machineId = $this->data['machine_id'] ?? 0;
                $this->timestamp = $this->data['timestamp'] ?? 0;
            } else {
                $this->data = json_decode($app->request->post('data'), true);
                $this->mobile = $app->request->post('mobile', '');
                $this->secret = $app->request->post('secret', '');
                $this->machineId = $app->request->post('machine_id', 0);
                $this->timestamp = $app->request->post('timestamp', 0);
            }
        } else {
            $this->data = json_decode($app->request->get('data'), true);
            $this->mobile = $this->data['mobile'] ?? '';
            $this->secret = $this->data['secret'] ?? '';
            $this->machineId = $this->data['machine_id'] ?? 0;
            $this->timestamp = $this->data['timestamp'] ?? 0;
        }

        if (cacheLimit($this->limitKey, 60, 30, $this->machineId)) {
            exit(json_encode(['code' => 101, 'msg' => '-系统繁忙-'], JSON_UNESCAPED_UNICODE));
        }

        if (!in_array($app->request->action(), ['login'])) {
            if (!$this->mobile || !$this->machineId || !$this->secret || !$this->timestamp) {
                exit(json_encode(['code' => 101, 'msg' => '系统繁忙--'], JSON_UNESCAPED_UNICODE));
            }

            $res = $this->verifySecret();
            if ($res['code'] !== 0) {
                exit(json_encode($res));
            }
            $this->common();
        }
    }

    private function success(array $data = [])
    {
        return json_encode(['code' => 0, 'data' => $data, 'success' => true, 'msg' => '成功'], JSON_UNESCAPED_UNICODE);
    }

    private function error(int $code = 1, string $msg = '操作有误')
    {
        return json_encode(['code' => $code, 'msg' => $msg, 'success' => false], JSON_UNESCAPED_UNICODE);
    }

    public function login()
    {
        if (!isset($this->mobile, $this->machineId, $this->mobile, $this->data['password'])) {
            return $this->error(101, '系统繁忙');
        }

        $user = new User();
        $userModel = $user->where([
            ['mobile', '=', $this->mobile],
            ['deleted', '=', 0],
            ['state', '=', 1],
        ])->find();

        if (!$userModel) {
            return $this->error(1, '登陆失败');
        }

        if (!sha1($this->data['password'] . $userModel->getAttr('salt')) === $userModel->getAttr('password')) {
            return $this->error(1, '登陆失败');
        }

        $where = [
            ['id', '=', $this->machineId],
            ['deleted', '=', 0],
        ];

        $openWx = 0;
        if ($userModel->getAttr('role_type') === 1) {
            $where[] = ['agent_user_id', '=', $userModel->getAttr('id')];
            $where[] = ['user_id', '=', 0];
            $agent = (new Agent())->where([['deleted', '=', 0], ['user_id', '=', $userModel->getAttr('id')]])->find();
            $openWx = $agent->getAttr('open_wx');
        } else {
            $where[] = ['user_id', '=', $userModel->getAttr('id')];
        }

        $machine = (new Machine())->where($where)->find();
        if (!$machine) {
            return $this->error(1, '登陆失败');
        }

        $token = uniqid('token:' . $this->machineId);
        $endTime = $user->getEndTime((int)$userModel->getAttr('type'), (int)$userModel->getAttr('created_at'));

        if ($endTime - time() <= 0) {
            return $this->error(1, '账号已到期');
        }

        Cache::store('redis')->set('token:' . $this->machineId, $token, $endTime - time());
        return $this->success([
            'token' => $token,
            'number' => $machine->getAttr('number'),
            'machineType' => $machine->getAttr('type'),
            'openWx' => $openWx,
            'isAgent' => $userModel->getAttr('role_type') === 1,
            //'endTime' => $userModel->getAttr('created_at') + $user->getEndTime($userModel->getAttr('type'), $userModel->getAttr('created_at')),
        ]);
    }

    public function deviceHeartBeat()
    {
        $res = $this->verifySecret();
        if ($res['code'] === 0) {
            return $this->success();
        }
        return $this->error($res['code'], $res['msg']);
    }

    //检测token是否失效，每次接口请求验证，不通过则需要前段自动使用generateToken方法生成token
    private function verifySecret()
    {
        try {
            if (!Cache::store('redis')->get('token:' . $this->machineId) || $this->secret !== md5($this->mobile . Cache::store('redis')->get('token:' . $this->machineId) . $this->timestamp)) {
                return ['code' => 401, 'msg' => 'token失效'];
            }

            if (time() - $this->timestamp > 60) {
                return ['code' => 1, 'msg' => 'secret失效'];
            }

            //记录user信息
            $user = new User();
            $res = $user->where([['mobile', '=', $this->mobile], ['state', '=', 1], ['deleted', '=', 0]])->field(['id', 'agent_user_id', 'role_type', 'type', 'created_at'])->find();
            if (!$res) {
                return ['code' => 401, 'msg' => '用户或代理商不存在'];
            }

            $this->user = $res->toArray();
            $this->user['machine_id'] = $this->machineId;
            return ['code' => 0, 'msg' => 'token正常'];
        } catch (Exception $e) {
            return ['code' => 401, 'msg' => $e->getMessage()];
        }
    }

    public function getDate()
    {
        $user = new User();
        $date = round(($user->getEndTime($this->user['type'], $this->user['created_at']) - time()) / 86400 * 100) / 100;
        if ($date < 0) {
            return $this->error(401, '过期');
        }
        return $this->success(['date' => $date, 'type' => $this->user['type']]);
    }

    //获取最新的100个任务记录
    public function getTaskList()
    {
        $res = Task::where([
            ['user_id', '=', $this->user['id']],
            ['agent_user_id', '=', $this->user['agent_user_id']],
            ['state', '=', 1],
            ['deleted', '=', 0],
            ['is_city', '=', $this->data['isCity'] ?? 0],
        ])->limit(100)->field(['id', 'name'])->order('id desc')->select()->toArray();

        return $this->success($res);
    }

    //获取任务详情
    public function getTaskDetail()
    {
        $detail = Task::where([
            ['id', '=', $this->data['id']],
            ['state', '=', 1],
            ['deleted', '=', 0],
            ['user_id', '=', $this->user['id']],
            ['agent_user_id', '=', $this->user['agent_user_id']],
        ])->find();
        if ($detail) {
            $detail = $detail->toArray();
        }

        if (!$detail) {
            return $this->success();
        }

        $detail['userRules'] = UserRule::where([['deleted', '=', 0], ['id', 'in', json_decode($detail['user_rule'])]])->select()->toArray();
        $detail['videoRules'] = VideoRule::where([['deleted', '=', 0], ['id', 'in', json_decode($detail['video_rule'])]])->select()->toArray();
        $detail['commentRules'] = CommentRule::where([['deleted', '=', 0], ['id', 'in', json_decode($detail['comment_rule'])]])->select()->toArray();
        $detail['commentUserRules'] = UserRule::where([['deleted', '=', 0], ['id', 'in', json_decode($detail['comment_user_rule'])]])->select()->toArray();

        return $this->success($detail);
    }

    public function speechLibList()
    {
        $opWhere = [
            'user_id' => $this->user['agent_user_id'] ?: $this->user['id'],
            'type' => $this->data['type'] ?? 0,
            'role_type' => (int)$this->user['role_type'],
        ];
        $model = new SpeechLib();
        $data = $model->getList(100, 1, $opWhere);
        return $this->success($data);
    }

    //随机获取话术库内容，并且混淆
    public function getMsg()
    {
        $type = $this->data['type'] ?? 0;
        //先获取话术库  数组
        if (!isset($this->data['lib_id'])) {

            return $this->error();
        }
        $this->data['lib_id']  = json_decode($this->data['lib_id'], true);
        if (!is_array($this->data['lib_id']) || !$this->data['lib_id']) {
            return $this->error();
        }

        $speedIds = SpeechLib::where([
            ['deleted', '=', 0],
            ['type', '=', $type],
            ['id', 'in', $this->data['lib_id']],
            ['user_id', '=', $this->user['id']],
            ['agent_user_id', '=', $this->user['agent_user_id']],
        ])->field(['id'])->select()->toArray();
        if (!$speedIds) {
            return $this->error(1, '记录不存在');
        }

        $speedIds = array_column($speedIds, 'id');
        $count = Speech::where([['deleted', '=', 0], ['lib_id', 'in', $speedIds]])->count();
        if ($count === 0) {
            return $this->error(1, '没有数据');
        }
        $index = mt_rand(1, $count);
        $res = Speech::where([['deleted', '=', 0], ['lib_id', 'in', $speedIds]])->field(['id', 'desc', 'level'])->limit($index - 1, 1)->select()->toArray();
        if ($res) {
            $res = $res[0];
        }
        $data = (new Speech())->autoSpeechList(['desc' => $res['desc'], 'level' => $res['level']], 5);
        if ($data['code'] !== 0) {
            return $this->error(1, '找不到数据');
        }

        $data = $data['data'];
        $result = [];
        foreach ($data as $k => $v) {
            $result[$k] = ['id' => $res['id'], 'msg' => $v];
        }

        $index = mt_rand(0, count($result) - 1);
        return $this->success($result[$index]);
    }

    private function common()
    {
        if ($this->user['role_type'] === 1) {
            $this->user['agent_user_id'] = $this->user['id'];
            $this->user['id'] = 0;
        }

        //写入的时候可能需要的数据
        $this->data['user_id'] = $this->user['id'];
        $this->data['agent_user_id'] = $this->user['agent_user_id'];
        $this->data['created_at'] = time();
        $this->data['machine_id'] = $this->user['machine_id'] ?? 0;
    }

    //添加视频详情
    public function addVideo()
    {
        $videoModel = new Video();
        try {
            validate(ValidateVideo::class)->check($this->data);
        } catch (Exception $e) {
            return $this->error(1, $e->getMessage());
        }

        foreach ($this->data as $k => $v) {
            if (is_array($v)) {
                $v = json_encode($v, JSON_UNESCAPED_UNICODE);
            }
            $videoModel->setAttr($k, $v);
        }

        $videoModel->save();
        $this->data['type'] = (int)$this->data['type'];
        $res = (new Statistic())->updateStatistic([
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'task_id' => $this->data['task_id'],
            'machine_id' => $this->user['machine_id'],
            'view_video' => $this->data['type'] === 0 ? 1 : 0,
            'target_video' => $this->data['type'] === 1 ? 1 : 0,
        ], $this->data['type']);

        return $this->success(['id' => $videoModel->getAttr('id')]);
    }

    //添加操作内容
    public function addVideoOp()
    {
        $opWhere = [
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'video_id' => $this->data['video_id'],
            'deleted' => 0,
            'type' => $this->data['type'],
            'machine_id' => $this->user['machine_id'],
        ];

        if ((int)$opWhere['type'] === 1 && isset($this->data['video_comment_id']) && $this->data['video_comment_id']) {
            $opWhere['video_comment_id'] = $this->data['video_comment_id'];
        }

        $videoOpModel = (new VideoOp())->where($opWhere)->find();
        if (!$videoOpModel) {
            $videoOpModel = new VideoOp();
        }

        try {
            validate(ValidateVideoOp::class)->check($this->data);
        } catch (Exception $e) {
            return $this->error(1, $e->getMessage());
        }

        foreach ($this->data as $k => $v) {
            //等于0的不操作
            if (!$v) {
                continue;
            }
            $videoOpModel->setAttr($k, $v);
        }

        $videoOpModel->save();
        (new Statistic())->updateStatistic([
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'task_id' => $this->data['task_id'],
            'machine_id' => $this->user['machine_id'],
            'is_zan' => $this->data['is_zan'] ?? 0,
            'is_comment' => $this->data['is_comment'] ?? 0,
            'is_focus' => $this->data['is_focus'] ?? 0,
            'is_private_msg' => $this->data['is_private_msg'] ?? 0,
            'view_user' => $this->data['is_view_user'] ?? 0,
            'view_video' => $this->data['is_view_video'] ?? 0,
            'target_video' => $this->data['is_view_target_video'] ?? 0
        ], $this->data['type']);
        return $this->success(['id' => $videoOpModel->getAttr('id')]);
    }

    public function op()
    {
        //操作，0点赞视频，1点赞评论，2评论，3关注，4私信，5访问主页，6刷视频
        $op = new Op();
        $opWhere = [
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'task_id' => $this->data['task_id'],
            'deleted' => 0,
            'machine_id' => $this->user['machine_id'],
            'type' => $this->data['type'],
            'created_at' => time(),
        ];

        foreach ($opWhere as $k => $v) {
            $op->setAttr($k, $v);
        }
        $op->save();
        return $this->success(['id' => $op->getAttr('id')]);
    }

    //添加视频评论操作内容
    public function addVideoComment()
    {
        $videoCommentModel = new VideoComment();
        try {
            validate(ValidateVideoComment::class)->check($this->data);
        } catch (Exception $e) {
            return $this->error(1, $e->getMessage());
        }

        foreach ($this->data as $k => $v) {
            $videoCommentModel->setAttr($k, $v);
        }
        $videoCommentModel->save();
        return $this->success(['id' => $videoCommentModel->getAttr('id')]);
    }

    public function updateVideoComment()
    {
        $videoCommentModel = (new VideoComment())->where([
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'id' => $this->data['id'],
        ])->find();

        if ($videoCommentModel) {
            $videoCommentModel->setAttr('douyin', $this->data['douyin']);
            $videoCommentModel->save();
            return $this->success(['id' => $videoCommentModel->getAttr('id')]);
        }

        return $this->success(['id' => 0]);
    }

    //添加视频评论操作内容
    public function addVideoDouyin()
    {
        $videoDouyinModel = new VideoDouyin();
        try {
            validate(ValidateVideoDouyin::class)->check($this->data);
        } catch (Exception $e) {
            return $this->error(1, $e->getMessage());
        }

        foreach ($this->data as $k => $v) {
            $videoDouyinModel->setAttr($k, $v);
        }

        if (isset($this->data['video_id'])) {
            $videoModel = (new Video())->where([
                'user_id' => $this->user['id'],
                'agent_user_id' => $this->user['agent_user_id'],
                'id' => $this->data['video_id'],
            ])->find();
            if ($videoModel) {
                $videoModel->setAttr('douyin', $this->data['douyin']);
                $videoModel->save();
            }
        }

        $videoDouyinModel->save();
        return $this->success(['id' => $videoDouyinModel->getAttr('id')]);
    }

    //30天内的重复视频直接过滤
    public function videoExist()
    {
        if (!isset($this->data['title']) || !isset($this->data['nickname'])) {
            return $this->error();
        }

        if (Video::where([
            ['deleted', '=', 0],
            ['title', '=', $this->data['title']],
            ['nickname', '=', $this->data['nickname']],
            ['user_id', '=', $this->user['id']],
            ['agent_user_id', '=', $this->user['agent_user_id']],
            ['created_at', '>=', time() - 86400 * 30],
        ])->count()) {
            return $this->success(['isExist' => true]);
        }
        return $this->success(['isExist' => false]);
    }

    public function accountFre()
    {
        if (!isset($this->data['title']) || !isset($this->data['nickname'])) {
            return $this->error();
        }

        if (Video::where([
            ['deleted', '=', 0],
            ['nickname', '=', $this->data['nickname']],
            ['user_id', '=', $this->user['id']],
            ['agent_user_id', '=', $this->user['agent_user_id']],
            ['created_at', '>=', time() - 86400],
        ])->count() >= 2) {
            return $this->success();
        }

        if (Video::where([
            ['deleted', '=', 0],
            ['nickname', '=', $this->data['nickname']],
            ['user_id', '=', $this->user['id']],
            ['agent_user_id', '=', $this->user['agent_user_id']],
            ['created_at', '>=', time() - 86400 * 30],
        ])->count() >= 5) {
            return $this->success();
        }
        return $this->error();
    }

    //30天内的重复用户直接过滤
    public function douyinExist()
    {
        if (!isset($this->data['douyin'])) {
            return $this->error();
        }

        if (VideoDouyin::where([
            ['deleted', '=', 0],
            ['douyin', '=', $this->data['douyin']],
            ['user_id', '=', $this->user['id']],
            ['agent_user_id', '=', $this->user['agent_user_id']],
            ['created_at', '>=', time() - 86400 * 30],
            ['created_at', '<=', time() - 60],
        ])->count()) {
            return $this->success(['isExist' => true]);
        }
        return $this->success(['isExist' => false]);
    }

    //日志模块
    public function log()
    {
        if (!isset($this->data['type'])) {
            $this->data['type'] = 0;
        }

        if (!isset($this->data['desc'])) {
            return $this->error();
        }

        if (mb_strlen($this->data['desc']) > 1024) {
            return $this->error(1, '内容太长了');
        }

        $logModel = new Log();
        $logModel->setAttr('type', $this->data['type']);
        $logModel->setAttr('desc', $this->data['desc']);
        $logModel->setAttr('user_id', $this->user['id']);
        $logModel->setAttr('agent_user_id', $this->user['agent_user_id']);
        $logModel->setAttr('created_at', time());
        $logModel->setAttr('machine_id', $this->data['machine_id']);
        $logModel->save();
        return $this->success();
    }

    public function checkAppVersion()
    {
        try {
            $result = (new Option())->where(['key' => Option::APK])->find();
            if (!$result) {
                return $this->error(1, '暂无更新');
            }

            //jiangqiao-1252432685.cos.ap-shanghai.myqcloud.com/apk/dke_v2.3.3.apk

            $name = pathinfo($result->getAttr('value'), PATHINFO_FILENAME); //dke_v2.3.2
            $name = str_replace(env('LOGO') . '_v', '',  $name);
            $name = str_replace('.apk', '', $name);
            $name = str_replace('.', '', $name);

            if ((int)$this->data['version'] < (int)$name) {
                return $this->success(['url' => 'https://' . $result->getAttr('value')]);
            }
            return $this->error(1, '暂无更新');
        } catch (\Exception $e) {
            // 请求失败
            return $this->error(1, $e->getMessage());
        }
    }

    //获取24小时内的视频数据
    //获取每日数据
    public function getDateData()
    {
        $opModel = new Op();
        $params = [
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'task_id' => $this->data['task_id'],
        ];

        //获取24小时内的点赞等频率数据
        return $this->success([
            'zanVideoTimestamp' => $opModel->getAllTimestamp(array_merge($params, ['type' => Op::TYPE[0]])),
            'zanCommentTimestamp' => $opModel->getAllTimestamp(array_merge($params, ['type' => Op::TYPE[1]])),
            'commentTimestamp' => $opModel->getAllTimestamp(array_merge($params, ['type' => Op::TYPE[2]])),
            'focusTimestamp' => $opModel->getAllTimestamp(array_merge($params, ['type' => Op::TYPE[3]])),
            'privateMsgTimestamp' => $opModel->getAllTimestamp(array_merge($params, ['type' => Op::TYPE[4]])),
            'viewUserPageTimestamp' => $opModel->getAllTimestamp(array_merge($params, ['type' => Op::TYPE[5]])),
            'videoTimestamp' => $opModel->getAllTimestamp(array_merge($params, ['type' => Op::TYPE[6]])),
        ]);
    }

    public function getDouyinConfig()
    {
        if (!isset($this->data['account'])) {
            return $this->error(1, '缺少参数');
        }

        $params = [
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'account' => $this->data['account'],
        ];
        $privateClose = (new DouyinMethod())->privateClose($params);

        return $this->success(['privateClose' => $privateClose]);
    }

    public function addDouyinConfig()
    {
        if (!isset($this->data['account'])) {
            return $this->error(1, '缺少参数');
        }

        $params = [
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'account' => $this->data['account'],
        ];

        $res = (new DouyinMethod())->add($params);
        if ($res['code'] === 0) {
            return $this->success();
        }

        return $this->error(1, $res['msg']);
    }

    public function getTaskVideoData()
    {
        $video = new Video();
        $params = [
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'task_id' => $this->data['task_id'],
        ];

        $res = $video->getSum($params);
        //获取24小时内的点赞等频率数据
        return $this->success([
            'videoCount' => $res['videoCount'],
            'targetVideoCount' =>  $res['targetVideoCount'],
        ]);
    }

    public function getProvince()
    {
        $res = (new Province())->field(['id', 'name'])->select()->toArray();
        return $this->success($res);
    }

    public function getCosSign()
    {
        $signData = (new \TencentCos())->getSign();
        $signData['url'] = env('BUCKET') . '.cos.' . env('REGION') . '.myqcloud.com';
        $signData['bucket'] = env('BUCKET');
        $signData['region'] = env('REGION');
        $signData['path'] = 'log';
        return $this->success($signData);
    }

    public function uploadLog()
    {
        $files = request()->file();
        $savename = [];

        try {
            for ($i = 0; $i < count($files); $i++) {
                validate(['file' . $i => 'fileSize:1048576|fileExt:txt'])->check($files); //限制1M
            }

            foreach ($files as $file) {
                $savename[] = \think\facade\Filesystem::disk('public')->putFileAs('log/' . date('Ymd'), $file, $this->data['machine_id'] . '_' . date('H-s-i') . '_' . $file->getOriginalName());
            }
        } catch (\think\exception\ValidateException $e) {
            return $this->error(1, $e->getMessage());
        }

        if ($savename) {
            $logModel = new Log();
            $logModel->setAttr('type', $this->data['type'] ?? 0);
            $logModel->setAttr('desc', json_encode($savename));
            $logModel->setAttr('user_id', $this->user['id']);
            $logModel->setAttr('agent_user_id', $this->user['agent_user_id']);
            $logModel->setAttr('created_at', time());
            $logModel->setAttr('machine_id', $this->data['machine_id']);
            $logModel->save();
        }

        return $this->success($savename);
    }

    public function getLiveAccount()
    {
        $res = (new LiveMessage())->getList($this->data);
        if ($res['code'] === 0) {
            return $this->success(['list' => $res['data'], 'id' => $res['id']]);
        }
        return $this->error(1, $res['msg']);
    }

    public function addLiveAccount()
    {
        $res = (new LiveMessage())->add($this->data);
        if ($res['code'] === 0) {
            return $this->success();
        }
        return $this->error(1, $res['msg']);
    }

    public function getLiveCode()
    {
        $res = (new LiveCode())->add();
        if ($res['code'] === 0) {
            return $this->success(['code' => $res['data']]);
        }
        return $this->error(1, $res['msg']);
    }

    public function getKeyword()
    {
        $res = (new GrabKeyword())->getKeyword([
            'agent_user_id' => $this->user['agent_user_id'],
        ]);
        return $this->success($res);
    }

    //获取通讯录
    public function getContacts()
    {
        $redis = \IRedis::instance();
        $contacts = (new Contact())->getList(1, 1, [
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->machineId,
        ]); //最少多少条，才采集过来
        $data = [];

        $options = (new Option())->getSetting($this->user['agent_user_id']);
        if ($contacts['total'] === 0 && $redis->lock('dke_getContacts_' . $this->user['agent_user_id'], $this->machineId)) {
            //如果没有本地通讯录，创建通讯录
            Db::startTrans();
            $res = (new Contact())->add([
                'agent_user_id' => $this->user['agent_user_id'],
                'user_id' => 0,
                'machine_id' => $this->machineId,
            ]);

            $data = (new GrabKeywordPhone())->updateListByContact($options['contact_count'], 1, [
                'minTotal' => $options['contact_count'],
                'contact_id' => $res['id'],
                'agent_user_id' => $this->user['agent_user_id'],
                'type' => [0], //只需要普通手机号
            ]);

            if ($data) {
                Db::commit();
            } else {
                Db::rollback();
            }

            $redis->unLock('dke_getContacts_' . $this->user['agent_user_id']);
        } elseif ($contacts['total'] && $contacts['data'][0]['status'] === 1 && $redis->lock('dke_getContacts_' . $this->user['agent_user_id'], $this->machineId)) {
            //如果本地通讯录已完成
            $data = (new GrabKeywordPhone())->updateListByContact($options['contact_add_count'], 1, [
                'minTotal' => $options['contact_add_count'],
                'contact_id' => $contacts['data'][0]['id'],
                'agent_user_id' => $this->user['agent_user_id'],
                'type' => [0], //只需要普通手机号
            ]);
            $redis->unLock('dke_getContacts_' . $this->user['agent_user_id']);
        }

        return $this->success($data);
    }

    public function getFriendContacts()
    {
        $redis = \IRedis::instance();

        $data = [];
        if ($redis->lock('dke_getContacts_' . $this->user['agent_user_id'], $this->machineId)) {
            $data = (new GrabKeywordPhone())->updateListByContact($this->data['limit'] ?? 1, 1, [
                'contact_id' => 0,
                'agent_user_id' => $this->user['agent_user_id'],
                'type' => [0, 2], //只需要普通手机号和微信
                //'machine_id' => $this->machineId,
            ]);
            $redis->unLock('dke_getContacts_' . $this->user['agent_user_id']);
        }
        return $this->success($data);
    }

    public function updateContact()
    {
        $res = (new Contact())->editStatus($this->machineId, $this->user['agent_user_id'], 1);
        if ($res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error(1, $res['msg']);
    }

    public function updateGrabKeywordStatus()
    {
        $res = (new GrabKeyword())->editStatus($this->data['id'], $this->data['status'] ?? 0);
        if ($res['code'] === 0) {
            return $this->success();
        }
        return $this->error(1, $res['msg']);
    }

    public function getGrabTaskSetting()
    {
        $model = new Option();
        return $this->success($model->getSetting($this->user['agent_user_id']));
    }

    public function grabKeywordPhone()
    {
        $model = new GrabKeywordPhone();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'keyword_id' => $this->data['keyword_id'],
            'wx' => $this->data['wx'] ?? '',
            'mobile' => $this->data['_mobile'] ?? '', //防止和默认的系统手机号重复
            'nickname' => $this->data['nickname'],
            'account' => $this->data['douyin'],
            'age' => $this->data['age'],
            'desc' => $this->data['introduce'],
            'zan_count' => $this->data['zanCount'],
            'focus_count' => $this->data['focusCount'],
            'fans_count' => $this->data['fansCount'],
            'work_count' => $this->data['worksCount'],
            'ip' => $this->data['ip'],
            'gender' => $this->data['gender'],
            'type' => (isset($this->data['_mobile']) && $this->data['_mobile']) ? 0 : 2,
        ];

        $res = $model->add($params);
        if ($res['code'] === 0) {
            return $this->success();
        }

        return $this->error(1, $res['msg']);
    }

    public function updatePhoneStatus()
    {
        $model = new GrabKeywordPhone();
        $res = $model->setStatus($this->data['_mobile'], $this->data['type'], [
            'agent_user_id' => $this->user['agent_user_id'],
            'status' => 1,
            'wx_status' => $this->data['wx_status'] ?? 0,
        ]);

        if ($res['code'] === 1) {
            return $this->error(1, $res['msg']);
        }
        return $this->success($res);
    }

    //开始同城关注相关功能
    //开始上传今日的数据
    public function cityMachineData()
    {
        $model = new CityMachineData();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'account' => $this->data['account'] ?? '',
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'focus_count' => $this->data['focus_count'] ?? 0,
            'inc_focus_count' => $this->data['inc_focus_count'] ?? 0,
            'dec_focus_count' => $this->data['dec_focus_count'] ?? 0,
            'comment_count' => $this->data['comment_count'] ?? 0,
            'zan_comment_count' => $this->data['zan_comment_count'] ?? 0,
            'zan_count' => $this->data['zan_count'] ?? 0,
            'refresh_video_count' => $this->data['refresh_video_count'] ?? 0,
            'new_works_user_count' => $this->data['new_works_user_count'] ?? 0,
        ];
        $res = $model->add($params);
        if ($res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error(1, $res['msg']);
    }

    //首先客户端关注，然后成功之后则不做任何操作，失败的话，则取消关注
    public function cityFocus()
    {
        $model = new CityFocusUser();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'account' => $this->data['douyin'],
            'nickname' => $this->data['nickname'],
            'age' => $this->data['age'] ?? 0,
            'gender' => $this->data['gender'] ?? 0,
            'zan_count' => $this->data['zanCount'] ?? 0,
            'fans_count' => $this->data['fansCount'] ?? 0,
            'focus_count' => $this->data['focusCount'] ?? 0,
            'introduce' => $this->data['introduce'] ?? '',
            'works_count' => $this->data['worksCount'] ?? 0,
            'distance' => $this->data['distance'] ?? 0,
            'works_url' => $this->data['works_url'] ?? '',
        ];
        $res = $model->add($params);
        if ($res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error(1, $res['msg']);
    }

    //查看是否重复
    public function cityAccountExist()
    {
        $model = new CityFocusUser();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'account' => $this->data['douyin'],
        ];
        $res = $model->accountExist($params);
        if ($res['code'] === 0) {
            return $this->success($res); //重复
        }
        return $this->error(1, $res['msg']);
    }

    //取消关注
    public function cityCancelFocus()
    {
        $model = new CityFocusUser();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'account' => $this->data['douyin'],
        ];
        $res = $model->cancelFocus($params);
        if ($res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error(1, $res['msg']);
    }

    //更新用户数据
    public function cityUserUpdate()
    {
        $model = new CityFocusUser();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'account' => $this->data['douyin'],
            'nickname' => $this->data['nickname'],
            'age' => $this->data['age'] ?? 0,
            'gender' => $this->data['gender'] ?? 0,
            'zan_count' => $this->data['zanCount'] ?? 0,
            'fans_count' => $this->data['fansCount'] ?? 0,
            'focus_count' => $this->data['focusCount'] ?? 0,
            'introduce' => $this->data['introduce'] ?? '',
            'works_count' => $this->data['worksCount'] ?? 0,
            // 'distance' => $this->data['distance'] ?? 0,
            // 'works_url' => $this->data['works_url'] ?? '',
        ];
        $res = $model->edit($params);
        if ($res['code'] === 0) {
            $this->cityUserOp();
            return $this->success($res['data']);
        }
        return $this->error(1, $res['msg']);
    }

    protected function cityUserOp()
    {
        $model = new CityFocusUserOp();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
            'account' => $this->data['douyin'],
            'comment' => $this->data['commentMsg'],
            'is_comment' => $this->data['isComment'] ?? 0,
            'is_zan' => $this->data['isZan'] ?? 0,
            'works_count' => $this->data['worksCount'] ?? 0,
        ];

        $res = $model->add($params);
        if ($res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error(1, $res['msg']);
    }

    public function getYesterdayAccount()
    {
        $model = new CityFocusUserOp();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
        ];
        return $this->success($model->getYesterdayAccount($params));
    }

    //黑名单获取
    public function getBlackFocusUsers()
    {
        $model = new CityBlackFocusUser();
        $params = [
            'role_type' => (int)$this->user['role_type'],
            'user_id' => $this->user['id'],
            'agent_user_id' => $this->user['agent_user_id'],
            'machine_id' => $this->user['machine_id'],
        ];
        return $this->success($model->getAccount($params));
    }
    //同城关注相关功能完成
}
