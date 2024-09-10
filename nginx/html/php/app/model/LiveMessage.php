<?php

namespace app\model;

use Exception;
use think\Model;

class LiveMessage extends Model
{
    public function add(array $params)
    {
        try {
            foreach ($params as $item) {
                if (!isset($item['code'], $item['nickname'], $item['text'])) {
                    continue;
                }
                //5分钟内重复的不写入
                if (self::where([['code', '=', $item['code']], ['text', '=', $item['text']]])->count()) {
                    continue;
                }

                $model = new self();
                $model->setAttr('code', $item['code']);
                $model->setAttr('nickname', $item['nickname']);
                $model->setAttr('text', $item['text']);
                $model->setAttr('created_at', time());
                $model->save();
            }

            return ['code' => 0, 'msg' => '成功', 'data' => $model->getAttr('id')];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function getList(array $params)
    {
        if (!isset($params['id'])) {
            $model = self::order('id desc')->where([['code', '=', (int)($params['code'] ?? 0)]])->find();
            $params['id'] = $model ? $model->getAttr('id') : 0;
        }

        $data = self::where([['id', '>', (int)($params['id'] ?? 0)], ['code', '=', (int)($params['code'] ?? 0)]])->select();
        return ['code' => 0, 'data' => $data->toArray(), 'id' => $params['id']];
    }
}
