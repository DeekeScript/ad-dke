function _id(name) {
    return id('com.ss.android.ugc.aweme:id/' + name);
}

// let zanTag = _id('d8b').find();
// console.log(zanTag);

// for (let i in zanTag) {
//     if (isNaN(i)) {
//         continue;
//     }
//     console.log(zanTag[i]);
// }


// console.log(descContains('1772').findOne());


// console.log(descContains('点击进入直播间').findOne(2000));
// console.log(_id('k9v').findOne(2000));

// console.log(textContains('赚钱').findOne(2000));


// let back = _id('o=s').findOne(2000);
// click(back.bounds().centerX(), back.bounds().centerY());

// let m = _id('de7').find();

// console.log(m);

// console.log(selected(true).find());
// console.log(checkable(true).find());

// let i = 3;
// while (i--) {
//     console.log('第' + i + '次');
//     device.keepScreenDim();
//     sleep(5 * 1000);//等待5秒
//     //device.wakeUpIfNeeded();
//     device.cancelKeepingAwake();
//     sleep(20 * 1000);
//     device.wakeUp();
//     sleep(1000);
//     swipe(200, device.height * 2 / 3, 200, device.height / 6, 200);
// }

// console.log(textContains('智能获客').findOne(2000));

// console.log(textContains('25.9').findOne(2000));

// let searchTag = _id('inh').findOne(2000);
// console.log(searchTag);

// console.log(textContains('搜索').findOne(2000));
// console.log(descContains('搜索').findOne(2000));

// console.log(device.height);

// launch('com.ss.android.ugc.aweme');
// launch('com.tencent.mobileqq');

// console.log(id('android:id/text1').text('视频').findOne(2000));

// console.log(id('us8').textContains('推荐').findOne(2000));

function intoLocal() {
    let tj = _id('us8').textContains('推荐').findOne(2000);
    let top = tj.bounds().top + tj.bounds().height() * Math.random();
    let right = tj.bounds().left + tj.bounds().width();
    swipe(right - 300, top, right, top, 300);
    this.sleep(2000);
    click(_id('us8').findOne(2000).bounds().centerX(), _id('us8').findOne(2000).bounds().centerY());
    this.sleep(3000);
}

intoLocal();

function intoRecommend() {
    let tj = this.id('us8').textContains('推荐').findOne(2000);
    let top = tj.bounds().top + tj.bounds().height() * Math.random();
    let left = tj.bounds().left;
    swipe(left, top, left - 300, top, 300);
    this.sleep(2000);
    click(_id('us8').textContains('推荐').findOne(2000).bounds().centerX(), _id('us8').textContains('推荐').findOne(2000).bounds().centerY());
    this.sleep(3000);
}

intoRecommend();
