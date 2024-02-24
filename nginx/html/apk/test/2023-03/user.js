
const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
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

    stopApp() {
        if (app.openAppSetting('com.ss.android.ugc.aweme')) {
            this.sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            while (!click(p.centerX(), p.centerY()));
            this.sleep(1000);
            p = text('确定').findOne(3000) || text('强行停止').findOne(3000);
            if (p) {
                p = p.bounds();
            }
            while (!click(p.centerX(), p.centerY()));
            this.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    click(tag, rate) {
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * rate + Math.random() * (tag.bounds().width() * p);
        let height = tag.bounds().height() * rate + Math.random() * (tag.bounds().height() * p);

        try {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } catch (e) {
            this.log(e);
            try {
                click(tag.bounds().left + width, tag.bounds().top);
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
        if (currentPackage() !== cStorage.getPackage()) {
            launch(cStorage.getPackage());
            this.sleep(1500);
        }

        return launch('com.ss.android.ugc.aweme');
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
        this.logs.push(str);
        if (this.logs.length > 20) {
            threads.start(() => {
                console.log(JSON.stringify(this.logs));
                cHttp.post('dke', 'log', { desc: JSON.stringify(this.logs) });
                this.logs = [];
            });
        }

    },

    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }
        while (i--) {
            back();
            if (!time) {
                this.sleep(300 + Math.random() * 400);
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
        return text[0];
    },
    closeApp() {
        let mDevice = files.read('/sdcard/dke/device.json');
        if (mDevice) {
            mDevice = JSON.parse(mDevice);
        }

        if (mDevice && mDevice['mobileStopType'] * 1 === 1) {
            this.stopApp();
            return true;
        }

        home();
        this.sleep(1000);
        recents();
        this.sleep(1000);
        let dy = text('抖音').boundsInside(0, 0, device.width, device.height / 2).clickable(false).findOne(2000);
        if (!dy) {
            dy = descContains('抖音').boundsInside(0, 0, device.width, device.height).findOne(2000);
        }

        //部分机型width为负数
        if (!dy || dy.bounds().width() < 0) {
            return this.stopApp();
        }

        let btm = device.height * (0.5 + Math.random() * 0.1);
        let lf = 300 * Math.random();
        swipe(device.width / 2 - 150 + lf, btm, device.width / 2 - 150 + lf, device.height * (0.1 + 0.05 * Math.random()), 100 + 200 * Math.random());//从下往上推，清除
        this.sleep(1000);
        this.back();
        return true;
    },

    //关闭弹窗
    closeAlert() {
        return threads.start(() => {
            this.log('开启线程监听弹窗');
            while (true) {
                try {
                    if (text("稍后").exists()) {
                        text("稍后").findOne(2000).click();
                    }
                    if (text("以后再说").exists()) {
                        text("以后再说").findOne(2000).click();
                    }
                    if (text("我知道了").exists()) {
                        text("我知道了").findOne(2000).click();
                    }
                    if (text("下次再说").exists()) {
                        text("下次再说").findOne(2000).click();
                    }
                    if (text("满意").exists()) {
                        let a = text("满意").clickable(true).findOne(2000);
                        if (a) {
                            a.click();
                        }
                    }

                    if (text("不感兴趣").exists()) {
                        let a = text("不感兴趣").clickable(true).findOne(2000);
                        if (a) {
                            a.click();
                        }
                    }

                    if (text("好的").exists()) {
                        let a = text("好的").clickable(true).findOne(2000);
                        if (a) {
                            a.click();
                        }
                    }

                    if (text("确定").exists()) {
                        text("确定").findOne(2000).click();
                    }

                    if (this.id('dz7').text("取消").exists()) {
                        text("确定").findOne(2000).click();
                    }

                    if (text("拒绝").exists()) {
                        text("拒绝").findOne(2000).click();
                    }

                    //暂时取消掉
                    // if (this.id('close').boundsInside(0, 0, device.width, device.height / 2).desc('关闭').exists()) {
                    //     //this.id('close').boundsInside(0, 0, device.width, device.height / 2).desc('关闭').findOne(2000).click();
                    // }
                    this.sleep(500);
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
    },

    //一坨时间  换成频率  当前任务频率，当前一小时频率，10分钟频率，1分钟频率
    //特别注意hours参数， 这个参数规定了执行的小时数，不在这里面的时间段不能算进来
    timestampsToFre(timestamps, hours) {
        let firstTime = timestamps[0];//第一次时间戳
        let currentTime = Date.parse(new Date()) / 1000;

        //获取第一次的执行时间   再获取当前时间的小时，  把不在hours里面的小时数计算处理
        let firstHour = (new Date(timestamps[0] * 1000)).getHours();
        let currentHour = (new Date()).getHours();

        let ignoreHourCount = 0;
        //计算最开始到现在  有几个不符合时间的  不符合的拉出去
        for (let i = firstHour; i <= currentHour; i++) {
            if (!hours.includes(i)) {
                ignoreHourCount++;
            }
        }

        //this.log(timestamps.length, (currentTime - firstTime - 3600 * ignoreHourCount));
        let second = Math.round(timestamps.length / (currentTime - firstTime - 3600 * ignoreHourCount) * 10000) / 10000;//每秒操作几次
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
    }
}

const User = {
    //保证执行的时候在哪个页面，执行完成也是哪个界面
    privateMsg(msg) {
        if (Common.id('title').text('私密账号').findOne(2000)) {
            Common.log('私密账号');
            return false;
        }

        let settingTag = Common.id('srb').desc('更多').findOne(2000);
        if (!settingTag) {
            Common.log('找不到setting按钮');
            return false;
        }

        let clickCount = 3;
        let sendTag;
        while (clickCount--) {
            if (clickCount === 2 || !Common.id('cancel_btn').findOne(2000)) {
                Common.click(settingTag);
                Common.sleep(1000);
                if (clickCount !== 2) {
                    Common.log('找不到发私信按钮，重试 -_-');
                }
                settingTag = Common.id('srb').desc('更多').findOne(2000);
                continue;
            }

            sendTag = Common.id('desc').text('发私信').findOne(2000);
            if (!sendTag) {
                sendTag = Common.id('desc').text('发私信').findOne(2000);
                Common.log('找不到发私信按钮，重试');
                continue;
            }
        }

        if (!sendTag) {
            Common.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag.parent());
        Common.sleep(1500);

        let textTag = Common.id('mas').findOne(2000);
        if (!textTag) {
            Common.log('找不到发私信输入框');
            return false;
        }
        Common.click(textTag);

        textTag = Common.id('mas').findOne(2000);
        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            textTag.setText(input);
            Common.sleep(500 + Math.random() * 1000);
        }

        let sendTextTag = Common.id('j2').findOne(2000);
        if (!sendTextTag) {
            Common.log('发送消息失败');
            return false;
        }

        Common.click(sendTextTag);
        Common.sleep(Math.random() * 4 + 2);
        Common.back(2);
        return true;
    },

    getNickname() {
        //一般用户
        let i = 3;
        while (i--) {
            let nickname = Common.id('msy').findOne(2000);
            if (nickname && nickname.text()) {
                return nickname.text().replace("，复制名字", '');
            }
        }

        throw new Error('找不到昵称');
    },

    //机构 媒体等账号 公司
    isCompany() {
        if (Common.id('vrv').findOne(2000)) {
            return true;
        }

        if (Common.id('vjf').findOne(2000)) {
            return false;
        }

        throw new Error('找不到是不是公司标签');
    },

    getDouyin() {
        let douyin = Common.id('vjf').findOne(2000);
        if (douyin && douyin.text()) {
            return douyin.text().replace("抖音号：", '');
        }

        //官方账号等等
        douyin = Common.id('vrv').findOne(2000);
        if (douyin && douyin.text()) {
            return douyin.text();
        }

        throw new Error('找不到抖音号');//
    },

    getZanCount() {
        let zan = Common.id('vq0').findOne(2000);
        if (!zan || !zan.text()) {
            throw new Error('找不到赞');
        }

        return Common.numDeal(zan.text());
    },

    getFocusCount() {
        let focus = Common.id('vq3').findOne(2000);
        if (!focus || !focus.text()) {
            throw new Error('找不到关注');
        }

        return Common.numDeal(focus.text());
    },

    getFansCount() {
        let fans = Common.id('vq7').findOne(2000);
        if (!fans || !fans.text()) {
            throw new Error('找不到粉丝');
        }

        return Common.numDeal(fans.text());
    },

    getIntroduce() {
        let tags = Common.getTags(Common.id('nep').findOne(2000).children().find(textMatches(/[\s\S]+/)));
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
        let tags = Common.getTags(Common.id('nep').findOne(2000).children().find(textMatches(/[\s\S]+/)));
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
        let tags = Common.getTags(Common.id('nep').findOne(2000).children().find(textMatches(/[\s\S]+/)));
        let text = '';
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
        let tags = textMatches(/作品 [\d]+/).findOne(1000);//rj5 或者 ptm
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
        //let file = textMatches(/[\d]+件好物/).findOne(2000);
        let tag = Common.id('nee').findOne(1000);
        if (!tag) {
            return false;
        }
        return tag.children().findOne(text('进入橱窗')) ? true : false;
    },

    //比较耗时，需要优化
    //比较耗时，需要优化
    getGender() {
        let genderTag = clickable(false).descContains('男').findOne(500);
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 1;
        }

        genderTag = clickable(false).descContains('女').findOne(500);
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 2;
        }

        return 3;
    },

    //是否是私密账号
    isPrivate() {
        return Common.id('title').text('私密账号').findOne(1000) ? true : false;
    },

    isTuangouTalent() {
        let tag = Common.id('nee').findOne(1000);
        if (!tag) {
            return false;
        }

        return tag.children().findOne(text('团购推荐')) ? true : false;
    },

    focus() {
        let focusTag = Common.id('ola').text('关注').findOne(2000);
        if (focusTag) {
            Common.click(focusTag);
            return true;
        }

        let hasFocusTag = Common.id('olb').text('已关注').findOne(2000);
        if (hasFocusTag) {
            return true;
        }
        throw new Error('找不到关注和已关注');
    },

    cancelFocus() {
        let hasFocusTag = Common.id('olb').findOne(2000);//text(已关注) || text(相互关注)
        if (hasFocusTag) {
            Common.click(hasFocusTag);
            Common.sleep(500);

            //真正地点击取消
            let cancelTag = Common.id('j-z').text('取消关注').findOne(2000);
            if (!cancelTag || cancelTag.bounds().top > device.height - 200) {
                let x = Math.random() * 500 + 100;
                swipe(x, device.height / 2, x, 200, 200);
                Common.sleep(1000);
                cancelTag = Common.id('j-z').text('取消关注').findOne(2000);
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

        let focusTag = Common.id('ola').findOne(2000);//.text('关注') 或者回关
        if (focusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    getUserInfo() {
        //let res = {};
        let res = {
            nickname: this.getNickname(),
            douyin: this.getDouyin(),
            age: this.getAge() || 0,
            introduce: this.getIntroduce(),
            zanCount: this.getZanCount(),
            focusCount: this.getFocusCount(),
            fansCount: this.getFansCount(),
            worksCount: 0,
            openWindow: 0,//开启橱窗
            tuangouTalent: this.isTuangouTalent(),
            ip: this.getIp(),
            isCompany: this.isCompany(),//是否是机构 公司
            gender: this.getGender(),
        };

        if (this.isPrivate()) {
            return res;
        }

        let newRes = {
            worksCount: this.getWorksCount(),
            openWindow: this.openWindow(),
        };

        for (let i in newRes) {
            res[i] = newRes[i];
        }
        return res;
    },
}

// console.log(User.getUserInfo());

// let closePrivateMsg = Common.id('mxi').textContains('私信功能已被封禁').findOne(1000);

// console.log(closePrivateMsg);

User.cancelFocus();
