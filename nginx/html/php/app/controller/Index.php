<?php

namespace app\controller;

use app\BaseController;
use app\model\Machine;
use app\model\User;
use Exception;
use think\App;

class Index extends BaseController
{
    // public function index()
    // {
    //     return '<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px;} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:) </h1><p> ThinkPHP V' . \think\facade\App::version() . '<br/><span style="font-size:30px;">16载初心不改 - 你值得信赖的PHP框架</span></p><span style="font-size:25px;">[ V6.0 版本由 <a href="https://www.yisu.com/" target="yisu">亿速云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="https://e.topthink.com/Public/static/client.js"></script><think id="ee9b1aa918103c4fc"></think>';
    // }

    public function generateAccountMachine()
    {
        try {
            $sign = '0349ffd;lsfj;asg3043284012{}+sfjs;adl';
            $token = $this->request->get('token');
            $timestamp = $this->request->get('timestamp');
            $currentToken = md5($sign . $timestamp);
            if ($currentToken !== $token) {
                return $this->error(['msg' => '有误']);
            }

            //生成一个machine
            $machine = new Machine();
            $params = [
                'user_id' => 14, //对应我们自己的代理商账号
                'role_type' => 1,
                'name' => '在线支付-' . $this->request->get('mobile'),
                'number' => '001',
                'type' => 1,
            ];

            $res = $machine->add($params);
            if ($res['code'] === 1) {
                return $this->error($res);
            }

            $machineModel = $machine->where([['name', '=', $params['name']]])->find();
            //生成一个账号
            $user = new User();
            $res = $user->add([
                'user_id' => 14, //对应我们自己的代理商账号
                'role_type' => 1,
                'machine_id' => $machineModel->getAttr('id'),
                'type' => $this->request->get('type'),
                'name' => $this->request->get('name'),
                'mobile' => $this->request->get('mobile'),
                'password' => $this->request->get('mobile'),
                'state' => 1,
            ]);

            if ($res['code'] === 1) {
                return $this->error($res);
            }

            return $this->success([
                'data' => [
                    'mobile' => $this->request->get('mobile'),
                    'machine_id' => $machineModel->getAttr('id'),
                    'type' => $this->request->get('type'),
                ]
            ]);
        } catch (Exception $e) {
            return $this->error(['msg' => $e->getMessage()]);
        }
    }

    public function baiduwenxin()
    {
        return json_encode(['apiKey' => 'NZmgn5urWoHhKWe8XbGMdbUp', 'apiSecret' => 'brIq133KaAPNEkn109avxl7MXUHHWkg0']);
    }
}
