<?php

namespace app\validate;

use think\Validate;

class Video extends Validate
{
    protected $rule = [
        'user_id'  =>  'require|integer',
        'agent_user_id'  =>  'require|integer',
        'task_id'  =>  'require|integer',
        'douyin'  =>  'max:32',
        'nickname'  =>  'require|max:64',
        'title'  =>  'require|max:255',
        'zan_count' =>  'require|integer|max:10',
        'comment_count' =>  'require|integer|max:10',
        'collect_count' =>  'require|integer|max:10',
        'type' => 'require|in:0,1',
        'keyword'  =>  'max:255',
        'no_keyword'  =>  'max:255',
        'watch_second' =>  'require|integer|max:10',
    ];

    protected $message  =   [
        'user_id.require' => '用户ID必须',
        'user_id.integer'     => '用户ID有误',
        'agent_user_id.require' => '代理商ID必须',
        'agent_user_id.integer'     => '代理商ID有误',
        'task_id.require' => '任务ID必须',
        'task_id.integer'     => '任务ID有误',
        'douyin.max'     => '抖音号最多不能超过32个字符',
        'nickname.require' => '抖音昵称必须',
        'nickname.max'     => '抖音昵称最多不能超过64个字符',
        'title.require' => '视频标题必须',
        'title.max'     => '视频标题长度不能超出255字符',
        'zan_count.require'   => '点赞数必须',
        'zan_count.integer'  => '点赞数不正确',
        'zan_count.max'  => '点赞数太大',
        'comment_count.require'   => '评论数必须',
        'comment_count.integer'  => '评论数不正确',
        'comment_count.max'  => '评论数太大',
        'collect_count.require'   => '收藏数必须',
        'collect_count.integer'  => '收藏数不正确',
        'collect_count.max'  => '收藏数太大',
        'type.require'        => '类型必须',
        'type.in'        => '类型有误',
        'keyword.max'  => '匹配关键词长度不能超过255个字符数',
        'no_keyword.max'  => '不匹配关键词长度不能超过255个字符数',
        'watch_second.require'   => '观看时长必须',
        'watch_second.integer'  => '观看时长不正确',
        'watch_second.max'  => '观看时长数太大',
    ];
}
