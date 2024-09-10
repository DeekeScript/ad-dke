<?php

namespace app\common;

use app\model\Agent;

class Role
{
    public const ACTIONS = [
        //公共的，都需要
        ['controller' => 'Api', 'action' => 'getProvince', 'roles' => [0, 1, 2]], //获取省份
        ['controller' => 'Api', 'action' => 'getSpeechLib', 'roles' => [0, 1, 2]], //获取用户话术库
        ['controller' => 'Api', 'action' => 'getMachine', 'roles' => [0, 1]], //获取机器列表
        ['controller' => 'Api', 'action' => 'editPassword', 'roles' => [0, 1, 2]], //修改密码
        ['controller' => 'Api', 'action' => 'logList', 'roles' => [0]], //管理员查看手机日志
        ['controller' => 'Api', 'action' => 'removeLog', 'roles' => [0]], //管理员删除手机日志
        ['controller' => 'Api', 'action' => 'apkList', 'roles' => [0]], //apk列表
        ['controller' => 'Api', 'action' => 'addApk', 'roles' => [0]], //apk上传
        ['controller' => 'Api', 'action' => 'apkUpload', 'roles' => [0]], //apk上传
        ['controller' => 'Api', 'action' => 'getCosSign', 'roles' => [0]],

        //独自的
        ['controller' => 'Api', 'action' => 'welcome', 'roles' => [0, 1, 2]], //欢迎页
        ['controller' => 'Api', 'action' => 'currentUser', 'roles' => [0, 1, 2]], //当前用户
        ['controller' => 'Api', 'action' => 'userList', 'roles' => [0, 1]], //用户列表
        ['controller' => 'Api', 'action' => 'machineList', 'roles' => [0, 1, 2]], //机器列表

        ['controller' => 'Api', 'action' => 'statistic', 'roles' => [0, 1, 2]], //统计列表
        ['controller' => 'Api', 'action' => 'statisticList', 'roles' => [0, 1, 2]], //统计列表
        ['controller' => 'Api', 'action' => 'updateUser', 'roles' => [0, 1]], //用户更新
        ['controller' => 'Api', 'action' => 'addUser', 'roles' => [0, 1]], //添加用户
        ['controller' => 'Api', 'action' => 'removeUser', 'roles' => [0, 1]], //删除用户

        ['controller' => 'Api', 'action' => 'agentList', 'roles' => [0]], //代理商列表
        ['controller' => 'Api', 'action' => 'updateAgent', 'roles' => [0]], //更新代理商
        ['controller' => 'Api', 'action' => 'addAgent', 'roles' => [0]], //添加代理商
        ['controller' => 'Api', 'action' => 'removeAgent', 'roles' => [0]], //移除代理商

        ['controller' => 'Api', 'action' => 'updateMachine', 'roles' => [0, 1]], //更新机器
        ['controller' => 'Api', 'action' => 'addMachine', 'roles' => [1]], //添加机器
        ['controller' => 'Api', 'action' => 'removeMachine', 'roles' => [0]], //删除机器

        ['controller' => 'Api', 'action' => 'taskList', 'roles' => [0, 1, 2]], //任务列表
        ['controller' => 'Api', 'action' => 'addTask', 'roles' => [1, 2]], //添加任务
        ['controller' => 'Api', 'action' => 'updateTask', 'roles' => [0, 1, 2]], //更新任务
        ['controller' => 'Api', 'action' => 'removeTask', 'roles' => [0, 1, 2]], //删除任务

        ['controller' => 'Api', 'action' => 'getVideoRules', 'roles' => [0, 1, 2]], //视频规则
        ['controller' => 'Api', 'action' => 'getUserRules', 'roles' => [0, 1, 2]], //用户规则
        ['controller' => 'Api', 'action' => 'getCommentRules', 'roles' => [0, 1, 2]], //评论规则

        ['controller' => 'Api', 'action' => 'videoRuleList', 'roles' => [0, 1, 2]], //视频规则
        ['controller' => 'Api', 'action' => 'userRuleList', 'roles' => [0, 1, 2]], //用户规则
        ['controller' => 'Api', 'action' => 'commentRuleList', 'roles' => [0, 1, 2]], //评论规则
        ['controller' => 'Api', 'action' => 'addVideoRule', 'roles' => [1, 2]], //添加视频规则
        ['controller' => 'Api', 'action' => 'updateVideoRule', 'roles' => [0, 1, 2]], //修改视频规则
        ['controller' => 'Api', 'action' => 'addUserRule', 'roles' => [1, 2]], //添加用户规则
        ['controller' => 'Api', 'action' => 'updateUserRule', 'roles' => [0, 1, 2]], //修改用户规则
        ['controller' => 'Api', 'action' => 'updateCommentRule', 'roles' => [0, 1, 2]], //修改评论规则
        ['controller' => 'Api', 'action' => 'addCommentRule', 'roles' => [1, 2]], //添加评论规则
        ['controller' => 'Api', 'action' => 'removeVideoRule', 'roles' => [0, 1, 2]], //删除视频规则
        ['controller' => 'Api', 'action' => 'removeUserRule', 'roles' => [0, 1, 2]], //删除用户规则
        ['controller' => 'Api', 'action' => 'removeCommentRule', 'roles' => [0, 1, 2]], //删除评论规则


        ['controller' => 'Api', 'action' => 'videoList', 'roles' => [0, 1, 2]], //视频列表
        ['controller' => 'Api', 'action' => 'videoDetailList', 'roles' => [0, 1, 2]], //视频明细
        ['controller' => 'Api', 'action' => 'videoCommentList', 'roles' => [0, 1, 2]], //视频评论区明细
        ['controller' => 'Api', 'action' => 'videoDouyinList', 'roles' => [0, 1, 2]], //用户明细
        ['controller' => 'Api', 'action' => 'removeVideo', 'roles' => [0, 1, 2]], //删除视频
        ['controller' => 'Api', 'action' => 'removeVideoDetail', 'roles' => [0, 1, 2]], //删除短视频明细
        ['controller' => 'Api', 'action' => 'removeVideoComment', 'roles' => [0, 1, 2]], //删除评论区明细
        ['controller' => 'Api', 'action' => 'removeVideoDouyin', 'roles' => [0, 1, 2]], //删除用户明细

        ['controller' => 'Api', 'action' => 'speechList', 'roles' => [0, 1, 2]], //话术列表
        ['controller' => 'Api', 'action' => 'autoSpeechList', 'roles' => [0, 1, 2]], //混淆话术列表
        ['controller' => 'Api', 'action' => 'updateSpeech', 'roles' => [0, 1, 2]], //更新话术列表
        ['controller' => 'Api', 'action' => 'addSpeech', 'roles' => [1, 2]], //添加话术
        ['controller' => 'Api', 'action' => 'removeSpeech', 'roles' => [0, 1, 2]], //删除话术列表

        ['controller' => 'Api', 'action' => 'speechLibList', 'roles' => [0, 1, 2]], //话术列表
        ['controller' => 'Api', 'action' => 'updateSpeechLib', 'roles' => [0, 1, 2]], //更新话术列表
        ['controller' => 'Api', 'action' => 'addSpeechLib', 'roles' => [1, 2]], //添加话术
        ['controller' => 'Api', 'action' => 'removeSpeechLib', 'roles' => [0, 1, 2]], //删除话术列表

        ['controller' => 'Api', 'action' => 'grabTaskList', 'roles' => [0, 1]], //采集关键词列表
        ['controller' => 'Api', 'action' => 'addGrabTask', 'roles' => [1]], //添加采集关键词
        ['controller' => 'Api', 'action' => 'updateGrabTask', 'roles' => [0, 1]], //更新采集关键词
        ['controller' => 'Api', 'action' => 'removeGrabTask', 'roles' => [1]], //删除采集关键词
        ['controller' => 'Api', 'action' => 'grabTaskPhoneList', 'roles' => [0, 1]], //电话列表
        ['controller' => 'Api', 'action' => 'removeGrabTaskPhone', 'roles' => [0, 1]], //电话列表
        ['controller' => 'Api', 'action' => 'updatePhone', 'roles' => [1]],
        ['controller' => 'Api', 'action' => 'exportVcf', 'roles' => [1]],

        ['controller' => 'Api', 'action' => 'focusUserList', 'roles' => [0, 1]], //同城列表
        ['controller' => 'Api', 'action' => 'focusUserChatList', 'roles' => [0, 1]],
        ['controller' => 'Api', 'action' => 'blackFocusUserList', 'roles' => [0, 1]], //黑名单列表
        ['controller' => 'Api', 'action' => 'machineDataList', 'roles' => [0, 1]], //机器列表
        ['controller' => 'Api', 'action' => 'cityStatistics', 'roles' => [0, 1]], //同城操作记录
        ['controller' => 'Api', 'action' => 'blackFocusUser', 'roles' => [0, 1]],
        ['controller' => 'Api', 'action' => 'removeFocusUser', 'roles' => [0, 1]],
        ['controller' => 'Api', 'action' => 'removeBlackFocusUser', 'roles' => [0, 1]],

        ['controller' => 'Api', 'action' => 'getGrabTaskSetting', 'roles' => [1]], //设置
        ['controller' => 'Api', 'action' => 'grabTaskSetting', 'roles' => [1]], //设置

        ['controller' => 'Api', 'action' => 'removeStatistic', 'roles' => [0, 1, 2]], //删除统计
    ];

    public function getAccess(int $roleType = 0, int $userId)
    {
        $actions = [];
        $openWx = 1;
        if ($roleType === 1) {
            $openWx = (new Agent())->getOpenWx($userId);
        }

        foreach (self::ACTIONS as $v) {
            if (env('close') && in_array($v['action'], ['taskList', 'videoList', 'speechLibList', 'statisticList'])) {
                continue;
            }

            if (!$openWx && $roleType === 1 && $v['action'] === 'grabTaskList') {
                continue;
            }

            if (in_array($roleType, $v['roles'])) {
                $actions[] = $v['controller'] . '_' . $v['action'];
            }
        }
        return $actions;
    }

    public function isAccess(int $roleType = 0, string $controller, string $action)
    {
        foreach (self::ACTIONS as $v) {
            if (env('close') && in_array($v['action'], ['taskList', 'videoList', 'speechLibList', 'statistic'])) {
                continue;
            }

            if (in_array($roleType, $v['roles'])) {
                if ($v['controller'] . ':' . $v['action'] === $controller . ':' . $action) {
                    return true;
                }
            }
        }
        return false;
    }
}
