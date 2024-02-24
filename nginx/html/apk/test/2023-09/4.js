

// const cHttp = require('../../unit/mHttp.js');

const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    //获取百分之多少的dp （比如手机是100dp高度，rate=20的时候，返回的是20dp）
    dp(rate) {
        let dpi = context.getResources().getDisplayMetrics().densityDpi;
        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht * rate / 100) + 'dp';
    },

    aId(name) {
        //android:id/text1
        return id('android:id/' + name);
    },

    getTags(tags) {
        let tgs = [];
        for (let i in tags) {
            if (isNaN(i) || typeof (tags[i]).toString() == 'function') {
                continue;
            }
            tgs.push(tags[i]);
        }
        return tgs;
    },

    sleep(time) {
        sleep(time);
    },

    packageName() {
        return 'com.ss.android.ugc.aweme';
    },

    stopApp() {
        if (app.openAppSetting('com.ss.android.ugc.aweme')) {
            this.sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            //log('stopTag', stopTag);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            click(p.centerX(), p.centerY());
            this.sleep(1000);
            p = text('确定').findOne(3000) || text('强行停止').findOne(3000);
            if (p) {
                p = p.bounds();
                click(p.centerX(), p.centerY());
            }

            this.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    click(tag, rate) {
        //this.log('click', tag, tag.bounds().height(), tag.bounds().width());
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * rate + Math.random() * (tag.bounds().width() * p);
        let height = tag.bounds().height() * rate + Math.random() * (tag.bounds().height() * p);

        try {
            click(tag.bounds().left + Math.round(width), tag.bounds().top + Math.round(height));
        } catch (e) {
            this.log(e);
            try {
                click(tag.bounds().left + Math.round(width), tag.bounds().top);
            } catch (e) {
                this.log(e);
                return false;
            }
        }

        this.sleep(500);
        return true;
    },

    openApp() {
        this.log('openApp', currentPackage(), cStorage.getPackage());
        if (currentPackage() !== cStorage.getPackage() && cStorage.getPackage() !== 'org.autojs.autoxjs.v6') {
            launch(cStorage.getPackage());
            this.sleep(2000);
        }

        launch('com.ss.android.ugc.aweme');//打开抖音
        let k = 5;
        while (k-- >= 0) {
            this.sleep(3000);
            let homeTag = this.id('r6d').filter((v) => {
                return v && v.bounds() && v.bounds().left > 0 && v.bounds().top && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0;
            }).findOnce();
            if (homeTag) {
                break;
            }
        }
    },

    backApp() {
        if (cStorage.getPackage() !== 'org.autojs.autoxjs.v6') {
            launch(cStorage.getPackage());
            this.sleep(2000);
        }
    },

    restartApp() {
        this.stopApp();
        this.openApp();
    },

    log() {
        //这里需要做日志记录处理
        let str = [];
        for (let i in arguments) {
            str.push(arguments[i]);
        }
        if (str.length === 1) {
            str = " " + str[0] + "\n";
        }

        console.log(str);
        // this.logs.push(str);
        // if (cStorage.getMachineType() === 1) {
        //     return true;
        // }
        // if (this.logs.length > 20) {
        //     threads.start(() => {
        //         //console.log(JSON.stringify(this.logs));
        //        cHttp.post('dke', 'log', { desc: JSON.stringify(this.logs) });
        //         this.logs = [];
        //     });
        // }
    },

    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }
        while (i--) {
            back();
            if (!time) {
                this.sleep(700 + Math.random() * 200);
                continue;
            }

            if (randTime) {
                this.sleep(time + randTime * Math.random());
                continue;
            }
            this.sleep(time);
        }
        this.log('back ' + i);
    },

    closeAll() {
        try {
            let closeTag = descContains('不再提醒').findOne(2000);
            if (closeTag) {
                this.click(closeTag);
            }
        } catch (e) {
            this.log(e);
        }
    },

    numDeal(text) {
        text = /[\d\.]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('万', '') * 10000;
        }
        return text[0] * 1;
    },

    closeApp() {
        // if (android.os.Build.VERSION.RELEASE < 14 && cStorage.getPackage() !== 'org.autojs.autoxjs.v6' && 'JSN-AL00' === device.model) {
        //     home();
        //     this.toast('关闭抖音');
        //     this.sleep(2000);
        //     let am = context.getSystemService(context.ACTIVITY_SERVICE);
        //     am.killBackgroundProcesses('com.ss.android.ugc.aweme');
        //     this.sleep(2000);
        //     this.backApp();
        //     return true;
        // }

        let t = cStorage.getMobileStopType();
        if (!t || t * 1 === 0) {
            this.stopApp();
            return true;
        }

        home();
        this.sleep(1000);
        recents();
        this.sleep(1000);

        let dy = text('抖音').clickable(false).filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0;
        }).findOne(2000);
        if (!dy) {
            dy = descContains('抖音').filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0;
            }).findOne(2000);
        }

        //部分机型width为负数
        if (!dy || dy.bounds().width() < 0) {
            return this.stopApp();
        }

        let btm = device.height * (0.5 + Math.random() * 0.1);
        let lf = 300 * Math.random();
        swipe(device.width / 2 - 150 + lf, btm, device.width / 2 - 150 + lf, device.height * (0.1 + 0.05 * Math.random()), 100 + 100 * Math.random());//从下往上推，清除
        this.sleep(1000);
        this.back();
        return true;
    },

    swipe(type, sensitivity) {
        let left = Math.random() * device.width * 0.8 + device.width * 0.2;
        let bottom = device.height * 2 / 3 * sensitivity + device.height / 6 * Math.random();
        let top = device.height / 12 + device.height / 12 * Math.random();
        if (!type) {
            swipe(left, bottom, left, top, 200 + 100 * Math.random());//从下往上推，清除
            return true;
        }
        swipe(left, top, left, bottom, 200 + 100 * Math.random());//从上往下滑
    },

    swipeSearchUserOp() {
        this.swipeSearchUserOpTarge = this.id("kf-").scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == device.width && v.bounds().top >= 0;
        }).findOnce();

        if (this.swipeSearchUserOpTarge) {
            this.swipeSearchUserOpTarge.scrollForward();
        } else {
            log('滑动失败');
        }
    },

    swipeFansListOp() {
        this.swipeFansListOpTarge = this.id("p1-").scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == device.width && v.bounds().top >= 0;
        }).findOnce();

        if (this.swipeFansListOpTarge) {
            this.swipeFansListOpTarge.scrollForward();
        } else {
            log('滑动失败');
        }
        //log(this.swipeFansListOpTarge);
    },

    swipeFocusListOp() {
        this.swipeFocusListOpTarge = this.id("p1-").scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == device.width && v.bounds().top >= 0;
        }).findOnce();
        if (this.swipeFocusListOpTarge) {
            this.swipeFocusListOpTarge.scrollForward();
        } else {
            log('滑动失败');
        }
        //log(this.swipeFocusListOpTarge);

    },

    //关闭弹窗
    closeAlert() {
        return threads.start(() => {
            this.log('开启线程监听弹窗');
            let k = 0;
            while (true) {
                k++;
                if (k > 1000) {
                    k = 0;
                }
                let clicks = [];
                try {
                    if (text("稍后").exists()) {
                        let a = text("稍后").filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('稍后');
                        }
                    }

                    if (text("以后再说").exists()) {
                        let a = text("以后再说").filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('以后再说');
                        }
                    }

                    if (text("我知道了").exists()) {
                        let a = text("我知道了").filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('我知道了');
                        }
                    }
                    if (text("下次再说").exists()) {
                        let a = text("下次再说").filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);

                        if (a) {
                            a.click();
                            clicks.push('下次再说');
                        }
                    }

                    if (text("满意").exists()) {
                        let a = text("满意").clickable(true).filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('满意');
                        }
                    }

                    if (text("不感兴趣").exists()) {
                        let a = text("不感兴趣").clickable(true).filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('不感兴趣');
                        }
                    }

                    if (text("好的").exists()) {
                        let a = text("好的").clickable(true).filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('好的');
                        }
                    }

                    if (packageName(this.packageName()).text("确定").exists()) {
                        let a = packageName(this.packageName()).text("确定").filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('确定');
                        }
                    }

                    if (this.id('dz7').text("取消").exists()) {
                        let a = this.id('dz7').text("取消").filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);

                        if (a) {
                            a.click();
                            clicks.push('取消');
                        }
                    }

                    if (text("拒绝").exists()) {
                        let a = text("拒绝").filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            a.click();
                            clicks.push('拒绝');
                        }
                    }

                    if (text("拒绝").desc('拒绝').exists()) {
                        let a = text("拒绝").desc('拒绝').filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(2000);
                        if (a) {
                            this.click(a);
                            clicks.push('拒绝-2');
                        }
                    }

                    //id('com.ss.android.ugc.aweme:id/pn1').findOne(2000).click(); 进入主页直接弹出对话框页面
                    if (this.id('pn1').clickable(true).exists() && !this.id('ssq').exists()) {
                        let ssq = this.id('ssq').filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOne(1000);

                        if (ssq && ssq.bounds().top > 120) {
                            this.id('pn1').clickable(true).findOne(2000).click();//ssq是私信页面的ID  防止私信页面也被点击
                            clicks.push('ssq');
                        }
                    }

                    //暂时取消掉
                    if (this.id('close').clickable(true).desc('关闭').filter((v) => {
                        return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                    }).exists()) {
                        let a = this.id('close').clickable(true).desc('关闭').filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOnce();
                        //不是主页里面的“删除”关注其他用户
                        if (a && a.parent().id() !== 'com.ss.android.ugc.aweme:id/root') {
                            a.click();
                        }
                    }

                    if (this.id('bk=').text('暂不公开').exists()) {
                        let a = this.id('bk=').text('暂不公开').filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
                        }).findOnce();

                        if (a) {
                            a.click();
                        }
                    }

                    this.sleep(500);
                    if (clicks.length > 0) {
                        this.log('Common点击', clicks);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    },

    sleepFunc(func, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }
        func();
        this.sleep(time + randomTime * Math.random());
    },

    toast(msg, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }

        //toast(msg);
        this.log(msg);
        if (time) {
            this.sleep(time + randomTime * Math.random());
        }
    },

    showToast(msg) {
        toast(msg);
        log(msg);
    },

    //一坨时间  换成频率  当前任务频率，当前一小时频率，10分钟频率，1分钟频率
    //特别注意hours参数， 这个参数规定了执行的小时数，不在这里面的时间段不能算进来
    timestampsToFre(timestamps, hours) {
        //this.log(hours.length, hours);
        hours = hours.sort((a, b) => {
            return a - b;
        });

        let length = 0;
        let currentHour = (new Date()).getHours();
        for (let i in hours) {
            if (hours[i] > currentHour) {
                break;
            }
            length++;
        }

        let currentTime = Date.parse(new Date()) / 1000;

        let second = Math.round(timestamps.length / (length * 3600) * 10000) / 10000;//每秒操作几次
        let allFre = {
            second: second,
            minute: second * 60,//每分钟操作几次
            tenMinute: second * 60 * 10,//每分钟操作几次
            hour: second * 60 * 60,//每小时操作几次
        };

        let hourCount = 0;
        let tenMinuteCount = 0;
        let minuteCount = 0;

        for (let timestamp of timestamps) {
            //1小时内
            if (timestamp > currentTime - 3600) {
                hourCount++;
            }

            //10分钟内
            if (timestamp > currentTime - 600) {
                tenMinuteCount++;
            }

            //一分钟内
            if (timestamp > currentTime - 60) {
                minuteCount++;
            }
        }

        //this.log('hourCount', hourCount, tenMinuteCount, minuteCount);
        let hourFre = {
            second: hourCount / 3600,
            minute: hourCount / 60,//每分钟操作几次
            tenMinute: hourCount / 10,//每分钟操作几次
            hour: hourCount,//每小时操作几次
        }

        second = Math.round(tenMinuteCount / 60 / 10 * 1000) / 1000;
        let tenMinuteFre = {
            second: tenMinuteCount / 60 / 10,
            minute: tenMinuteCount / 10,//每分钟操作几次
            tenMinute: tenMinuteCount,//每10分钟操作几次
            hour: tenMinuteCount * 6,//每小时操作几次
        }

        let minuteFre = {
            second: minuteCount / 60,
            minute: minuteCount,//每分钟操作几次
            tenMinute: minuteCount * 10,//每分钟操作几次
            hour: minuteCount * 60,//每小时操作几次
        }

        return {
            allFre: allFre,
            hourFre: hourFre,
            tenMinuteFre: tenMinuteFre,
            minuteFre: minuteFre
        }
    },

    //关键词拆分
    splitKeyword(keyword) {
        keyword = keyword.replace(/，/g, ',');
        keyword = keyword.split(',');
        let ks = [];
        for (let i in keyword) {
            let tmp = keyword[i];
            if (keyword[i].indexOf('&') !== -1) {
                tmp = keyword[i].split('&');
            } else if (keyword[i].indexOf('+') !== -1) {
                tmp = keyword[i].split('+');
            }
            ks.push(tmp);
        }
        return ks;
    },

    containsWord(contain, title) {
        contain = this.splitKeyword(contain);
        for (let con of contain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return [con];
            }

            if (typeof (con) === 'object') {
                let _true = true;
                for (let i in con) {
                    if (title.indexOf(con[i]) === -1) {
                        _true = false;
                    }
                }
                if (_true) {
                    return con;
                }
            }
        }
        return false;
    },

    noContainsWord(noContain, title) {
        noContain = this.splitKeyword(noContain);
        for (let con of noContain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return false;
            }

            if (typeof (con) === 'object') {
                let len = 0;
                for (let i in con) {
                    if (title.indexOf(con[i]) !== -1) {
                        len++;
                    }
                }
                if (len === con.length) {
                    return false;
                }
            }
        }
        return noContain;
    },

    playAudio(file) {
        media.playMusic(file);
    },
}


const DyUser = {
    //保证执行的时候在哪个页面，执行完成也是哪个界面
    //返回false是失败，true是成功，-1是被封禁
    privateMsg(msg) {
        if (Common.id('title').text('私密账号').findOnce()) {
            Common.log('私密账号');
            return false;
        }

        let settingTag = Common.id('srb').desc('更多').filter((v) => {
            return v && v.bounds() && v.bounds().top && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().left > 0;
        }).findOnce();

        if (!settingTag) {
            Common.log('找不到setting按钮');
            return false;
        }

        let clickCount = 3;
        let sendTag;
        while (clickCount--) {
            if (clickCount === 2 || !Common.id('cancel_btn').findOnce()) {
                Common.click(settingTag);
                Common.sleep(1000);
                if (clickCount !== 2) {
                    Common.log('找不到发私信按钮，重试 -_-');
                }
                settingTag = Common.id('srb').desc('更多').findOnce();
                continue;
            }

            sendTag = Common.id('desc').text('发私信').findOnce();
            if (!sendTag) {
                sendTag = Common.id('desc').text('发私信').findOnce();
                Common.log('找不到发私信按钮，重试');
                Common.sleep(500);
                continue;
            }
        }

        if (!sendTag) {
            Common.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag.parent());
        Common.sleep(1500);

        let textTag = Common.id('mas').findOnce();
        if (!textTag) {
            Common.log('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            Common.back();
            return false;
        }
        Common.click(textTag);

        textTag = Common.id('mas').findOnce();
        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            textTag.setText(input);
            Common.sleep(100 + Math.random() * 200);
        }

        Common.sleep(1000);
        let sendTextTag = Common.id('j2').findOnce();
        if (!sendTextTag) {
            Common.log('发送消息失败');
            return false;
        }

        Common.click(sendTextTag);
        Common.sleep(1000);
        let closePrivateMsg = Common.id('mxi').textContains('私信功能已被封禁').findOne(1000);
        if (closePrivateMsg) {
            Common.sleep(Math.random() * 1000);
            Common.back(2);
            return -1;
        }
        Common.sleep(Math.random() * 1000);
        Common.back(2);
        return true;
    },

    getNickname() {
        //一般用户
        let i = 3;
        while (i--) {
            let nickname = Common.id('msy').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0;
            }).findOnce();
            if (nickname && nickname.text()) {
                return nickname.text().replace("，复制名字", '');
            }
            Common.sleep(200);
        }

        throw new Error('找不到昵称');
    },

    //机构 媒体等账号 公司
    isCompany() {
        if (Common.id('vrv').findOnce()) {
            return true;
        }

        if (Common.id('vjf').findOnce()) {
            return false;
        }

        return false;
        //throw new Error('找不到是不是公司标签');
    },

    getDouyin() {
        let douyin = Common.id('vjf').findOnce();
        if (douyin && douyin.text()) {
            return douyin.text().replace("抖音号：", '');
        }

        //官方账号等等
        douyin = Common.id('vrv').findOnce();
        if (douyin && douyin.text()) {
            return douyin.text();
        }

        douyin = Common.id('a2h').findOnce();//优质电商作者
        if (douyin && douyin.text()) {
            return douyin.text();
        }

        throw new Error('找不到抖音号');//
    },

    getZanCount() {
        let zan = Common.id('vq0').findOnce();
        if (!zan || !zan.text()) {
            throw new Error('找不到赞');
        }

        return Common.numDeal(zan.text());
    },

    getFocusCount() {
        let focus = Common.id('vq3').findOnce();
        if (!focus || !focus.text()) {
            throw new Error('找不到关注');
        }

        return Common.numDeal(focus.text());
    },

    getFansCount() {
        let fans = Common.id('vq7').findOnce();
        if (!fans || !fans.text()) {
            throw new Error('找不到粉丝');
        }

        return Common.numDeal(fans.text());
    },

    getIntroduce() {
        let tags = Common.getTags(Common.id('nep').findOnce().children().find(textMatches(/[\s\S]+/)));
        let text = '';
        if (!tags) {
            return text;
        }
        for (let i in tags) {
            if (tags[i].text().indexOf('IP：') === 0) {
                continue;
            } else if (/^[\d]+岁$/.test(tags[i].text())) {
                continue;
            } else if (tags[i].text() === '男' || tags[i].text() === '女') {
                continue;
            }
            text += "\n" + tags[i].text();
        }
        return text.substring(1);
    },

    getIp() {
        let tags = Common.getTags(Common.id('nep').findOnce().children().find(textMatches(/[\s\S]+/)));
        let text = '';
        if (!tags) {
            return text;
        }
        for (let i in tags) {
            if (tags[i].text().indexOf('IP：') === 0) {
                return tags[i].text().replace('IP：', '');
            }
        }
        return text;
    },

    getAge() {
        let tags = Common.getTags(Common.id('nep').findOnce().children().find(textMatches(/[\s\S]+/)));
        let text = 0;
        if (!tags) {
            return text;
        }
        for (let i in tags) {
            if (/^[\d]+岁$/.test(tags[i].text())) {
                return tags[i].text().replace('岁', '');
            }
        }
        return text;
    },

    getWorksTag() {
        let tags = textMatches(/作品 [\d]+/).findOnce();//rj5 或者 ptm
        if (!tags || tags.length === 0) {
            return {
                text: function () {
                    return 0;
                }
            }
        }
        return tags;
    },

    getWorksCount() {
        let tag = this.getWorksTag();
        return Common.numDeal(tag.text());
    },

    openWindow() {
        //let file = textMatches(/[\d]+件好物/).findOnce();
        let tag = Common.id('nee').findOnce();
        if (!tag) {
            return false;
        }
        return tag.children().findOne(text('进入橱窗')) ? true : false;
    },

    //比较耗时，需要优化
    //比较耗时，需要优化
    getGender() {
        let genderTag = clickable(false).descContains('男').findOnce();
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 1;
        }

        genderTag = clickable(false).descContains('女').findOnce();
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 2;
        }

        return 3;
    },

    //是否是私密账号
    isPrivate() {
        if (Common.id('title').text('私密账号').findOnce() ? true : false) {
            return true;
        }

        //帐号已被封禁
        if (Common.id('ssm').textContains('封禁').findOnce()) {
            return true;
        }

        //注销了
        if (Common.id('tv_title').textContains('账号已经注销').findOnce()) {
            return true;
        }
        return false;
    },

    isTuangouTalent() {
        let tag = Common.id('nee').findOnce();
        if (!tag) {
            return false;
        }

        return tag.children().findOne(text('团购推荐')) ? true : false;
    },

    isFocus() {
        let hasFocusTag = Common.id('olb').text('已关注').findOnce() || Common.id('olb').text('互相关注').findOnce();
        if (hasFocusTag) {
            return true;
        }
        return false;
    },

    focus() {
        let focusTag = Common.id('ola').findOnce();//.text('关注')  .text('回关')
        if (focusTag) {
            Common.click(focusTag);
            return true;
        }

        let hasFocusTag = Common.id('olb').text('已关注').findOnce() || Common.id('olb').text('互相关注').findOnce();
        if (hasFocusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    cancelFocus() {
        let hasFocusTag = Common.id('olb').findOnce();//text(已关注) || text(相互关注)
        if (hasFocusTag) {
            hasFocusTag.click();
            Common.sleep(500);

            //真正地点击取消
            let cancelTag = Common.id('j-z').text('取消关注').findOnce();
            if (!cancelTag || cancelTag.bounds().top > device.height - 200) {
                let x = Math.random() * 500 + 100;
                swipe(x, device.height / 2, x, 200, 200);
                Common.sleep(1000);
                cancelTag = Common.id('j-z').text('取消关注').findOnce();
                if (!cancelTag) {
                    throw new Error('取消关注的核心按钮找不到');
                }
                Common.click(cancelTag);
                Common.sleep(1000 + Math.random() * 500);
                let cancelTag = Common.id('bfr').text('取消关注').findOne(1000);
                if (cancelTag) {
                    Common.click(cancelTag);
                }
            } else {
                Common.click(cancelTag);
            }
        }

        //私密账号的问题修复
        let privateMsgTag = Common.id('bfr').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height;
        }).findOnce();
        if (privateMsgTag) {
            Common.click(privateMsgTag);
            Common.sleep(500);
        }

        let focusTag = Common.id('ola').findOnce();//.text('关注') 或者回关
        if (focusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    getUserInfo() {
        let res = {};
        res = {
            nickname: this.getNickname(),
            douyin: this.getDouyin(),
            age: this.getAge() || 0,
            // introduce: this.getIntroduce(),
            // zanCount: this.getZanCount(),
            // focusCount: this.getFocusCount(),
            // fansCount: this.getFansCount(),
            worksCount: 0,
            // openWindow: 0,//开启橱窗
            // tuangouTalent: this.isTuangouTalent(),
            // ip: this.getIp(),
            // isCompany: this.isCompany(),//是否是机构 公司
            gender: this.getGender(),
        };

        if (this.isPrivate()) {
            return res;
        }

        let newRes = {
            worksCount: this.getWorksCount(),
            // openWindow: this.openWindow(),
        };

        for (let i in newRes) {
            res[i] = newRes[i];
        }
        return res;
    },

    contents: [],
    cancelFocusList() {
        let focus = Common.id('vq6').findOnce();
        if (!focus) {
            throw new Error('找不到关注');
        }

        click(focus.bounds().centerX(), focus.bounds().centerY());
        Common.sleep(2000);

        let focusCountTag = Common.id('u+m').findOnce();
        if (!focusCountTag) {
            throw new Error('找不到focus');
        }

        let focusCount = Common.numDeal(focusCountTag.text());
        if (focusCount === 0) {
            return true;
        }

        let errorCount = 0;
        let loop = 0;
        let arr = [];
        while (true) {
            let containers = Common.id('root_layout').filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height - 300;
            }).find();

            if (containers.length === 0) {
                errorCount++;
                log('containers为0');
            }

            arr.push(JSON.stringify(containers));
            if (arr.length > 2) {
                arr.shift();
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }
                let titleTag = containers[i].children().findOne(Common.id('vad'));
                if (!titleTag || this.contents.includes(titleTag.text())) {
                    continue;
                }

                log(this.contents.length, this.contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                let titleBarTag = Common.id('title_bar').findOnce();
                if (titleBarTag && titleTag.bounds().top <= titleBarTag.bounds().top + titleBarTag.bounds().height()) {
                    continue;
                }

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                let hasFocusTag = containers[i].children().findOne(Common.id('bh5'));
                if (!hasFocusTag) {
                    continue;
                }

                //第一种机型
                if (hasFocusTag.text() === '已关注') {
                    let setting = containers[i].children().findOne(Common.id('l-k'));
                    if (!setting) {
                        log('找不到focus setting-1');
                        errorCount++;
                        continue;
                    }

                    setting.click();
                    Common.sleep(1000);

                    let cancelTag = Common.id('title').text('取消关注').filter((v) => {
                        return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height;
                    }).findOnce();
                    Common.click(cancelTag);
                } else if (hasFocusTag.text() !== '相互关注' && hasFocusTag.text() !== '关注') {
                    //既不是“已关注”也不是“相互关注” 还不是“关注”  适配老机型
                    let setting = containers[i].children().findOne(Common.id('l-k'));
                    if (!setting) {
                        errorCount++;
                        log('找不到focus setting');
                        continue;
                    }

                    Common.click(titleTag);
                    Common.sleep(1000);

                    let focusTag = Common.id('olb').text('已关注').findOnce();
                    if (!focusTag) {
                        Common.back();
                        this.contents.push(nickname);
                        continue;
                    }

                    errorCount = 0;
                    this.cancelFocus();
                    Common.sleep(1500);
                    Common.back();
                }

                this.contents.push(nickname);
                Common.sleep(500);
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            log('滑动');
            Common.swipeFocusListOp();
            Common.sleep(1500);

            if (arr[0] === arr[1]) {
                loop++;
            } else {
                loop = 0;
            }

            if (loop >= 3) {
                return true;
            }
        }
    },

    //type=0关注截流，type=1粉丝截流
    focusUserList(type, getMsg, DyVideo, DyComment, machine, settingData, contents) {
        let account;
        if (settingData && settingData.account) {
            account = settingData.account
        } else {
            account = settingData
        }

        let times = 3;
        while (times--) {
            if (type === 0) {
                let focus = Common.id('vq3').findOnce();
                if (!focus) {
                    throw new Error('找不到关注');
                }

                Common.click(focus);
                Common.sleep(2000);
                focus = Common.id('vq3').findOnce();
                if (focus) {
                    continue;
                }
                break;
            } else {
                let fans = Common.id('vq7').findOnce();
                if (!fans) {
                    throw new Error('找不到粉丝');
                }

                Common.click(fans);
                Common.sleep(2000);
                fans = Common.id('vq7').findOnce();
                if (fans) {
                    continue;
                }
                break;
            }
        }

        if (times <= 0) {
            dialogs.alert(type === 0 ? '关注列表都已操作' : '粉丝列表都已操作');
            return false;//设置了隐私，不能操作
        }

        let topTag = Common.id('r5j').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOnce();

        let top = (topTag && (topTag.bounds().top + topTag.bounds().height())) || 400;
        let errorCount = 0;
        let loop = 0;
        let arr = [];
        while (true) {
            let containers = Common.id('root_layout').filter((v) => {
                return v && v.bounds() && v.bounds().top > top && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
            }).find();

            if (containers.length === 0) {
                errorCount++;
                log('containers为0');
            }

            arr.push(JSON.stringify(containers));
            if (arr.length >= 3) {
                arr.shift();
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }
                let titleTag = containers[i].children().findOne(Common.id('vad'));
                if (!titleTag || contents.includes(titleTag.text())) {
                    continue;
                }

                if (containers[i].children().findOne(Common.id('pm2'))) {
                    //rp++;//是自己（从自己的粉丝页面搜索进入之后，第一个用户很可能是自己）
                    continue;
                }

                log(contents.length, contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                if (machine.get('task_dy_toker_focus_' + account + '_' + nickname)) {
                    log('重复');
                    continue;
                }

                //进入用户首页
                let intoUserCount = 3;
                while (intoUserCount--) {
                    Common.click(titleTag);
                    Common.sleep(1500 + 1000 * Math.random());
                    try {
                        this.getNickname();
                    } catch (e) {
                        log('点击进入失败', e);
                        continue;
                    }
                    break;
                }

                if (this.isPrivate()) {
                    log('私密账号');
                    machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let worksCount = this.getWorksCount() * 1;
                if (worksCount < settingData.worksMinCount * 1 || worksCount > settingData.worksMaxCount * 1) {
                    log('作品数不符合', worksCount, settingData.worksMinCount, settingData.worksMaxCount);
                    machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let fansCount = 0;

                try {
                    fansCount = this.getFansCount() * 1;
                } catch (e) {
                    log(e);
                    continue;
                }

                if (fansCount < settingData.fansMinCount * 1 || fansCount > settingData.fansMaxCount * 1) {
                    log('粉丝数不符合', fansCount, settingData.fansMinCount, settingData.fansMaxCount);
                    machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                if (Math.random() * 100 <= settingData.focusRate * 1) {
                    this.focus();
                }

                if (Math.random() * 100 <= settingData.privateRate * 1) {
                    this.privateMsg(getMsg(1, nickname, this.getAge(), this.getGender()).msg);
                }

                let commentRate = Math.random() * 100;
                let zanRate = Math.random() * 100;

                if ((commentRate <= settingData.commentRate * 1 || zanRate <= settingData.zanRate * 1) && DyVideo.intoUserVideo()) {
                    if (zanRate <= settingData.zanRate * 1) {
                        !DyVideo.isZan() && DyVideo.clickZan();
                    }

                    if (commentRate <= settingData.commentRate * 1) {
                        let videoTitle = DyVideo.getContent();
                        DyVideo.openComment(!!DyVideo.getCommentCount());
                        DyComment.commentMsg(getMsg(0, videoTitle).msg);
                        Common.back(1, 800);
                    }

                    Common.back(1, 800);
                }

                machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                settingData.opCount--;
                if (settingData.opCount <= 0) {
                    return true;
                }

                Common.back(1, 800);
                contents.push(nickname);
                if (Common.id('srb').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0;
                }).findOnce()) {
                    Common.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
                }
                Common.sleep(500 + 500 * Math.random());
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            log('滑动');
            type === 1 ? Common.swipeFansListOp() : Common.swipeFocusListOp();
            Common.sleep(1500);

            if (arr[0] === arr[1]) {
                loop++;
            } else {
                loop = 0;
            }
            log('loop', loop);

            if (loop >= 3) {
                return true;
            }
        }
    },

    //进入关注列表 我的，不是其他的关注列表
    intoFocusList() {
        let fans = Common.id('vq7').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        if (!fans) {
            throw new Error('找不到关注列表');
        }

        if (fans.text() == 0) {
            return false;
        }

        click(fans.bounds().centerX(), fans.bounds().centerY());
        Common.sleep(2000);

        let focusCountTag = Common.id('u+m').findOnce();
        if (!focusCountTag) {
            throw new Error('找不到focusCountTag');
        }

        let focusCount = Common.numDeal(focusCountTag.text());
        if (focusCount === 0) {
            return false;
        }
        return true;
    },

    focusListSearch(keyword) {
        let searchBox = Common.id('fh4').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        Common.click(searchBox);
        Common.sleep(1000 + 1000 * Math.random());

        searchBox = Common.id('fh4').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        searchBox.setText(keyword);

        let nickTag = Common.id('vad').text(keyword).findOnce();//昵称查找
        log('nickTag', nickTag);
        if (!nickTag) {
            nickTag = Common.id('txt_desc').textContains(keyword).findOnce();//账号查找
            if (!nickTag) {
                return false;
            }
        }

        Common.click(nickTag);
        Common.sleep(3000);
        return true;
    },

    //粉丝回访
    viewFansList(nicknames) {
        let fans = Common.id('vqw').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        if (!fans) {
            throw new Error('找不到粉丝');
        }

        click(fans.bounds().centerX(), fans.bounds().centerY());
        Common.sleep(2000);

        let fansCountTag = Common.id('t4p').findOnce();
        if (!fansCountTag) {
            throw new Error('找不到fans');
        }

        let fansCount = Common.numDeal(fansCountTag.text());
        if (fansCount === 0) {
            return true;
        }

        let errorCount = 0;
        let contents = [];
        let loop = 0;
        while (true) {
            let containers = Common.id('root_layout').filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height - 200;
            }).find();

            if (containers.length === 0) {
                errorCount++;
                log('containers为0');
            }

            let rp = 0;
            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }
                let titleTag = containers[i].children().findOne(Common.id('vad'));
                if (!titleTag || contents.includes(titleTag.text())) {
                    rp++;
                    continue;
                }

                log(contents.length, contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                if (nicknames.includes(nickname)) {
                    continue;
                }

                let titleBarTag = Common.id('title_bar').findOnce();
                if (titleBarTag && titleTag.bounds().top <= titleBarTag.bounds().top + titleBarTag.bounds().height()) {
                    continue;
                }

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                let rp = 3;
                while (rp--) {
                    Common.click(titleTag);
                    Common.sleep(1000);
                    titleTag = containers[i].children().findOne(Common.id('vad'));
                    if (titleTag) {
                        continue;
                    }
                    Common.sleep(4000 * Math.random() + 2500);
                    Common.back();
                    Common.sleep(500);
                    break;
                }
                nicknames.push(nickname);
                contents.push(nickname);
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            log('滑动');
            Common.swipeFansListOp();
            Common.sleep(500);
            log(rp, containers.length);
            if (rp === containers.length) {
                loop++;
            } else {
                loop = 0;
            }
            if (loop >= 3) {
                return true;
            }
        }
    },

    getStep(oldArr, newArr) {
        // log(oldArr, newArr);
        if (newArr.length === 0) {
            return oldArr.length;
        }

        let some = [];
        for (let i in newArr) {
            for (let j in oldArr) {
                if (oldArr[j] === newArr[i]) {
                    let kk = [];
                    for (let k = i; k < newArr.length; k++) {
                        if (oldArr[k * 1 - i * 1 + j * 1] === newArr[k]) {
                            kk.push(newArr[k]);
                            continue;
                        }
                        break;
                    }

                    if (kk.length) {
                        some.push(kk);
                    }
                }
            }
        }

        let max = [];
        for (let i in some) {
            if (some[i].length > max.length) {
                max = some[i];
            }
        }

        return oldArr.length - max.length;
    },

    gotoIndex(index, idName) {
        if (!idName) {
            idName = 'vad';//走到关注的第几位
        }

        let newArr = [];
        let oldArr = [];
        let currentIndex = 0;
        let rp = 0;

        while (true) {
            let tags = Common.id(idName).filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
            }).find();

            for (let i in tags) {
                if (isNaN(i)) {
                    continue;
                }

                oldArr.push(tags[i].text());
            }

            let step = this.getStep(oldArr, newArr);
            log('step', step, rp);
            if (step === 0) {
                rp++;
            } else {
                rp = 0;
            }

            if (rp >= 3) {
                return false;
            }

            currentIndex += step;
            log(currentIndex, step, index);
            if (currentIndex >= index) {
                return true;
            }
            newArr = JSON.parse(JSON.stringify(oldArr));
            oldArr = [];
            swipe(300, 2000, 300, 1200, 500);
            Common.sleep(2000 + 1000 * Math.random());
        }
    },

    fucosUserOp(DyVideo, DyComment, blackUsers, msg, cancelFocus, getData, setData, gotoIndex, updateUser, opUsers) {
        if (!this.intoFocusList()) {
            log('没有粉丝');
            return false;
        }

        if (!Common.id('uh+').textContains('最早关注').findOnce()) {
            log('排序不正确');
            return false;
        }

        if (!gotoIndex()) {
            log('粉丝数量不足');
            return false;
        }

        let errorCount = 0;
        let loop = 0;
        let arr = [];
        let userData = {};

        while (true) {
            let containers = Common.id('root_layout').filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height - 300;
            }).find();

            if (containers.length === 0) {
                errorCount++;
                log('containers为0');
            }

            arr.push(JSON.stringify(containers));
            if (arr.length > 2) {
                arr.shift();
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }

                let titleTag = containers[i].children().findOne(Common.id('vad'));
                if (!titleTag || this.contents.includes(titleTag.text())) {
                    continue;
                }

                log(this.contents.length, this.contents.includes(titleTag.text()));
                let nickname = titleTag.text();
                Common.click(titleTag);
                Common.sleep(3000);

                userData = this.getUserInfo();
                if (opUsers.includes(userData.douyin)) {
                    Common.back();
                    log('已处理');
                    Common.sleep(800);
                    continue;
                }

                if (blackUsers.includes(userData.douyin)) {
                    this.cancelFocus();
                    cancelFocus(userData.douyin);
                    setData('decFocusCount', (getData('decFocusCount') || 0) + 1);
                    Common.sleep(1500);
                    Common.back();
                    Common.sleep(800);
                    continue;
                }

                //开始进入视频评论
                if (DyVideo.intoUserVideo()) {
                    if (DyVideo.clickZanForNewVideo(4)) {
                        //随机对前4个没有操作的视频进行点赞和评论，以及点赞评论区
                        userData.isZan = true;
                        let msgData = msg(nickname);
                        DyComment.commentMsg(msgData.msg);
                        Common.sleep(2000 + 2000 * Math.random());
                        userData.commentMsg = msgData.msg;
                        userData.isComment = true;
                        setData('commentCount', (getData('commentCount') || 0) + 1);
                    }
                    Common.back(1, 800);
                }

                let res = updateUser(userData);
                //此时要取消关注
                if ((res && res.success && res.data.cancelFocus) || (res && !res.success)) {
                    log('取消关注');
                    this.cancelFocus();
                }

                Common.back(1, 800);
                this.contents.push(nickname);
                opUsers.push(userData.douyin);
                //这里有特殊要求，如果长度大于15，直接砍掉，避免大量相同的账号
                if (this.contents.length > 15) {
                    this.contents.shift();
                }
                Common.sleep(500);
            }

            if (errorCount >= 3) {
                if (id('android:id/text1').text('关注').selected(true).exists()) {
                    log('完成了');
                    return true;
                }
                throw new Error('遇到3次错误');
            }

            log('滑动', arr[0] === arr[1], loop, arr);
            Common.swipeFocusListOp();
            Common.sleep(1500);

            if (arr[0] === arr[1]) {
                loop++;
            } else {
                loop = 0;
            }

            if (loop >= 3) {
                log('完成了-');
                return true;
            }
        }
    }
}











let aa = [];
this.contents = [];

function getAccounts(account){
    return aa[account]
}

function setAccount(account){
    aa[account] = 1
}

log('开始执行用户列表');
let textTag = Common.id('r5j').filter((v) => {
    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
}).findOnce();
let rpCount = 0;
let arr = [];
let errorCount = 0;
log('textTag', textTag);

let jj =  100;
while (jj--) {
    let tags = className('android.widget.FrameLayout').focusable(true).filter((v) => {
        return v && v.bounds() && v.bounds().left === 0 && v.bounds().top > textTag.bounds().top + textTag.bounds().height() && v.bounds().top + v.bounds().height() < device.height && !!v.children() && !!v.children().findOne(textContains('粉丝'));
    }).find();
    log('tags', tags.length);

    if (tags.length === 0) {
        errorCount++;
        log('containers为0');
    }

    arr.push(JSON.stringify(tags));
    if (arr.length >= 3) {
        arr.shift();
    }

    for (let i in tags) {
        if (isNaN(i)) {
            continue;
        }

        let child = tags[i].children().findOne(textContains('粉丝'));
        if (!child || !child.text() || !child.bounds() || child.bounds().left < 0 || child.bounds().width() < 0 || child.bounds().top < 0 || child.bounds().height() < 0 || child.bounds().height() + child.bounds().top > device.height) {
            continue;
        }

        if(child.bounds().top <= textTag.bounds().top + textTag.bounds().height()){
            continue;
        }

        let text = child.text().split(/[,|，]/);
        let account = text[2].replace('抖音号：', '').replace('按钮', '');
        log(account, 'account');

        if (!account || this.contents.includes(account) || getAccounts(account)) {
            continue;
        }

        log('child', child, tags[i]);

        try {
            Common.click(child);//部分机型超出范围
        } catch (e) {
            continue;
        }
        Common.sleep(2000 + 1000 * Math.random());

        //看看有没有视频，有的话，操作评论一下，按照20%的频率即可
        let isPrivateAccount = DyUser.isPrivate();
        Common.log('是否是私密账号：' + isPrivateAccount);
        if (isPrivateAccount) {
            Common.back();
            Common.sleep(500);
            setAccount(account);
            this.contents.push(account);
            continue;
        }

        setAccount(account);
        console.log(account, getAccounts(account));
        this.contents.push(account);
        Common.back(1, 800);//用户页到列表页
        if (Common.id('srb').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0;
        }).findOnce()) {
            Common.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
        }

        Common.sleep(500 + 500 * Math.random());
    }

    if (errorCount >= 3) {
        throw new Error('遇到3次错误');
    }

    if (arr[0] === arr[1]) {
        rpCount++;
    } else {
        rpCount = 0;
    }
    log('rpCount', rpCount);
    Common.swipeSearchUserOp();
    Common.sleep(2000 + 1000 * Math.random());
}