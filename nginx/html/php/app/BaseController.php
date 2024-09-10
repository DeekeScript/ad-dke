<?php

declare(strict_types=1);

namespace app;

use app\common\Role;
use app\model\User;
use think\App;
use think\exception\ValidateException;
use think\Validate;

/**
 * 控制器基础类
 */
abstract class BaseController
{
    /**
     * Request实例
     * @var \think\Request
     */
    protected $request;

    protected $ignoreAction = ['login', 'outLogin', 'downloadJson', 'verify', 'baiduwenxin'];

    /**
     * 应用实例
     * @var \think\App
     */
    protected $app;

    /**
     * 是否批量验证
     * @var bool
     */
    protected $batchValidate = false;

    /**
     * 控制器中间件
     * @var array
     */
    protected $middleware = [];



    protected $limit = 15;
    protected $page = 1;

    /**
     * Summary of user
     * @var \app\model\User
     */
    protected $user;

    /**
     * 构造方法
     * @access public
     * @param  App  $app  应用对象
     */
    public function __construct(App $app)
    {
        $this->app = $app;
        $this->request = $this->app->request;

        // 控制器初始化
        $this->initialize();
    }

    // 初始化
    protected function initialize()
    {
        $this->limit = $this->request->get('pageSize', $this->limit, 'int');
        if ($this->limit > 100) {
            $this->limit = 100;
        }

        $this->page = $this->request->get('current', $this->page, 'int');
        if ($this->page <= 0) {
            $this->page = 1;
        }

        if (!in_array($this->request->controller(), ['Index']) && !in_array($this->request->action(), $this->ignoreAction)) {
            $user = new User();
            $user = $user->findOneByToken(str_replace('Bearer ', '', $this->request->header('Authorization')));
            if (!$user) {
                exit(json_encode(['code' => 401, 'msg' => '登陆失效', 'sucess' => false]));
            }

            $user['avatar'] = '/head.png';
            $this->user = $user;

            if (!(new Role())->isAccess($user['role_type'], $this->request->controller(), $this->request->action())) {
                exit(json_encode(['code' => 402, 'msg' => '没有访问权限', 'sucess' => false]));
            }
        }
    }

    /**
     * 验证数据
     * @access protected
     * @param  array        $data     数据
     * @param  string|array $validate 验证器名或者验证规则数组
     * @param  array        $message  提示信息
     * @param  bool         $batch    是否批量验证
     * @return array|string|true
     * @throws ValidateException
     */
    protected function validate(array $data, $validate, array $message = [], bool $batch = false)
    {
        if (is_array($validate)) {
            $v = new Validate();
            $v->rule($validate);
        } else {
            if (strpos($validate, '.')) {
                // 支持场景
                [$validate, $scene] = explode('.', $validate);
            }
            $class = false !== strpos($validate, '\\') ? $validate : $this->app->parseClass('validate', $validate);
            $v = new $class();
            if (!empty($scene)) {
                $v->scene($scene);
            }
        }

        $v->message($message);

        // 是否批量验证
        if ($batch || $this->batchValidate) {
            $v->batch(true);
        }

        return $v->failException(true)->check($data);
    }

    protected function success(array $res, array $ext = [])
    {
        $return = ['code' => 0, 'success' => true, 'data' => $res['data'] ?? [], 'total' => $res['total'] ?? 0, 'msg' => $res['msg'] ?? '成功'];
        if ($ext) {
            $return = array_merge($return, $ext);
        }
        return json($return);
    }

    protected function error(array $res)
    {
        return json(['code' => 1, 'data' => [], 'success' => false, 'msg' => $res['msg'] ?? '失败']);
    }
}
