const DyCommon = {
    //封装的方法
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    boundsInside(left, top, width, height) {
        return boundsInside(left, top, width, height);
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
            p = text('确定').findOne().bounds();
            while (!click(p.centerX(), p.centerY()));
            this.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    click(tag) {
        let width = Math.floor(Math.random() * (tag.bounds().width() - 2));
        let height = Math.floor(Math.random() * (tag.bounds().height() - 2));

        try {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } catch (e) {
            console.log(e);
            try {
                click(tag.bounds().left + width + 1, tag.bounds().top + 1);
            } catch (e) {
                console.log(e);
                return false;
            }
        }

        this.sleep(500);
        return true;
    },

    openApp() {
        //this.log('openApp');
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
            console.log(e);
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
        let dy = text('抖音').clickable(false).filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0;
        }).findOne(2000);
        if (!dy) {
            dy = descContains('抖音').filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0;
            }).findOne(2000);
        }

        this.log(dy, dy.bounds().width());

        //部分机型width为负数
        if (!dy || dy.bounds().width() < 0) {
            exit();
            return this.stopApp();
        }

        let btm = device.height * (0.5 + Math.random() * 0.1);
        let lf = 300 * Math.random();
        swipe(device.width / 2 - 150 + lf, btm, device.width / 2 - 150 + lf, device.height * (0.1 + 0.05 * Math.random()), 100 + 100 * Math.random());//从下往上推，清除
        this.sleep(1000);
        this.back();
        return true;
    },

    //关闭弹窗
    closeAlert() {
        return threads.start(() => {
            console.log('开启线程监听弹窗');
            while (true) {
                sleep(1000);
                if (text("稍后").exists()) {
                    this.sleep(2000 + Math.random() * 2000);
                    text("稍后").findOne(2000).click();
                }
                if (text("以后再说").exists()) {
                    this.sleep(2000 + Math.random() * 2000);
                    text("以后再说").findOne(2000).click();
                }
                if (text("我知道了").exists()) {
                    this.sleep(2000 + Math.random() * 2000);
                    text("我知道了").findOne(2000).click();
                }
                if (text("下次再说").exists()) {
                    this.sleep(2000 + Math.random() * 2000);
                    text("下次再说").findOne(2000).click();
                }
                if (text("确定").exists()) {
                    this.sleep(2000 + Math.random() * 2000);
                    text("确定").findOne(2000).click();
                }

                if (this.id('dz7').text("取消").exists()) {
                    this.sleep(2000 + Math.random() * 2000);
                    text("确定").findOne(2000).click();
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

    showToast() {
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

        this.log(timestamps.length, ignoreHourCount, (currentTime - firstTime - 3600 * ignoreHourCount) * 10000);
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

let Common = DyCommon;










const DyVideo = {
    next() {
        let left = device.width * 0.3 + device.width * 0.5 * Math.random();
        let top = [device.height * 2 / 3, device.height - 700, device.height / 2 + 100];
        swipe(left, top[Math.round(Math.random() * (top.length - 1))] - 200 * Math.random(), left, 300, 100 + Math.random() * 200);
    },

    getZanTag() {
        let zanTags = Common.getTags(Common.id('d_9').find());
        for (let i in zanTags) {
            if (!zanTags[i]) {
                continue;
            }

            if (zanTags[i].bounds().top < 200 || zanTags[i].bounds().top > device.height) {
                continue;
            }

            return zanTags[i];
        }

        throw new Error('没有找到赞标签');
    },

    getZanCount() {
        let zan = this.getZanTag();
        return Common.numDeal(zan.desc());
    },

    isZan() {
        let zan = this.getZanTag();
        return zan.desc().indexOf('已点赞') !== -1;
    },

    clickZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            Common.click(zanTag);
            return true;
        }
        throw new Error('点赞失败');
    },

    getCommentTag() {
        let commentTags = Common.getTags(Common.id('c7h').find());
        for (let i in commentTags) {
            if (!commentTags[i]) {
                continue;
            }

            if (commentTags[i].bounds().top < 200 || commentTags[i].bounds().top > device.height) {
                continue;
            }

            return commentTags[i];
        }

        throw new Error('没有找到评论标签');
    },

    getCommentCount() {
        let comment = this.getCommentTag();
        return Common.numDeal(comment.desc());
    },

    //评论
    openComment() {
        let comment = this.getCommentTag();
        Common.click(comment);
        Common.sleep(2000 + 2000 * Math.random());
        return true;
    },

    getCollectTag() {
        let collectTags = Common.getTags(Common.id('cyy').find());
        for (let i in collectTags) {
            if (!collectTags[i]) {
                continue;
            }

            if (collectTags[i].bounds().top < 200 || collectTags[i].bounds().top > device.height) {
                continue;
            }

            return collectTags[i];
        }

        throw new Error('没有找到收藏标签');
    },

    getCollectCount() {
        let collect = this.getCollectTag();
        return Common.numDeal(collect.desc());
    },

    collect() {
        let tag = this.getCollectTag();
        return Common.click(tag);
    },

    isCollect() {
        let tag = this.getCollectTag();
        return tag.desc().indexOf('未选中') === -1;
    },

    getShareTag() {
        let shareTags = Common.getTags(Common.id('qw9').find());
        for (let i in shareTags) {
            if (!shareTags[i]) {
                continue;
            }

            if (shareTags[i].bounds().top < 200 || shareTags[i].bounds().top > device.height) {
                continue;
            }

            return shareTags[i];
        }

        throw new Error('没有找到分享标签');
    },

    getShareCount() {
        let share = this.getShareTag();
        return Common.numDeal(share.desc());
    },

    getContentTag() {
        let tags = Common.getTags(Common.id('desc').find());
        for (let i in tags) {
            if (!tags[i] || !tags[i].bounds) {
                continue;
            }
            if (tags[i].bounds().top < 200) {
                continue;
            }
            if (tags[i].bounds().top > device.height) {
                continue;
            }
            return tags[i];
        }

        return false;//极端情况是可以没有内容的
    },

    getContent() {
        let tag = this.getContentTag();
        return tag ? tag.text() : '';
    },

    getTitleTag() {
        let tags = Common.getTags(Common.id('title').find());
        for (let i in tags) {
            if (!tags[i] || !tags[i].bounds) {
                continue;
            }
            if (tags[i].bounds().top < 200) {
                continue;
            }
            if (tags[i].bounds().top > device.height) {
                continue;
            }
            return tags[i];
        }
        throw new Error('找不到标题内容');
    },

    getAtNickname() {
        return this.getTitleTag().text().replace('@', '');
    },

    //是否直播中
    isLiving() {
        //两种方式，一种是屏幕上展示，一种是头像
        let tags = Common.getTags(Common.id('lc-').descContains('点击进入直播间').find());
        for (let i in tags) {
            if (!tags[i] || !tags[i].bounds) {
                continue;
            }
            if (tags[i].bounds().height() <= 0) {
                continue;
            }
            if (tags[i].bounds().top > device.height) {
                continue;
            }
            return true;
        }

        tags = Common.getTags(Common.id('vh2').find());
        for (let i in tags) {
            if (!tags[i] || !tags[i].bounds) {
                continue;
            }
            if (tags[i].bounds().top < 200) {
                continue;
            }
            if (tags[i].bounds().top > device.height) {
                continue;
            }
            return tags[i];
        }
        return false;
    },

    getAvatar() {
        let name = 'user_avatar';
        let tags = Common.getTags(Common.id(name).find());
        for (let i in tags) {
            if (!tags[i] || !tags[i].bounds) {
                continue;
            }
            if (tags[i].bounds().top < 200) {
                continue;
            }
            if (tags[i].bounds().top > device.height) {
                continue;
            }
            return tags[i];
        }
        throw new Error('找不到头像');
    },

    intoUserPage() {
        Common.click(this.getAvatar());
        Common.sleep(2000 + Math.random() * 1000);
    },

    getNickname() {
        let avatar = this.getAvatar();
        return avatar.desc();
    },

    getInfo() {
        return {
            nickname: this.getNickname(),
            title: this.getContent(),
            zanCount: this.getZanCount(),
            commentCount: this.getCommentCount(),
            collectCount: this.getCollectCount(),
            shareCount: this.getShareCount(),
        }
    },

    getProcessBar() {
        return Common.id('v0p').findOne(2000);
    }
}











const DyUser = {
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
        let nickname = Common.id('msy').findOne(2000);
        if (nickname && nickname.text()) {
            return nickname.text().replace("，复制名字", '');
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
        let tags = textMatches(/作品 [\d]+/).findOne(2000);//rj5 或者 ptm
        if (!tags || tags.length === 0) {
            throw new Error('作品数不存在');
        }
        return tags;
    },

    getWorksCount() {
        let tag = this.getWorksTag();
        return Common.numDeal(tag.text());
    },

    openWindow() {
        //let file = textMatches(/[\d]+件好物/).findOne(2000);
        let tag = Common.id('nee').findOne(2000);
        if (!tag) {
            return false;
        }
        return tag.children().findOne(text('进入橱窗')) ? true : false;
    },

    //比较耗时，需要优化
    //比较耗时，需要优化
    getGender() {
        let genderTag = clickable(false).descContains('男').findOne(2000);
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 1;
        }

        genderTag = clickable(false).descContains('女').findOne(2000);
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 2;
        }

        return 3;
    },

    //是否是私密账号
    isPrivate() {
        return Common.id('title').text('私密账号').findOne(2000) ? true : false;
    },

    isTuangouTalent() {
        let tag = Common.id('nee').findOne(2000);
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
        let hasFocusTag = Common.id('olb').text('已关注').findOne(2000);
        if (hasFocusTag) {
            Common.click(hasFocusTag);
            Common.sleep(500);

            //真正地点击取消
            let cancelTag = Common.id('j-z').text('取消关注').findOne(2000);
            if (!cancelTag) {
                throw new Error('取消关注的核心按钮找不到');
            }
            Common.click(cancelTag);
        }

        let focusTag = Common.id('ola').text('关注').findOne(2000);
        if (focusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    getUserInfo() {
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









let Http = {
    getConfig() {
        let json = files.read('/sdcard/dke/device.json');
        json = JSON.parse(json);
        let config = {
            url: json['domain'],
            secret: json['secret'],
            mid: device.getAndroidId(),
        };

        //dev环境判断
        //log('app.versionName', app.versionName);
        if (app.versionName === '6.3.5') {
            // config.url = 'http://192.168.10.9/';
            // config.url = 'http://192.168.43.146/';
        }
        return config;
    },

    post(controller, action, data, type) {
        let config = this.getConfig();
        let url = config.url;
        if (type) {
            console.log(url + controller + '/' + action);
        }

        let params = {
            mid: config.mid,
            token: storage.getToken(),
            data: data ? JSON.stringify(data) : '[]'
        };
        //{'contentType': "application/json"}
        let res = http.post(url + controller + '/' + action, params);
        let result = [];
        try {
            if (type === 1) {
                result = res.body.string();
                console.log(result);
            } else {
                result = res.body.json();
            }
        } catch (e) {
            console.log(e);
        }
        //console.log(params, result);
        return result;
    },

    postFile(controller, action, data, files) {
        let config = this.getConfig();
        if (!files) {
            files = 1;
        }
        var timestamp = Date.parse(new Date()) / 1000;
        let url = config.url_new;
        let content = JSON.stringify({
            mid: config.mid,
            timestamp: timestamp,
            token: md5(config.secret + timestamp),
            data: data
        });

        let res;
        if (files == 2) {
            let params = {};
            for (let k in data.files) {
                params['file' + k] = ['file' + k + '.png', data.files[k]];
            }
            params.content = base64.encode(encodeURIComponent(content));
            res = http.postMultipart(url + controller + '/' + action, params);
        } else {
            res = http.postMultipart(url + controller + '/' + action, {
                content: base64.encode(encodeURIComponent(content)),
                file: open(data.file)
            });
        }

        let result = res.body.json();
        return result;
    },

    updateApp() {
        let config = this.getConfig();
        let params = {
            mid: config.mid,
            token: storage.getToken(),
            version: app.versionCode,
        };

        let str = '';
        for (let i in params) {
            str += '&' + i + '=' + params[i];
        }

        http.get(config.url + 'dke/checkAppVersion?data=' + JSON.stringify(params), {}, function (res) {
            //断网的情况下 更新已存在
            if (res === null) {
                let allFiles = files.listDir('/sdcard/dke/apk/');
                log(allFiles);
                let maxFile = allFiles[0];
                for (let f in allFiles) {
                    if (allFiles[f] > maxFile) {
                        maxFile = allFiles[f];
                    }
                }
                return app.viewFile('/sdcard/dke/apk/' + maxFile);
            }
            res = res.body.json()
            console.log(res);
            if (res.code == 0) {
                let newVersionApk = /[\d\.]+apk/.exec(res.data.url)[0];
                dialogs.confirm("确定更新吗？", "", function (value) {
                    if (value) {
                        //app.openUrl(res.data.url);
                        let fileDir = '/sdcard/dke/apk/' + newVersionApk;
                        files.ensureDir('/sdcard/dke/apk/');
                        threads.start(function () {
                            //在新线程执行的代码

                            //首先查看本地 10分钟内文件是否存在，是的话直接安装
                            if (!files.exists(fileDir)) {
                                let re = http.get(res.data.url);
                                if (re.statusCode != 200) {
                                    return toast('下载失败');
                                }

                                toast('请耐心等待1-2分钟');
                                files.writeBytes(fileDir, re.body.bytes());
                                toast('下载完成');
                            }

                            app.viewFile(fileDir);
                        });
                    }
                });
            } else {
                dialogs.alert(res.msg);
            }
        });
    }
}





let storage = {
    getToken() {
        let storage = storages.create("data");
        return storage.get("token");
    },
    setToken(token) {
        let storage = storages.create("data");
        return storage.put("token", token);
    }
}



































const DyComment = {
    tag: undefined,//当前的tag标签
    containers: [],//本次遍历的内容  主要用于去重
    getAvatarTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id('avatar'));
        }
        return this.tag.children().findOne(Common.id('avatar'));
    },

    getNicknameTag() {
        return this.tag.children().findOne(Common.id('title'));
    },

    getContentTag() {
        return this.tag.children().findOne(Common.id('content'));
    },

    getTimeTag() {
        return this.tag.children().findOne(Common.id('c6t'));
    },

    getIpTag() {
        return this.tag.children().findOne(Common.id('c3y'));
    },

    getBackTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id('pgt'));
        }
        return this.tag.children().findOne(Common.id('pgt'));
    },

    //回复当前评论的评论标签
    getBackCommentTag() {
        return this.tag.children().findOne(Common.id('us4'));
    },

    getZanTag(tag) {
        let zanId = ['d_j', 'jz5'];//华为，oppo
        let resTag;
        for (let name of zanId) {
            if (tag) {
                resTag = tag.children().findOne(Common.id(name));
            } else {
                resTag = this.tag.children().findOne(Common.id(name));
            }
            if (resTag) {
                break;
            }
        }
        if (resTag) {
            return resTag;
        }
        throw new Error('找不到评论点赞，请注意');
    },

    isAuthor() {
        return this.tag.children().findOne(Common.id('c6e').text('作者')) ? true : false;
    },

    getNickname() {
        return this.getNicknameTag().text();
    },

    getContent() {
        let tag = this.getContentTag();
        return tag ? tag.text() : '';
    },

    getZanCount() {
        return Common.numDeal(this.getZanTag().desc());
    },

    isZan() {
        return this.getZanTag().desc().indexOf('已选中') !== -1;
    },

    //data 是getList返回的参数
    clickZan(data) {
        let zanTag = this.getZanTag(data.tag);
        Common.click(zanTag);
        return true;
    },

    getTime() {
        let timestamp = Math.ceil(Date.parse(new Date()) / 1000);
        let incSecond = 0;
        let time = this.getTimeTag();
        if (!time) {
            return 0;
        }

        time = time.text();
        if (time.indexOf('分钟前') !== -1) {
            incSecond = time.replace('分钟前', '') * 60;
        } else if (time.indexOf('小时前') !== -1) {
            incSecond = time.replace('小时前', '') * 3600;
        } else if (time.indexOf('刚刚') !== -1) {
            incSecond = 0;
        } else if (time.indexOf('天前') !== -1) {
            incSecond = time.replace('天前', '') * 86400;
        } else if (time.indexOf('昨天') !== -1) {
            time = time.replace('昨天', '').split(':');
            incSecond = 86400 - time[0] * 3600 - time[1] * 60 + (new Date()).getHours() * 3600 + (new Date()).getMinutes() * 60;
        } else if (/[\d]{2}\-[\d]{2}/.test(time)) {
            time = (new Date()).getFullYear() + '-' + time;
            return (new Date(time)).getTime() / 1000 + ((new Date()).getHours() - 8) * 3600 + (new Date()).getMinutes() * 60;//减去默认的8点
        } else {
            return (new Date(time)).getTime() / 1000;//直接是日期
        }
        return timestamp - incSecond;
    },

    getIp() {
        let tag = this.getIpTag();
        return tag ? tag.text() : '未知';
    },

    getBackCommentCount() {
        let tag = this.getBackCommentTag();
        return tag ? Common.numDeal(tag.desc()) : 0;
    },

    swipeTop() {
        //上滑
        let left = 100 + (device.width - 200) * Math.random();
        let commentWindowTag = Common.id('f95').findOne(2000);
        let commentWindowHeight = commentWindowTag.bounds().height() - 120;
        let commentWindowsTop = commentWindowTag.bounds().top;

        swipe(left, commentWindowsTop + commentWindowHeight * (0.6 + Math.random() * 0.4), left, commentWindowsTop + 300 * Math.random(), 200 + Math.random() * 200);
    },

    getList() {
        let contains = Common.getTags(Common.id('dge').find());
        let contents = [];
        let data = {};
        for (let i in contains) {
            //不需要二次回复的内容
            if (contains[i].bounds().left > 0) {
                continue;
            }

            this.tag = contains[i];
            //console.log(this.tag);
            let time = this.getTime();
            data = {
                tag: contains[i],
                nickname: this.getNickname(),
                content: this.getContent(),
                time: time,
                // date: {
                //     y: (new Date(time * 1000)).getFullYear(),
                //     m: (new Date(time * 1000)).getMonth() + 1,
                //     d: (new Date(time * 1000)).getDate(),
                //     h: (new Date(time * 1000)).getHours(),
                //     i: (new Date(time * 1000)).getMinutes(),
                // },
                ip: this.getIp(),
                zanCount: this.getZanCount(),
                isZan: this.isZan(),
                isAuthor: this.isAuthor(),
                //backCommentCount: this.getBackCommentCount(),//暂时无法获取，不做
            }
            contents.push(data);

            //最底下的  超出了直接continue
            let bottomTag = Common.id('c2u').findOne(2000);
            let bottomTop = bottomTag.bounds().top - 45;//比这个还下面的  直接continue
            if (this.containers.includes(data.nickname + '_' + data.content)) {
                continue;
            }
            if (this.tag.bounds().top + this.tag.bounds().height() > bottomTop) {
                continue;
            }
            this.containers.push(data.nickname + '_' + data.content);
        }
        return contents;
    },
    //这里其实使用back最方便
    closeCommentWindow() {
        let closeTag = Common.id('back_btn').desc('关闭').findOne(2000);
        if (!closeTag) {
            throw new Error('找不到关闭按钮');
        }
        Common.click(closeTag);
        return true;
    },

    //data 是getList返回的参数
    intoUserPage(data) {
        let headTag = this.getAvatarTag(data.tag);
        Common.click(headTag);
        Common.sleep(3000);
    },

    //评论回复
    //data 是getList返回的参数 评论
    backMsg(data, msg) {
        let backTag = this.getBackTag(data.tag);
        Common.click(backTag);
        Common.sleep(1000 + 2000 * Math.random());

        let iptTag = Common.id('c2u').findOne(2000);
        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            iptTag.setText(input);
            Common.sleep(1000 + Math.random() * 3000);//每个字1-4秒
        }
        Common.sleep(Math.random() * 1000);

        let submitTag = Common.id('c49').findOne(2000);
        Common.click(submitTag);
        Common.sleep(2000 * Math.random());
    },

    //视频评论
    commentMsg(msg) {
        let iptTag = Common.id('c2u').findOne(2000);
        Common.click(iptTag);
        Common.sleep(1000 + 2000 * Math.random());

        iptTag = Common.id('c2u').findOne(2000);
        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            iptTag.setText(input);
            Common.sleep(1000 + Math.random() * 3000);//每个字1-4秒
        }
        Common.sleep(Math.random() * 1000);

        let submitTag = Common.id('c49').findOne(2000);
        Common.click(submitTag);
        Common.sleep(2000 * Math.random());
    },

    swipeDown(distance) {
        let left = 100 + (device.width - 200) * Math.random();
        let commentWindowTag = Common.id('f95').findOne(2000);
        let commentWindowHeight = commentWindowTag.bounds().height() - 200;
        let commentWindowsTop = commentWindowTag.bounds().top;
        let rd = commentWindowHeight / 2 + commentWindowHeight * Math.random() * 0.5;

        swipe(left, commentWindowsTop + rd, left, commentWindowsTop + rd + distance * 6, 200 + Math.random() * 100);
    }
}


























let Dy = {
    me: {},//当前账号的信息
    taskConfig: {},
    titles: [],//今日刷视频的所有标题  标题+'@@@'+昵称   保证唯一，从而减少请求后台接口
    videoData: [],//所有视频数据时间
    zanVideoData: [],//当前任务所有的点赞视频时间
    zanCommentData: [],//当前任务所有的点赞评论时间
    commentData: [],//当前任务所有评论的时间
    privateMsgData: [],//当前任务私信的所有的时间
    viewUserPageData: [],//当前任务浏览用户的主页的所有时间
    viewVideoDate: [],//当前用户当前看到的视频时间点
    focusData: [],
    msgCount: 0,//当前账号消息数
    targetVideoCount: 0,//刷到目标视频数量
    videoCount: 0,//刷到视频数量
    provices: [],
    privateClose: false,

    getData(name) {
        return this[name] || undefined;
    },

    getProvinces() {
        if (!this.provices.length) {
            let config = Http.post('dke', 'getProvince', {});
            if (config.code !== 0) {
                return false;
            }
            this.provices = config.data;
        }
        return this.provices;
    },

    //获取任务详情数据
    getTaskConfig() {
        let d = new Date();
        let today = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        if (!this.taskConfig || this.taskConfig.today !== today) {
            let config = Http.post('dke', 'getTaskDetail', { id: this.taskId });
            if (config.code !== 0) {
                return false;
            }
            config.data.today = today;
            this.taskConfig = config.data;
        }
        return this.taskConfig;
    },

    //获取视频，点赞，评论等的频率数据
    getConfig() {
        let dateData = Http.post('dke', 'getDateData', { task_id: this.taskId });
        if (dateData.code !== 0) {
            dialogs.alert('数据请求异常，请重试！');
            return false;
        }

        let res = {
            zanVideoTimestamp: [],
            zanCommentTimestamp: [],
            commentTimestamp: [],
            focusTimestamp: [],
            privateMsgTimestamp: [],
            viewUserPageTimestamp: [],
            videoTimestamp: [],
        }

        res = dateData.data;//res的数据格式如上图所示
        this.videoData = res.videoTimestamp;
        this.zanVideoData = res.zanVideoTimestamp;
        this.zanCommentData = res.zanCommentTimestamp;
        this.commentData = res.commentTimestamp;
        this.privateMsgData = res.privateMsgTimestamp;
        this.viewUserPageData = res.viewUserPageTimestamp;
        this.focusData = res.focusTimestamp;
        return res;
    },

    //获取视频和目标视频数  用于判断是否完成任务
    getTaskVideoData() {
        let dateData = Http.post('dke', 'getTaskVideoData', { task_id: this.taskId });
        if (dateData.code !== 0) {
            dialogs.alert('数据请求异常，请重试！');
            return false;
        }

        let res = {
            videoCount: 0,
            targetVideoCount: 0,
        }

        res = dateData.data;//res的数据格式如上图所示
        this.videoCount = res.videoCount;
        this.targetVideoCount = res.targetVideoCount;
        return res;
    },

    //type 0 评论，1私信
    getMsg(type) {
        let res = Http.post('dke', 'getMsg', { type: type, lib_id: this.taskConfig.lib_id });
        if (res.code !== 0) {
            return false;
        }
        return res.data;
    },

    douyinExist(douyin) {
        let res = Http.post('dke', 'douyinExist', { douyin: douyin });
        if (res.code !== 0) {
            return true;
        }
        return res.data.isExist;
    },

    videoExist(nickname, title) {
        let res = Http.post('dke', 'videoExist', { nickname: nickname, title: title });
        if (res.code !== 0) {
            return true;
        }
        return res.data.isExist;
    },

    getDouyinConfig() {
        let dateData = Http.post('dke', 'getDouyinConfig', { account: this.me.douyin });
        log(dateData);
        if (dateData.code !== 0) {
            dialogs.alert('数据请求异常，请重试！');
            return false;
        }
        this.privateClose = dateData.data.privateClose;
    },

    addDouyinConfig() {
        let config = Http.post('dke', 'addDouyinConfig', { account: this.me.douyin });
        log(config);
        if (config.code !== 0) {
            return false;
        }
        this.privateClose = true;
    },

    //上报视频数据
    postVideoData(videoData, type) {
        videoData.type = type;
        if (type === 0) {
            this.videoCount++;
        } else {
            this.targetVideoCount++;
        }

        let res = Http.post('dke', 'addVideo', {
            task_id: this.taskConfig.id,
            nickname: videoData.nickname,
            title: videoData.title,
            zan_count: videoData.zanCount,
            comment_count: videoData.commentCount,
            collect_count: videoData.collectCount,
            share_count: videoData.shareCount,
            keyword: videoData.containWord,
            no_keyword: videoData.noContainWord,
            watch_second: videoData.watchSecond,
            type: videoData.type,
        });
        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    //上报视频操作数据
    addVideoOp(videoData, type) {
        videoData.type = type;
        let res = Http.post('dke', 'addVideoOp', {
            video_id: videoData.id,
            video_comment_id: videoData.videoCommentId,
            type: videoData.type || 0,
            is_zan: videoData.isZan || 0,
            zan_time: videoData.zanTime || 0,
            is_private_msg: videoData.isPrivateMsg,
            private_msg: videoData.privateMsg,
            is_comment: videoData.isComment || 0,
            comment_msg: videoData.commentMsg || '',
            comment_msg_time: videoData.commentMsgTime || 0,
            msg_time: videoData.msgTime || 0,
            is_focus: videoData.isFocus || 0,
            focus_time: videoData.focusTime || 0,
            task_id: this.taskConfig.id,
        });

        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    //添加视频评论
    addVideoComment(videoData) {
        let res = Http.post('dke', 'addVideoComment', {
            video_id: videoData.id,
            nickname: videoData.nickname || '',
            douyin: videoData.douyin || '',
            keyword: videoData.keyword || '',
            no_keyword: videoData.noKeyword || '',
            province_id: videoData.provinceId || 0,
            in_time: videoData.inTime || 0,
            desc: videoData.desc || '',
        });
        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    addVideoDouyin(videoData) {
        let res = Http.post('dke', 'addVideoDouyin', {
            video_id: videoData.id,
            nickname: videoData.nickname || '',
            douyin: videoData.douyin || '',
            zan_count: videoData.zanCount || 0,
            focus_count: videoData.focusCount || 0,
            fans_count: videoData.fansCount || 0,
            type: videoData.type || 0,
            task_id: this.taskConfig.id,
        });
        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    freCheck(timestamps) {
        let currentTime = Date.parse(new Date()) / 1000;
        if (timestamps.length && timestamps[0] <= currentTime - 86400) {
            let k = 0;
            while (k++ < timestamps.length) {
                if (undefined === timestamps[0]) {
                    break;
                }

                if (timestamps[0] > currentTime - 86400) {
                    break;
                }

                timestamps.splice(0, 1);
            }
        }

        //this.taskConfig.hour 是任务配置的小时数
        return DyCommon.timestampsToFre(timestamps, this.taskConfig.hour);
    },

    getIdByIp(ip) {
        for (let i in this.provices) {
            if (this.provices[i].name.indexOf(ip) !== -1) {
                return this.provices[i].id;
            }
        }
        return 0;
    },

    getIpById(id) {
        for (let i in this.provices) {
            if (this.provices[i].id === id) {
                return this.provices[i].name;
            }
        }
        return '';
    },

    //关注和私信一样 6个档 [0, 2, 3, 4, 5, 6]  每小时
    focusFreCheck(focusLimit) {
        if (focusLimit === 0) {
            return false;
        }

        if (this.focusData.length === 0) {
            return true;
        }

        focusLimit = [0, 2, 3, 4, 5, 6][focusLimit];
        let focusFre = this.freCheck(this.focusData);
        DyCommon.log('关注频率：', focusFre, focusLimit);

        //十分钟频率是否高于1000%
        if (focusFre['tenMinuteFre']['tenMinute'] > focusLimit / 6 * 10) {
            return false;
        }

        //一小时之内不得大于200%
        if (focusFre['hourFre']['hour'] > focusLimit * 2) {
            return false;
        }

        //一小时之内不得大于10%
        if ((new Date()).getTime() / 1000 - this.focusData[0] > 1800 && focusFre['allFre']['hour'] > focusLimit * 1.10) {
            return false;
        }

        return true;
    },

    /**
     * 
      { label: '不点赞视频', value: 0 },
        { label: '小于5%【很安全】', value: 1 },
        { label: '5%-10%【很安全】', value: 2 },
        { label: '10%-15%【很安全】', value: 3 },
        { label: '15%-20%【较安全】', value: 4 },
        { label: '20%-30%【较安全】', value: 5 },
        { label: '30%-40%【不可持续】', value: 6 },
        { label: '大于50%【高危】', value: 7 },
     */
    //点赞频率检查  假设每小时可以超出预期 20%  每10分钟可以超出30%  每分钟可以超出40%  超出太多可能会触发风控
    zanVideoFreCheck(zanVideoLimit) {
        if (zanVideoLimit === 0) {
            return false;
        }

        if (this.zanVideoData.length === 0) {
            return true;
        }

        zanVideoLimit = [
            [],
            [0, 5],
            [5, 10],
            [10, 15],
            [15, 20],
            [20, 30],
            [30, 40],
            [50, 60],
        ][zanVideoLimit];
        zanVideoLimit = (zanVideoLimit[0] + (zanVideoLimit[1] - zanVideoLimit[0]) * Math.random()) / 100;

        let zanFre = this.freCheck(this.zanVideoData);
        let videoFre = this.freCheck(this.videoData);//点赞需要获取视频的频率，再去乘以点赞的频率，即可得到最终的每秒点赞数量

        //console.log(zanVideoLimit, zanFre, videoFre);
        //一分钟之内不得大于20%
        if (zanFre['minuteFre']['minute'] > videoFre['minuteFre']['minute'] * zanVideoLimit * 1.20) {
            return false;
        }

        //十分钟频率是否高于10%
        if (zanFre['tenMinuteFre']['tenMinute'] > videoFre['tenMinuteFre']['tenMinute'] * zanVideoLimit * 1.1) {
            return false;
        }

        //一小时之内不得大于30%
        if (zanFre['hourFre']['hour'] > videoFre['hourFre']['hour'] * zanVideoLimit * 1.30) {
            return false;
        }

        //一小时之内不得大于10%
        if ((new Date()).getTime() / 1000 - this.zanVideoData[0] > 1800 && zanFre['allFre']['hour'] > videoFre['allFre']['hour'] * zanVideoLimit * 1.10) {
            return false;
        }

        return true;
    },

    /**
      { label: '不点赞视频评论', value: 0 },
        { label: '小于10个/小时【很安全】', value: 1 },
        { label: '10-20个/小时【很安全】', value: 2 },
        { label: '20-30个/小时【较安全】', value: 3 },
        { label: '30-40个/小时【较安全】', value: 4 },
        { label: '40-50个/小时【不可持续】', value: 5 },
        { label: '50-60个/小时【不可持续】', value: 6 },
        { label: '大于60个/小时【高危】', value: 7 },
     */
    //zanCommentLimit 大概是1小时60个
    zanCommentFreCheck(zanCommentLimit) {
        if (zanCommentLimit === 0) {
            return false;
        }

        if (this.zanCommentData.length === 0) {
            return true;
        }

        zanCommentLimit = [
            [],
            [0, 10],
            [10, 20],
            [20, 30],
            [30, 40],
            [40, 50],
            [50, 60],
            [60, 70],
        ][zanCommentLimit];
        zanCommentLimit = zanCommentLimit[0] + (zanCommentLimit[1] - zanCommentLimit[0]) * Math.random();

        let zanCommentFre = this.freCheck(this.zanCommentData);
        //console.log(zanCommentFre);
        //一分钟之内不得大于500%
        if (zanCommentFre['hourFre']['minute'] > zanCommentLimit / 60 * 5) {
            return false;
        }

        //十分钟频率是否高于250%
        if (zanCommentFre['hourFre']['tenMinute'] > zanCommentLimit / 6 * 2.5) {
            return false;
        }

        //一小时之内不得大于50%
        if (zanCommentFre['hourFre']['hour'] > zanCommentLimit * 1.50) {
            return false;
        }

        //总共之内不得大于10%
        if ((new Date()).getTime() / 1000 - this.zanCommentData[0] > 1800 && zanCommentFre['allFre']['hour'] > zanCommentLimit * 1.10) {
            return false;
        }

        return true;
    },

    /**
      { label: '不私信用户', value: 0 },
        { label: '低【很安全】', value: 1 },
        { label: '中低【很安全】', value: 2 },
        { label: '中【较安全】', value: 3 },
        { label: '中高【较安全】', value: 4 },
        { label: '高【不可持续】', value: 5 },
     */
    //评论评论检查 6档 [0, 5, 10, 15, 20, 25]  每小时
    commentFreCheck(commentLimit) {
        if (commentLimit === 0) {
            return false;
        }
        commentLimit = commentLimit * 5;

        if (this.commentData.length === 0) {
            return true;
        }
        let commentFre = this.freCheck(this.commentData);
        //十分钟频率是否高于200%
        if (commentFre['tenMinuteFre']['tenMinute'] > commentLimit * 5) {
            return false;
        }

        //一小时之内不得大于50%
        if (commentFre['hourFre']['hour'] > commentLimit * 1.50) {
            return false;
        }

        //总共之内不得大于10%
        if ((new Date()).getTime() / 1000 - this.commentData[0] > 1800 && commentFre['allFre']['hour'] > commentLimit * 1.10) {
            return false;
        }

        return true;
    },

    //返回0正常，其他都不正常
    taskCheck(taskConfig) {
        //查看是否到了时间，没有的话，直接返回flase
        let hour = JSON.parse(taskConfig.hour);
        if (hour.includes((new Date()).getHours())) {
            return 101;//不在任务时间
        }

        if (taskConfig.end_time && taskConfig.end_time <= Date.parse(new Date()) / 1000) {
            return 102;//结束了
        }

        if (this.msgCount >= taskConfig.limit_count && taskConfig.end_type === 3) {
            return 103;//消息数达到了
        }

        if (this.videoCount >= taskConfig.limit_count && taskConfig.end_type === 1) {
            return 104;//任务视频数达到了
        }

        if (this.targetVideoCount >= taskConfig.limit_count && taskConfig.end_type === 2) {
            return 105;//任务目标视频数达到了
        }
        return 0;
    },

    //刷视频频率检查  videoFreLimit 是每小时刷视频个数  一般300每小时
    refreshVideoFreCheck(refresh_video_fre) {
        let fre = [0, 100, 150, 250, 350, 400, 500];
        let refreshVideoLimit = fre[refresh_video_fre];

        if (this.videoData.length === 0) {
            return true;
        }

        let videoFre = this.freCheck(this.videoData);
        log(videoFre);

        //一分钟之内不得大于100%
        if (videoFre['tenMinuteFre']['minute'] > refreshVideoLimit / 60 * 2) {
            return false;
        }

        //十分钟频率是否高于50%
        if (videoFre['tenMinuteFre']['tenMinute'] > refreshVideoLimit / 6 * 1.50) {
            return false;
        }

        //一小时之内不得大于20%
        if (videoFre['hourFre']['hour'] > refreshVideoLimit * 1.20) {
            return false;
        }

        //总计之内不得大于10%
        if ((new Date()).getTime() / 1000 - this.videoData[0] > 1800 && videoFre['allFre']['hour'] > refreshVideoLimit * 1.10) {
            return false;
        }

        return true;
    },

    //私信个数检查 6个档 [0, 2, 3, 4, 5, 6]
    privateMsgFreCheck(privateMsgLimit) {
        if (privateMsgLimit === 0) {
            return false;
        }

        privateMsgLimit = [0, 2, 3, 4, 5, 6][privateMsgLimit];

        if (this.privateMsgData.length === 0) {
            return true;
        }

        let privateMsgFre = this.freCheck(this.privateMsgData);
        //console.log(privateMsgFre, privateMsgLimit);

        //十分钟频率是否高于1000%
        if (privateMsgFre['tenMinuteFre']['tenMinute'] > privateMsgLimit / 6 * 10) {
            return false;
        }

        //一小时之内不得大于500%
        if (privateMsgFre['hourFre']['hour'] > privateMsgLimit * 5) {
            return false;
        }

        //总数不能超过 10%
        if ((new Date()).getTime() / 1000 - this.privateMsgData[0] > 1800 && privateMsgFre['allFre']['hour'] >= privateMsgLimit * 1.1) {
            return false;
        }

        return true;
    },

    //访问别人主页频率检查  1小时访问 60个人
    viewUserPageFreCheck(viewUserPageLimit) {
        if (this.viewUserPageData.length === 0) {
            return true;
        }
        let viewUserPageFre = this.freCheck(this.viewUserPageData);

        //一小时之内不得大于30%
        if (viewUserPageFre['hourFre']['hour'] > viewUserPageLimit * 1.3) {
            return false;
        }

        //十分钟频率是否高于50%
        if (viewUserPageFre['tenMinuteFre']['tenMinute'] > viewUserPageLimit / 6 * 1.50) {
            return false;
        }

        //总数不能超过 10%
        if ((new Date()).getTime() / 1000 - this.viewUserPageData[0] > 1800 && viewUserPageFre['allFre']['hour'] >= viewUserPageLimit * 1.1) {
            return false;
        }

        return true;
    },

    //用户规则检查
    userRuleCheck(userRules, userData) {
        for (let rule of userRules) {
            //检测当前这个规则是否符合，是的话则直接返回
            let gender = JSON.parse(rule.gender);
            if (!gender.includes(userData.gender)) {
                continue;
            }

            let provinces = JSON.parse(rule.province_id);
            if (!provinces.includes(0) && !provinces.includes(this.getIdByIp(userData.ip))) {
                continue;
            }

            if ((rule.is_person === 1 && userData.isCompany) || (rule.is_person === 2 && !userData.isCompany)) {
                continue;
            }

            if (rule.open_window !== userData.openWindow) {
                continue;
            }

            if ((rule.is_tuangou === 1 && !userData.tuangouTalent) || (rule.is_tuangou === 2 && userData.tuangouTalent)) {
                continue;
            }

            if (rule.min_zan || rule.max_zan) {
                if (userData.zanCount < rule.min_zan || userData.zanCount > rule.max_zan) {
                    continue;
                }
            }

            if (rule.min_fans || rule.max_fans) {
                if (userData.fansCount < rule.min_fans || userData.fansCount > rule.max_fans) {
                    continue;
                }
            }

            if (rule.min_works || rule.max_works) {
                if (userData.worksCount < rule.min_works || userData.worksCount > rule.max_works) {
                    continue;
                }
            }

            if (rule.min_focus || rule.max_focus) {
                if (userData.focusCount < rule.min_focus || userData.focusCount > rule.max_focus) {
                    continue;
                }
            }

            if (rule.contain) {
                userData.containWord = DyCommon.containsWord(rule.contain, userData.introduce);
                if (!userData.containWord) {
                    continue;
                }
            }

            if (rule.no_contain) {
                userData.noContainWord = DyCommon.noContainsWord(rule.no_contain, userData.introduce);
                if (!userData.noContainWord) {
                    continue;
                }
            }

            return userData;
        }
        return false;
    },

    //评论规则检查
    commentRuleCheck(commentRules, commentData) {
        for (let rule of commentRules) {
            //0不限，1，字母；2数字；3汉字，4表情，5其他符号
            let nicknameType = JSON.parse(rule.nickname_type);
            if (!nicknameType.includes(0)) {
                if (nicknameType.includes(1) && !/[a-zA-Z]+/.test(commentData.nickname)) {
                    continue;
                }

                if (nicknameType.includes(2) && !/[0-9]+/.test(commentData.nickname)) {
                    continue;
                }

                if (nicknameType.includes(3) && !/[\u4e00-\u9fa5]+/.test(commentData.nickname)) {
                    continue;
                }

                let reg = /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD]|[\u2660-\u2767]\u0020)/g;
                if (nicknameType.includes(4) && !reg.test(commentData.nickname)) {
                    continue;
                }
            }

            if (rule.min_comment || rule.max_comment) {
                if (commentData.content.length < rule.min_comment || commentData.content.length > rule.max_comment) {
                    continue;
                }
            }

            if (rule.min_zan || rule.max_zan) {
                if (commentData.zanCount < rule.min_zan || commentData.zanCount > rule.max_zan) {
                    continue;
                }
            }

            if (rule.in_time) {
                //30秒内的不回忽略
                if (commentData.time - (Date.parse(new Date()) / 1000) > rule.in_time + 30) {
                    continue;
                }
            }

            let provinces = JSON.parse(rule.province_id);
            if (!provinces.includes(0) && !provinces.includes(this.getIdByIp(commentData.ip))) {
                continue;
            }

            if (rule.contain) {
                commentData.containWord = DyCommon.containsWord(rule.contain, commentData.content);
                if (!commentData.containWord) {
                    continue;
                }
            }

            if (rule.no_contain) {
                commentData.noContainWord = DyCommon.noContainsWord(rule.no_contain, commentData.content);
                if (!commentData.noContainWord) {
                    continue;
                }
            }

            return commentData;
        }
        return false;
    },

    //检测标题是否正常
    videoRulesCheckTitle(videoRules, title) {
        for (let rule of videoRules) {
            if (rule.contain) {
                let containWord = DyCommon.containsWord(rule.contain, title);
                if (!containWord) {
                    continue;
                }
            }

            if (rule.no_contain) {
                let noContainWord = DyCommon.noContainsWord(rule.no_contain, title);
                if (!noContainWord) {
                    continue;
                }
            }

            return true;
        }
        return false;
    },

    //视频规则是否符合条件
    videoRulesCheck(videoRules, videoData) {
        for (let rule of videoRules) {
            //检测当前这个规则是否符合，是的话则直接返回
            if (rule.min_zan || rule.max_zan) {
                if (videoData.zanCount < rule.min_zan || videoData.zanCount > rule.max_zan) {
                    continue;
                }
            }

            if (rule.min_comment || rule.min_comment) {
                if (videoData.commentCount < rule.min_comment || videoData.commentCount > rule.max_comment) {
                    continue;
                }
            }

            if (rule.min_collect || rule.max_collect) {
                if (videoData.collectCount < rule.min_collect || videoData.collectCount > rule.max_collect) {
                    continue;
                }
            }

            if (rule.min_share || rule.max_share) {
                if (videoData.shareCount < rule.min_share || videoData.shareCount > rule.max_share) {
                    continue;
                }
            }

            if (rule.contain) {
                videoData.containWord = DyCommon.containsWord(rule.contain, videoData.title);
                if (!videoData.containWord) {
                    continue;
                }
            }

            if (rule.no_contain) {
                videoData.noContainWord = DyCommon.noContainsWord(rule.no_contain, videoData.title);
                if (!videoData.noContainWord) {
                    continue;
                }
            }

            return videoData;
        }
        return false;
    },

    refreshVideo(videoRules) {
        DyCommon.toast('现在是模拟刷视频');
        let videoData;
        let errorCount = 0;
        while (true) {
            DyVideo.next();
            this.viewVideoDate[0] = Date.parse(new Date()) / 1000;
            DyCommon.toast('滑动视频', 3000, 2000);
            try {
                if (DyVideo.isLiving()) {
                    DyCommon.toast('直播中，切换下一个视频');
                    continue;
                }

                let unique = DyVideo.getNickname() + '_' + DyVideo.getContent();
                if (this.titles.includes(unique)) {
                    DyCommon.toast('重复视频');
                    continue;
                }

                if (this.titles.length >= 1000) {
                    this.titles.shift();
                }

                this.titles.push(unique);
                videoData = DyVideo.getInfo();
            } catch (e) {
                errorCount++
                console.log(e);
                if (errorCount > 3) {
                    throw new Error('三次都没有解决错误');
                }
                continue;
            }
            errorCount = 0;
            if (!videoData.title) {
                DyCommon.toast('当前视频没有标题，切换到下一个');
                continue;
            }

            //查看是不是已经存在的视频
            if (this.videoExist(videoData.nickname, videoData.title)) {
                DyCommon.toast('已经存在的视频');
                continue;
            }

            //接下来是视频的参数和config比对， 不合适则刷下一个
            let tmp = this.videoRulesCheck(videoRules, videoData);
            if (!tmp) {
                //不合适的视频也会请求到后端
                this.viewVideoDate[1] = Date.parse(new Date()) / 1000;
                videoData.watchSecond = this.viewVideoDate[1] - this.viewVideoDate[0];
                this.postVideoData(videoData, 0);
                continue;
            }
            videoData = tmp;
            break;
        }

        //合适的视频，内容请求到后端  然后返回数据看看是否点赞 是否评论  评论数量等等 是否点赞等等， 主方法拿到返回值再去操作对应的方法
        //符合条件的视频，多看一会儿  首先看看是否有滑动条，有的话，观看30-60秒  没有的话 观看 15-30秒
        if (DyVideo.getProcessBar()) {
            DyCommon.sleep(30 + 30 + Math.random() - 5);//最后减去视频加载时间  和查询元素的时间
        } else {
            DyCommon.sleep(15 + 15 + Math.random() - 5);//最后减去视频加载时间  和查询元素的时间
        }

        this.viewVideoDate[1] = Date.parse(new Date()) / 1000;
        videoData.watchSecond = this.viewVideoDate[1] - this.viewVideoDate[0];
        let res = this.postVideoData(videoData, 1);
        videoData.id = res.id;
        return videoData;
    },

    commentDeal() {
        if (this.commentFreCheck(this.taskConfig.comment_fre)) {
            //随机评论视频
            let msg = this.getMsg(0);
            DyVideo.openComment();
            DyComment.commentMsg(msg.msg);///////////////////////////////////操作
            this.commentData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
        }

        //随机点赞 评论回复
        let contains = [];//防止重复的
        let rps = 0;//大于2 则退出
        let opCount = Math.floor(Math.random() * 5);//最多滑动5屏
        while (true) {
            let comments = DyComment.getList();
            if (comments.length === 0) {
                break;
            }

            let rpCount = 0;
            let preOpCount = 1 + Math.floor(Math.random() * (comments.length - 1));
            for (let comment of comments) {
                if (contains.includes(comment.nickname + '_' + comment.title)) {
                    rpCount++;
                    continue;
                }
                rps = 0;//只要有一个不在列表，则清零
                contains.push(comment.nickname + '_' + comment.title);
                //查看是否匹配  匹配关键词就回复
                if (this.commentRuleCheck(this.taskConfig.commentRules, comment)) {
                    continue;
                }

                if (this.zanCommentFreCheck(this.taskConfig.comment_zan_fre)) {
                    DyComment.clickZan(comment);//////////////////////操作
                    this.zanCommentData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
                    preOpCount--;
                }

                if (this.privateMsgFreCheck(this.taskConfig.private_fre) || this.focusFreCheck(this.taskConfig.focus_fre)) {
                    DyComment.intoUserPage(comment);
                    let userData = DyUser.getUserInfo();
                    let isPrivateAccount = DyUser.isPrivate();
                    if (!isPrivateAccount && this.userRuleCheck(this.taskConfig.userRules, userData)) {
                        if (this.focusFreCheck(this.taskConfig.focus_fre)) {
                            DyUser.focus();///////////////////////////操作
                            preOpCount--;
                            this.focusData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
                            DyCommon.sleep(2000 * Math.random());
                        }

                        if (this.privateMsgFreCheck(this.taskConfig.private_fre)) {
                            if (!this.douyinExist(userData.douyin)) {
                                let msg = this.getMsg(1);
                                DyUser.privateMsg(msg.msg);//////////////////////操作
                                preOpCount--;
                                this.privateMsgData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
                            }
                        }
                    }
                    DyCommon.back();//从用户页面返回到评论页面
                    DyCommon.sleep(1000 * Math.random() + 500);
                }

                if (Math.random() < 1 / 5 && this.commentFreCheck(this.taskConfig.comment_fre)) {
                    let msg = this.getMsg(0);
                    DyComment.backMsg(comment, msg.msg);////////////////////////////操作
                    preOpCount--;
                    this.commentData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
                }

                if (preOpCount <= 0) {
                    break;
                }
            }

            if (rpCount === comments.length) {
                rps++;
            } else {
                opCount--;
            }

            if (rps >= 2 || opCount <= 0) {
                break;
            }

            DyComment.swipeTop();
            DyCommon.sleep(1000 + 1000 * Math.random());
        }
    },

    run(taskId) {
        console.log(this.videoRulesCheckTitle([{ contain: '创业&短视频，创业', no_contain: '短视频3' }], '短视频创业'));
        exit();

        this.taskId = taskId;
        let taskConfig = this.getTaskConfig();
        if (taskConfig === false) {
            console.hide();
            return false;
        }

        let config = this.getConfig();
        if (config === false) {
            console.hide();
            return false;
        }

        //获取当前的视频数据
        let taskVideoData = this.getTaskVideoData();
        if (taskVideoData === false) {
            console.hide();
            return false;
        }

        //获取省份数据
        let provices = this.getProvinces();
        if (provices === false) {
            console.hide();
            return false;
        }

        return this.runTask();//返回指定编码
    },

    runTask() {
        //////开始测试里面的基本功能
        //已经通过的测试放在2.check.js里面

        let focusFre = this.freCheck(this.focusData);
        console.log(this.focusData);
        console.log(Date.parse(new Date()) / 1000 - this.focusData[0]);
        console.log(focusFre);

        // console.log(this.taskConfig.hour);
        // let zanFre = this.freCheck(this.zanVideoData);
        // let videoFre = this.freCheck(this.videoData);
        // console.log(this.zanVideoData, this.videoData, zanFre, videoFre);

        // let commentFre = this.freCheck(this.commentData);
        // let privateFre = this.freCheck(this.privateMsgData);
        // console.log(this.commentData, this.privateMsgData, commentFre, privateFre);

        // let zanCommentFre = this.freCheck(this.zanCommentData);
        // let zanVideoFre = this.freCheck(this.zanVideoData);
        // console.log(this.commentData, this.privateMsgData, zanCommentFre, zanVideoFre);

        return false;
        //进入主页，获取个人的账号信息 然后进入视频界面
        DyCommon.toast('进入了主页', 1000);
        DyIndex.intoMyPage();
        DyCommon.toast('进入个人主页，记录自己的账号和抖音号');
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
        }
        DyCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));
        DyCommon.back(1, 1000);

        //开始刷视频
        while (true) {
            let code = this.taskCheck(this.taskConfig);
            if (0 !== code) {
                return code;
            }

            if (!this.refreshVideoFreCheck(this.taskConfig)) {
                return 106;//视频频率达到了  此时可以休息10分钟  直接关掉抖音即可
            }

            log('开始获取视频数据')
            let videoData = DyVideo.getInfo();
            //看看是否可以点赞了
            if (this.videoRulesCheck(this.taskConfig.videoRules, videoData) && this.zanVideoFreCheck(this.taskConfig.video_zan_fre)) {
                DyVideo.clickZan();///////////////////////////////////操作
                this.zanVideoData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
                this.addVideoOp(videoData, 0);
            }

            //现在决定是否对视频作者作者进行操作
            //查看频率是否允许操作作者
            if (this.focusFreCheck(this.taskConfig.focus_fre) || this.privateMsgFreCheck(this.taskConfig.private_fre)) {
                //看看是不是广告，是的话，不操作作者
                if (DyVideo.viewDetail()) {
                    continue;
                }

                DyVideo.intoUserPage();
                let userData = DyUser.getUserInfo();
                let isPrivateAccount = DyUser.isPrivate();
                if (!isPrivateAccount && this.focusFreCheck(this.taskConfig.focus_fre) && this.userRuleCheck(this.taskConfig.userRules, userData)) {
                    DyUser.focus();///////////////////////////////////操作
                    this.focusData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
                }

                if (!isPrivateAccount && this.privateMsgFreCheck(this.taskConfig.private_fre) && this.userRuleCheck(this.taskConfig.userRules, userData)) {
                    let msg = this.getMsg(1);
                    DyUser.privateMsg(msg.msg);///////////////////////////////////操作
                    this.privateMsgData.push(Date.parse(new Date()) / 1000);//将私信的数据写上
                }
                DyCommon.back();
                DyCommon.sleep(2000 * Math.random());
            }

            //看看是否可以操作评论区了
            DyCommon.sleep(1000);
            this.commentDeal(videoData);
        }
    },
}

Common.closeApp();

// Dy.run(3);


// for (let i = 0; i < 100; i++) {
//     Dy.videoData[i] = Date.parse(new Date()) / 1000 - 3600 + i * 36;
// }

// Dy.taskConfig.hour = [10, 11, 19, 20];
// console.log(Dy.refreshVideoFreCheck(2));//[0, 100, 150, 250, 350, 400, 500];

// Dy.taskId = 21;
// let task = Dy.getTaskConfig();
// let config = Dy.getConfig();

// Dy.me = {
//     douyin: 'jiangqiao',
//     nickname: 'jq',
// }

// log('privateClose', Dy.privateClose);
// storage.setToken('token_cc09c1f0ce3901ba64142cb392ea7');
// Dy.getDouyinConfig();
// log('privateClose', Dy.privateClose);

// Dy.addDouyinConfig();
// log('privateClose', Dy.privateClose);


// let videoData = {
//     id: 1,
//     videoCommentId: 2,
//     type: 1,
//     isZan: 0,
//     zanTime: Date.parse(new Date()) / 1000,
//     isPrivateMsg: 0,
//     isComment: 1,
// };

// let res = Http.post('dke', 'addVideoOp', {
//     video_id: videoData.id,
//     video_comment_id: videoData.videoCommentId,
//     type: videoData.type || 0,//0操作视频，1操作评论
//     is_zan: videoData.isZan || 1,
//     zan_time: videoData.zanTime || 0,
//     is_private_msg: videoData.isPrivateMsg,
//     private_msg: videoData.privateMsg || '贷款买房泪😭干，还了6年还了三万本金，房贷压力真的大#南京买...',
//     is_comment: videoData.isComment || 1,
//     comment_msg: videoData.commentMsg || '贷款买房泪😭干，还了6年还了三万本金，房贷压力真的大#南京买...',
//     comment_msg_time: videoData.commentMsgTime || 0,
//     msg_time: videoData.msgTime || 0,
//     is_focus: videoData.isFocus || 1,
//     focus_time: videoData.focusTime || 1,
//     task_id: 1,
//     is_view_user: videoData.isViewUser || 1,
//     view_user_time: videoData.view_user_time || 1,
//     is_view_video: videoData.isViewVideo || 1,
//     is_view_target_video: videoData.isViewTargetVideo || 1,
// });

// console.log(res);
// Dy.taskConfig.lib_id = '[1]';
// console.log(Dy.getMsg(0));

// function getTag(){
//     let tags = textMatches(/作品 [\d]+/).findOne(2000);//rj5 或者 ptm
//     if (!tags || tags.length === 0) {
//         return {
//             text: function () {
//                 return 0;
//             }
//         }
//     }
//     return tags;    
// }

// let t = getTag();
// console.log(t.text());


