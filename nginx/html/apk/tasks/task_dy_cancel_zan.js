let tCommon = require('app/dy/Common');
const DyIndex = require('app/dy/Index.js');
// const DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
const DyVideo = require('app/dy/Video.js');
// const DyComment = require('app/dy/Comment.js');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    rp: 0,
    run() {
        return this.testTask();
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-cancel-zan-" + file + ".txt";
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
        let res = DyIndex.intoMyLikeVideo();
        if (!res) {
            this.rp++; //没有视频，三次之后确定全部取消了
            if (this.rp >= 3) {
                return true;//完成了
            }
            log('错误');
            return toast('错误');
        }

        this.rp = 0;//有视频
        let container = [];
        let _rp = 0;
        while (true) {
            //查看是不是直播中
            log('开始');
            let title = DyVideo.getContent();
            let nickname;
            if (DyVideo.isLiving()) {
                log('直播中的主播');
                try {
                    nickname = DyVideo.getLivingNickname();
                } catch (e) {
                    nickname = 'living';
                }
            } else {
                log('不是直播');
                nickname = DyVideo.getNickname();
            }

            log('nickname:title', nickname + ':' + title);
            if (container.includes(nickname + ':' + title)) {
                DyVideo.next();
                _rp++;
                if (_rp >= 3) {
                    log('_rp', _rp);
                    return false;//这里可能还没有完成 可能是各种问题导致的卡顿
                }
                continue;
            }
            container.push(nickname + ':' + title);
            _rp = 0;

            let isZan = DyVideo.isZan();
            log('isZan', isZan);
            if (isZan) {
                DyVideo.clickZan();
            }
            tCommon.sleep(500);
            DyVideo.next();
        }
    },
}

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
        if (task.run()) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
                tCommon.sleep(1000);
            }
            dialogs.alert('提示', '一键取赞完成');
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
