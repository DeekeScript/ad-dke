let tCommon = require('app/dy/Common');
const DyIndex = require('app/dy/Index.js');
const DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
const DyVideo = require('app/dy/Video.js');
let storage = require('common/storage');
let machine = require('common/machine');
const DyMessage = require('app/dy/Message.js');
let Http = require('unit/mHttp');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    contents: [],
    lib_id: undefined,
    run(keyword, index) {
        return this.testTask(keyword, index);
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-fans-group-" + file + ".txt";
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
    getMsg(type, lib_id, title, age, gender) {
        if (storage.getMachineType() === 1) {
            if (storage.get('baidu_wenxin_switch')) {
                return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            }
            return machine.getMsg(type) || false;//永远不会结束
        }

        let res = Http.post('dke', 'getMsg', { type: type, lib_id: lib_id });
        if (res.code !== 0) {
            return false;
        }
        return res.data;
    },

    testTask(keyword, index) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoMyMessage();
        log('keyword', keyword, index);
        if (!DyMessage.intoFansGroup(keyword, index)) {
            return false;
        }

        return DyMessage.intoGroupUserList(this.contents, (type, title, age, gender) => this.getMsg(type, this.lib_id, title, age, gender), (v) => machine.get('task_dy_fans_group_' + keyword + '_' + v), (v) => machine.set('task_dy_fans_group_' + keyword + '_' + v, true));
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

let keyword = false;
keyword = dialogs.rawInput('请输入群主账号或昵称（支持输入部分）', storage.get('task_dy_fans_group') || '');

if (!keyword) {
    tCommon.showToast('你取消了执行');
    console.hide();
    exit();
}
storage.set('task_dy_fans_group', keyword);

let index = 1;
index = dialogs.rawInput('请输入第几个群', storage.get('task_dy_fans_group_index') || index);

if (!index) {
    tCommon.showToast('你取消了执行');
    console.hide();
    exit();
}
index = index * 1;
storage.set('task_dy_fans_group_index', index);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let res = task.run(keyword, index);
        if (res || res === false) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(1000);
            dialogs.alert('提示', res ? '已完成' : '找不到群');
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
