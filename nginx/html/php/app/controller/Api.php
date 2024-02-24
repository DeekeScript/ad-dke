<?php

namespace app\controller;

use app\BaseController;
use app\common\Role;
use app\model\Agent;
use app\model\CityBlackFocusUser;
use app\model\CommentRule;
use app\model\CityFocusUser;
use app\model\CityFocusUserOp;
use app\model\CityMachineData;
use app\model\GrabKeyword;
use app\model\GrabKeywordPhone;
use app\model\Log;
use app\model\LoginLog;
use app\model\Machine;
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
use Exception;
use JeroenDesloovere\VCard\VCard;
use Qcloud\Cos\Client;
use think\captcha\facade\Captcha;

class Api extends BaseController
{
    public function login()
    {
        $params = $this->request->post();
        if (!isset($params['mobile'], $params['password'], $params['role_type'], $params['code'])) {
            return $this->error(['msg' => '登陆失败']);
        }

        if (!Captcha::check((string)$params['code'])) {
            // 验证失败
            return $this->error(['msg' => '验证码有误']);
        }

        $loginLog = new LoginLog();
        $res = $loginLog->execute($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }

        $user = new User();
        $res = $user->login($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function outLogin()
    {
        return $this->success([]);
    }

    public function currentUser()
    {
        $this->user['permissions'] = (new Role())->getAccess($this->user['role_type'], (int)$this->user['id']);
        return $this->success([
            'code' => 0,
            'data' => $this->user,
        ]);
    }

    public function editPassword()
    {
        $model = new User();
        $params = $this->request->post();
        $params['id'] = $this->user['id'];
        $res = $model->editPassword($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function userList()
    {
        $model = new User();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addUser()
    {
        $model = new User();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        if ($this->user['role_type'] === 0) {
            $params['machine_id'] = 0;
        }
        $params['role_type'] = $this->user['role_type'];

        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateUser()
    {
        $model = new User();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];

        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeUser()
    {
        $model = new User();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        if ($this->user['id'] === $params['id']) {
            return $this->error(['code' => 1, 'msg' => '不能删除自己']);
        }
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function agentList()
    {
        $model = new Agent();
        $res = $model->getList($this->limit, $this->page, $this->request->get());
        return $this->success($res);
    }

    public function addAgent()
    {
        $model = new Agent();
        $res = $model->add($this->request->post());
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateAgent()
    {
        $model = new Agent();
        $res = $model->edit($this->request->post());
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeAgent()
    {
        $model = new Agent();
        $res = $model->remove($this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function machineList()
    {
        $model = new Machine();
        $params = $this->request->get();
        $params['p_user_id'] = $params['user_id'] ?? 0; //查询的user_id  role_type不是代理商的时候，可以参与
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        $machineCount = $this->user['role_type'] === 1 ? (new Agent())->machineCount($this->user['id']) : 0;
        return $this->success($res, ['machineCount' => $machineCount]);
    }

    public function addMachine()
    {
        $model = new Machine();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateMachine()
    {
        $model = new Machine();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeMachine()
    {
        $model = new Machine();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function statisticList()
    {
        $model = new Statistic();
        $params = $this->request->get();
        if (isset($params['user_id'])) {
            $params['p_user_id'] = $params['user_id'];
        }
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function statistic()
    {
        $model = new Statistic();
        $params = $this->request->get();
        if (isset($params['user_id'])) {
            $params['p_user_id'] = $params['user_id'];
        }
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->statistic($params);
        return $this->success($res);
    }

    public function removeStatistic()
    {
        $model = new Statistic();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function videoList()
    {
        $model = new Video();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function removeVideo()
    {
        $model = new Video();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function videoDetailList()
    {
        $model = new VideoOp();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $params['type'] = 0;
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function videoCommentList()
    {
        $model = new VideoComment();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $params['type'] = 1;
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function removeVideoDetail()
    {
        $model = new VideoOp();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeVideoComment()
    {
        $model = new VideoOp();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function videoDouyinList()
    {
        $model = new VideoDouyin();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addVideoDouyin()
    {
        $model = new VideoDouyin();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateVideoDouyin()
    {
        $model = new VideoDouyin();
        $res = $model->edit($this->request->post());
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeVideoDouyin()
    {
        $model = new VideoDouyin();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function taskList()
    {
        $model = new Task();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addTask()
    {
        $model = new Task();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateTask()
    {
        $model = new Task();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeTask()
    {
        $model = new Task();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    //获取规则列表  任务创建需要
    public function getVideoRules()
    {
        $model = new VideoRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->videoRules($params);
        return $this->success(['data' => $res]);
    }

    //获取规则列表  任务创建需要
    public function getCommentRules()
    {
        $model = new CommentRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->commentRules($params);
        return $this->success(['data' => $res]);
    }

    public function getProvince()
    {
        $model = new Province();
        $params = $this->request->get();
        $this->limit = 1000;
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    //获取规则列表  任务创建需要
    public function getUserRules()
    {
        $model = new UserRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->userRules($params);
        return $this->success(['data' => $res]);
    }

    public function updateVideoRule()
    {
        $model = new VideoRule();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeVideoRule()
    {
        $model = new VideoRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function videoRuleList()
    {
        $model = new VideoRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addVideoRule()
    {
        $model = new VideoRule();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateCommentRule()
    {
        $model = new CommentRule();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeCommentRule()
    {
        $model = new CommentRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function commentRuleList()
    {
        $model = new CommentRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addCommentRule()
    {
        $model = new CommentRule();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateUserRule()
    {
        $model = new UserRule();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeUserRule()
    {
        $model = new UserRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function userRuleList()
    {
        $model = new UserRule();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addUserRule()
    {
        $model = new UserRule();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function getMachine()
    {
        $model = new Machine();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getMachine($params);
        return $this->success($res);
    }

    public function SpeechList()
    {
        $model = new Speech();
        $params = $this->request->get();
        $params['p_user_id'] = $this->request->get('user_id');
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function getSpeechLib()
    {
        $model = new SpeechLib();
        $params = $this->request->get();
        $params['p_user_id'] = $this->request->get('user_id');
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $this->limit = 1000;
        $res = $model->getList($this->limit, $this->page, $params);
        if ($res['data']) {
            $res['data'] = array_map(static function ($item) {
                return ['label' => $item['name'] . '[' . ($item['type'] === 1 ? '私信' : '评论') . ']', 'value' => $item['id']];
            }, $res['data']);
        }
        return $this->success($res);
    }

    public function addSpeech()
    {
        $model = new Speech();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateSpeech()
    {
        $model = new Speech();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeSpeech()
    {
        $model = new Speech();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function SpeechLibList()
    {
        $model = new SpeechLib();
        $params = $this->request->get();
        $params['p_user_id'] = $this->request->get('user_id');
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addSpeechLib()
    {
        $model = new SpeechLib();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateSpeechLib()
    {
        $model = new SpeechLib();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeSpeechLib()
    {
        $model = new SpeechLib();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function autoSpeechList()
    {
        $model = new Speech();

        $res = $model->autoSpeechList($this->request->get(), 10);
        return $this->success($res);
    }

    //日志列表  只有管理员有权限 不需要用户的筛选
    public function logList()
    {
        $model = new Log();
        $params = $this->request->get();
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function removeLog()
    {
        $model = new Log();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id', 0, 'int'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function downloadJson()
    {
        return download(json_encode($this->request->get()), 'device.json', true);
    }

    public function apkList()
    {
        //$signData = (new \TencentCos())->getSign();
        //jiangqiao-1252432685.cos.ap-shanghai.myqcloud.com/apk/dke_v2.3.2.apk
        $apk = (new Option())->where(['key' => Option::APK])->find();
        if ($apk) {
            $cosClient = new Client(
                [
                    'region' => env('REGION'),
                    'schema' => 'https', //协议头部，默认为http
                    'credentials' => [
                        'secretId'  => env('GROUP_SECRET_ID'),
                        'secretKey' =>  env('GROUP_SECRET_KEY'),
                    ]
                ]
            );

            $tmp = explode('/', $apk['value']);
            $key = '';
            for ($k = 0; $k < count($tmp); $k++) {
                if ($k <= 0) {
                    continue;
                }
                $key .= '/' . $tmp[$k];
            }
            $key = ltrim($key, '/');

            try {
                $result = $cosClient->headObject([
                    'Bucket' => env('BUCKET'), //存储桶名称，由BucketName-Appid 组成，可以在COS控制台查看 https://console.cloud.tencent.com/cos5/bucket
                    'Key' => $key,
                ]);

                // 请求成功
                return $this->success(['data' => [[
                    'name' => pathinfo($apk['value'], PATHINFO_FILENAME),
                    'id' => $apk['created_at'],
                    'url' => 'https://' . $apk['value'],
                    'created_at' => $apk['created_at'],
                    'size' => $result->toArray()['ContentLength'],
                ]]]);
            } catch (\Exception $e) {
                // 请求失败
                return $this->error(['msg' => $e->getMessage()]);
            }
        }

        return $this->success([]);
    }

    public function addApk()
    {
        $params = $this->request->post();
        $model = new Option();
        if (isset($params['value'])) {
            $params['key'] = Option::APK;
            $res = $model->add($params);
            if ($res['code'] === 0) {
                return $this->success([]);
            }
            return $this->error(['msg' => $params['msg']]);
        }
        return $this->error(['msg' => '操作有误']);
    }

    public function getCosSign()
    {
        try {
            if (!request()->get('type')) {
                $signData = (new \TencentCos())->getSign();
            } else {
                $signData = [];
            }

            $signData['url'] = env('BUCKET') . '.cos.' . env('REGION') . '.myqcloud.com';
            $signData['bucket'] = env('BUCKET');
            $signData['region'] = env('REGION');
            $signData['path'] = 'log';
            $signData['logo'] = env('LOGO');
            return $this->success(['data' => $signData]);
        } catch (Exception $e) {
            return $this->error(['msg' => $e->getTrace()]);
        }
    }

    public function verify()
    {
        return Captcha::create();
    }

    public function grabTaskList()
    {
        $model = new GrabKeyword();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function addGrabTask()
    {
        $model = new GrabKeyword();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->add($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function updateGrabTask()
    {
        $model = new GrabKeyword();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->edit($params);
        if ($res['code'] === 1) {
            return $this->error($res);
        }
        return $this->success($res);
    }

    public function removeGrabTask()
    {
        $model = new GrabKeyword();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }

        return $this->success($res);
    }

    public function grabTaskPhoneList()
    {
        $model = new GrabKeywordPhone();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function removeGrabTaskPhone()
    {
        $model = new GrabKeywordPhone();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params, $this->request->get('id'));
        if ($res['code'] === 1) {
            return $this->error($res);
        }

        return $this->success($res);
    }

    public function getGrabTaskSetting()
    {
        $model = new Option();
        $res = $model->get(Option::CONTACT_SETTING . '_' . $this->user['id']);
        if ($res) {
            return $this->success(['data' => json_decode($res, true)]);
        }

        return $this->success(['data' => [
            'machine_count' => 5,
            'contact_count' => 2000,
            'contact_add_count' => 20,
            'search_add_count' => 30,
            'add_contact_friend_count' => 5,
            'add_search_friend_count' => 1,
            'add_friend_sec' => 450,
            'send_text' => '找你有事',
        ]]);
    }

    public function grabTaskSetting()
    {
        $model = new Option();
        $res = $model->add([
            'key' => Option::CONTACT_SETTING . '_' . $this->user['id'],
            'value' => json_encode([
                'machine_count' => $this->request->post('machine_count', 5),
                'contact_count' => $this->request->post('contact_count', 2000),
                'contact_add_count' => $this->request->post('contact_add_count', 20),
                'search_add_count' => $this->request->post('search_add_count', 30),
                'add_contact_friend_count' => $this->request->post('add_contact_friend_count', 5),
                'add_search_friend_count' => $this->request->post('add_search_friend_count', 1),
                'add_friend_sec' => $this->request->post('add_friend_sec', 450),
                'send_text' => $this->request->post('send_text', '找你有事'),
            ])
        ]);
        if ($res['code'] === 0) {
            return $this->success([]);
        }
        return $this->error($res);
    }

    public function updatePhone()
    {
        $model = new GrabKeywordPhone();
        $res = $model->updateMobileWx($this->request->post(), $this->user['id']);
        if ($res['code'] === 0) {
            return $this->success([]);
        }
        return $this->error($res);
    }

    public function exportVcf()
    {
        // 保存位置
        try {
            if (!is_dir(public_path() . '/storage/' . date('Y-m-d') . '/')) {
                mkdir(public_path() . '/storage/' . date('Y-m-d') . '/', 0777);
            }

            $filename = public_path() . '/storage/' . date('Y-m-d') . '/' . time() . '_' . $this->user['id'] . "_vcard.vcf";
            $myfile = fopen($filename, "w");
            $res = (new GrabKeywordPhone())->downloadPhone($this->request->get('limit') ?: 60, $this->user['id']);
            if ($res['code'] === 1) {
                return $this->error(['msg' => $res['msg']]);
            }

            foreach ($res['data'] as $data) {
                $all_str = $this->make_vcard($data['nickname'], $data['mobile']);
                fwrite($myfile, $all_str);
            }
            fclose($myfile);
            return $this->success(['data' => file_get_contents($filename)]);
        } catch (Exception $e) {
            return $this->error(['msg' => $e->getMessage()]);
        }
    }

    protected function make_vcard($name = '', $mobile = '')
    {
        if (empty($mobile)) {
            return '';
        }
        $vcard = new VCard();
        // define variables
        $lastname          = '';
        $firstname         = "$name";
        $additional        = '';
        $prefix            = '';
        $suffix            = '';
        // 这里可以不要,默认UTF-8,导出来windows可能会中文乱码,但是手机上不影响
        $vcard->addName($lastname, $firstname, $additional, $prefix, $suffix);
        $vcard->addPhoneNumber((int) $mobile, 'PREF;WORK');
        $vcard->addPhoneNumber((int) $mobile, 'WORK');
        return $vcard->getOutput();
    }

    public function focusUserList()
    {
        $model = new CityFocusUser();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->getList($this->limit, $this->page, $params);
        return $this->success($res);
    }

    public function focusUserChatList()
    {
        try {
            $model = new CityFocusUserOp();
            $params = $this->request->get();
            $params['user_id'] = $this->user['id'];
            $params['role_type'] = $this->user['role_type'];
            $res = $model->getList($this->limit, $this->page, $params);
            return $this->success($res);
        } catch (Exception $e) {
            var_dump($e->getMessage());
            exit;
        }
    }

    public function blackFocusUserList()
    {
        try {
            $model = new CityBlackFocusUser();
            $params = $this->request->get();
            $params['user_id'] = $this->user['id'];
            $params['role_type'] = $this->user['role_type'];
            $res = $model->getList($this->limit, $this->page, $params);
            return $this->success($res);
        } catch (Exception $e) {
            var_dump($e->getMessage());
            exit;
        }
    }

    public function machineDataList()
    {
        try {
            $model = new CityMachineData();
            $params = $this->request->get();
            $params['user_id'] = $this->user['id'];
            $params['role_type'] = $this->user['role_type'];
            $res = $model->getList($params);
            return $this->success($res);
        } catch (Exception $e) {
            var_dump($e->getMessage());
            exit;
        }
    }

    public function cityStatistics()
    {
        $model = new CityMachineData();
        $params = $this->request->get();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->statistics($params['date'] ?? 7);
        return $this->success($res);
    }

    public function blackFocusUser()
    {
        $model = new CityBlackFocusUser();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->blackFocusUser($params);
        if ($res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error($res);
    }

    public function removeFocusUser()
    {
        $model = new CityFocusUser();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params);
        if (!$res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error($res);
    }

    public function removeBlackFocusUser(){
        $model = new CityBlackFocusUser();
        $params = $this->request->post();
        $params['user_id'] = $this->user['id'];
        $params['role_type'] = $this->user['role_type'];
        $res = $model->remove($params);
        if (!$res['code'] === 0) {
            return $this->success($res);
        }
        return $this->error($res);
    }
}
