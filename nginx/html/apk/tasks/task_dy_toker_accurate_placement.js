let tCommon = require('app/dy/Common');
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let DyComment = require('app/dy/Comment.js');
let Http = require('unit/mHttp');
let storage = require('common/storage');
let machine = require('common/machine');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    nicknames: [],//已经艾特的不再处理
    count: 0,
    run(count, kw) {
        return this.testTask(count, kw);
    },

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

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-task_dy_toker_accurate_placement-" + file + ".txt";
        if (!files.isDir(allFile)) {
            if (!files.ensureDir(allFile)) {
                console.log('文件夹创建失败：' + allFile);
            }
        }

        console.setGlobalLogConfig({
            "file": allFile
        });
    },

    includesKw(str, kw) {
        for (let i in kw) {
            if (str.includes(kw[i])) {
                return true;
            }
        }
        return false;
    },

    testTask(count, kw) {
        if (count <= this.count) {
            return true;
        }

        //首先进入页面
        DyIndex.intoSearchPage();
        log('链接：', kw);

        let res = DySearch.intoSearchLinkVideo(kw);
        if (!res) {
            toast('找不到视频');
            throw new Error('找不到视频：' + kw);
        }

        DyVideo.openComment(!!DyVideo.getCommentCount());
        let baseCount = 8;
        let times = Math.ceil(count / baseCount);
        for (let i = 0; i < times; i++) {
            let opCount = count - this.count > baseCount ? baseCount : count - this.count;
            DyComment.commentAtUser(opCount, this.nicknames);
            log('一轮完成');
            this.count += opCount;
        }

        if (count <= this.count) {
            return true;
        }
        return false;
    },
}

let kw = dialogs.rawInput('请输入视频链接：', machine.get('task_dy_toker_accurate_placement') || '');
if (!kw) {
    toast('你取消了任务', 2000);
    exit();
}

machine.set('task_dy_toker_accurate_placement', kw);

let count = dialogs.rawInput('请输入精准投放用户数量：', machine.get('task_dy_toker_accurate_placement_count') || '');
if (!count) {
    toast('你取消了任务', 2000);
    exit();
}

if (count > 100) {
    toast('每次操作，数量不得大于100', 2000);
    exit();
}

machine.set('task_dy_toker_accurate_placement_count', count);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run(count, kw)) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(2000);
            dialogs.alert('精准投放完成');
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
