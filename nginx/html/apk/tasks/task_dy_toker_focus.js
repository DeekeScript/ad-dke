let tCommon = require('app/dy/Common');
const DyIndex = require('app/dy/Index.js');
const DySearch = require('app/dy/Search.js');
const DyUser = require('app/dy/User.js');
const DyVideo = require('app/dy/Video.js');
let storage = require('common/storage');
let machine = require('common/machine');
const DyComment = require('app/dy/Comment.js');
let Http = require('unit/mHttp');
let baiduWenxin = require('service/baiduWenxin');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    contents: [],
    run(account) {
        return this.testTask(account);
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-dy-toker-focus-" + file + ".txt";
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
    getMsg(type, title, age, gender) {
        if (storage.getMachineType() === 1) {
            if (storage.get('baidu_wenxin_switch')) {
                return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            }
            return machine.getMsg(type) || false;//永远不会结束
        }

        let res = Http.post('dke', 'getMsg', { type: type, lib_id: this.taskConfig.lib_id });
        if (res.code !== 0) {
            return false;
        }
        return res.data;
    },

    testTask(account) {
        //首先进入点赞页面
        DyIndex.intoHome();
        if (account.indexOf('+') === 0) {
            DyIndex.intoMyPage();
        } else {
            DyIndex.intoSearchPage();
        }
        let res = DySearch.homeIntoSearchUser(account);
        if (res) {
            return res;
        }

        return DyUser.focusUserList(0, this.getMsg, DyVideo, DyComment, machine, account, this.contents);
    },
}

let account = false;
account = dialogs.rawInput('请输入对方账号', storage.get('task_dy_toker_focus_account') || '');

if (!account) {
    tCommon.showToast('你取消了执行');
    console.hide();
    exit();
}

storage.set('task_dy_toker_focus_account', account);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let res = task.run(account);
        if (res) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(3000);
            dialogs.alert('提示', '截流关注已完成');
            break;
        }

        if (res === false) {
            break;
        }

        tCommon.sleep(3000);
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
