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
            sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            while (!click(p.centerX(), p.centerY()));
            sleep(1000);
            p = text('确定').findOne().bounds();
            while (!click(p.centerX(), p.centerY()));
            sleep(5000);
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
        swipe(device.width / 2 - 150 + lf, btm, device.width / 2 - 150 + lf, device.height * (0.1 + 0.05 * Math.random()), 100 + 100 * Math.random());//从下往上推，清除
        this.sleep(1000);
        this.back();
        return true;
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
        if (!tag) {
            return '未知';
        }
        let msg = tag.text();
        if (!msg) {
            return '未知';
        }
        return msg.replace(' · ', '');
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

            let topTag = Common.id('title').findOne(2000);
            if (topTag && this.tag.bounds().top < topTag.bounds().top + topTag.bounds().height() + 10) {
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
        //console.log('headTag', headTag);
        Common.click(headTag);
        Common.sleep(3000);
    },

    //评论回复
    //data 是getList返回的参数 评论
    backMsg(data, msg) {
        let backTag = this.getBackTag(data.tag);
        //console.log(data);
        Common.click(backTag);
        Common.sleep(1000 + 2000 * Math.random());

        iptTag = Common.getTags(Common.id('c2u').find());
        if (iptTag.length === 2) {
            iptTag = iptTag[1];
        } else {
            iptTag = iptTag[0];
        }

        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            iptTag.setText(input);
            Common.sleep(1000 + Math.random() * 3000);//每个字1-4秒
        }
        Common.sleep(Math.random() * 1000);

        let submitTag = Common.getTags(Common.id('c49').find());
        if (submitTag.length === 2) {
            submitTag = submitTag[1];
        } else {
            submitTag = submitTag[0];
        }
        Common.click(submitTag);
        Common.sleep(2000 * Math.random());
    },

    //视频评论
    commentMsg(msg) {
        let iptTag = Common.id('c2u').findOne(2000);
        try {
            Common.click(iptTag);
            Common.sleep(1000 + 2000 * Math.random());
        } catch (e) {
            console.log(e);
        }

        iptTag = Common.getTags(Common.id('c2u').find());
        if (iptTag.length === 2) {
            iptTag = iptTag[1].bounds().top > iptTag[0].bounds().top ? iptTag[0] : iptTag[1];
        } else {
            iptTag = iptTag[0];
        }

        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            iptTag.setText(input);
            Common.sleep(500 + Math.random() * 2500);//每个字1-4秒
        }
        Common.sleep(Math.random() * 1000);

        let rp = 3;
        while (rp--) {
            try {
                let submitTag = Common.getTags(Common.id('c49').find());
                if (submitTag.length === 2) {
                    submitTag = submitTag[1].bounds().top > submitTag[0].bounds().top ? submitTag[0] : submitTag[1];
                } else {
                    submitTag = submitTag[0];
                }
                Common.click(submitTag);
                break;
            } catch (e) {
                Common.log(e);
            }
        }

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







const Video = {
    next() {
        let left = device.width * 0.3 + device.width * 0.4 * Math.random();
        let top = device.height * 3 / 4;
        swipe(left, top - 200 * Math.random(), left, 300 + 200 * Math.random(), 100 + Math.random() * 200);
    },

    getZanTag() {
        let tag = Common.id('d_9').filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
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
        let tag = Common.id('c7h').filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到评论标签');
    },

    getCommentCount() {
        let comment = this.getCommentTag();
        return Common.numDeal(comment.desc());
    },

    //评论  type 为true表示有评论数，否则为无评论数
    openComment(type) {
        let comment = this.getCommentTag();
        Common.click(comment);
        if (type) {
            Common.sleep(2000 + 1500 * Math.random());
        } else {
            Common.sleep(2000 + 1000 * Math.random());
            Common.back();
        }

        return true;
    },

    getCollectTag() {
        let tag = Common.id('cyy').filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
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
        let tag = Common.id('qw9').filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到分享标签');
    },

    getShareCount() {
        let share = this.getShareTag();
        return Common.numDeal(share.desc());
    },

    getContentTag() {
        let tag = Common.id('desc').filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
        }

        return false;//极端情况是可以没有内容的
    },

    getContent() {
        let tag = this.getContentTag();
        return tag ? tag.text() : '';
    },

    getTitleTag() {
        let tag = Common.id('title').filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到标题内容');
    },

    getAtNickname() {
        return this.getTitleTag().text().replace('@', '');
    },

    //是否直播中
    isLiving() {
        //两种方式，一种是屏幕上展示，一种是头像
        let tags = Common.id('lc-').descContains('点击进入直播间').filter((v) => {
            return v.bounds() && (v.bounds().height() > 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0);
        }).findOnce();

        if (tags) {
            return true;
        }

        tags = Common.id('vh2').clickable(true).descContains('直播中').filter((v) => {
            return v.bounds() && (v.bounds().height() > 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0);
        }).findOnce();

        return tags ? true : false;
    },

    //头像查找经常出问题，这里做3次轮训
    getAvatar(times) {
        if (!times) {
            times = 1;
        }
        try {
            let name = 'user_avatar';
            let tag = Common.id(name).filter((v) => {
                return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
            }).findOne(2000);
            if (tag) {
                return tag;
            }
            throw new Error('找不到头像' + times);
        } catch (e) {
            if (times < 3) {
                return this.getAvatar(++times);
            }
        }

        throw new Error('找不到头像');
    },

    //有没有查看详情  有的话大概率是广告  广告的话，不能操作广告主
    viewDetail() {
        //let name = 'k+t';//Common.id(name).find()
        let tags = text('查看详情').descContains('查看详情').filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOne(2000);
        return tags || false;
    },

    intoUserPage() {
        let head = this.getAvatar(3);
        log(head);
        Common.click(head, 0.3);
        Common.sleep(2000 + Math.random() * 1000);
    },

    getNickname() {
        let avatar = this.getAvatar(3);
        return avatar.desc();
    },

    getDistanceTag(loop) {
        let name = 'n1c';
        if (loop) {
            name = 'n9q';
        }

        let tag = Common.id(name).filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
        }

        if (!loop) {
            return this.getDistanceTag(1);
        }

        if (loop) {
            return {
                text: () => {
                    return '0';
                }
            };
        }
    },

    getDistance() {
        let tag = this.getDistanceTag();
        return tag.text().replace('公里', '').replace('km', '') * 1;
    },

    getInTimeTag() {
        let name = 'uni';
        let tag = Common.id(name).filter((v) => {
            return v.bounds() && (v.bounds().top > 200 && v.bounds().top < device.height);
        }).findOnce();
        if (tag) {
            return tag;
        }
        return {
            text() {
                return '0分钟前';
            }
        }
    },

    getInTime() {
        let inTimeTag = this.getInTimeTag();
        let time = inTimeTag.text().replace('· ', '');
        let incSecond = 0;
        if (time.indexOf('分钟前') !== -1) {
            incSecond = time.replace('分钟前', '') * 60;
        } else if (time.indexOf('小时前') !== -1) {
            incSecond = time.replace('小时前', '') * 3600;
        } else if (time.indexOf('刚刚') !== -1) {
            incSecond = 0;
        } else if (time.indexOf('天前') !== -1) {
            incSecond = time.replace('天前', '') * 86400;
        } else if (time.indexOf('周前') !== -1) {
            incSecond = time.replace('周前', '') * 86400 * 7;
        } else if (time.indexOf('昨天') !== -1) {
            time = time.replace('昨天', '').split(':');
            incSecond = 86400 - time[0] * 3600 - time[1] * 60 + (new Date()).getHours() * 3600 + (new Date()).getMinutes() * 60;
        } else if (/[\d]{2}\-[\d]{2}/.test(time) || /[\d]{2}\月[\d]{2}日/.test(time)) {
            time = time.replace('日', '').replace('月', '-');
            time = (new Date()).getFullYear() + '-' + time;
            incSecond = Date.parse(new Date()) / 1000 - (new Date(time)).getTime() / 1000;//日期
        } else {
            time = time.replace('日', '').replace('月', '-').replace('年', '-');
            incSecond = Date.parse(new Date()) / 1000 - (new Date(time)).getTime() / 1000;//直接是日期
        }
        return incSecond;
    },

    getInfo(isCity, params) {
        if (!params) {
            params = {};
        }

        log('info before');
        let info = {
            zanCount: this.getZanCount(),
            commentCount: this.getCommentCount(),
            collectCount: this.getCollectCount(),
            shareCount: this.getShareCount(),
        }
        log('info after');

        if (!params['nickname']) {
            info.nickname = this.getNickname();
        } else {
            info.nickname = params['nickname'];
        }

        if (!params['title']) {
            info.title = this.getContent();
        } else {
            info.title = params['title'];
        }

        if (isCity) {
            info.distance = this.getDistance();
            info.in_time = this.getInTime();
        }

        log('title');

        return info;
    },

    getProcessBar() {
        let tag = Common.id('v0p').findOne(2000);
        if (!tag) {
            return false;
        }

        if (tag['info']['actions'] === 144205) {
            return true;
        }
        return false;
    },

    intoUserVideo() {
        let bottom = device.height - 200 - Math.random() * 300;
        let top = bottom - 400 - Math.random() * 200;
        let left = device.width * 0.1 + Math.random() * (device.width * 0.8);
        swipe(left, bottom, left, top, 300);

        let containers = Common.id('container').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
        }).find();

        if (containers.length === 0) {
            return false;
        }

        let videoIndex = null;
        let baseZanCount = null;
        for (let i in containers) {
            if (i * 1 === 0 || isNaN(i)) {
                continue;
            }

            let video = containers[i].children().findOne(Common.id('lc-'));
            let index = video.desc().indexOf('点赞数');
            let zanCount = video.desc().substring(index + 3) * 1;
            log(index, zanCount, video.desc());
            if (null === baseZanCount || zanCount < baseZanCount) {
                baseZanCount = zanCount;
                videoIndex = i;
            }
        }

        log('最小赞', baseZanCount);
        Common.click(containers[videoIndex]);
        Common.sleep(5000 + Math.random() * 10000);
        return true;
    },
}

sleep(10000);
// let i = 3;
// while (i--) {
//     Video.next();
//     log('开始获取数据');
//     log(Video.getInfo());
//     log('结束')
// }

log('开始');
log(Video.getDistance());

log(Video.getInTime());

log('结束');

// console.log(Video.isLiving());

// Video.intoUserVideo();
// log(Video.getCommentCount());
// Video.openComment(Video.getCommentCount());

// let k = 20;
// while (k-- > 0) {
//     log(k, Video.getContent());
//     Video.next();
//     sleep(3000);
// }

// Video.intoUserPage();

// let k = 5;
// while (k-- > 0) {
//     Common.closeApp();
//     sleep(4000);
//     Common.openApp();
// }

// launch('com.dke');

//Video.next();
//Video.clickZan();
//console.log(Video.getZanCount());
//console.log(Video.isZan());

// sleep(5000);
// let a = Video.getAvatar();
// Common.click(a);

// console.log(Video.getCommentTag());
// console.log(Video.getCommentCount());
//Video.openComment();

//console.log(Video.getAvatar());
//console.log(Video.getNickname());

//console.log(Video.getContent());
//console.log(Video.getAtNickname());
//Video.collect();
//console.log(Video.isCollect());

//console.log(Video.getShareCount());
// console.log(Video.isLiving());


function getBar() {
    requestScreenCapture();//请求截图
    Common.sleep(3000);
    let img = captureScreen();
    let bar = Common.id('v0p').findOne(2000);
    let top = bar.bounds().top;
    let height = bar.bounds().height();
    console.log([top, height]);//1950 54

    let clipw = images.clip(img, 0, top, device.width, height); //[ 0, 1965, 1080, 12 ]
    images.save(clipw, '/sdcard/dke/jq_clip_' + 0 + '.png', "png", 100);

    let clip = images.clip(img, 0, top + 15, device.width, 10); //[ 0, 1965, 1080, 12 ]
    images.save(clip, '/sdcard/dke/jq_' + 0 + '.png', "png", 100);
    gray = images.threshold(clip, 100, 255, "BINARY");//量化后的程序
    var point = images.findAllPointsForColor(gray, "#FFFFFF");
    ///console.log(point);
    //console.log(point.x / device.width);
    images.save(gray, '/sdcard/dke/jq_' + 1 + '.png', "png", 100);
}

// getBar();

// requestScreenCapture();//请求截图
// Common.sleep(2000);
// console.log(Video.getProcessRate());
