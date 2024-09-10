<?php

use think\facade\Cache;

class IRedis
{
    private $redis;
    private static $instance;

    public static function instance()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }

        if (!self::$instance->redis) {
            self::$instance->redis = new \Redis();
            self::$instance->redis->connect('tcp://redis', 6379);
        }

        return self::$instance;
    }

    public function lock($key, $id, $ttl = 5)
    {
        return $this->redis->set($key, $id, ['nx', 'ex' => $ttl]); //锁定几秒
    }

    public function unLock($key)
    {
        return $this->redis->del($key);
    }
}
