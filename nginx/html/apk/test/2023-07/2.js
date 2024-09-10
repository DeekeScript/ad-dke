let Common = {
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },
    aId(name) {
        //android:id/text1
        return id('android:id/' + name);
    },
}

function m() {
    launch('com.ss.android.ugc.aweme');//打开抖音
    let k = 5;
    while (k-- >= 0) {
        log(k);
        this.sleep(3000);
        let homeTag = this.id('r6d').filter((v) => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0;
        }).findOnce();
        if (homeTag) {
            break;
        }
    }
}

// m();

// function k() {
//     let hasFocusTag = Common.id('olb').text('已关注').findOnce() || Common.id('olb').text('互相关注').findOnce();
//     if (hasFocusTag) {
//         return true;
//     }
//     return false;
// }

// log(k());

function getStep(oldArr, newArr) {
    // log(oldArr, newArr);
    if (newArr.length === 0) {
        return oldArr.length;
    }

    let some = [];
    for (let i in newArr) {
        for (let j in oldArr) {
            if (oldArr[j] === newArr[i]) {
                let kk = [];
                for (let k = i; k < newArr.length; k++) {
                    if (oldArr[k * 1 - i * 1 + j * 1] === newArr[k]) {
                        kk.push(newArr[k]);
                        continue;
                    }
                    break;
                }

                if (kk.length) {
                    some.push(kk);
                }
            }
        }
    }

    let max = [];
    for (let i in some) {
        if (some[i].length > max.length) {
            max = some[i];
        }
    }

    return oldArr.length - max.length;
}

function gotoIndex(index) {
    let newArr = [];
    let oldArr = [];
    let currentIndex = 0;

    while (true) {
        let tags = Common.id('vad').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
        }).find();

        for (let i in tags) {
            if (isNaN(i)) {
                continue;
            }

            oldArr.push(tags[i].text());
        }

        let step = getStep(oldArr, newArr);
        currentIndex += step;
        log(currentIndex, step, index);
        if (currentIndex >= index) {
            return true;
        }
        newArr = JSON.parse(JSON.stringify(oldArr));
        oldArr = [];
        swipe(300, 2000, 300, 1200, 500);
    }
}

gotoIndex(32);

// let newArr = [
//     '何小敏卤味（后湖越秀店）',
//     '武汉轻松开个店',
//     'っ、、和平',
//     '相信你',
//     '城市公馆—军哥',
//     '现货农产品',
//     '十一爸爸'
// ];

// let oldArr = [
//     '何小敏卤味（后湖越秀店）',
//     '武汉轻松开个店',
//     'っ、、和平',
//     '相信你',
//     '城市公馆—军哥',
//     '现货农产品',
//     '十一爸爸'
// ];

// log(getStep(oldArr, newArr));
