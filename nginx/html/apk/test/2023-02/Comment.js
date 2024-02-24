const Common = {
    //封装的方法
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

    back(i) {
        if (i === undefined) {
            i = 1;
        }
        while (i--) {
            back();
            this.sleep(300 + Math.random() * 400);
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
        recents();
        this.sleep(1000);
        let dy = textContains('抖音').id('title_view').findOne(2000);
        if (!dy) {
            dy = descContains('抖音').findOne(2000);
        }
        if (dy.bounds().top > 0 && dy.bounds().top < device.height && dy.bounds().left > 0 && dy.bounds().left < device.width) {
            swipe(device.width / 2, device.height / 2, device.width / 2, 20, 300);//从下往上推，清除
            this.sleep(1000);
            this.back();
            return true;
        }
        this.back();
        return false;
    },

    //关闭弹窗
    closeAlert() {
        threads.start(function () {
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
    }
}

const Comment = {
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
        let time = this.getTimeTag().text();
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
        let commentWindowHeight = commentWindowTag.bounds().height() - 200;
        let commentWindowsTop = commentWindowTag.bounds().top;

        swipe(left, commentWindowsTop + commentWindowHeight * (0.6 + Math.random() * 0.4), left, commentWindowsTop + 300 * Math.random(), 100 + Math.random() * 300);
    },

    getList() {
        let contains = Common.getTags(Common.id('dge').find());
        let contents = [];
        let data = {};
        for (let i in contains) {
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


//Comment.closeCommentWindow();
console.log(Comment.getList());//滑动5次
// Comment.swipeDown(42);

//滑动测试
// let i = 10;
// while (i--) {
//     console.log('第' + (10 - i) + '次');
//     Comment.swipeTop();
//     Common.sleep(2000);
// }



//console.log(Common.id('dge').findOne(2000).parent().children().find(Common.id('us4')));

//console.log(textMatches(/[\s\S]+/).find());//vjf 抖音号   //cwm 几人创作

//console.log(descMatches(/[\s\S]+/).find()); //v0p 进度条

// console.log(Common.id('vjf').findOne(2000));
// console.log(Common.id('cwm').findOne(2000));
// console.log(Common.id('v0p').findOne(2000));



// let comments = Comment.getList();
// Comment.clickZan(comments[0]);


// comments = Comment.getList();
// let k = comments.length;
// let m = 0;
// while (k--) {
//     Comment.intoUserPage(comments[m]);
//     Comment.sleep(2000);
//     //k = undefined;
// }


// let contains = Common.getTags(Common.id('dge').find());
// let zanTag = contains[0].children().findOne(Common.id('jz5'));
// let zanTag2 = contains[0].children().findOne(Common.id('d_j'));

// console.log(zanTag2);

function a() {
    let k = 10;
    let contents = [];
    while (k-- > 0) {
        let contains = Common.getTags(Common.id('dge').find());
        for (let i in contains) {
            let str = contains[i].children().findOne(Common.id('content')).text();
            if (contents.includes(str)) {
                continue;
            }
            contents.push(str);
        }
        Common.sleep(200);
        gesture(300, [500, 2000], [500, 200]);
    }
    log(contents);
}

// log('开始时间');
// a();
// log('结束时间');
