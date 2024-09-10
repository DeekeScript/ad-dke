<?php

namespace app\validate;

use think\Validate;

class UserRule extends Validate
{
    protected $rule = [
        'name'  =>  'require|max:64',
        'gender'  =>  'require|array',
        'zan_range'  =>  'array',
        'age_range' =>  'array',
        'focus_range' =>  'array',
        'fans_range' =>  'array',
        'works_range' =>  'array',
        'contain' =>  'max:3000',
        'no_contain' => 'max:3000',
        'is_person' => 'require|in:0,1,2',
        'is_tuangou' => 'require|in:0,1,2',
        'open_window' => 'require|in:0,1,2',
        'province_id'  =>  'require|array',
    ];

    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'gender.require' => '性别必须',
        'gender.array'     => '性别不正确',
        'zan_range.array'     => '点赞数区间必须',
        'age_range.array'   => '年龄区间必须',
        'focus_range.array'  => '关注数区间不符合要求',
        'fans_range.array'   => '粉丝数区间不符合要求',
        'works_range.array'   => '作品数区间不符合要求',
        'contain.max'   => '包含关键词最长为3000字',
        'no_contain.max'   => '不包含关键词最长为3000字',

        'is_person.require' => '个人号必须',
        'is_person.in'     => '个人号不正确',
        'is_tuangou.require' => '团购达人必须',
        'is_tuangou.in'     => '团购达人不正确',
        'open_window.require' => '开通橱窗必须',
        'open_window.in'     => '开通橱窗不正确',
        'province_id.require' => 'IP限制必须',
        'province_id.array'     => 'IP限制不正确',
    ];
}
