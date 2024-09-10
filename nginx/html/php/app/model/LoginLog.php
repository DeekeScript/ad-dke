<?php

namespace app\model;

use Exception;
use think\facade\Cache;
use think\Model;

class LoginLog extends Model
{
    private $mobileRules = [
        [5, 1], //5s 只能登陆一次  不管是否失败
        [60, 10], //一分钟最多登陆10次 
        [1800, 30], //半小时只能登陆30次
        [86400, 50], //一天之内只能登陆50次
    ];

    private $ipRules = [
        [5, 10], //5s 只能登陆10次
        [60, 100], //一分钟最多登陆100次
        [1800, 300], //半小时只能登陆300次
        [86400, 500], //一天之内只能登陆500次
    ];

    private function getIp()
    {
        if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
            $cip = $_SERVER["HTTP_CLIENT_IP"];
        } elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
            $cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
        } elseif (!empty($_SERVER["REMOTE_ADDR"])) {
            $cip = $_SERVER["REMOTE_ADDR"];
        } else {
            $cip = 0;
        }

        if ($cip) {
            $cip = ip2long($cip);
        }

        return $cip;
    }

    public function rules(array $params)
    {
        try {
            $params['ip'] = $this->getIp();
            foreach ($this->mobileRules as $rule) {
                $where[]  = ['ip', '=', $params['ip']];
                $where[] = ['created_at', '>=', time() - $rule[0]];
                if (self::where($where)->count() > $rule[1]) {
                    return ['code' => 1, 'msg' => '频率过高，请稍后重试'];
                }
            }

            foreach ($this->ipRules as $rule) {
                $where[]  = ['ip', '=', $params['ip']];
                $where[] = ['created_at', '>=', time() - $rule[0]];
                if (self::where($where)->count() > $rule[1]) {
                    return ['code' => 1, 'msg' => '频率过高，请稍后重试'];
                }
            }

            $model = new self();
            $model->setAttr('mobile', $params['mobile']);
            $model->setAttr('password', $params['password']);
            $model->setAttr('created_at', time());
            $model->setAttr('ip', $params['ip']);
            $model->save();

            return ['code' => 0, 'msg' => '通过'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => '系统繁忙' . $e->getMessage()];
        }
    }

    public function execute(array $params)
    {
        return $this->rules($params);
    }
}
