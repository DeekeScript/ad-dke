<?php
// 应用公共文件

use think\facade\Cache;

function getIp()
{
    if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
        $cip = $_SERVER["HTTP_CLIENT_IP"];
    } elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
        $cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
    } elseif (!empty($_SERVER["REMOTE_ADDR"])) {
        $cip = $_SERVER["REMOTE_ADDR"];
    } else {
        $cip = 0;
    }

    if ($cip) {
        $cip = ip2long($cip);
    }

    return $cip;
}

//每段时间操作次数满足之后，需要等待一段时间继续操作ƒ
function cacheLimit($key, $limitCount, $ttl, $mid = 0)
{
    $redis = Cache::store('redis')->handler();

    $ip = getIp();
    if ($mid) {
        $key = $key . '_' . $mid . '_' . $ip;
    } else {
        $key = $key . '_' . $ip;
    }

    if (!Cache::store('redis')->has($key)) {
        Cache::store('redis')->set($key, 0, $ttl);
        $count = 0;
    }

    $count = Cache::store('redis')->get($key);
    if ($count === null) {
        Cache::store('redis')->set($key, 0, $ttl);
    }

    //exit(json_encode(['code' => 1, 'msg' => $count]));
    if ($count >= $limitCount) {
        return true; //达到限制条件
    }

    Cache::store('redis')->inc($key);
    if ($redis->ttl($key) === -1) {
        Cache::store('redis')->set($key, 0, $ttl);
    }

    return false;
}
