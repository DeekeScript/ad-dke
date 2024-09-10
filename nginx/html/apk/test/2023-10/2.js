// log(packageName("com.ss.android.ugc.aweme").textContains('作者').find());

// log(packageName("com.ss.android.ugc.aweme").descContains('作者').find());

// let tag = id("com.ss.android.ugc.aweme:id/d6s").findOnce();
// // log(tag, descContains('几点').findOnce());

// log(tag.desc().split(',,,,')[1])//,,,,


// id("com.ss.android.ugc.aweme:id/1").filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left >= 0 && v.bounds().width() > 0;
// }).findOnce().scrollForward();


// log(id('l5').scrollable(true).filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == device.width && v.bounds().top >= 0;
// }).findOnce().scrollForward());//zrh  l_a  ;  viewpager    l5


// log(textContains('互关').findOnce());

// log(id('xpk').descContains('直播中').find());


// log(textContains('41').find());

let Common = {
    id(name) {
        return id("com.ss.android.ugc.aweme:id/" + name);
    }
}

function isLiving() {
    //两种方式，一种是屏幕上展示，一种是头像
    let tags = Common.id('mdo').descContains('点击进入直播间').filter((v) => {
        return v.bounds() && (v.bounds().height() > 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0);
    }).exists();

    if (tags) {
        return true;
    }

    tags = Common.id('yz4').clickable(true).descContains('直播中').filter((v) => {
        return v.bounds() && (v.bounds().height() > 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0);
    }).exists();

    return tags ? true : false;
}

// log(isLiving());
// log(descContains('直播中').find());

// log(textContains('自定义表情').find());
// log(descContains('自定义表情').find());

// id('com.ss.android.ugc.aweme:id/u-n').desc('自定义表情').findOnce().click();

// log(scrollable(true).find());

// scrollForward();

// log(desc('at').find());

// let submitTag = Common.id('dj3').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
// }).findOnce();

// log(submitTag);

log(descContains('群成员').find());
