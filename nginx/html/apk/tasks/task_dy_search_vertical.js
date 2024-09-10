let tCommon = require('app/dy/Common');
const DyIndex = require('app/dy/Index.js');
const DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
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
    lib_id: undefined,
    count: 100,
    run(keyword) {
        return this.testTask(keyword);
    },

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-search-vertical-" + file + ".txt";
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

    testTask(keyword) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoSearchPage();
        DySearch.homeIntoSearchVideo(keyword);
        tCommon.sleep(5000);

        let rpCount = 0;
        while (true) {
            if (DyVideo.isLiving()) {
                log('直播');
                tCommon.sleep(2000 + Math.random() * 2000);
                DyVideo.next();
                tCommon.sleep(2000);
                continue;
            }

            let title = DyVideo.getContent();
            let nickname = DyVideo.getNickname();
            if (machine.get('task_dy_search_vertical_' + nickname + "_" + title)) {
                log('重复视频');
                tCommon.sleep(2000 + Math.random() * 2000);
                DyVideo.next();
                tCommon.sleep(2000);
                continue;
            }

            if (this.contents.includes(nickname + '_' + title)) {
                rpCount++;
                if (rpCount > 3) {
                    return true;
                }
            }

            rpCount = 0;

            if (this.count-- <= 0) {
                return true;
            }

            //刷视频
            let processBar = DyVideo.getProcessBar();
            //console.log('processBar', processBar, processBar && processBar.bounds().height(), processBar && processBar.bounds().top);
            if (storage.getPackage() !== 'org.autojs.autoxjs.v6') {
                if (processBar) {
                    let sleepSec = 20 + 20 * Math.random() - 5;
                    tCommon.log('休眠' + sleepSec + 's');
                    tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
                } else {
                    let sleepSec = (15 + 10 * Math.random() - 5);
                    tCommon.log('休眠' + sleepSec + 's');
                    tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
                }
            } else {
                let sleepSec = (5 + 10 * Math.random() - 5);
                tCommon.log('休眠' + sleepSec + 's');
                tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
            }

            tCommon.log('看看是不是广告');
            //看看是不是广告，是的话，不操作作者
            if (DyVideo.viewDetail()) {
                let clickRePlayTag = tCommon.id('fw2').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().left > 0;
                }).findOnce();
                if (clickRePlayTag) {
                    log('点击重播');
                    clickRePlayTag.click();
                    tCommon.sleep(1000);
                }
                click(500 + Math.random() * 200, 500 + Math.random() * 300);
                tCommon.sleep(1500);
            } else {
                tCommon.log('不是广告，准备进入主页');
            }

            let commentCount = DyVideo.getCommentCount();

            if (Math.random() <= 0.333) {
                log('评论')
                let videoTitle = DyVideo.getContent();
                DyVideo.openComment(!!commentCount);
                tCommon.sleep(500 + 500 * Math.random());
                let msg = this.getMsg(0, videoTitle);
                DyComment.commentMsg(msg.msg);
                tCommon.sleep(2000 + 2000 * Math.random());
                tCommon.back();
                tCommon.sleep(500);
            }

            if (Math.random() <= 0.333) {
                log('点赞');
                DyVideo.clickZan();
            }

            machine.set('task_dy_search_vertical_' + nickname + "_" + title, true);
            this.contents.push(nickname + "_" + title);
            DyVideo.next();
            tCommon.sleep(2000);
        }
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
keyword = dialogs.rawInput('请输入关键词', storage.get('task_dy_search_vertical') || '');

if (!keyword) {
    tCommon.showToast('你取消了执行');
    console.hide();
    exit();
}
storage.set('task_dy_search_vertical', keyword);

task.count = dialogs.rawInput('请输入刷视频个数', storage.get('task_dy_search_count') || task.count);

if (!task.count) {
    tCommon.showToast('你取消了执行');
    console.hide();
    exit();
}
storage.set('task_dy_search_count', task.count);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let res = task.run(keyword);
        if (res) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(3000);
            dialogs.alert('提示', '已完成');
            break;
        }

        if (res === false) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(3000);
            dialogs.alert('提示', '已完成');
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
