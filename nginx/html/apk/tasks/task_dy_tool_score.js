let tCommon = require('app/dy/Common');
const DyIndex = require('app/dy/Index.js');
const DySearch = require('app/dy/Search.js');
const DyUser = require('app/dy/User.js');
// const DyVideo = require('app/dy/Video.js');
let storage = require('common/storage');
let machine = require('common/machine');
// const DyComment = require('app/dy/Comment.js');
let Http = require('unit/mHttp');

let tool = require('app/tool');
// let config = require('config/config');

let task = {
    contents: [],
    run(account) {
        return this.testTask(account);
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-dy-tool-score-" + file + ".txt";
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

        let res = Http.post('dke', 'getMsg', { type: type, lib_id: this.taskConfig.lib_id });
        if (res.code !== 0) {
            return false;
        }
        return res.data;
    },

    testTask(account) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoSearchPage();
        DySearch.homeIntoSearchUser(account);
        let userInfo = DyUser.getUserInfo();
        let res = tool.getVideoMsg(userInfo, () => {
            threads.shutDownAll();
        });
        log(res);
        return res;
    },
}

let account = false;
account = dialogs.rawInput('请输入对方账号', '');

if (!account) {
    tCommon.showToast('你取消了执行');
    console.hide();
    exit();
}

tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let res = task.run(account);
        if (thr) {
            thr.interrupt();
            threads.shutDownAll();
        }

        if (res) {
            tCommon.sleep(3000);
            tool.showDetail(res);
        }
        break;
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
