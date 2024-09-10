let tCommon = require('app/dy/Common');
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let DyComment = require('app/dy/Comment.js');
let Http = require('unit/mHttp');
let storage = require('common/storage');
let machine = require('common/machine');
let baiduWenxin = require('service/baiduWenxin');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    index: -1,
    nicknames: [],
    contents: [],
    run(input, kw, sleepSecond) {
        return this.testTask(input, kw, sleepSecond);
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
        let allFile = "/sdcard/dke/log/log-comment-" + file + ".txt";
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

    testTask(input, kw, sleepSecond) {
        //首先进入页面
        let intoUserFansList = input.indexOf('+') === 0;
        if (intoUserFansList) {
            input = input.substring(1);
            DyIndex.intoMyPage();
            DyUser.intoFocusList();
            tCommon.sleep(3000);
        } else {
            DyIndex.intoSearchPage();
        }

        input = tCommon.splitKeyword(input);
        kw = tCommon.splitKeyword(kw);
        log('账号：', input);
        log('关键词：', kw);
        this.index++;
        if (this.index >= input.length) {
            this.index = 0;
        }

        let douyin = input[this.index];
        let res;
        if (intoUserFansList) {
            res = DyUser.focusListSearch(douyin);
        } else {
            res = DySearch.intoUserVideoPage(input[this.index], 1);
        }

        if (!res) {
            toast('找不到用户账号：' + input);
            return 'exit';
        }

        if (intoUserFansList) {
            DyVideo.intoUserVideo();
        }

        //获取最新的前三视频
        let i = 3;
        while (i-- > 0) {
            let title = DyVideo.getContent();
            let commentCount = DyVideo.getCommentCount();
            if (commentCount === 0 || this.contents.includes(title)) {
                log('下一个视频', i);
                DyVideo.next();
                tCommon.sleep(3000);
                continue;
            }

            DyVideo.openComment(commentCount);
            tCommon.sleep(2000 + 1000 * Math.random());
            let rp = 0;
            let lastComment = undefined;
            let maxSwipe = 1200;
            while (true) {
                let comments = DyComment.getList();
                maxSwipe--;
                if (maxSwipe <= 0) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    log('滑动了1200次了');
                    break;
                }

                if (JSON.stringify(comments) === lastComment) {
                    rp++;
                } else {
                    rp = 0;
                }
                // log(JSON.stringify(comments), lastComment, rp);

                if (rp >= 3) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    log('评论扫描完了');
                    break;
                }
                lastComment = JSON.stringify(comments);

                for (let k in comments) {
                    if (!this.includesKw(comments[k]['content'], kw) || this.nicknames.includes(comments[k].nickname)) {
                        log('数据：', comments[k]['content'], !this.includesKw(comments[k]['content'], kw), this.nicknames.includes(comments[k].nickname));
                        continue;
                    }

                    if (machine.get('task_dy_toker_comment_' + douyin + '_' + comments[k].nickname)) {
                        log('重复');
                        continue;
                    }
                    log('找到了关键词', comments[k]['content']);

                    try {
                        if (!DyComment.isZan()) {
                            DyComment.clickZan(comments[k]);
                        }
                    } catch (e) {
                        log('异常处理：', e);
                        continue;
                    }

                    this.nicknames.push(comments[k].nickname);
                    machine.set('task_dy_toker_comment_' + douyin + '_' + comments[k].nickname, true);
                    DyComment.intoUserPage(comments[k]);
                    //私密账号
                    if (DyUser.isPrivate()) {
                        tCommon.back();
                        tCommon.sleep(500);
                        log('私密账号');
                        continue;
                    }

                    //开始操作评论
                    if (DyVideo.intoUserVideo()) {
                        log('有视频，直接操作视频引流');
                        DyVideo.clickZan();
                        let msg = this.getMsg(0, DyVideo.getContent());
                        if (msg) {
                            DyVideo.openComment(!!DyVideo.getCommentCount());
                            tCommon.log('开启评论窗口');
                            DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                            tCommon.log('评论了');
                            tCommon.back(2);//视频页面回到用户页面
                        } else {
                            tCommon.back();//从视频页面到用户页面
                        }
                    } else {
                        log('无视频，直接操作关注和私信引流');
                        DyUser.focus();
                        let msg = this.getMsg(1, comments[k].nickname, DyUser.getAge(), DyUser.getGender());
                        if (msg) {
                            DyUser.privateMsg(msg.msg);
                        }
                    }
                    tCommon.back();
                    tCommon.sleep(1000);
                }

                log('下一页评论');
                tCommon.swipeCommentListOp();
                tCommon.sleep(1500 + 500 * Math.random());
            }
            log('下一个视频', i);
            this.contents.push(title);
            DyVideo.next();
            tCommon.sleep(4000 + Math.random() * 2000);
        }

        if (intoUserFansList) {
            tCommon.back(4, 1500);
        } else {
            tCommon.back(6, 1500);
        }

        tCommon.backApp();
        if (this.index === input.length - 1) {
            toast('一轮完成，休息' + sleepSecond + '秒');
            log('一轮完成，休息' + sleepSecond + '秒');
            tCommon.sleep(sleepSecond * 1000);//休眠十分钟
        } else {
            toast('一个账号完成，休息3分钟');
            log('一个账号完成，休息3分钟');
            tCommon.sleep(180 * 1000);//休眠十分钟
        }
        return true;//重启
    },
}

let input = dialogs.rawInput('输入账号（多个账号使用逗号隔开）', machine.get('task_dy_toker_comment_account') || '');

if (!input) {
    toast('你取消了任务', 2000);
    exit();
}
machine.set('task_dy_toker_comment_account', input);

let kw = dialogs.rawInput('输入评论关键词（多个关键词使用逗号隔开）', machine.get('task_dy_toker_comment_kw') || '');

if (!kw) {
    toast('你取消了任务', 2000);
    exit();
}
machine.set('task_dy_toker_comment_kw', kw);

let sleepSecond = dialogs.rawInput('输入每轮休眠时间(秒)', machine.get('task_dy_toker_comment_sleep_second') || '600');

if (sleepSecond <= 0) {
    toast('休眠时间不能为空', 2000);
    exit();
}

if (!sleepSecond) {
    toast('你取消了任务', 2000);
    exit();
}


machine.set('task_dy_toker_comment_sleep_second', sleepSecond);
tCommon.openApp();

let thr = undefined;
while (true) {
    task.setLog();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let r = task.run(input, kw, sleepSecond);

        if (r === 'exit') {
            if (thr) {
                thr.interrupt();
                threads.shutDownAll();
                tCommon.sleep(3000);
                dialogs.alert('找不到用户，停止执行');
            }
            break;
        }

        if (r) {
            throw new Error('一个任务完成，重启，进入新的账号');
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

try {
    engines.myEngine().forceStop();
} catch (e) {
    log('停止脚本');
}
