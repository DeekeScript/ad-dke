<?php

namespace app\validate;

use think\Validate;

class Machine extends Validate
{
    protected $rule = [
        'name'  =>  'require|max:64',
        'secret'  =>  'require|max:255',
        'agent_user_id' =>  'require|max:10',
        'desc' => 'max:255',
        'type' =>  'require|in:0,1,2',
    ];

    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'secret.require' => '密钥必须',
        'secret.max'     => '密钥最多不能超过255个字符',
        'agent_user_id.require' => '代理商ID必须',
        'agent_user_id.max'     => '代理商ID最多不能超过10个字符',
        'weixin.require'   => '微信号必须',
        'desc.max'        => '描述最多不能超过255个字符',
        'type.require' => '类型必须',
        'type.in'     => '类型不正确',
    ];

    protected $scene = [
        'edit'  =>  ['name', 'number', 'desc', 'type'],
    ];
}
