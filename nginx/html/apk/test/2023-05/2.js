let Common = {
    click(tag) {
        click(tag.bounds().centerX(), tag.bounds().centerY());
    },

    sleep(second) {
        sleep(second);
    },

    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
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
}

function a() {
    let bottom = device.height - 200 - Math.random() * 300;
    let top = bottom - 400 - Math.random() * 200;
    let left = device.width * 0.1 + Math.random() * (device.width * 0.8);
    swipe(left, bottom, left, top, 300);
    Common.sleep(1500);

    //这里需要判断是否是商家
    workTag = id('android:id/text1').descContains('作品').filter((v) => {
        return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
    }).findOnce();
    log(workTag);

    if (workTag) {
        Common.click(workTag);
        log('点击workTag');
        Common.sleep(2000);
    }

    //press(workTag.bounds().centerX(), workTag.bounds().centerY(), 50);
    swipe(800, 600, 750, 600, 200);
    Common.sleep(500);
}

// a();

function b() {
    if (Common.id('tv_title').textContains('账号已经注销').findOnce()) {
        return true;
    }
}

// log(b());

function c() {
    let textTag = id('android:id/text1').text('用户').findOnce();
    let tags = className('android.widget.FrameLayout').focusable(true).filter((v) => {
        return v && (v.bounds() && v.bounds().left === 0) && v.bounds().top > textTag.bounds().top + textTag.bounds().height() + 30 && v.bounds().top + v.bounds().height() < device.height && !!v.children() && !!v.children().findOne(textContains('粉丝')) && v.bounds().width() === device.width;
    }).find();

    log(tags.length, tags[tags.length - 1], tags[tags.length - 2], device.height);
}

// c();


function d() {
    let workTag = id('android:id/text1').descContains('作品').findOnce();
    log(Common.numDeal(workTag.text()));
}

// d();

// swipe(200, 600, 200, 601, 1);


// let containers = Common.id('container').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
// }).find();

// let videoIndex = null;
// let baseZanCount = null;
// for (let i in containers) {
//     if (isNaN(i)) {
//         continue;
//     }

//     let video = containers[i].children().findOne(Common.id('lc-'));
//     let index = video.desc().indexOf('点赞数');
//     let zanCount = Common.numDeal(video.desc().substring(index + 3)) * 1;
//     log(index, zanCount, video.desc());
//     if (null === baseZanCount || zanCount < baseZanCount) {
//         baseZanCount = zanCount;
//         videoIndex = i;
//     }
// }

// log('最小赞', baseZanCount);

// auto.setMode('fast');
// log(id('com.ss.android.ugc.aweme:id/desc').find());


