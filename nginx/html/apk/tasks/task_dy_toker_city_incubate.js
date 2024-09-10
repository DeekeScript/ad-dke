let tCommon = require('app/dy/Common');
// const DyIndex = require('app/dy/Index.js');
// const DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
// const DyVideo = require('app/dy/Video.js');
// const DyComment = require('app/dy/Comment.js');
let dy = require('app/iDy');
let config = require('config/config');
let storage = require('common/storage');
let Https = require('unit/mHttp');

let task = {
    me: {},//我的抖音号和昵称
    taskId: undefined,
    //sucArr: [0, 0, 0, 0],//打招呼是否完成(2为完成，1为完成了一部分)，刷视频找同城用户是否完成，关注数（为了保证安全，每天最大150），最终的数据是否上传

    run(taskId, type) {
        dy.taskId = taskId;
        return this.testTask(taskId, type);
    },

    setData(key, value, index) {
        let _key = 'task_dy_toker_city_incubate';
        let values = storage.get(_key);
        if (!values) {
            values = {};
        }

        if (index !== undefined) {
            if (!values[key]) {
                values[key] = [];
            }
            values[key][index] = value;
        } else {
            values[key] = value;
        }

        return storage.set(_key, values);
    },

    getData(key, index) {
        let _key = 'task_dy_toker_city_incubate';
        let values = storage.get(_key);
        if (!values) {
            return values;
        }

        if (!values[key]) {
            return values[key];
        }

        if (index !== undefined) {
            return values[key][index];
        }

        return values[key];
    },

    clearData() {
        let _key = 'task_dy_toker_city_incubate';
        return storage.set(_key, {
            sucArr: [0, 0, 0, 0],
        });
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-city-incubate-" + file + ".txt";
        if (!files.isDir(allFile)) {
            if (!files.ensureDir(allFile)) {
                console.log('文件夹创建失败：' + allFile);
            }
        }

        console.setGlobalLogConfig({
            "file": allFile
        });
    },

    testTask(taskId, type) {
        dy.setIsCity(true);
        return dy.runCity(taskId, type, task.getData, task.setData);
    },

    setLogConsole() {
        console.show(true);
        console.setTitle(config.name + "提醒", "#FFFFFF", 40);
        console.setCanInput(false);
        console.setBackgroud("#2E78FC");
        tCommon.sleep(40);
        console.setSize(device.width, device.height / 6);
        tCommon.toast("感谢你对" + config.name + "的信任，有任何问题或者建议，请第一时间联系" + config.name + "官方！", 1000);
    }
}

if (!storage.getIsAgent()) {
    dialogs.alert('提示', '该功能需要代理商权限');
    exit();
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

let tasks = dy.getTask({ isCity: 1 });
if (tasks.code !== 0) {
    dialogs.alert(tasks.msg);
    console.hide();
    exit();
}

if (tasks.data.length === 0) {
    dialogs.alert('请在后台创建任务后运行！');
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

let type = Math.random();
let date = (new Date()).getDate();

//测试
// task.clearData();
// task.setData('sucArr', 2, 0);
// task.setData('sucArr', 1, 1);
// task.setData('sucArr', 132, 2);
// task.setData('decFocusCount', 12);
// task.setData('commentCount', 2);
// task.setData('zanCommentCount', 132);
// task.setData('zanCount', 12);
// task.setData('refreshVideoCount', 220);

// task.setData('sucArr', 0, 0);
// task.setData('sucArr', 1, 1);
// task.setData('sucArr', 150, 2);
// task.setData('sucArr', 0, 3);
// log(task.getData('sucArr'));
//测试结束

while (true) {
    task.setLog();
    try {
        let sucArr = task.getData('sucArr') || [];
        if (sucArr[0] === 2 && sucArr[1] === 1) {
            log('完成了休眠5分钟');
            if ((new Date()).getDate() !== date) {
                //如果总数据还没有上传，则先上传
                if (sucArr[3] === 0) {
                    dy.updateMyData(task.getData);
                }

                task.clearData();
                type = Math.random();
                date = (new Date()).getDate();
            }

            if (sucArr[0] === 2 && sucArr[1] === 1 && sucArr[3] === 0) {
                dy.updateMyData(task.getData);
                sucArr[3] = 1;
                task.setData('sucArr', 1, 3);
            }
            tCommon.sleep(5 * 60 * 1000);
            continue;
        }
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        log('type', type < 1 / 3 ? 0 : (type < 2 / 3 ? 1 : 2));
        let code = task.run(task.taskId, type < 1 / 3 ? 0 : (type < 2 / 3 ? 1 : 2));//分别是 最先执行评论，中间执行评论，最后执行评论
        if (code === true) {
            continue;
        }

        if (code === false) {
            tCommon.showToast('相关异常，请重试！');
            tCommon.backApp();
            tCommon.sleep((300 + 300 * Math.random()) * 1000);//休眠5-10分钟
        }

        tCommon.log(code);
        if (code === 101) {
            //tCommon.closeApp();
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

        if (thr) {
            thr.interrupt();
        }

        tCommon.sleep(3000);
    } catch (e) {
        console.log(e);
        tCommon.toast("遇到错误，即将自动重启");
        tCommon.closeApp();
        tCommon.sleep(3000);
        tCommon.openApp();
    }
}
