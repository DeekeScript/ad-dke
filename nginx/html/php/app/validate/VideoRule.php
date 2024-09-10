<?php

namespace app\validate;

use think\Validate;

class VideoRule extends Validate
{
    protected $rule = [
        'name'  =>  'require|max:64',
        'zan_range'  =>  'array',
        'comment_range' =>  'array',
        'collect_range' =>  'array',
        'share_range' =>  'array',
        'contain' =>  'max:3000',
        'no_contain' => 'max:3000',
        'is_city'  =>  'require|in:0,1',
        'distance'  =>  'integer|between:0,6',
        'in_time'  =>  'integer|between:0,6',
    ];

    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'zan_range.require' => '点赞数范围必须',
        'zan_range.array'     => '点赞数范围有误',
        'comment_range.require'   => '评论数范围必须',
        'comment_range.array'  => '评论数范围有误',
        'collect_range.require'   => '收藏数区间必须',
        'collect_range.array'  => '收藏数区间有误',
        'share_range.require'   => '分享数必须',
        'share_range.array'  => '分享数有误',
        'contain.max'   => '包含关键词最长为3000字',
        'no_contain.max'   => '不包含关键词最长为3000字',
        'is_city.require' => '视频类型必须',
        'is_city.in'     => '视频类型有误',
        'distance.integer'     => '视频距离有误',
        'in_time.integer'     => '视频时间有误',
        'distance.between'     => '视频距离有误',
        'in_time.between'     => '视频时间有误',
    ];
}
