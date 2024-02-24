let Common = require('./Common.js');
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
        return this.tag;
    },

    getTimeTag() {
        return this.tag.children().findOne(Common.id('dls'));
    },

    getIpTag() {
        return this.tag.children().findOne(Common.id('did'));
    },

    getBackTag(tag) {
        this.tag = tag;
        return this.getTimeTag();
    },

    getZanTag(tag) {
        let zanId = ['e3b','lo+'];//华为，oppo
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
        log(this.tag);
        throw new Error('找不到评论点赞，请注意');
    },

    isAuthor() {
        return this.tag.children().findOne(Common.id('d6s').descContains('作者')) ? true : false;
    },

    getNickname() {
        let tag = this.getNicknameTag();
        if (tag) {
            return tag.text();
        }
        return false;
    },

    getContent() {
        let tag = this.getContentTag();
        if (!tag || !tag.desc()) {
            return '';
        }

        let str = tag.desc().split(',,,,')[1]
        return str ? str.split(',')[0] : '';
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

    swipeTop(rate) {
        if (!rate) {
            rate = 1;
        }
        //上滑

        try {
            Common.id("1").filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left >= 0 && v.bounds().width() > 0;
            }).findOnce().scrollForward();
            console.log('上划');
        } catch (e) {
            log(e);
        }
    },

    getList() {
        let contains = Common.getTags(Common.id('d6s').find());
        let contents = [];
        let data = {};

        //最底下的  超出了直接continue
        let bottomTag = Common.id('dg0').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left > 0 && v.bounds().width() > 0;
        }).findOnce();

        let topTag = Common.id('title').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left > 0 && v.bounds().width() > 0;
        }).findOnce();

        for (let i in contains) {
            //不需要二次回复的内容
            if (contains[i].bounds().left > 0) {
                continue;
            }

            this.tag = contains[i];//主要给当前方法使用的，比如下面的this.getIp()方法等
            //console.log(this.tag);
            let time = this.getTime();
            data = {
                tag: contains[i],
                nickname: this.getNickname(),
                content: this.getContent(),
                //time: time,
                // date: {
                //     y: (new Date(time * 1000)).getFullYear(),
                //     m: (new Date(time * 1000)).getMonth() + 1,
                //     d: (new Date(time * 1000)).getDate(),
                //     h: (new Date(time * 1000)).getHours(),
                //     i: (new Date(time * 1000)).getMinutes(),
                // },
                // ip: this.getIp(),
                zanCount: this.getZanCount(),
                isZan: this.isZan(),
                isAuthor: this.isAuthor(),
            }
            if (data.nickname === false) {
                log('评论区nickname无');
                continue;
            }

            // if (!params || !params['noTime']) {
            //     data['time'] = time;
            // }


            let bottomTop = bottomTag.bounds().top - 45;//比这个还下面的  直接continue
            if (this.containers.includes(data.nickname + '_' + data.content)) {
                continue;
            }

            //小于头像的高度，可以不用忽略
            if (this.tag.bounds().top + this.tag.bounds().height() > bottomTop || this.tag.bounds().height() < 120) {
                log('范围不对：', topTag, this.tag);
                continue;
            }

            if (topTag && this.tag.bounds().top < topTag.bounds().top + topTag.bounds().height() + 12) {
                log('范围不对-1：', topTag, this.tag);
                continue;
            }

            contents.push(data);
            this.containers.push(data.nickname + '_' + data.content);
        }
        return contents;
    },
    //这里其实使用back最方便
    closeCommentWindow() {
        let closeTag = Common.id('back_btn').desc('关闭').findOnce();
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
        Common.sleep(3000 + 1000 * Math.random());
    },

    //评论回复
    //data 是getList返回的参数 评论
    backMsg(data, msg) {
        let backTag = this.getBackTag(data.tag);
        //console.log(data);
        Common.click(backTag);
        Common.sleep(1000 + 2000 * Math.random());

        iptTag = Common.getTags(Common.id('dg0').find());
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
            Common.sleep(1000 + Math.random() * 1000);//每个字1-2秒
        }
        Common.sleep(Math.random() * 1000);

        let submitTag = Common.getTags(Common.id('dj3').find());
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
        let iptTag = Common.id('dg0').findOnce();
        try {
            Common.click(iptTag);
            Common.sleep(1500 + 1500 * Math.random());
        } catch (e) {
            console.log(e);
        }

        iptTag = Common.getTags(Common.id('dg0').find());
        if (iptTag.length === 2) {
            iptTag = iptTag[1].bounds().top > iptTag[0].bounds().top ? iptTag[0] : iptTag[1];
        } else {
            iptTag = iptTag[0];
        }

        log('msg', msg);
        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            iptTag.setText(input);
            Common.sleep(500 + Math.random() * 1000);//每个字0.5-1.5秒
        }
        Common.sleep(Math.random() * 1000);

        let rp = 3;
        while (rp--) {
            try {
                let submitTag = Common.getTags(Common.id('dj3').find());
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

            //查看dg0位置有没有下来
            iptTag = Common.getTags(Common.id('dg0').find());
            if (iptTag.length === 2) {
                iptTag = iptTag[1].bounds().top > iptTag[0].bounds().top ? iptTag[0] : iptTag[1];
            } else {
                iptTag = iptTag[0];
            }

            if (iptTag.bounds().top < device.height * 2 / 3) {
                log('按钮点击没有反应');
                continue;
            }
        }

        Common.sleep(1500 + 1500 * Math.random());
    },

    //暂未变更
    iptEmoj(count) {
        let emjs = Common.id('gbx').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left >= 0;
        }).findOne(2000).children().find(Common.id('gbi'));

        let emj = emjs[Math.floor(Math.random() * emjs.length)];
        log('emj', emj);
        while (count-- > 0) {
            emj.click();
            Common.sleep(500 + 500 * Math.random());
        }
    },

    //暂未变更
    commentAtUser(count, nicknames) {
        let iptTag = Common.id('dg0').findOnce();
        try {
            Common.click(iptTag);
            Common.sleep(1500 + 1500 * Math.random());
        } catch (e) {
            console.log(e);
        }

        iptTag = Common.getTags(Common.id('dg0').find());
        if (iptTag.length === 2) {
            iptTag = iptTag[1].bounds().top > iptTag[0].bounds().top ? iptTag[0] : iptTag[1];
        } else {
            iptTag = iptTag[0];
        }
        if (iptTag) {
            Common.click(iptTag);
        }

        iptTag.setText('');//清空历史消息
        Common.sleep(1000 + 1000 * Math.random());

        this.iptEmoj(1 + Math.round(3 * Math.random()));
        Common.sleep(2000 + 1000 * Math.random());
        let atTag = Common.getTags(clickable(true).desc('at').find());
        if (atTag.length === 2) {
            atTag = atTag[1].bounds().top > atTag[0].bounds().top ? atTag[0] : atTag[1];
        } else {
            atTag = atTag[0];
        }

        atTag.click();
        Common.sleep(3000 + 1000 * Math.random());

        let rp = 3;
        let swipeTop = 0;
        let _break = false;
        let arr = [];

        while (true) {
            let tvTag = Common.id('tv_name').find();
            arr.push(JSON.stringify(tvTag));
            if (arr.length > 2) {
                arr.shift();
            }

            for (let i in tvTag) {
                if (isNaN(i)) {
                    continue;
                }

                log('tvTag', tvTag[i]);
                if (tvTag[i].bounds().left + tvTag[i].bounds().width() > device.width) {
                    continue;
                }

                if (tvTag[i].bounds().left < 0 || tvTag[i].bounds().top < 0 || tvTag[i].bounds().top + tvTag[i].bounds().height() > device.height) {
                    continue;
                }

                if (tvTag[i].text().indexOf('最近@') !== -1) {
                    continue;
                }

                if (!swipeTop) {
                    swipeTop = tvTag[i].bounds().top - 100 * Math.random();
                }

                if (nicknames.includes(tvTag[i].text())) {
                    continue;
                }

                nicknames.push(tvTag[i].text());
                click(tvTag[i].bounds().left + tvTag[i].bounds().width() * (0.1 + Math.random() * 0.8), swipeTop);
                count--;
                if (count <= 0) {
                    _break = true;
                    break;
                }
                Common.sleep(500);
            }

            if (arr[0] === arr[1]) {
                rp--;
            } else {
                rp = 3;
            }

            if (rp <= 0 || _break) {
                break;
            }

            swipe(device.width * (0.7 + 0.25 * Math.random()), swipeTop, device.width * (0.1 + 0.25 * Math.random()), swipeTop, 300);
            Common.sleep(3000 + 1000 * Math.random());
        }

        rp = 3;
        while (rp--) {
            try {
                let submitTag = Common.id('dj3').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
                }).findOnce();
                if (submitTag) {
                    Common.click(submitTag);
                    break;
                }
            } catch (e) {
                Common.log(e);
            }

            //查看dg0位置有没有下来
            iptTag = Common.getTags(Common.id('dg0').find());
            if (iptTag.length === 2) {
                iptTag = iptTag[1].bounds().top > iptTag[0].bounds().top ? iptTag[0] : iptTag[1];
            } else {
                iptTag = iptTag[0];
            }

            if (iptTag.bounds().top < device.height * 2 / 3) {
                log('按钮点击没有反应');
                continue;
            }
        }

        Common.sleep(1500 + 1500 * Math.random());
        return true;
    },

    //暂未变更
    commentImage(times) {
        let imgTag = Common.id('kiy').desc('表情').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left >= 0 && v.bounds().width() > 0;
        }).findOnce();

        imgTag.click();
        Common.sleep(1000 + 1000 * Math.random());
        let tag = Common.id('u-n').desc('自定义表情').findOnce();
        tag.click();
        Common.sleep(500 + 500 * Math.random());

        imgs = descMatches(/自定义表情[\s\S]+/).find();//一页7-8个表情
        if (imgs.length === 0) {
            Common.back(2);//退出到视频页面
            return false;
        }

        let rand = Math.round(times * Math.random());
        while (rand--) {
            let x = (0.1 + 0.8 * Math.random()) * device.width;
            let bottom = device.height - 100;
            let top = tag.bounds().top + tag.bounds().height() + 100;
            swipe(x, bottom, x, top, 300 + 200 * Math.random());
            Common.sleep(500 + 500 * Math.random());
        }

        let imgs = descMatches(/自定义表情[\s\S]+/).find();//一页7-8个表情
        rand = Math.round(Math.random() * (imgs.length - 1));
        imgs[rand].click();
        Common.sleep(1000);

        //点击发送
        let rp = 3;
        while (rp--) {
            try {
                let submitTag = Common.id('dj3').filter((v) => {
                    return v && v.bounds() && v.bounds().top >= 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
                }).findOnce();
                if (submitTag) {
                    Common.click(submitTag);
                    break;
                }
            } catch (e) {
                Common.log(e);
            }

            //查看dg0位置有没有下来
            iptTag = Common.getTags(Common.id('dg0').filter((v) => {
                return v && v.bounds() && v.bounds().top >= 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
            }).find());
            if (iptTag.length === 2) {
                iptTag = iptTag[1].bounds().top > iptTag[0].bounds().top ? iptTag[0] : iptTag[1];
            } else {
                iptTag = iptTag[0];
            }

            if (iptTag.bounds().top < device.height * 2 / 3) {
                log('按钮点击没有反应');
                continue;
            }
        }

        Common.sleep(1500 + 1500 * Math.random());
        Common.back();
    },

    zanComment(DyCommon, zanCount, maxZanCount) {
        if (!zanCount) {
            return zanCount;
        }

        log('赞评论数：', zanCount);
        let contains = [];
        let rpCount = 0;
        let sw = 0;
        while (true) {
            DyCommon.log('获取评论列表-开始');
            let comments = this.getList();
            for (let comment of comments) {
                if (this.isZan()) {
                    continue;
                }

                if (comment.zanCount > maxZanCount) {
                    log('大于最高赞');
                    continue;
                }

                if (contains.includes(comment.nickname)) {
                    rpCount++;
                    continue;
                }

                DyCommon.log('是否作者？', comment.isAuthor);
                if (comment.isAuthor) {
                    DyCommon.log('作者或者自己忽略');
                    continue;
                }

                contains.push(comment.nickname);
                this.clickZan(comment);
                log('赞评论');
                DyCommon.sleep(1000 + 2000 * Math.random())
                zanCount--;
                if (zanCount <= 0) {
                    return true;
                }
            }

            if (rpCount >= 3) {
                return true;
            }

            log('评论翻页');
            sw++;
            if (sw >= 5) {
                return true;
            }
            this.swipeTop();
        }
    },

    zanComment(DyCommon, zanCount, meNickname) {
        //随机点赞 评论回复
        let contains = [];//防止重复的
        let rps = 0;//大于2 则退出
        let opCount = 5;

        while (true) {
            DyCommon.log('获取评论列表-开始');
            let comments = this.getList();
            DyCommon.log('获取到了评论列表：' + comments.length);
            if (comments.length === 0) {
                break;
            }

            let rpCount = 0;
            for (let comment of comments) {
                //移除了comment.content
                if (contains.includes(comment.nickname)) {
                    rpCount++;
                    continue;
                }

                DyCommon.log('是否作者？', comment.isAuthor, comment.nickname);
                if (comment.nickname === meNickname || comment.isAuthor) {
                    DyCommon.log('作者或者自己忽略');
                    continue;
                }

                rps = 0;//只要有一个不在列表，则清零
                contains.push(comment.nickname);

                DyCommon.log('赞评论了哦', comment.tag);
                try {
                    this.clickZan(comment);//////////////////////操作
                    // statistics.zanComment();//赞评论数量加1
                } catch (e) {
                    log(e);
                }

                zanCount--;
                if (zanCount <= 0) {
                    break;
                }
            }

            if (rpCount === comments.length) {
                rps++;
            } else {
                opCount--;
            }

            if (rps >= 2 || opCount <= 0) {
                DyCommon.log(rps + ':' + opCount);
                //DyCommon.back();//评论页面返回到视频页面
                break;
            }

            DyCommon.log('滑动评论');
            this.swipeTop();
            DyCommon.sleep(2000 + 1000 * Math.random());
        }

        DyCommon.log('返回了哦');
        DyCommon.sleep(300);
        DyCommon.back();
        //漏洞修复  如果此时还在评论页面，则再一次返回
        DyCommon.sleep(1000);
        if (DyCommon.id('title').textContains('评论').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOnce()) {
            DyCommon.back();
            DyCommon.log('再次返回');
        }

        DyCommon.sleep(500 + 500 * Math.random());
    }
}

module.exports = Comment;
