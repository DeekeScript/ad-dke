<?php

namespace app\validate;

use think\Validate;

class GrabKeywordPhone extends Validate
{
    protected $rule = [
        'keyword_id' => 'require|max:10',
        'user_id'  =>  'require|max:10',
        'agent_user_id' =>  'require|max:10',
        'account' => 'require|max:64',
        'nickname' => 'require|max:64',
        'gender' => 'require|in:3,1,2',
        'age' => 'require|max:3',
        'mobile' => 'max:11',
        'wx' => 'max:36',
        'focus_count' => 'max:10',
        'fans_count' => 'max:10',
        'zan_count' => 'max:10',
        'work_count' => 'max:10',
        'machine_id' => 'max:10',
        'status' =>  'in:0,1,2',
        'qw_status' =>  'in:0,1,2',
        'wx_status' =>  'in:0,1,2',
        'type' => 'in:0,1,2',
        'desc' => 'max:255',
    ];

    protected $message  =   [
        'keyword_id.require' => '关键词ID必须',
        'keyword.max'     => '关键词ID不正确',
        'user_id.require' => '用户ID必须',
        'user_id.max'     => '用户ID有误',
        'agent_user_id.require' => '代理商ID必须',
        'agent_user_id.max'     => '代理商ID有误',
        'account.require'   => '抖音账号必须',
        'account.max'   => '抖音账号长度有误',
        'nickname.require'   => '抖音昵称必须',
        'nickname.max'   => '抖音昵称长度有误',
        'gender.require'   => '性别必须',
        'gender.in'   => '性别有误',
        'age.require' => '年龄必须',
        'age.max' => '年龄有误',
        'mobile.max' => '手机号有误',
        'wx.max' => '微信有误',
        'wx.focus_count' => '关注苏有误',
        'wx.fans_count' => '粉丝数有误',
        'wx.zan_count' => '点赞数有误',
        'wx.work_count' => '作品数有误',
        'status.in'     => '状态有误',
        'qw_status.in'     => '企业微信有误',
        'wx_status.in'     => '微信有误',
        'type.in'   => '类型有误',
        'desc.max'        => '描述最多不能超过255个字符',
    ];
}
