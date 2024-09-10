<?php

namespace app\validate;

use think\Validate;

class Agent extends Validate
{
    protected $rule = [
        'name'  =>  'require|max:64',
        'mobile'  =>  'require|length:11',
        'weixin' =>  'require|max:64',
        'douyin' =>  'max:64',
        'open_wx' =>  'in:0,1',
        'pay_money' => 'require|min:0|max:11',
        'add_machine_count' => 'require|min:0|max:11',
        'desc' => 'max:255',
    ];

    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'mobile.require' => '手机号必须',
        'mobile.length'     => '手机号不正确',
        'weixin.require'   => '微信号必须',
        'weixin.max'  => '名称最多不能超过64个字符',
        'douyin.max'        => '抖音号最多不能超过64个字符',
        'pay_money.require' => '消费金额必须',
        'pay_money.min' => '消费金额有误',
        'pay_money.max' => '消费金额有误',
        'add_machine_count.require' => '新增机器数量必须',
        'add_machine_count.min' => '新增机器数量有误',
        'add_machine_count.max' => '新增机器数量有误',
        'desc.max'        => '描述最多不能超过255个字符',
        //'open_wx.require' => '微信群控必须',
        'open_wx.in' => '微信群控有误',
    ];
}
