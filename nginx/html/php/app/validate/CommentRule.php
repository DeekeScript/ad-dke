<?php

namespace app\validate;

use think\Validate;

class CommentRule extends Validate
{
    protected $rule = [
        'name'  =>  'require|max:64',
        'zan_range'  =>  'array',
        'comment_range' =>  'array',
        'nickname_type' =>  'require|array',
        'in_time' => 'require|between:1,9',
        'province_id' => 'require|array',
        'contain' =>  'max:3000',
        'no_contain' => 'max:3000',
    ];

    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'zan_range.array'     => '点赞数区间有误',
        'comment_range.array'  => '评论长度区间有误',
        'nickname_type.require'   => '昵称类型必须',
        'nickname_type.array'   => '昵称类型有误',
        'in_time.require'   => '时间限制必须',
        'in_time.between'  => '时间限制有误',
        'province_id.require'   => 'IP限制必须',
        'province_id.array'  => 'IP限制有误',
        'contain.max'   => '包含关键词最长为3000字',
        'no_contain.max'   => '不包含关键词最长为3000字',
    ];
}
