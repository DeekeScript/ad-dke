<?php

namespace app\validate;

use think\Validate;

class Speech extends Validate
{
    protected $rule = [
        'desc'  =>  'require|max:2048', //包含多条，所以这里设置最大为2048
        'level'  =>  'require|integer|length:1',
        'lib_id'  =>  'require|integer|max:11',
    ];

    protected $message  =   [
        'desc.require' => '话术必须',
        'desc.max'     => '话术最多不能超过2048个字符',
        'level.require' => '级别必须',
        'level.length'     => '级别不正确',
        'level.integer'   => '级别不正确',
        'lib_id.require' => '话术库ID必须',
        'lib_id.max'     => '话术库ID有误',
        'lib_id.integer'   => '话术库ID有误',
    ];
}
