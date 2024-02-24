<?php

namespace app\validate;

use think\Validate;

class Task extends Validate
{
    protected $rule = [
        'name'  =>  'require|max:64',
        'type'  =>  'require|in:1,2',
        'hour'  =>  'require|array',
        'video_rule' =>  'require|array',
        'user_rule' =>  'require|array',
        'comment_user_rule' => 'require|array',
        'comment_rule' =>  'require|array',
        'end_type' => 'require|in:0,1,2,3',
        'comment_zan_fre' => 'require|in:0,1,2,3,4,5,6,7',
        'video_zan_fre' =>  'require|in:0,1,2,3,4,5,6,7',
        'comment_fre' =>  'require|in:0,1,2,3,4,5',
        'private_fre' =>  'require|in:0,1,2,3,4,5',
        'focus_fre' =>  'require|in:0,1,2,3,4,5',
        'refresh_video_fre' => 'require|in:0,1,2,3,4,5,6',
        'limit_count' =>  'min:0|max:11',
        //'end_time' => 'require',
        'state' => 'require|in:0,1',
        'desc' =>  'max:255',
        'lib_id' =>  'require|array',
        'is_city' => 'require|in:0,1',
    ];

    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'type.require' => '类型必须',
        'type.in'     => '类型不正确',
        'video_rule.require' => '视频规则必须',
        'video_rule.array'     => '视频规则有误',
        'user_rule.require'   => '达人规则必须',
        'user_rule.array'  => '达人规则有误',
        'comment_user_rule.require'   => '用户规则必须',
        'comment_user_rule.array'  => '用户规则有误',
        'comment_rule.require'   => '评论规则必须',
        'comment_rule.array'  => '评论规则有误',
        'end_type.require'   => '任务结束类型必须',
        'end_type.in'  => '任务结束类型有误',
        'comment_zan_fre.require'   => '点赞视频评论频率必须',
        'comment_zan_fre.in'  => '点赞视频评论频率有误',
        'video_zan_fre.require'   => '点赞视频频率必须',
        'video_zan_fre.in'  => '点赞视频频率有误',
        'comment_fre.require'   => '评论频率必须',
        'comment_fre.in'  => '评论频率有误',
        'private_fre.require'   => '私信用户频率必须',
        'private_fre.in'  => '私信用户频率有误',
        'focus_fre.require'   => '关注用户频率必须',
        'focus_fre.in'  => '关注用户频率有误',
        'refresh_video_fre.require'   => '刷视频频率必须',
        'refresh_video_fre.in'  => '刷视频频率有误',
        'limit_count.min'  => '限制数量有误',
        'limit_count.max'  => '限制数量有误',
        //'end_time.require'   => '结束时间必须',
        'state.require'   => '任务可用状态必须',
        'state.in'   => '任务可用状态有误',
        'desc.max' => '描述最多255个字符',
        'lib_id.require' => '话术库必须',
        'lib_id.array'     => '话术库有误',
        'is_city.require'   => '是否同城不能为空',
        'is_city.in'  => '是否同城有误',
    ];
}
