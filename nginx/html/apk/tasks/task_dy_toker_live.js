let tCommon = require('app/dy/Common');
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let DyComment = require('app/dy/Comment.js');
let Http = require('unit/mHttp');
let storage = require('common/storage');
let machine = require('common/machine');
let DyLive = require('app/dy/Live');
let baiduWenxin = require('service/baiduWenxin');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    index: -1,
    nicknames: [],
    intoErrorCount: 0,//根据错误次数判断直播是否结束
    run(input, preIndex) {
        return this.testTask(input, preIndex);
    },

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

    setLog() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "/sdcard/dke/log/log-toker-live-" + file + ".txt";
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

    testTask(douyin, preIndex) {
        //首先进入页面
        DyIndex.intoSearchPage();
        log('账号：', douyin);
        log('preIndex:', preIndex);
        let res = DySearch.intoUserLiveRoom(douyin, 1);
        if (!res) {
            toast('找不到用户账号：' + douyin);
            this.intoErrorCount++;
            threads.shutDownAll();
            tCommon.sleep(500);
            if (this.intoErrorCount >= 3) {
                return true;//完成了
            }
            throw new Error('找不到用户账号：' + douyin);
        }

        this.intoErrorCount = 0;

        while (true) {
            DyLive.openUserList();
            let onlineTag = descContains('在线观众').textContains('在线观众').filter((v) => {
                return v && v.bounds() && v.bounds().top && v.bounds().width() && v.bounds().height() && v.bounds().top + v.bounds().height() < device.height;
            }).findOne(2000);

            if (!onlineTag) {
                throw new Error('找不到“在线观众”tag');
            }

            let lastUser = undefined;
            while (true) {
                let users = DyLive.getUsers();
                if (JSON.stringify(users) === lastUser) {
                    rp++;
                } else {
                    rp = 0;
                }

                if (rp >= 3) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    log('扫描完了');
                    break;
                }

                lastUser = JSON.stringify(users);
                for (let k in users) {
                    if (this.nicknames.includes(users[k].title)) {
                        continue;
                    }

                    log('index', users[k].index * 1);
                    if (users[k].index * 1 <= preIndex) {
                        continue;
                    }

                    let tmp = /第\d+名/.exec(users[k].title);
                    let title = users[k].title;
                    if (tmp && tmp[0]) {
                        title = title.replace(tmp[0], '');
                    }

                    if (title.indexOf('***') !== -1) {
                        return -1;
                    }

                    if (machine.get('task_dy_toker_live_' + douyin + '_' + title)) {
                        log('重复');
                        continue;
                    }

                    if (users[k].tag.bounds().top <= onlineTag.bounds().top + onlineTag.bounds().height()) {
                        log('边界超出');
                        continue;
                    }

                    log('开始操作用户：', title, machine.get('task_dy_toker_live_' + douyin + '_' + title));
                    this.nicknames.push(users[k].title);
                    machine.set('task_dy_toker_live_' + douyin + '_' + title, true);
                    log('设置后：' + machine.get('task_dy_toker_live_' + douyin + '_' + title));
                    log('进入粉丝列表');
                    DyLive.intoFansPage(users[k]);
                    if (DyUser.isPrivate()) {
                        log('私密账号');
                        tCommon.back(1, 1000);
                        continue;
                    }

                    //开始操作评论
                    if (DyVideo.intoUserVideo()) {
                        log('有视频，直接操作视频引流');
                        DyVideo.clickZan();
                        tCommon.sleep(1000);
                        let msg = this.getMsg(0, DyVideo.getContent());
                        if (msg) {
                            DyVideo.openComment(!!DyVideo.getCommentCount());
                            tCommon.log('开启评论窗口');
                            DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                            tCommon.log('评论了');
                            tCommon.back(2);
                        } else {
                            tCommon.back();//从视频页面到用户页面
                        }
                    } else {
                        log('无视频，直接操作关注和私信引流');
                        try {
                            DyUser.focus();
                            let msg = this.getMsg(1, DyUser.getNickname(), DyUser.getAge(), DyUser.getGender());
                            if (msg) {
                                DyUser.privateMsg(msg.msg);
                            }
                        } catch (e) {
                            log(e);
                        }
                    }
                    tCommon.sleep(1000);
                    log('back 1');
                    tCommon.back();
                    tCommon.sleep(2000);
                }
                log('下一页');
                DyLive.swipeFansList();
                tCommon.sleep(2000);
            }
            toast('休眠2分钟后继续执行');
            tCommon.sleep(120 * 1000);//休眠2分钟
        }
    },
}

let input = dialogs.rawInput('输入正在直播的直播间主播账号：', machine.get('task_dy_toker_live_account') || '');

if (!input) {
    toast('你取消了任务');
    exit();
}
machine.set('task_dy_toker_live_account', input);

let preIndex = dialogs.rawInput('输入前多少名不操作：', machine.get('task_dy_toker_live_index') || '');

if (!preIndex) {
    preIndex = 0;
}
machine.set('task_dy_toker_live_index', preIndex);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let res = task.run(input, preIndex);
        if (res) {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(5000);
            dialogs.alert('提示', '任务完成了');
            break;
        }

        if (res === -1) {
            //设置隐私了，不能操作
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
            }
            tCommon.sleep(5000);
            dialogs.alert('提示', '直播间用户被设置隐私，不能操作');
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
