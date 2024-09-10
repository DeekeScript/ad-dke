let Common = {
    //封装的方法
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
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
            dy.sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            while (!click(p.centerX(), p.centerY()));
            dy.sleep(1000);
            p = text('确定').findOne().bounds();
            while (!click(p.centerX(), p.centerY()));
            dy.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    click(tag) {
        let width = Math.floor(Math.random() * tag.bounds().width());
        let height = Math.floor(Math.random() * tag.bounds().height());

        try {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } catch (e) {
            try {
                click(tag.bounds().left + width, tag.bounds().top);
            } catch (e) {
                return false;
            }
        }

        sleep(500);
        return true;
    },

    openApp() {
        this.log('openApp');
        return launch('com.ss.android.ugc.aweme');
    },

    restartApp() {
        dy.stopApp();
        dy.openApp();
    },

    log() {
        //这里需要做日志记录处理
        let str = [];
        for (let i in arguments) {
            str.push(arguments[i]);
        }
        console.log(str);
    },

    back(i) {
        if (i === undefined) {
            i = 1;
        }
        this.log('返回', i);
        while (i--) {
            back();
            this.sleep(500);
        }
    },

    closeAll() {
        try {
            let closeTag = descContains('不再提醒').findOne(2000);
            if (closeTag) {
                Common.click(closeTag);
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
        recents();
        this.sleep(1000);
        let dy = textContains('抖音').id('title_view').findOne(2000);
        if (dy.bounds().top > 0 && dy.bounds().top < device.height && dy.bounds().left > 0 && dy.bounds().left < device.width) {
            swipe(device.width / 2, device.height / 2, device.width / 2, 20, 300);//从下往上推，清除
            this.sleep(1000);
            this.back();
            return true;
        }
        this.back();
        return false;
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
        let nickname = Common.id('msy').findOnce();
        if (nickname && nickname.text()) {
            return nickname.text().replace("，复制名字", '');
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

        throw new Error('找不到是不是公司标签');
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
        let tags = textMatches(/作品 [\d]+/).findOnce();//rj5 或者 ptm
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

        return 0;
    },

    //是否是私密账号
    isPrivate() {
        return Common.id('title').text('私密账号').findOnce() ? true : false;
    },

    isTuangouTalent() {
        let tag = Common.id('nee').findOnce();
        if (!tag) {
            return false;
        }

        return tag.children().findOne(text('团购推荐')) ? true : false;
    },

    focus() {
        let focusTag = Common.id('ola').text('关注').findOnce();
        if (focusTag) {
            Common.click(focusTag);
            return true;
        }

        let hasFocusTag = Common.id('olb').text('已关注').findOnce();
        if (hasFocusTag) {
            return true;
        }

        hasFocusTag = Common.id('olb').text('相互关注').findOnce();
        if (hasFocusTag) {
            return true;
        }
        throw new Error('找不到关注和已关注');
    },

    cancelFocus() {
        let hasFocusTag = Common.id('olb').text('已关注').findOnce();
        if (hasFocusTag) {
            Common.click(hasFocusTag);
            Common.sleep(500);

            //真正地点击取消
            let cancelTag = Common.id('j-z').text('取消关注').findOnce();
            if (!cancelTag) {
                throw new Error('取消关注的核心按钮找不到');
            }
            Common.click(cancelTag);
        }

        let focusTag = Common.id('ola').text('关注').findOnce();
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

//console.log(User.getIntroduce());
//console.log(User.getIp());
// console.log(User.getAge());

// console.log(User.getGender());

//console.log(User.getWorksCount());

console.log(User.getUserInfo());
//console.log(User.focus());
//console.log(User.cancelFocus());
// User.privateMsg('你好啊');


// console.log(Common.id('nee').findOne(2000).children().findOne(text('团购推荐')));
// console.log(Common.id('nee').findOne(2000).children().findOne(text('进入橱窗')));


// console.log(textContains('已关注').find());
// console.log(text('男').findOne(2000));
//console.log(Common.id('title').text('私密账号').findOne(2000));

// console.log(Common.id('ptm').findOne(2000));
// console.log(textMatches(/作品 [\d]+/).findOne().parent().parent());