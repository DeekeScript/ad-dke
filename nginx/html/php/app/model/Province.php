<?php

namespace app\model;

use Exception;
use think\Model;

class Province extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [];
        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('id asc')->select()->toArray();
        return ['total' => $total, 'data' => $data];
    }
}
