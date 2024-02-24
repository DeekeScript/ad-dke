/**
 * 这里是页面的所有代码
 */

let mHttp = require('../unit/mHttp.js');
let storage = require('../common/storage.js');
let funcs = require('./funcs.js');
let Home = require('../page/Home');
let Speech = require('../page/Speech');
let Task = require('../page/Task');
let TaskDetail = require('../page/TaskDetail');
let OSetting = require('../page/OSetting');
let Setting = require('../page/Setting');
let Tool = require('../page/Tool');
let Study = require('../page/Study');
let Config = require('../config/config');
let Statistics = require('../page/Statistics');
const FansSetting = require('../page/FansSetting.js');
const SearchUserSetting = require('../page/SearchUserSetting.js');
const FansIncPage = require('../page/FansIncPage.js');
importClass(android.util.DisplayMetrics);
importClass(android.graphics.Color);
importClass(android.view.WindowManager);
importClass(android.view.View);
importClass(android.os.Build);
importClass(java.lang.Thread);
importClass(android.content.Context);
importClass(android.view.inputmethod.InputMethodManager);

let page = {
    //这里传入需要控制的应用，进行运行  每增加一个功能点，需要将btn的ID配置到btns属性，然后需要在tasks文件夹里面创建对应的文件
    btns: Object.keys(funcs[0]),
    current: undefined,
    uis: {},
    dp: function (rate) {
        let ht = device.height;
        let systemDM = new DisplayMetrics();
        //let wm = context.getSystemService(context.WINDOW_SERVICE);
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;

        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht / rate) + 'dp';
    },

    ldp: function (rate) {
        let ht = device.width;
        let systemDM = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;
        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht / rate) + 'dp';
    },

    listener() {
        let _this = this;
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        log('屏幕常亮');
        activity.getWindow().getDecorView().setOnSystemUiVisibilityChangeListener(new View.OnSystemUiVisibilityChangeListener({
            onSystemUiVisibilityChange: (visibility) => {
                //log('visibility', visibility);
                _this.basePage();
            },
        }));

        // context.registerActivityLifecycleCallbacks(new android.app.Application.ActivityLifecycleCallbacks({
        //     onActivityCreated: (a) => {
        //         //activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
        //     },

        //     // onActivityResumed: (a) => {
        //     //     //log('resumed');
        //     // },

        //     onActivityStarted: (a) => {
        //         //解决底部虚拟菜单问题
        //         //_this.basePage();
        //     },

        //     // onActivityStopped: (a) => {
        //     //     log('stopped');
        //     // },

        //     // onActivityPaused: (a) => {
        //     //     log('paused');
        //     //     return true;
        //     // },

        //     onActivityDestroyed: (a) => {
        //         //界面销毁
        //         //java.lang.System.exit(0);
        //     },

        //     // onActivitySaveInstanceState: (a) => {
        //     //     log('saveInstanceState');
        //     // }
        // }));
    },

    show() {
        this.basePage();
        if (storage.getToken()) {
            return this.index();
        }

        return this.login();
    },

    fansSetting() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        if (!this.uis['fansSetting']) {
            this.uis['fansSetting'] = FansSetting.show(ui.main);
        }
        ui.main.addView(this.uis['fansSetting']);
        this.current = 'fansSetting';
        FansSetting.func(funcs, this);
    },

    searchUserSetting() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        if (!this.uis['searchUserSetting']) {
            this.uis['searchUserSetting'] = SearchUserSetting.show(ui.main);
        }
        ui.main.addView(this.uis['searchUserSetting']);
        this.current = 'searchUserSetting';
        SearchUserSetting.func(funcs, this);
    },

    fansIncPage(){
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        if (!this.uis['fansIncPage']) {
            this.uis['fansIncPage'] = FansIncPage.show(ui.main);
        }
        ui.main.addView(this.uis['fansIncPage']);
        this.current = 'fansIncPage';
        FansIncPage.func(funcs, this);
    },

    taskDetail(taskIndex) {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        ui.main.addView(TaskDetail.show(ui.main));
        TaskDetail.setTaskIndex(taskIndex);
        ui.post(() => {
            TaskDetail.func(funcs, this);
        });

        this.current = 'taskDetail';
    },

    oSetting() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        if (!this.uis['oSetting']) {
            this.uis['oSetting'] = OSetting.show(ui.main);
        }
        ui.main.addView(this.uis['oSetting']);
        this.current = 'oSetting';
        OSetting.func(funcs, this);
    },

    statistics() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        // if (!this.uis['statistics']) {
        this.uis['statistics'] = Statistics.show(ui.main);
        // }
        ui.main.addView(this.uis['statistics']);
        this.current = 'statistics';
        Statistics.func(funcs, this);
    },

    tool() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        if (!this.uis['tool']) {
            this.uis['tool'] = Tool.show(ui.main);
        }
        ui.main.addView(this.uis['tool']);
        Tool.func(funcs, this);
        this.current = 'tool';
        log('tool');
    },

    home() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        ui.main.addView(this.uis['home']);
        Home.func(funcs, this);
        this.current = 'home';
    },

    setting() {
        if (ui.a) {
            page.close = true;
            Thread.sleep(80);
        }
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        ui.main.addView(this.uis['setting']);
        Setting.func(funcs, this);
        this.current = 'setting';
    },

    task() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        ui.main.addView(this.uis['task']);
        Task.func(funcs, this);
        this.current = 'task';
    },

    study() {
        ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();
        ui.main.addView(Study.show(ui.main));
        Study.func(funcs, this);
        this.current = 'study';
    },

    setSpeechFuncOpen() {
        Speech.funcOpen = false;
        this.uis['speech'] = Speech.show(ui.main);
    },

    _init() {
        Home.funcOpen = false;
        Task.funcOpen = false;
        Speech.funcOpen = false;
        Setting.funcOpen = false;
        Tool.funcOpen = false;
        TaskDetail.funcOpen = false;
        OSetting.funcOpen = false;
        Statistics.funcOpen = false;

        FansSetting.funcOpen = false;
        SearchUserSetting.funcOpen = false;
    },

    init(homeView) {
        this._init();
        if (ui.main) {
            log('this.init');
            let _this = this;
            ui.post(() => {
                _this.uis = {
                    home: homeView || Home.show(ui.main),//已经初始化了
                    task: Task.show(ui.main),
                    speech: Speech.show(ui.main),
                    setting: Setting.show(ui.main),
                    // tool: Tool.show(ui.main),
                    // taskDetail: TaskDetail.show(ui.main),
                    // oSetting: OSetting.show(ui.main),
                };
            });
        }
    },

    basePage() {
        ui.statusBarColor("#2E78FC");//状态栏颜色
        activity.getWindow().setNavigationBarColor(Color.parseColor('#f6f6f6'));
        try {
            if (Build.VERSION.SDK_INT > 11 && Build.VERSION.SDK_INT < 19) { // lower api
                let v = activity.getWindow().getDecorView();
                v.setSystemUiVisibility(View.GONE);
            } else if (Build.VERSION.SDK_INT >= 19) {
                let decorView = activity.getWindow().getDecorView();
                let uiOptions = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION; //点击其他部位，重现
                //| View.SYSTEM_UI_FLAG_FULLSCREEN;//关闭最上面的
                decorView.setSystemUiVisibility(uiOptions);
            }
        } catch (e) {
            log(e);
        }
    },

    login: function () {
        this.current = 'login';
        ui.layout(
            <frame>
                <frame bg={"#ffffff"} marginTop={0}>
                    <vertical>
                        <vertical w="*" h={this.dp(5)}><img w="*" scaleType="fitXY" src={"file://img/task-bg.png"} /></vertical>
                        <vertical marginTop={"-" + this.dp(8)}><img w="*" h={this.dp(6)} src={"file://logo/" + Config.logo + ".png"} /></vertical>
                        <vertical bg="#ffffff" h="auto" padding={'6dp 0 12dp 0'} id="content" marginTop={this.dp(20)} marginLeft={"12dp"} marginRight={"12dp"}>
                            <vertical>
                                <text textColor="#333333" textSize="16dp" text="手机号" />
                                <input id='mobile' textSize="18dp" textSizeHint="18dp" inputType="phone" hint="请输入手机号" />
                            </vertical>
                            <text id='mobileError' visibility={'gone'} textColor="red">*请输入手机号</text>
                            <vertical marginTop="12dp">
                                <text textColor="#333333" textSize="16dp" text="密码" />
                                <input id='password' textSize="18dp" textSizeHint="18dp" password="true" hint="请输入密码" />
                            </vertical>
                            <text padding="6dp 0" id='passwordError' visibility={'gone'} textColor="red">*请输入密码</text>
                            <vertical marginTop="12dp">
                                <text textColor="#333333" textSize="16dp" text="设备ID" />
                                <input id='machineId' textSize="18dp" textSizeHint="18dp" inputType="phone" hint="请输入设备ID" />
                            </vertical>
                            <text id='machineIdError' visibility={'gone'} textColor="red">*请输入设备ID</text>
                            <text padding="6dp 0" id='loginError' visibility={'gone'} textColor="red" gravity="center">登陆失败</text>
                        </vertical>

                        <vertical marginLeft="11dp" marginRight="11dp" marginTop="12dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <button bg="#2E78FC" id='login' style="Widget.AppCompat.Button.Colored" text="登陆" />
                            </card>
                        </vertical>
                    </vertical>
                </frame>

                <frame marginTop={this.dp(1.23)}>
                    <horizontal layout_gravity="center">
                        <text textColor="#999999" h="*" w="*" gravity="center">{Config.name}技术团队提供计算支持 @ v{app.versionName}</text>
                    </horizontal>
                    <img w="*" scaleType="fitXY" src="file://img/login-bottom.png" />
                </frame>
            </frame >
        );

        ui.login.click(() => {
            if (ui.login.attr('lock')) {
                return true;
            }

            ui.login.attr('lock', true);
            let errorCount = 0;
            if (!ui.mobile.text()) {
                ui.mobileError.attr('visibility', 'visible');
                errorCount++;
            } else {
                ui.mobileError.attr('visibility', 'gone');
            }

            if (!ui.password.text()) {
                ui.passwordError.attr('visibility', 'visible');
                errorCount++;
            } else {
                ui.passwordError.attr('visibility', 'gone');
            }

            if (!ui.machineId.text()) {
                ui.machineIdError.attr('visibility', 'visible');
                errorCount++;
            } else {
                ui.machineIdError.attr('visibility', 'gone');
            }

            if (errorCount) {
                return false;
            }

            ui.loginError.attr('visibility', 'gone');
            //软键盘隐藏
            let imm = context.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);

            threads.start(() => {
                let res = mHttp.post('dke', 'login', {
                    'mobile': ui.mobile.text(),
                    'password': ui.password.text(),
                    'machine_id': ui.machineId.text(),
                });
                log('登陆结果', res);
                if (res.code === 0) {
                    toast('登陆成功');
                    setTimeout(() => {
                        ui.post(() => {
                            page.basePage();
                            page.index();
                        });
                    }, 700);
                    storage.setMachineId(ui.machineId.text());
                    storage.setMobile(ui.mobile.text());
                    storage.setToken(res.data.token);
                    storage.setTag(res.data.number);
                    storage.setMachineType(res.data.machineType);
                    storage.setOpenWx(res.data.openWx);
                    storage.setIsAgent(res.data.isAgent);
                    //storage.setEndTime(res.data.endTime * 1);
                }

                ui.post(() => {
                    if (res.code !== 0) {
                        ui.loginError && ui.loginError.setText(res.msg || '登陆失败');
                        ui.loginError && ui.loginError.attr('visibility', 'visible');
                    }
                    ui.login.attr('lock', false);
                });
            });
        });
    },

    index: function () {
        let bottomBar = {
            home: 'file://img/home.png',
            speech: 'file://img/speech.png',
            task: 'file://img/task.png',
            setting: 'file://img/setting.png',
        }

        ui.layout(
            <frame>
                <frame id='main'></frame>
                <frame marginTop={this.dp(1.12)} bg="#ffffff">
                    <progressbar progressTint="#dedede" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                    <vertical>
                        <horizontal height={this.dp(12)}>
                            <frame layout_weight="1" id="home" w={storage.getMachineType() === 1 ? this.ldp(4) : this.ldp(2)}>
                                <vertical padding={"0 " + this.dp(160) + " 0 " + this.dp(160)}>
                                    <img id="home_img" w="*" h={this.dp(35)} src={"file://img/home.png"} />
                                    <text textSize="12dp" id="home_text" textColor="#2E78FC" gravity="center">{Config.name}</text>
                                </vertical>
                            </frame>

                            <frame visibility={storage.getMachineType() === 1 ? 'visible' : 'gone'} layout_weight="1" id="task" w={this.ldp(4)}>
                                <vertical alpha="1" padding={"0 " + this.dp(160) + " 0 " + this.dp(160)}>
                                    <img id="task_img" w="*" h={this.dp(35)} src={"file://img/task.png"} />
                                    <text textSize="12dp" id="task_text" textColor="#515151" gravity="center">任务管理</text>
                                </vertical>
                            </frame>
                            <frame visibility={storage.getMachineType() === 1 ? 'visible' : 'gone'} layout_weight="1" id="speech" w={this.ldp(4)}>
                                <vertical alpha="1" padding={"0 " + this.dp(160) + " 0 " + this.dp(160)}>
                                    <img id="speech_img" w="*" h={this.dp(35)} src={"file://img/speech.png"} />
                                    <text textSize="12dp" id="speech_text" textColor="#515151" gravity="center">话术管理</text>
                                </vertical>
                            </frame>

                            <frame layout_weight="1" id="setting" w={storage.getMachineType() === 1 ? this.ldp(4) : this.ldp(2)}>
                                <vertical alpha="1" padding={"0 " + this.dp(160) + " 0 " + this.dp(160)}>
                                    <img id="setting_img" w="*" h={this.dp(35)} src={"file://img/setting.png"} />
                                    <text textSize="12dp" id="setting_text" textColor="#515151" gravity="center">系统设置</text>
                                </vertical>
                            </frame>
                        </horizontal>
                    </vertical>
                </frame>
            </frame >
        );

        try {
            let ids = ['home', 'task', 'speech', 'setting'];
            if (storage.getMachineType() === 2) {
                ids = ['home', 'setting'];
            }

            //可能已经存在了page（比如mttp重定向页面的时候，这里肯定已经存在页面了）
            ui.current && ui.main.removeView(ui.current) && ui.main.invalidate();

            this.current = ids[0];
            this.uis = { home: Home.show(ui.main) };
            this.init(this.uis['home']);

            ui.main.addView(this.uis['home']);
            Home.func(funcs, this);

            let target;
            if (storage.getMachineType() === 2) {
                target = {
                    home: Home,
                    setting: Setting,
                }
            } else {
                target = {
                    home: Home,
                    task: Task,
                    speech: Speech,
                    setting: Setting,
                }
            }

            let _this = this;

            for (let i in ids) {
                (function (i) {
                    ui[ids[i]].click(() => {
                        if (ids[i] === _this.current) {
                            return false;
                        }

                        if (ui.a) {
                            _this.close = true;
                            Thread.sleep(80);
                        }

                        ui.main.removeView(ui.current);
                        ui.main.invalidate();
                        _this.current = ids[i];

                        ui.main.addView(_this.uis[ids[i]]);
                        target[ids[i]].func(funcs, _this);

                        for (let j in ids) {
                            ui[ids[j] + '_img'].attr('src', bottomBar[ids[j]]);
                            ui[ids[j] + '_img'].setColorFilter(Color.parseColor('#515151'));
                            ui[ids[j] + '_text'].setTextColor(Color.parseColor("#515151"));
                        }

                        ui[ids[i] + '_img'].attr('src', bottomBar[ids[i]]);
                        ui[ids[i] + '_img'].setColorFilter(Color.parseColor('#2E78FC'));
                        ui[ids[i] + '_text'].setTextColor(Color.parseColor("#2E78FC"));
                    });
                })(i);
            }
        } catch (e) {
            log(e);
        }
    },
};

module.exports = page;
