// log(id('fxl').filter((v) => {
//     return v && v.bounds() && v.bounds().top && v.bounds().top + v.bounds().height() < device.height;
// }).findOnce().children());


// if (text('反馈').desc('反馈').clickable(true).filter((v) => {
//     return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
// }).exists()) {
//     log('存在“反馈”字眼');
// }


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

// let tag = Common.id('jar').clickable(true).desc('搜索').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left > 0 && v.bounds().width() > 0;
// }).findOnce();

// log(tag);

// let contains = Common.id('content').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().left >= 0 && v.bounds().width() > 0;
// }).find();

// log(contains);

// let intoGroupUserTag = Common.id('f+a').desc('更多').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().left > 0;
// }).findOnce();

// log(intoGroupUserTag);

function viewDetail() {
    //let name = 'k+t';//Common.id(name).find()
    //let name = 'k+t';//Common.id(name).find()
    let tags = text('查看详情').descContains('查看详情').filter((v) => {
        return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
    }).findOnce();

    if (tags) {
        return true;
    }

    tags = Common.id('fwy').text('查看详情').filter((v) => {
        return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
    }).findOnce();
    return tags || false;
}

// console.log(viewDetail())

// if (Common.id('ssm').textContains('封禁').findOnce()) {
//     log(true);
// }


// let tag = className('android.widget.FrameLayout').filter((v) => {
//     return v && v.bounds() && v.bounds().left === 0 && v.bounds().top > textTag.bounds().top + textTag.bounds().height() + 30 && v.children() ? true : false && v.children().findOne(textContains('粉丝'));
// }).findOnce().children().findOne(textContains('粉丝'));

// let text = tag.text().split('，');
// console.log(text[2].replace('抖音号：', '').replace('按钮', ''));


// for (let i of clickable(false).find()) {
//     log(i);
// }

// let res = shell('wm density');
// log(res);

let focusTag = Common.id('ola').text('关注').findOnce();
log(focusTag);
