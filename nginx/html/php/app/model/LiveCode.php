<?php

namespace app\model;
use Exception;
use think\Model;

class LiveCode extends Model
{
    public function add()
    {
        try {
            $model = new self();
            $model->setAttr('created_at', time());
            $model->save();
            return ['code' => 0, 'msg' => '成功', 'data' => $model->getAttr('id')];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
