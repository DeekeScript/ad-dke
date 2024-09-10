
let Common = {
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    sleep(time) {
        sleep(time);
    }
}

// let tags = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').textContains('粉丝').filter((v) => {
//     return v && !!v.bounds() && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().top > 0;
// }).find();

// for (let i in tags) {
//     if (isNaN(i)) {
//         continue;
//     }

//     click(tags[i].bounds().centerX(), tags[i].bounds().centerY());
//     sleep(3000);

//     let contentTag = className('android.widget.TextView').clickable(true).filter((v) => {
//         return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0;
//     }).textContains('更多').findOnce();
//     log(contentTag);
//     if (contentTag) {
//         //点击10次确保点击正常
//         let h = contentTag.bounds().top + contentTag.bounds().height() * (1 / 3 + 2 / 3 * Math.random());
//         let step = contentTag.bounds().width() / 20;
//         for (let i = 0; i < 20; i++) {
//             click(contentTag.bounds().left + i * step, h);
//             sleep(30);
//         }
//         sleep(1000);
//     }

//     contentTag = className('android.widget.TextView').filter((v) => {
//         return v && v.bounds() && v.bounds().left == contentTag.bounds().left && v.bounds().top == contentTag.bounds().top && v.bounds().width() == contentTag.bounds().width();
//     }).clickable(true).findOnce();

//     let p = /[\d-—]{11,14}/.exec(contentTag.text());
//     if (p && p.length) {
//         log(p[0]);
//     }
//     break;
// }


// let tag = Common.id('nes').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0;
// }).findOnce();

// log(tag);


// let tag = Common.id('s32').textContains('联系电话').findOnce();
// click(tag.bounds().centerX(), tag.bounds().centerY());
// sleep(3000);

// let mobile = Common.id('fe_').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0;
// }).findOnce().text().replace('呼叫', '').replace(' ', '');
// log(mobile);

// log(Common.id('s32').textContains('联系').findOnce());


// let left = (1 / 5 + 3 / 5 * Math.random()) * device.width;
// let rd = Math.random();
// swipe(left, device.height * (2 / 3 + 1 / 8 * rd), left + Math.random() * 50 * Math.random(), device.height * (1 / 4 + 1 / 8 * rd), 400 + Math.random() * 100);



function b() {
    let tCommon = Common;
    let contentTag = className('android.widget.TextView').clickable(true).filter((v) => {
        return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0;
    }).textContains('更多').findOnce();

    log(contentTag);
    if (contentTag) {
        //点击10次确保点击正常
        let h = contentTag.bounds().top + contentTag.bounds().height() - 20;
        let step = contentTag.bounds().width() / 20;
        for (let i = 0; i < 20; i++) {
            click(contentTag.bounds().left + i * step, h);
            sleep(30);
        }
        tCommon.sleep(1000);
        contentTag = className('android.widget.TextView').filter((v) => {
            return v && v.bounds() && v.bounds().left == contentTag.bounds().left && v.bounds().top == contentTag.bounds().top && v.bounds().width() == contentTag.bounds().width();
        }).clickable(true).findOnce();
    } else {
        let tag = tCommon.id('nes').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0;
        }).findOnce();

        contentTag = className('android.widget.TextView').filter((v) => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top == tag.bounds().top + tag.bounds().height() && v.bounds().width() > 0;
        }).clickable(true).findOnce();
        log(33);
    }

    log(contentTag);
    if (contentTag && contentTag.text()) {
        let p = /[\d-—]{11,14}/.exec(contentTag.text());
        log('p', p);
        if (p && p.length) {
            let mobile = p[0];
            let dyAccount = DyUser.getDouyin();
            let dyNickname = DyUser.getNickname();
            files.append(filename, "手机号：" + mobile + "       昵称：" + dyNickname + "       抖音号：" + dyAccount + "\r\n");
            toast('手机号写入成功');
        } else {
            p = /\d{3}.*\d{4}.*\d{4}/.exec(contentTag.text());
            log(p);
            if (p && p.length) {
                let mobile = p[0];
                let dyAccount = DyUser.getDouyin();
                let dyNickname = DyUser.getNickname();
                files.append(filename, "手机号：" + mobile + "       昵称：" + dyNickname + "       抖音号：" + dyAccount + "\r\n");
                toast('手机号写入成功');
            }
        }
    }
}

b();
