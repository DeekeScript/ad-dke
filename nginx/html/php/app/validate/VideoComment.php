<?php

namespace app\validate;

use think\Validate;

class VideoComment extends Validate
{
    protected $rule = [
        'user_id'  =>  'require|integer',
        'agent_user_id'  =>  'require|integer',
        'video_id'  =>  'require|integer',
        'douyin'  =>  'max:32',
        'nickname'  =>  'require|max:64',
        'keyword'  =>  'max:255',
        'no_keyword'  =>  'max:255',
        'province_id' => 'require|between:0,34',
        'desc'  =>  'max:255',
    ];

    protected $message  =   [
        'user_id.require' => '用户ID必须',
        'user_id.integer'     => '用户ID有误',
        'agent_user_id.require' => '代理商ID必须',
        'agent_user_id.integer'     => '代理商ID有误',
        'video_id.require' => '视频ID必须',
        'video_id.integer'     => '视频ID有误',
        'douyin.max'     => '抖音号最多不能超过32个字符',
        'nickname.require' => '抖音昵称必须',
        'nickname.max'     => '抖音昵称最多不能超过64个字符',
        'keyword.max'  => '匹配关键词长度不能超过255个字符数',
        'no_keyword.max'  => '不匹配关键词长度不能超过255个字符数',
        'province_id.require'     => 'IP必须',
        'province_id.in'        => 'IP有误',
        'desc.max'     => '评论内容不能超过255个字符',
    ];
}
