let tCommon = require('app/dy/Common');
// const DyIndex = require('app/dy/Index.js');
// const DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
// const DyVideo = require('app/dy/Video.js');
// const DyComment = require('app/dy/Comment.js');

let dy = require('app/iDy');
let config = require('config/config');

let task = {
    me: {},//我的抖音号和昵称
    taskId: undefined,
    run(taskId) {
        dy.taskId = taskId;
        return this.testTask(taskId);
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-toker-" + file + ".txt";
        if (!files.isDir(allFile)) {
            if (!files.ensureDir(allFile)) {
                console.log('文件夹创建失败：' + allFile);
            }
        }

        console.setGlobalLogConfig({
            "file": allFile
        });
    },

    testTask(taskId) {
        return dy.run(taskId);
    },

    setLogConsole() {
        //let dpi = context.getResources().getDisplayMetrics().densityDpi;
        console.show(true);
        console.setTitle(config.name + "提醒", "#FFFFFF", 40);
        console.setCanInput(false);
        console.setBackgroud("#2E78FC");
        tCommon.sleep(40);
        console.setSize(device.width, device.height / 6);
        tCommon.toast("感谢你对" + config.name + "的信任，有任何问题或者建议，请第一时间联系" + config.name + "官方！", 1000);
    },
}

// task.setLogConsole();
let i = false;
dialogs.confirm('运行前说明', '特别注意，不要多台手机都使用Wi-Fi！账号之间不要相关联！一号一机！', (_true) => {
    i = _true
});

if (!i) {
    tCommon.toast('你取消了任务', 2000);
    console.hide();
    exit();
}

let tasks = dy.getTask({ isCity: 0 });
if (tasks.code !== 0) {
    dialogs.alert(tasks.msg);
    console.hide();
    exit();
}

if (tasks.data.length === 0) {
    dialogs.alert('请创建任务后运行！');
    console.hide();
    exit();
}

let options = tasks.data.map((item) => {
    return item.name;
});

let selectTaskIndex = dialogs.select("请选择一个任务", options);
if (selectTaskIndex >= 0) {
    tCommon.toast("您选择的任务：" + options[selectTaskIndex]);
} else {
    tCommon.toast("您取消了选择");
    exit();
}

task.taskId = tasks.data[selectTaskIndex]['id'];

tCommon.openApp();
//console.hide();  在index里面进行关闭
let thr = undefined;
while (true) {
    task.setLog();
    //threads.shutDownAll();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let code = task.run(task.taskId);
        if (code === false) {
            tCommon.showToast('相关异常，请重试！');
            tCommon.backApp();
            tCommon.sleep((300 + 300 * Math.random()) * 1000);//休眠5-10分钟
        }
        tCommon.log(code);
        if ([102, 103, 104, 105].includes(code)) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.showToast('任务结束了');
            tCommon.backApp();
            tCommon.sleep(2000);
            exit();
        }

        if (code === 106) {
            tCommon.showToast('频率达到了，休息一会儿');
            tCommon.sleep(2000);
            tCommon.backApp();
            tCommon.sleep((300 + 300 * Math.random()) * 1000);//休眠5-10分钟
            tCommon.openApp();
        }

        if (code === 101) {
            // tCommon.closeApp();
            tCommon.showToast('不在任务时间，休息一会儿');
            tCommon.sleep(2000);
            tCommon.backApp();
            let hours = JSON.parse(dy.getData('taskConfig').hour);
            while (true) {
                tCommon.sleep(5 * 60 * 1000);
                if (hours.includes((new Date()).getHours())) {
                    break;
                }
            }
            tCommon.openApp();
        }

        tCommon.sleep(3000);
    } catch (e) {
        console.log(e);
        try {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.toast("遇到错误，即将自动重启");
            tCommon.closeApp();
            tCommon.sleep(3000);
            tCommon.toast('开启抖音');
            tCommon.openApp();
        } catch (e) {
            console.log('启停bug', e);
        }
    }
}
