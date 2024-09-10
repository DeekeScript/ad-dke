let heartBeat = require('service/heartBeat.js');
let runCheck = require('service/runCheck.js');
let mHttp = require('./unit/mHttp');
let storage = require('./common/storage');
let tCommon = require("./app/dy/Common");
//importClass(android.view.WindowManager);

// auto.setMode('fast');

//开启无障碍
// auto.setStable(storage.get('stable') ? 1 : 0);
// auto.waitFor();
// tCommon.backApp();

//启动之前，关闭其他进程
function stopEng() {
    for (let eng of engines.all()) {
        if (engines.myEngine().id !== eng.id) {
            eng.forceStop();
        }
    }
    threads.shutDownAll();
}

device.keepScreenDim();//保持屏幕常亮

stopEng();
let index = engines.execScriptFile('run/index.js');
let mFloaty = engines.execScriptFile('run/floaty.js');

//正常情况下，当engines.all()长度为3的时候，是正常的，小于3是异常，等于4，是程序在运行
let runCount = 0;
let msg;

let sendHeartBeat = 0;
function listenerProcess() {
    let eng = engines.all();
    let files = [];
    for (let en of eng) {
        if (!en.getSource()) {
            continue;
        }
        let tmp = en.getSource().toString().split('\/');
        files.push(tmp[tmp.length - 1]);
    }

    //悬浮窗挂掉了，重新启动
    if (files.indexOf('floaty.js') == -1) {
        console.log('悬浮窗挂掉了，重新启动');
        mFloaty = engines.execScriptFile('run/floaty.js');
    }
}

try {
    runCheck.run();
    //auto.waitFor();//增加无障碍等待

    //这里监听程序的运行情况，并且给悬浮窗具体的信息
    let d = new Date();
    let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    console.setGlobalLogConfig({
        "file": "/sdcard/dke/log/log-main-" + file + ".txt"
    });

    let k = 0;
    let checkCount = 0;
    setInterval(function () {
        try {
            listenerProcess();
            runCount = engines.all().length;
            if (runCount < 3) {
                msg = '异常';
            } else if (runCount == 3) {
                msg = '待执行';
                index.getEngine() ? index.getEngine().emit("notice", msg) : null;//向悬浮窗通知信息
            } else if (runCount == 4) {
                msg = '执行中';
                sendHeartBeat++;
                if (sendHeartBeat == 300) {
                    heartBeat.run();
                    sendHeartBeat = 0;
                }
            } else {
                msg = '异常';
            }
            //log('msg', msg);
            mFloaty.getEngine() ? mFloaty.getEngine().emit("notice", msg) : null;//向悬浮窗通知信息
            if (k % 10 === 1) {
                log(msg);
            }
        } catch (e) {
            log('main定时器问题', e);
        }
        k++;
        if (k >= 1000) {
            k = 0;
        }

        //登陆状态检测
        if (checkCount % 300 === 0) {
            //1分钟检测一次
            log('检测登陆状态');
            try {
                threads.start(function () {
                    let res = mHttp.post('dke', 'getDate', {});
                    if (res.code === 0 && res.data.date <= 0) {
                        storage.removeToken();
                    }
                });
            } catch (e) {
                log('检测登陆状态', e);
            }
        }

        checkCount++;
        if (checkCount >= 900) {
            checkCount = 1;//不再重置为0
        }
    }, 1000);
} catch (e) {
    //主程序异常的时候，将错误写入文件
    console.log('main异常', e);
}
