<?php

namespace app\validate;

use think\Validate;

class User extends Validate
{
    protected $rule = [
        'name'  =>  'require|max:64',
        'mobile'  =>  'require|length:11',
        'password' =>  'require|max:64',
        'state' =>  'require|in:1,0',
        'type' =>  'require|in:3,2,1,0',
    ];

    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'mobile.require' => '手机号必须',
        'mobile.length'  => '手机号不正确',
        'password.require' => '密码必须',
        'password.max'  => '密码最长64位',
        'state.require'  => '状态必须',
        'state.in' => '状态有误',
        'type.require'  => '时长必须',
        'type.in' => '时长有误',
    ];

    protected $scene = [
        'edit'  =>  ['name', 'mobile', 'state', 'type'],
    ];
}
