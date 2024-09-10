
// threads.start(() => {
//     this.log('开启线程监听弹窗');
//     while (true) {
//         if (text("稍后").exists()) {
//             text("稍后").findOne(2000).click();
//         }
//         if (text("以后再说").exists()) {
//             text("以后再说").findOne(2000).click();
//         }
//         if (text("我知道了").exists()) {
//             text("我知道了").findOne(2000).click();
//         }
//         if (text("下次再说").exists()) {
//             text("下次再说").findOne(2000).click();
//         }
//         if (text("确定").exists()) {
//             text("确定").findOne(2000).click();
//         }

//         if (this.id('dz7').text("取消").exists()) {
//             text("确定").findOne(2000).click();
//         }

//         if (this.id('close').desc('关闭').exists()) {
//             this.id('close').desc('关闭').findOne(2000).click();
//         }
//         this.sleep(500);
//     }
// });



const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    aId(name) {
        //android:id/text1
        return id('android:id/' + name);
    },

    getTags(tags) {
        let tgs = [];
        for (let i in tags) {
            if (isNaN(i) || typeof (tags[i]).toString() == 'function') {
                continue;
            }
            tgs.push(tags[i]);
        }
        return tgs;
    },

    sleep(time) {
        sleep(time);
    },
}


function getInTimeTag() {
    let name = 'uni';
    let tags = Common.getTags(Common.id(name).find());
    for (let i in tags) {
        if (!tags[i] || !tags[i].bounds) {
            continue;
        }
        if (tags[i].bounds().top < 200) {
            continue;
        }
        if (tags[i].bounds().top > device.height) {
            continue;
        }
        return tags[i];
    }
    throw new Error('找不到inTime');
}

function getInTime() {
    let inTimeTag = getInTimeTag();
    let time = inTimeTag.text().replace('· ', '');
    let incSecond = 0;
    if (time.indexOf('分钟前') !== -1) {
        incSecond = time.replace('分钟前', '') * 60;
    } else if (time.indexOf('小时前') !== -1) {
        incSecond = time.replace('小时前', '') * 3600;
    } else if (time.indexOf('刚刚') !== -1) {
        incSecond = 0;
    } else if (time.indexOf('天前') !== -1) {
        incSecond = time.replace('天前', '') * 86400;
    } else if (time.indexOf('周前') !== -1) {
        incSecond = time.replace('周前', '') * 86400 * 7;
    } else if (time.indexOf('昨天') !== -1) {
        time = time.replace('昨天', '').split(':');
        incSecond = 86400 - time[0] * 3600 - time[1] * 60 + (new Date()).getHours() * 3600 + (new Date()).getMinutes() * 60;
    } else if (/[\d]{2}\-[\d]{2}/.test(time) || /[\d]{2}\月[\d]{2}日/.test(time)) {
        time = time.replace('日', '').replace('月', '-');
        time = (new Date()).getFullYear() + '-' + time;
        incSecond = Date.parse(new Date()) / 1000 - (new Date(time)).getTime() / 1000;//日期
    } else {
        time = time.replace('日', '').replace('月', '-').replace('年', '-');
        incSecond = Date.parse(new Date()) / 1000 - (new Date(time)).getTime() / 1000;//直接是日期
    }
    return incSecond;
}

// console.log(getInTime() / 3600 / 24);


function getDistanceTag(loop) {
    let name = 'n1c';
    if (loop) {
        name = 'n9q';
    }

    let tags = Common.getTags(Common.id(name).find());
    for (let i in tags) {
        if (!tags[i] || !tags[i].bounds) {
            continue;
        }
        if (tags[i].bounds().top < 200) {
            continue;
        }
        if (tags[i].bounds().top > device.height) {
            continue;
        }
        return tags[i];
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

function getDistance() {
    let tag = this.getDistanceTag();
    return tag.text().replace('公里', '').replace('km', '') * 1;
}

console.log(getDistance());
