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
    me:{},
    run(settingData) {
        return this.testTask(settingData);
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-dy-toker-fans-" + file + ".txt";
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

    testTask(settingData) {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
            focusCount: DyUser.getFocusCount(),
        }

        tCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));
        DyIndex.intoHome();

        if (settingData.account.indexOf('+') === 0) {
            DyIndex.intoMyPage();
        } else {
            DyIndex.intoSearchPage();
        }

        let res = DySearch.homeIntoSearchUser(settingData.account);
        if (res) {
            return res;
        }

        return DyUser.focusUserList(1, this.getMsg, DyVideo, DyComment, machine, settingData, this.contents, this.me.nickname);
    },
}

let settingData = machine.getFansSettingRate();
settingData.isFirst = true;
log('settingData', settingData);

if (!settingData.account) {
    tCommon.showToast('未设置账号，取消执行');
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
        let res = task.run(settingData);
        if (res) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(3000);
            let iSettingData = machine.getFansSettingRate();
            dialogs.alert('提示', '已完成' + "|已执行数量：" + (iSettingData.opCount * 1 - settingData.opCount) + "/" + iSettingData.opCount);
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
