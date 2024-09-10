<?php

namespace app\validate;

use think\Validate;

class VideoDouyin extends Validate
{
    protected $rule = [
        'user_id'  =>  'require|integer',
        'agent_user_id'  =>  'require|integer',
        'video_id'  =>  'require|integer',
        'douyin'  =>  'require|max:64',
        'nickname'  =>  'require|max:64',
        'zan_count' =>  'require|integer|max:10',
        'focus_count' =>  'require|integer|max:10',
        'fans_count' =>  'require|integer|max:10',
        'type' => 'require|in:0,1,2'
    ];

    protected $message  =   [
        'user_id.require' => '用户ID必须',
        'user_id.integer'     => '用户ID有误',
        'agent_user_id.require' => '代理商ID必须',
        'agent_user_id.integer'     => '代理商ID有误',
        'video_id.require' => '视频ID必须',
        'video_id.integer'     => '视频ID有误',
        'douyin.require' => '抖音号必须',
        'douyin.max'     => '抖音号最多不能超过64个字符',
        'nickname.require' => '抖音昵称必须',
        'nickname.max'     => '抖音昵称最多不能超过64个字符',
        'zan_count.require'   => '点赞数必须',
        'zan_count.integer'  => '点赞数不正确',
        'zan_count.max'  => '点赞数太大',
        'focus_count.require'   => '关注数必须',
        'focus_count.integer'  => '关注数不正确',
        'focus_count.max'  => '关注数太大',
        'fans_count.require'   => '粉丝数必须',
        'fans_count.integer'  => '粉丝数不正确',
        'fans_count.max'  => '粉丝数太大',
        'type.require'        => '类型必须',
        'type.in'        => '类型有误',
    ];

    protected $scene = [
        'edit'  =>  ['nickname', 'douyin', 'zan_count', 'focus_count', 'fans_count'],
    ];
}
