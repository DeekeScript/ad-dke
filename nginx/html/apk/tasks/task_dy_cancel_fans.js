let tCommon = require('app/dy/Common');
const DyIndex = require('app/dy/Index.js');
// const DySearch = require('app/dy/Search.js');
const DyUser = require('app/dy/User.js');
const DyVideo = require('app/dy/Video.js');
// const DyComment = require('app/dy/Comment.js');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    run() {
        return this.testTask();
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-cancel-fans-" + file + ".txt";
        if (!files.isDir(allFile)) {
            if (!files.ensureDir(allFile)) {
                console.log('文件夹创建失败：' + allFile);
            }
        }

        console.setGlobalLogConfig({
            "file": allFile
        });
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        DyUser.cancelFocusList();
    },
}

dialogs.alert('提示', '该功能将在后续版本中上线，尽情期待！')
exit();

let i = false;
dialogs.confirm('提示', '确定开始执行嘛？', (_true) => {
    i = _true;
});

if (!i) {
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
        task.run(task.taskId);
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
