

// console.log(id('com.ss.android.ugc.aweme:id/cyy').findOne(2000));
// console.log(descContains('抖音').findOne(2000));
// console.log(textMatches(/抖音/).find());
// console.log(descMatches(/抖音/).find());

// text("我知道了").findOne(2000).click();


// home();
// this.sleep(1000);
// recents();
// this.sleep(1000);

// let dy = textContains('抖音').id('title_view').findOne(2000);
// if (!dy) {
//     dy = descContains('抖音').findOne(2000);
// }

// console.log(textContains('抖音').id('title_view'));
// console.log(descContains('抖音').find());


let btm = device.height * (0.5 + Math.random() * 0.1);
let lf = 300 * Math.random();
swipe(device.width / 2 - 150 + lf, btm, device.width / 2 - 150 + lf, device.height * (0.1 + 0.05 * Math.random()), 200 + 200 + Math.random());//从下往上推，清除

