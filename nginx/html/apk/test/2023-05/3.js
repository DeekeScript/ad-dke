
// while (true) {
//     swipe(200, 2000, 200, 500, 300);
//     sleep(3000);
//     try {
//         log('title', id('com.ss.android.ugc.live:id/j8a').filter((v) => {
//             return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
//         }).findOnce().text());

//         log('点赞', id('com.ss.android.ugc.live:id/e5e').filter((v) => {
//             return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
//         }).findOnce().text());
//     } catch (e) {
//         log(e);
//     }
// }


// swipe(200, 600, 200, 620, 100);

// log(textMatches(/[\s\S]+/).find());

// while (true) {
//     swipe(200, 2000, 200, 500, 300);
//     sleep(3000);
//     try {
//         log('title', id('com.ss.android.ugc.aweme:id/title').filter((v) => {
//             return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
//         }).findOnce().text());

//         log('点赞', id('com.ss.android.ugc.aweme:id/d_9').filter((v) => {
//             return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
//         }).findOnce().desc());
//     } catch (e) {
//         log(e);
//     }
// }


// let activityManager = context.getSystemService(context.ACTIVITY_SERVICE);
// let a = activityManager.restartPackage("com.ss.android.ugc.aweme");
// log(a);


// function m() {
//     let manager = context.getPackageManager();
//     let code = 0;
//     try {
//         let info = manager.getPackageInfo('com.ss.android.ugc.aweme', 0);
//         code = info.versionCode;
//     } catch (e) {
//         return false;
//     }
//     return code;
// }

// log(m());


// function q() {
//     events.observeKey();
//     events.onKeyDown("volume_up", ()=>{
//         log("音量上键被按下");
//     });
// }


// q();


function refresh() {
    let i = 5;
    while (i--) {
        swipe(500, 1200, 500, 500, 300);
        sleep(3000);
        try {
            log('title', id('com.ss.android.ugc.aweme:id/desc').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
            }).findOnce().text());

            log('点赞', id('com.ss.android.ugc.aweme:id/d_9').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
            }).findOnce().desc());
        } catch (e) {
            log(e);
        }
    }
}

refresh();
