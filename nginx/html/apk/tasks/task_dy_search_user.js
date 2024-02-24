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
    count: 100,
    fans: 20000,
    params: { clickZan: false, comment: false, },
    lib_id: undefined,
    run(settingData) {
        return this.testTask(settingData);
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-search-user-" + file + ".txt";
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

        let res = Http.post('dke', 'getMsg', { type: type, lib_id: this.lib_id });
        if (res.code !== 0) {
            return false;
        }
        return res.data;
    },

    decCount() {
        return --this.count;
    },

    testTask(settingData) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoSearchPage();
        DySearch.intoSearchList(settingData.keyword, 1);
        tCommon.sleep(3000);
        this.params.settingData = settingData;
        return DySearch.userList(
            (v) => machine.get('task_dy_search_user_' + v),
            () => this.decCount(),
            DyUser,
            DyComment,
            DyVideo,
            (v) => machine.set('task_dy_search_user_' + v, true),
            (v, title, age, gender) => this.getMsg(v, title, age, gender),
            this.params
        );
    },
}

if (storage.getMachineType() !== 1) {
    let libs = Http.post('dke', 'speechLibList', { type: 0 });
    if (libs.code !== 0 || libs.data.total === 0) {
        tCommon.showToast('请先在线上添加话术');
        console.hide();
        exit();
    }

    let opts = [];
    for (let i in libs.data.data) {
        opts.push(libs.data.data[i]['name'] + "[ID=" + libs.data.data[i]['id'] + "]");
    }
    let id = dialogs.select('请选择话术库', opts);
    if (id <= 0) {
        tCommon.showToast('取消了话术库选择');
        console.hide();
        exit();
    }
    task.lib_id = JSON.stringify([libs.data.data[id]['id']]);
    tCommon.showToast('你选择了话术库：' + libs.data.data[id]['name'] + "[ID=" + libs.data.data[id]['id'] + "]");
}

let settingData = machine.getSearchUserSettingRate();
settingData.isFirst = true;
log('settingData', settingData);

if (!settingData.keyword) {
    tCommon.showToast('未设置关键词，停止运行');
    console.hide();
    exit();
}

task.count = settingData.opCount;
if (!task.count) {
    tCommon.showToast('未设置运行次数，停止运行');
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
            let iSettingData = machine.getSearchUserSettingRate();
            dialogs.alert('提示', '已完成' + "|已执行数量：" + (iSettingData.opCount * 1 - task.count) + "/" + iSettingData.opCount);
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
