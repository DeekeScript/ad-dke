<?php

namespace app\model;

use app\validate\Speech as ValidateSpeech;
use Exception;
use think\exception\ValidateException;
use think\Model;

class Speech extends Model
{
    const EMOJI = [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
        '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
        '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸',
        '😎', '🤓', '🧐', '😕', '😟', '🙁',  '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖',
        '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖',
        '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞',
        '💕', '💟', '❣', '💔', '❤', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳',
        '💣', '💬', '👁‍🗨', '🗨', '🗯', '💭', '💤',
    ];

    const PERSON = [
        '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝', '👍', '👎',
        '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
        '*', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓',
        '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵', '💂', '🥷', '👷', '🤴', '👸', '👳',
        '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇',
        '🚶', '🧍', '🧎', '🏃', '💃', '🕺', '🕴', '👯', '🧖', '🧗', '🤺', '🏇', '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋',
        '🚴', '🚵', '🤸', '🤼', '🤽', '🤾', '🤹', '🧘', '🛀', '🛌', '👭', '👫', '👬', '💏', '💑', '👪', '🗣', '👤', '👥', '🫂',
        '👣',
    ];

    const ANIMAL = [
        '🐵', '🐒', '🦍', '🦧', '*', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅',
        '🐆', '*', '*', '🦄', '🦓', '🦌', '🦬', '*', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙',
        '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿', '🦫', '🦔', '🦇', '*', '*‍❄', '🐨', '🐼', '🦥', '🦦',
        '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '*', '🕊', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚',
        '🦜', '🐸', '🐊', '*', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '*', '🐡', '🦈', '🐙', '🐚', '🐌',
        '🦋', '*', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷', '🕸', '🦂', '🦟', '🪰', '🪱', '🦠', '💐', '🌸', '💮', '🏵', '🌹', '🥀',
        '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘', '🍀', '🍁', '🍂', '🍃'
    ];

    const FOOD = [
        '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '*', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔',
        '🥕', '🌽', '🌶', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖',
        '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈',
        '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐',
        '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶',
        '🍾', '🍷', '🍸', '🍹', '*', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽', '🍴', '🥄', '🔪', '🏺'
    ];

    const ADDRESS = [
        '🌍', '🌎', '🌏', '🌐', '🗺', '🗾', '🧭', '🏔', '⛰', '🌋', '🗻', '🏕', '🏖', '🏜', '🏝', '🏞', '🏟', '🏛', '🏗', '🧱', '🪨',
        '🪵', '🛖', '🏘', '🏚', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '*',
        '🗽', '⛪', '🕌', '🛕', '🕍', '⛩', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙', '🌄', '🌅', '🌆', '🌇', '🌉', '♨', '🎠', '🎡', '🎢',
        '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓',
        '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎', '🏍', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏',
        '🛣', '🛤', '🛢', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢', '✈', '🛩', '🛫', '🛬', '🪂',
        '💺', '🚁', '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '🛎', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱', '⏲', '🕰'
    ];

    const SYMBOL = [
        ',', '.', '-', '+', ')', '(', '*', '&', '^', '%', '$', '#', '@', '!', '~', '?',
        '，', '。', '？', '：', '；', '“', '’', '——', '=', '）', '（', '～'
    ];

    protected function getMsg(string $desc, int $level = 1)
    {
        if ($level) {
            $desc = \Pinyin::hashChinese($desc, $level);
        }

        $emoji = [self::EMOJI, self::PERSON, self::ANIMAL, self::FOOD, self::ADDRESS, self::SYMBOL];
        $index = rand(0, count($emoji) - 1);
        $emo = $emoji[$index];
        $strLength = mb_strlen($desc);

        if ($strLength < 5) {
            $emoCount = 1;
        } else {
            $emoCount = (int)round($strLength / 5);
            if ($emoCount > 3) {
                $emoCount = 3;
            }
        }

        $tCount = $emoCount * $level; //扩大表情占比数量
        $emoCount = rand(0, $tCount);
        if ($emoCount === 0) {
            return $desc;
        }

        if ($strLength > 5 && $emoCount === 0) {
            $emoCount = rand(0, $tCount);
        }

        for ($i = 0; $i < $emoCount; $i++) {
            $tabIndex = rand(0, $strLength);
            $emoIndex = rand(0, count($emo) - 1);
            if ($tabIndex === 0) {
                $desc = $emo[$emoIndex] . $desc;
                continue;
            }
            $desc = mb_substr($desc, 0, $tabIndex) . $emo[$emoIndex] . mb_substr($desc, $tabIndex);
        }
        return $desc;
    }

    public function getList(int $limit, int $page, array $params)
    {
        $where = [['deleted', '=', 0], ['lib_id', '=', $params['id'] ?? 0]];
        if (isset($params['desc']) && $params['desc']) {
            $where[] = ['desc', 'like', $params['desc'] . '%'];
        }

        if (isset($params['type']) && $params['type']) {
            $where[] = ['type', '=', $params['type']];
        }

        if (isset($params['level']) && $params['level']) {
            $where[] = ['level', '=', $params['level']];
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
            $users = User::where([['id', 'in', array_column($data, 'user_id')]])->field(['id', 'name'])->select()->toArray();
            if ($users) {
                $users = array_column($users, 'name', 'id');
            }
            $data = array_map(static function ($item) use ($users) {
                $item['userName'] = $users[$item['user_id']] ?? '-';
                return $item;
            }, $data);
        }

        return ['total' => $total, 'data' => $data];
    }

    public function add(array $params)
    {
        try {
            validate(ValidateSpeech::class)->check($params);
        } catch (ValidateException $e) {
            return ['code' => 1, 'msg' => $e->getMessage()];
        }

        $params['desc'] = str_replace("\r\n", "\n", $params['desc']);
        try {
            $desc = explode("\n", $params['desc']);
            if (count($desc) === 0) {
                throw new Exception('话术不能为空');
            }

            foreach ($desc as $v) {
                $model = new self();
                $model->setAttr('desc', $v);
                $model->setAttr('level', $params['level']);
                $model->setAttr('lib_id', $params['lib_id']);
                $model->setAttr('created_at', time());
                if (User::ROLE_TYPE[1] === $params['role_type']) {
                    $model->setAttr('agent_user_id', $params['user_id']);
                } elseif (User::ROLE_TYPE[2] === $params['role_type']) {
                    $model->setAttr('user_id', $params['user_id']);
                    $model->setAttr('agent_user_id', (new User())->getIdByUserId($params['user_id']));
                }

                $model->save();
            }

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
            validate(ValidateSpeech::class)->check($params);
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
                return ['code' => 1, 'msg' => '不存在'];
            }
            $model->setAttr('desc', $params['desc']);
            $model->setAttr('level', $params['level']);
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
            if ($params['role_type'] === User::ROLE_TYPE[1]) {
                $where[] = ['agent_user_id', '=', $params['user_id']];
            } elseif ($params['role_type'] === User::ROLE_TYPE[2]) {
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

    /**
     * 
     * @param array $params
     * @param int $count  为1只生成1个，为N生成N个
     * @return array
     */
    public function autoSpeechList(array $params, int $count = 1)
    {
        if (!isset($params['level']) || !isset($params['desc'])) {
            return ['code' => 1, 'data' => []];
        }

        $data = [];
        for ($i = 0; $i < $count; $i++) {
            $data[] = $this->getMsg($params['desc'], (int)$params['level']);
        }

        return ['code' => 0, 'data' => $data];
    }
}
