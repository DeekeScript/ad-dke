<?php

namespace app\validate;

use think\Validate;

class SpeechLib extends Validate
{
    protected $rule = [
        'desc'  =>  'max:64',
        'name'  =>  'require|max:255',
        'type' =>  'require|in:0,1',
    ];

    protected $message  =   [
        'desc.max'     => '描述最多不能超过64个字符',
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过64个字符',
        'type.require'  => '类型必须',
        'type.in'        => '类型不正确',
    ];
}
