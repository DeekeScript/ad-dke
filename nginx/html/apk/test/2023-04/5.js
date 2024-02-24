function getContentTag() {
    let tag = id('desc').filter((v) => {
        return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
    }).findOne(2000);
    if (tag) {
        return tag;
    }

    return false;//极端情况是可以没有内容的
}

// let t = getContentTag();
// log(t);
// log(id('desc').find());

// log(descContains('在线观众').textContains('在线观众').filter((v) => {
//     return v && v.bounds() && v.bounds().top && v.bounds().width() && v.bounds().height() && v.bounds().top + v.bounds().height() < device.height;
// }).findOne(2000));

// let workTag = id('android:id/text1').descContains('作品').findOne(2000).text();
// log(id('ola').text('关注').findOne(2000));

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

// let containers = Common.id('container').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
// }).find();


// log(containers);


// workTag = id('android:id/text1').descContains('作品').findOne(2000);
// if (workTag) {
//     Common.click(workTag);
//     log('点击workTag');
//     sleep(2000);
// }
// // click(workTag.bounds().left + workTag.bounds().width() + 80, workTag.bounds().top - 10);
// workTag.click();

// function  getContentTag() {
//     let tag = Common.id('desc').filter((v) => {
//         return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
//     }).findOne(2000);
//     if (tag) {
//         return tag;
//     }

//     return false;//极端情况是可以没有内容的
// }

// log(getContentTag());

// let a = Common.id('dge').find();

// for (let i in a) {
//     if (isNaN(i)) {
//         continue;
//     }
//     log(a[i].children().findOne(Common.id('c6e').text('作者')) ? true : false);
// }

// log(desc('搜索').findOne(2000));


function getDistanceTag(loop) {
    let name = 'n1c';
    if (loop) {
        name = 'n9q';
    }

    let tag = Common.id(name).filter((v) => {
        return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
    }).findOnce();
    if (tag) {
        return tag;
    }

    if (!loop) {
        return this.getDistanceTag(1);
    }

    if (loop) {
        return {
            text: () => {
                return '0';
            }
        };
    }
}

// log('开始');
// let a = getDistanceTag();
// log(a);


// let cityTag = Common.id('wqe').text('张湾').findOnce();
// log(Common.id('wqe').findOnce(), Common.id('wqe').text('张湾').findOnce());
// Common.click(cityTag);

// log(currentPackage());

log(Common.id('desc').filter((v) => {
    return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
}).findOnce());
