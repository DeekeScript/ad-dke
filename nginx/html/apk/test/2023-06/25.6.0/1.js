// log(className('com.lynx.tasm.behavior.ui.LynxFlattenUI').filter((v) => {
//     return v && v.bounds() && v.bounds().width() === device.width;
// }).find());

// log(clickable(false).find());

// log(id('com.ss.android.ugc.aweme:id/qr-').find());

// let tag = textContains('332577416').filter((v) => {
//     return v && v.id() === null && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().height() > 0;
// }).findOnce().parent().children().findOne(textContains('直播'));

// click(tag.bounds().centerX(), tag.bounds().centerY());

// log(tag);

// let tags = className('android.widget.FrameLayout').focusable(true).filter((v) => {
//     return v && v.bounds() && v.bounds().left === 0 && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && !!v.children() && !!v.children().findOne(textContains('粉丝'));
// }).find();

// log(tags[0].children().findOne(textContains('粉丝')));

// let tags = id('com.ss.android.ugc.aweme:id/n84').findOnce().children().find(textMatches(/[\s\S]+/));
// log(tags);

// log(text('进入橱窗').findOnce().parent().parent());

// let tag = id('com.ss.android.ugc.aweme:id/n8s').findOnce();

// let m = tag.children().findOne(text('进入橱窗'));
// log(m);

let Common = {
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },
    aId(name) {
        //android:id/text1
        return id('android:id/' + name);
    },
}

// let tag = Common.id('desc').filter((v) => {
//     return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
// }).findOnce();

// log(tag);

// let tags = Common.id('vl=').descContains('点击进入直播间').filter((v) => {
//     return v.bounds() && (v.bounds().height() > 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0);
// }).findOnce();

// log(tags);

// log(descContains(18).findOnce());

// log(descMatches(/[\s\S]+[小时|分钟]前，[\s\S]+/).find());
// log(textContains('评论').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
// }).findOnce());

// log(textContains('点击重播').findOnce());

// log(textContains('立即试玩').findOnce());

// let containers = Common.id('container').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
// }).find();

// let video = containers[0].children().findOne(Common.id('vl='));

// log(video);

function b() {
    let focusTag = Common.id('wsy').findOnce();//.text('关注')  .text('回关')
    if (focusTag && focusTag.bounds().top < device.height) {
        Common.click(focusTag);
        return true;
    }

    let hasFocusTag = Common.id('pd5').text('已关注').findOnce();
    if (hasFocusTag) {
        return true;
    }
}

// log(b());

// log(textContains('关注').findOnce());

// function c() {
//     let p = Common.id('close').desc('关闭').findOnce();
//     log(p.parent().id() === 'com.ss.android.ugc.aweme:id/root');
// }

// c();

function m() {
    let containers = Common.id('container').filter((v) => {
        return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
    }).find();
    log(containers.length);

    let settingTag = Common.id('tqs').desc('更多').filter((v) => {
        return v && v.bounds() && v.bounds().top && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().left > 0;
    }).findOnce();

    log(settingTag);
}

// m();


function a() {
    let tags = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').filter((v) => {
        return v && !v.text().includes('我的信息') && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height - 300 && v.bounds().left === 0 && v.bounds().width() === device.width;
    }).find()

    let users = [];
    for (let i in tags) {
        try {
            if (isNaN(i)) {
                continue;
            }
            let tp = /第(\d+)名/.exec(tags[i].text());
            users.push({
                title: tags[i].text(),
                tag: tags[i],
                index: (tp && tp[1]) || 1000,
            });
        } catch (e) {
            log(tags[i]);
            log(e);
        }
    }
    log(users);
}

// log(a());

// function next() {
//     let left = device.width * 0.2 + device.width * 0.5 * Math.random();
//     swipe(left, device.height * 3 / 4 - 200 * Math.random(), left + Math.random() * 100, device.height * 1 / 4 - 200 * Math.random(), 100 + Math.random() * 100);
// }
// next();


// let commentWindowTag = Common.id('grq').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().height() > 0 && v.bounds().width() > 0 && v.bounds().height() + v.bounds().top <= device.height;
// }).findOnce();

// log(commentWindowTag,  Common.id('grq').findOnce());

// log(text('回复').findOne(2000));

// let tags = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').filter((v) => {
//     return v && !!v.text() && !v.text().includes('我的信息') && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height - 300 && v.bounds().left === 0 && v.bounds().width() === device.width;
// }).find();

// log(tags);

// swipe(40, 600, 1, 600, 500);

// log(Common.id('pd5').text('互相关注').findOnce());

// log(textContains('店铺').findOnce());

// let videoTag = Common.aId('text1').text('用户').findOnce();
// let rightTag = Common.id('s0o').findOnce();
// log(videoTag.bounds().left , videoTag.bounds().width() , rightTag.bounds().left);
// if (videoTag.bounds().width() < 0 || videoTag.bounds().left + videoTag.bounds().width() > rightTag.bounds().left) {
//     log('swipt');
//     swipe(device.width * 2 / 3, videoTag.bounds().centerY(), device.width * 1 / 3, videoTag.bounds().centerY(), 300);
// }

// function _back(n) {
//     for (let i = 0; i < n; i++) {
//         back();
//         log(1);
//         sleep(600);
//     }
// }

// _back(3);

// let workTag = textContains('作品').findOnce();
// click(workTag.bounds().centerX(), workTag.bounds().centerY());
// sleep(1000);
// swipe(workTag.bounds().left + workTag.bounds().width(), workTag.bounds().centerY(), workTag.bounds().left, workTag.bounds().centerY(), 300);


let statistics = {
    getDate() {
        let d = new Date();
        let m = d.getMonth() + 1;
        let date = d.getDate();
        return (m >= 10 ? m : ('0' + m)) + '-' + (date >= 10 ? date : ('0' + date));
    },

    zan() {
        let time = this.getDate();
        let count = storage.get('s_zan' + time) || 0;
        storage.set('s_zan', count + 1);
    },

    comment() {
        let time = this.getDate();
        let count = storage.get('s_comment' + time) || 0;
        storage.set('s_comment', count + 1);
    },

    zanComment() {
        let time = this.getDate();
        let count = storage.get('s_zanComment' + time) || 0;
        storage.set('s_zanComment', count + 1);
    },

    privateMsg() {
        let time = this.getDate();
        let count = storage.get('s_private_msg' + time) || 0;
        storage.set('s_private_msg', count + 1);
    },

    focus() {
        let time = this.getDate();
        let count = storage.get('s_focus' + time) || 0;
        storage.set('s_focus', count + 1);
    },

    viewUser() {
        let time = this.getDate();
        let count = storage.get('s_viewUser' + time) || 0;
        storage.set('s_viewUser', count + 1);
    },

    getWeekDate() {
        let dates = [];
        // 获取当前日期
        let now = new Date();
        // 循环获取最近 7 天的日期
        for (let i = 1; i <= 7; i++) {
            // 获取当前日期的时间戳
            let timestamp = now.getTime();
            // 计算 i 天前的时间戳
            let dayTimestamp = 24 * 60 * 60 * 1000; // 一天的毫秒数
            let iDayAgoTimestamp = timestamp - i * dayTimestamp;
            // 转换为日期对象
            let date = new Date(iDayAgoTimestamp);
            // 格式化日期为 "yyyy-MM-dd" 的字符串并存入数组
            //let year = date.getFullYear();
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
            dates.push(month + "-" + day);
        }
        return dates;
    },

    getData(time) {
        let time = time || this.getDate();
        return {
            s_zan: Math.random() * 100,
            s_comment: Math.random() * 100,
            s_zanComment: Math.random() * 100,
            s_private_msg: Math.random() * 100,
            s_focus: Math.random() * 100,
            s_viewUser: Math.random() * 100,
        }
    },

    getWeekData() {
        let dates = this.getWeekDate();
        let data = [];
        for (let i in dates) {
            data.push([dates[i], this.getData(dates[i])]);
        }

        //数据整理
        let res = {};
        let ids = ['s_zan', 's_comment', 's_zanComment', 's_private_msg', 's_focus', 's_viewUser'];
        for (let i in ids) {
            res[ids[i]] = [];
            for (let j in data) {
                res[ids[i]].push([data[j][0], data[j][1][ids[i]]]);
            }
        }
        return res;
    }
}

// log(statistics.getWeekData());

function ss(){
    let atTag = Common.id('aj8').desc('at').find();
    if (atTag.length === 2) {
        atTag = atTag[1].bounds().top > atTag[0].bounds().top ? atTag[0] : atTag[1];
    } else {
        atTag = atTag[0];
    }

    atTag.click();
    log(atTag);
}

// ss();

function next() {
    let left = device.width * 0.3 + device.width * 0.4 * Math.random();
    swipe(left, device.height * 3 / 4 - 200 * Math.random(), left + Math.random() * 100, device.height * 1 / 4 - 200 * Math.random(), 100 + Math.random() * 100);
}

// next();

swipe(300, 1200, 300, 1190, 500);
