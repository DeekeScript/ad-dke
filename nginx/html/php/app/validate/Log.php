<?php

namespace app\validate;

use think\Validate;

class Log extends Validate
{
    protected $rule = [
        'desc'  =>  'require|max:64',
        'type' =>  'require|in:1,0',
    ];

    protected $message  =   [
        'desc.require' => '日志内容必须',
        'desc.max'     => '日志长度不超过255个字符',
        'type.require'  => '日志类型必须',
        'type.in' => '日志类型有误',
    ];
}
