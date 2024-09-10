<?php

namespace app\model;

use app\validate\Task as ValidateTask;
use Exception;
use think\exception\ValidateException;
use think\Model;

class Task extends Model
{
    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0]];
        if (isset($params['name']) && $params['name']) {
            $where[] = ['name', 'like', $params['name'] . '%'];
        }

        if (isset($params['state'])) {
            $where[] = ['state', '=', (int)$params['state']];
        }

        if (isset($params['desc']) && $params['desc']) {
            $where[] = ['desc', 'like', $params['desc'] . '%'];
        }

        if (User::ROLE_TYPE[0] === $params['role_type'] && isset($params['agent_user_id'])) {
            $where[] = ['agent_user_id', '=', $params['agent_user_id']];
        }

        if (User::ROLE_TYPE[2] !== $params['role_type'] && isset($params['p_user_id'])) {
            $where[] = ['user_id', '=', $params['p_user_id']];
        }

        if (User::ROLE_TYPE[1] === $params['role_type']) {
            $where[] = ['agent_user_id', '=', $params['user_id']];
            $where[] = ['user_id', '=', 0];
        } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
            $where[] = ['user_id', '=', $params['user_id']];
        }

        $total = self::where($where)->count();
        if ($total === 0) {
            return ['total' => 0, 'data' => []];
        }
        $data = self::where($where)->page($page, $limit)->order('agent_user_id desc, id desc')->select()->toArray();
        if ($data) {
            $videoRules = [];
            $userRules = [];
            $commentRules = [];
            $commentUserRules = [];
            $speechLibIds = [];

            foreach ($data as $v) {
                $videoRules = array_merge($videoRules, json_decode($v['video_rule'], true));
                $userRules = array_merge($userRules, json_decode($v['user_rule'], true));
                $commentRules = array_merge($commentRules, json_decode($v['comment_rule'], true));
                $commentUserRules = array_merge($commentUserRules, json_decode($v['comment_user_rule'], true));
                $speechLibIds = array_merge($speechLibIds, json_decode($v['lib_id'], true) ?? []);
            }

            $vRules = VideoRule::where([['id', 'in', $videoRules]])->field(['id', 'name'])->select()->toArray();
            if ($vRules) {
                $vRules = array_column($vRules, 'name', 'id');
            }
            $uRules = UserRule::where([['id', 'in', $userRules]])->field(['id', 'name'])->select()->toArray();
            if ($uRules) {
                $uRules = array_column($uRules, 'name', 'id');
            }
            $cRules = CommentRule::where([['id', 'in', $commentRules]])->field(['id', 'name'])->select()->toArray();
            if ($cRules) {
                $cRules = array_column($cRules, 'name', 'id');
            }
            $cURules = UserRule::where([['id', 'in', $commentUserRules]])->field(['id', 'name'])->select()->toArray();
            if ($cURules) {
                $cURules = array_column($cURules, 'name', 'id');
            }

            $speechLibs = SpeechLib::where([['id', 'in', $speechLibIds]])->field(['id', 'name', 'type'])->select()->toArray();
            if ($speechLibs) {
                $speechLibs = array_column($speechLibs, null, 'id');
            }

            $userIds = array_merge(array_column($data, 'user_id'), array_column($data, 'agent_user_id'));
            $users = User::where([['id', 'in', $userIds]])->field(['id', 'name'])->select()->toArray();
            if ($users) {
                $users = array_column($users, 'name', 'id');
            }

            $data = array_map(static function ($item) use ($vRules, $uRules, $cRules, $cURules, $users, $speechLibs) {
                $item['video_rules_names'] = [];
                $videoRules = json_decode($item['video_rule']);
                foreach ($videoRules as $v) {
                    $item['video_rules_names'][] = $vRules[$v];
                }

                $item['user_rules_names'] = [];
                $userRules = json_decode($item['user_rule']);
                foreach ($userRules as $v) {
                    $item['user_rules_names'][] = $uRules[$v];
                }

                $item['comment_user_rules_names'] = [];
                $commentUserRoles = json_decode($item['comment_user_rule']);
                foreach ($commentUserRoles as $v) {
                    $item['comment_user_rules_names'][] = $cURules[$v];
                }

                $item['comment_rules_names'] = [];
                $commentRules = json_decode($item['comment_rule']);
                foreach ($commentRules as $v) {
                    $item['comment_rules_names'][] = $cRules[$v];
                }

                $item['speech_names'] = [];
                $speechLibIds = json_decode($item['lib_id']) ?? [];
                foreach ($speechLibIds as $v) {
                    $item['speech_names'][] = $speechLibs[$v];
                }

                $item['userName'] = $users[$item['user_id']] ?? $users[$item['agent_user_id']] ?? '-';
                return $item;
            }, $data);
        }
        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        try {
            validate(ValidateTask::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        try {
            $model = new self();
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $model->setAttr('agent_user_id', $params['user_id']);
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $model->setAttr('user_id', $params['user_id']);
                $model->setAttr('agent_user_id', (new User())->getIdByUserId($params['user_id']));
            }

            if (!is_array($params['video_rule']) || !is_array($params['user_rule']) || !is_array($params['comment_user_rule']) || !is_array($params['comment_rule'])) {
                return ['code' => 1, 'msg' => '参数有误'];
            }

            $arr = ['video_rule', 'user_rule', 'comment_user_rule', 'comment_rule'];
            foreach ($arr as $v) {
                foreach ($params[$v] as $value) {
                    if (!is_numeric($value) || (int)$value !== $value * 1) {
                        return ['code' => 1, 'msg' => '参数有误'];
                    }
                }
            }

            $model->setAttr('name', $params['name']);
            $model->setAttr('type', $params['type']);
            $model->setAttr('hour', json_encode($params['hour']));
            $model->setAttr('lib_id', json_encode($params['lib_id']));
            $model->setAttr('video_rule', json_encode($params['video_rule']));
            $model->setAttr('user_rule', json_encode($params['user_rule']));
            $model->setAttr('comment_user_rule', json_encode($params['comment_user_rule']));
            $model->setAttr('comment_rule', json_encode($params['comment_rule']));
            $model->setAttr('end_type', $params['end_type']);
            $model->setAttr('comment_zan_fre', $params['comment_zan_fre']);
            $model->setAttr('video_zan_fre', $params['video_zan_fre']);
            $model->setAttr('comment_fre', $params['comment_fre']);
            $model->setAttr('private_fre', $params['private_fre']);
            $model->setAttr('focus_fre', $params['focus_fre']);
            $model->setAttr('refresh_video_fre', $params['refresh_video_fre']);
            $model->setAttr('limit_count', $params['limit_count'] ?? 0);
            $model->setAttr('end_time', isset($params['end_time']) ? strtotime($params['end_time']) : 0);
            $model->setAttr('desc', $params['desc'] ?? '');
            $model->setAttr('state', $params['state']);
            $model->setAttr('is_city', $params['is_city']);
            $model->setAttr('created_at', time());
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function edit(array $params)
    {
        if (!isset($params['id']) || empty($params['id'])) {
            return ['code' => 1, 'msg' => '操作有误'];
        }

        try {
            validate(ValidateTask::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getError()];
        }

        try {
            $where = [['id', '=', $params['id']], ['deleted', '=', 0]];
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
                $where[] = ['user_id', '=', 0];
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $where[] = ['user_id', '=', $params['user_id']];
            }
            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '记录不存在'];
            }
            $model->setAttr('name', $params['name']);
            $model->setAttr('type', $params['type']);
            $model->setAttr('hour', json_encode($params['hour']));
            $model->setAttr('lib_id', json_encode($params['lib_id']));
            $model->setAttr('video_rule', json_encode($params['video_rule']));
            $model->setAttr('user_rule', json_encode($params['user_rule']));
            $model->setAttr('comment_user_rule', json_encode($params['comment_user_rule']));
            $model->setAttr('comment_rule', json_encode($params['comment_rule']));
            $model->setAttr('end_type', $params['end_type']);
            $model->setAttr('comment_zan_fre', $params['comment_zan_fre']);
            $model->setAttr('video_zan_fre', $params['video_zan_fre']);
            $model->setAttr('comment_fre', $params['comment_fre']);
            $model->setAttr('private_fre', $params['private_fre']);
            $model->setAttr('focus_fre', $params['focus_fre']);
            $model->setAttr('refresh_video_fre', $params['refresh_video_fre']);
            $model->setAttr('limit_count', $params['limit_count'] ?? 0);
            $model->setAttr('end_time', isset($params['end_time']) ? strtotime($params['end_time']) : 0);
            $model->setAttr('desc', $params['desc'] ?? '');
            $model->setAttr('state', $params['state']);
            $model->setAttr('is_city', $params['is_city']);
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }

    public function remove(array $params, int $id)
    {
        try {
            $where = [['id', '=', $id], ['deleted', '=', 0]];
            if (User::ROLE_TYPE[1] === $params['role_type']) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
                $where[] = ['user_id', '=', 0];
            } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                $where[] = ['user_id', '=', $params['user_id']];
            }

            $model = self::where($where)->find();
            if (!$model) {
                return ['code' => 1, 'msg' => '不存在'];
            }
            $model->deleted = 1;
            $model->save();
            return ['code' => 0, 'msg' => '成功'];
        } catch (Exception $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }
    }
}
