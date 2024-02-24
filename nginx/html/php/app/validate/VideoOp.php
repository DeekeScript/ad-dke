<?php

namespace app\validate;

use think\Validate;

class VideoOp extends Validate
{
    protected $rule = [
        'user_id'  =>  'require|integer',
        'agent_user_id'  =>  'require|integer',
        'video_id'  =>  'require|integer',
        'video_comment_id' => 'integer',
        'type' => 'require|in:0,1',
        'is_zan' => 'require|in:0,1',
        'zan_time' => 'integer',
        'is_private_msg' => 'in:0,1',
        'private_msg' => 'max:255',
        'is_comment' => 'require|in:0,1',
        'comment_msg' => 'max:255',
        'msg_time' => 'integer',
        'is_focus' => 'require|in:0,1',
    ];

    protected $message  =   [
        'user_id.require' => '用户ID必须',
        'user_id.integer'     => '用户ID有误',
        'agent_user_id.require' => '代理商ID必须',
        'agent_user_id.integer'     => '代理商ID有误',
        'video_id.require' => '视频ID必须',
        'video_id.integer'     => '视频ID有误',
        'video_comment_id.integer'     => '视频评论ID有误',
        'type.require'        => '类型必须',
        'type.in'        => '类型有误',
        'is_zan.require'   => '是否点赞必须',
        'is_zan.in'  => '是否点赞不正确',
        'zan_time.integer'     => '点赞时间有误',
        'is_private_msg.in'  => '是否私信不正确',
        'private_msg.max'   => '私信内容最多255个字符',
        'is_comment.require'   => '是否评论必须',
        'is_comment.in'  => '是否评论不正确',
        'comment_msg.max'   => '评论内容最多255个字符',
        'msg_time.integer'     => '私信时间有误',
        'is_focus.require'   => '是否关注必须',
        'is_focus.in'  => '是否关注不正确',
    ];
}
