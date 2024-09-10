


// let k = 10;

// while (k-- > 0) {
//     click(1, 1);
//     log('click');
//     sleep(2000);
// }


// device.cancelKeepingAwake();
// device.keepScreenDim();

// let k = 10;

// while (k-- > 0) {
//     log(k);
//     sleep(10000);
//     //唤醒
// }

let tag = textContains('st66889697').filter((v) => {
    return v && v.id() === null && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().height() > 0;
}).findOne(2000).parent().children().findOne(textContains('直播'));

click(tag.bounds().centerX(), tag.bounds().centerY());


// let container = id('container').filter((v) => {
//     return v && !v.children().findOne(descContains('置顶'));
// }).findOne(2000);
// log(container.children().findOne(descContains('置顶')));


// log(textContains('39').findOne(2000).parent().parent());

// let tags = id('acx').findOne(2000).children().find(textMatches(/[\s\S]+/)).filter((v) => {
//     return v && !v.text().includes('我的信息') && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height - 200 && v.bounds().left === 0 && v.bounds().width() === device.width;
// });

// for(let i in tags){
//     let tp = /第(\d+)名/.exec(tags[i].text());
//     log(tp[1]);
// }
