
const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    click(tag) {
        click(tag.bounds().centerX(), tag.bounds().centerY());
    }
}

// log(Common.id('olb').findOnce().click());

function iptEmoj(count) {
    let emjs = Common.id('e+l').filter((v) => {
        return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left >= 0;
    }).findOne(2000).children().find(Common.id('e--'));

    let emj = emjs[Math.floor(Math.random() * emjs.length)];
    while (count--) {
        log(count);
        Common.click(emj);
        sleep(500 + 500 * Math.random());
    }
}

// iptEmoj(3);

//log(id('r5i').desc('自定义表情').findOnce().click());

// let a = descMatches(/.+/).find();
// for (let i in a) {
//     log(a[i]);
// }

// log(descMatches(/自定义表情[\s\S]+/).find());

// let a = desc('拒绝').text('拒绝').filter((v) => {
//     return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height;
// }).findOnce();

// Common.click(a);

// if (text("拒绝").exists()) {
//     let a = text("拒绝").filter((v) => {
//         return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
//     }).findOne(2000);
//     if (a) {
//         Common.click(a);

//     }
// }

// log(text('反馈').desc('反馈').clickable(true).filter((v) => {
//     return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
// }).findOnce());

function isPrivate() {
    if (Common.id('title').text('私密账号').findOnce() ? true : false) {
        return true;
    }

    if (Common.id('ssm').textContains('封禁').findOnce() ? true : false) {
        return true;
    }
    return false;
}

// console.log(isPrivate());

function intoLocal() {
    let tjs = Common.id('u5n').find();
    if (!tjs || tjs.length === 0) {
        throw new Error('找不到同城');
    }

    let tj = undefined;
    for (let i in tjs) {
        if (isNaN(i) || typeof (tjs[i]).toString() == 'function') {
            continue;
        }

        if (['探索', '关注', '商城', '推荐', '购物', '社区', '经验', '读书日'].includes(tjs[i].text())) {
            continue;
        }
        tj = tjs[i];
    }

    return tj;
}

// log(intoLocal());

function getNumForDetail(str) {
    hour = /(\d+)小时前/.exec(str);
    if (hour && hour[1]) {
        return hour * 60;
    }

    minute = /(\d+)分钟前/.exec(str);
    return minute && minute[1];
}

// let containers = Common.id('jf').descMatches(/[\s\S]+[小时|分钟]前，[\s\S]+/).clickable(true).className('android.view.ViewGroup').findOnce();
// let str = containers.desc().toString();
// log(str);
// log(getNumForDetail(str));

// log(containers.children().findOne(Common.id('c5f').descContains('回复评论')));

// log(containers.children().findOne(Common.id('c2s').descContains('赞')));


let msgTag = Common.id('red_tips_count_view').descContains('未读消息').filter((v) => {
    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left > 0 && v.bounds().width() > 0;
}).findOnce();

log(msgTag.parent().children().findOne(Common.id('tv_title').descContains('互动消息')));
