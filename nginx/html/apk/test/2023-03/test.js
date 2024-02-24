//sleep(7000);

// console.log(id('com.ss.android.ugc.aweme:id/c49').find());
// // console.log(descContains('平等').find());

// console.log(id('com.ss.android.ugc.aweme:id/c2u').find());


home();
this.sleep(1000);
recents();
this.sleep(1000);
let dy = textContains('抖音').id('title_view').findOne(2000);
if (!dy) {
    dy = descContains('抖音').findOne(2000);
}
console.log(dy);
