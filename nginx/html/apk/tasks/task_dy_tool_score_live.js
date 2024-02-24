let tCommon = require('app/dy/Common');
const DyIndex = require('app/dy/Index.js');
const DySearch = require('app/dy/Search.js');
const DyUser = require('app/dy/User.js');
const DyVideo = require('app/dy/Video.js');
let storage = require('common/storage');
let machine = require('common/machine');
// const DyComment = require('app/dy/Comment.js');

let tool = require('app/tool');
let mHttp = require('unit/mHttp');
let DyLive = require('app/dy/Live.js');
// let config = require('config/config');
importClass(android.util.DisplayMetrics);
importClass(android.graphics.Color);

let task = {
    contents: [],
    accounts: [],
    id: undefined,
    float: undefined,
    run(i, code) {
        return this.testTask(i, code);
    },

    dp: function (rate) {
        let ht = device.height;
        let systemDM = new DisplayMetrics();
        let wm = context.getSystemService(context.WINDOW_SERVICE);
        wm.getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;

        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht / rate) + 'dp';
    },

    ldp: function (rate) {
        let ht = device.width;
        let systemDM = new DisplayMetrics();
        let wm = context.getSystemService(context.WINDOW_SERVICE);
        wm.getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;
        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht / rate) + 'dp';
    },

    getAccounts(code) {
        if (this.accounts >= 5) {
            return this.accounts;
        }

        let res = mHttp.post('dke', 'getLiveAccount', { code: code, id: this.id });
        if (res.code === 0) {
            for (let i in res.data.list) {
                if (!res.data.list[i].text) {
                    continue;
                }
                this.accounts.push(res.data.list[i].text);
                this.id = res.data.list[i].id;
            }
            if (!this.id) {
                this.id = res.data.id;
            }
        }
        return this.accounts;
    },

    addAccounts(data) {
        let res = mHttp.post('dke', 'addLiveAccount', data);
        return res.code === 0;
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-dy-tool-score-live-" + file + ".txt";
        if (!files.isDir(allFile)) {
            if (!files.ensureDir(allFile)) {
                console.log('文件夹创建失败：' + allFile);
            }
        }

        console.setGlobalLogConfig({
            "file": allFile
        });
    },

    //type 0 评论，1私信
    getMsg(type) {
        if (storage.getMachineType() === 1) {
            return machine.getMsg(type) || false;//永远不会结束
        }

        let res = mHttp.post('dke', 'getMsg', { type: type, lib_id: this.taskConfig.lib_id });
        if (res.code !== 0) {
            return false;
        }
        return res.data;
    },

    openFloat() {
        let visible = 'visible';
        this.float = floaty.rawWindow(
            <frame w="*" h={this.dp(6)} bg="#000000">
                <vertical id="title" height={this.dp(18)} bg="#FF3333" paddingTop={this.dp(90)} paddingBottom={this.dp(90)} paddingLeft={this.dp(72)} paddingRight={this.dp(72)}>
                    <text id="text" textSize="20dp" textColor="#FFFFFF">评论区输入你的账号，即可账号评分!</text>
                </vertical>

                <horizontal marginTop={this.dp(14)} h={this.dp(36)}>
                    <text layout_weight={1} textSize="16dp" visibility={visible} id="text_1" textColor="#FF0000" text="1.亲，评论占坑" />
                    <text layout_weight={1} textSize="16dp" visibility={visible} id="text_2" textColor="#dddddd" text="2.亲，评论占坑" />
                    <text layout_weight={1} textSize="16dp" visibility={visible} id="text_3" textColor="#dddddd" text="3.亲，评论占坑" />
                </horizontal>
                <horizontal marginTop={this.dp(9.0)} h={this.dp(36)}>
                    <text layout_weight={1} textSize="16dp" visibility={visible} id="text_4" textColor="#dddddd" text="4.亲，评论占坑" />
                    <text layout_weight={1} textSize="16dp" visibility={visible} id="text_5" textColor="#dddddd" text="5.亲，评论占坑" />
                    <text layout_weight={1} textSize="16dp" visibility={visible} id="text_6" textColor="#dddddd" text="6.亲，评论占坑" />
                </horizontal>
            </frame>
        );

        this.float.setSize(-1, -2);
        this.float.setTouchable(false);
        this.float.setPosition(0, device.height / 3);

        threads.start(() => {
            let i = 0;
            let color = ['#FF3333', '#FFFFFF'];
            setInterval(() => {
                if (i >= 2) {
                    i = 0;
                }

                this.float && this.float.title && this.float.title.attr('bg', color[1 - i]);
                this.float && this.float.text && this.float.text.setTextColor(Color.parseColor(color[i]));
                i++;
            }, 1000);
        });
    },

    setFloat(accounts) {
        if (!this.float) {
            return;
        }
        ui.post(() => {
            for (let i = 0; i <= 5; i++) {
                //log('text_' , accounts[i]);
                accounts[i] && this.float['text_' + (i + 1)].setText((i + 1) + "." + accounts[i].toString());
                !accounts[i] && this.float['text_' + (i + 1)].setText((i + 1) + ".亲，评论占坑");
            }
        });
    },

    testTask(i, code) {
        if (i === 1) {
            while (DyVideo.isLiving()) {
                DyVideo.next();
                tCommon.sleep(3000);
            }
            log('打分开始');
            let startTime = undefined;
            let into = false;
            while (true) {
                !into && click(device.width / 2, device.height * 3 / 4);
                !this.float && this.openFloat();
                //首先进入点赞页面
                let accounts = this.getAccounts(code);
                this.setFloat(accounts);
                if (!startTime || Date.parse(new Date()) / 1000 - startTime >= 5) {
                    startTime = Date.parse(new Date()) / 1000;
                    tCommon.playAudio('./mp3/live_score.mp3');
                }

                if (accounts.length === 0) {
                    log('休眠5秒钟');
                    tCommon.sleep(1000);
                    into = true;
                    //!into && tCommon.backApp();
                    continue;
                }

                let account = accounts[0];
                DyIndex.intoSearchPage();
                accounts.shift();
                DySearch.homeIntoSearchUser(account);
                let userInfo = DyUser.getUserInfo();
                let res = tool.getVideoMsg(userInfo, () => {
                    //
                });
                log(res);
                this.float.close();
                this.float = undefined;
                threads.start(() => {
                    tCommon.sleep(7000);
                    click(200, 100);
                });
                tool.showDetail(res, 7);
                //tCommon.backApp();
                into = false;
            }
        }

        if (i === 0) {
            let _this = this;
            log('弹幕监听');
            DyLive.listenBarrage((data) => {
                log('data', data);
                let post = [];
                if (data && data.length) {
                    for (let i in data) {
                        if (!/^[a-zA-Z0-9_-]{5,20}$/.test(data[i].comment)) {
                            continue;
                        }

                        post.push({
                            code: code,
                            nickname: data[i].nickname,
                            text: data[i].comment,
                        });
                    }
                }
                if (post && post.length) {
                    _this.addAccounts(post);
                }
            });
        }
    },
}

let options = ["观看打分直播端", "打分直播端"]
let i = dialogs.select("请选择一个选项", options);
if (i >= 0) {
    toast("您选择的是：" + options[i]);
} else {
    console.hide();
    toast("您取消了选择");
    exit();
}

let code = 0;
if (i === 1) {
    code = dialogs.rawInput('请输入生成的Code', '');
    if (!code) {
        tCommon.showToast('你取消了执行');
        console.hide();
        exit();
    }
} else {
    let res = mHttp.post('dke', 'getLiveCode', {});
    if (res.code === 0) {
        code = res.data.code;
    }

    if (code === 0) {
        tCommon.showToast('你取消了执行');
        console.hide();
        exit();
    }

    dialogs.confirm('本次直播的Code是：' + code + '请将此Code填写在“打分端“的手机上');
}

tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run(i, code)) {//0直播端，1采集端
            thr.interrupt();
            threads.shutDownAll();
            break;
        }
    } catch (e) {
        console.log(e);
        try {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.showToast("遇到错误，即将自动重启");
            tCommon.closeApp();
            tCommon.sleep(3000);
            tCommon.showToast('开启抖音');
            tCommon.openApp();
        } catch (e) {
            console.log('启停bug', e);
        }
    }
}

try {
    engines.myEngine().forceStop();
} catch (e) {
    log('停止脚本');
}
