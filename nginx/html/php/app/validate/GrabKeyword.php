<?php

namespace app\validate;

use think\Validate;

class GrabKeyword extends Validate
{
    protected $rule = [
        'keyword'  =>  'require|max:64',
        'desc' => 'max:255',
        'pass_rate' => 'between:0,100',
        'suc_rate' => 'between:0,100',
        'repeat_rate' => 'between:0,100',
        'status' =>  'in:0,1,2',
    ];

    protected $message  =   [
        'keyword.require' => '关键词必须',
        'pass_rate.between'   => '通过率必须是数字',
        'suc_rate.between'   => '成功率必须是数字',
        'repeat_rate.between'   => '重复率必须是数字',
        'desc.max'        => '描述最多不能超过255个字符',
        'status.in'     => '类型不正确',
    ];
}
