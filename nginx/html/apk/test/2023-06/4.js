let Common = {
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    stopApp() {
        if (app.openAppSetting('com.ss.android.ugc.aweme')) {
            this.sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            //log('stopTag', stopTag);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            click(p.centerX(), p.centerY());
            this.sleep(1000);
            p = text('确定').findOne(3000) || text('强行停止').findOne(3000);
            if (p) {
                p = p.bounds();
                click(p.centerX(), p.centerY());
            }

            this.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    back() {
        back();
    },

    log(s) {
        log(s);
    },

    sleep(time) {
        sleep(time);
    },

    openApp() {
        launch('com.ss.android.ugc.aweme');//打开抖音
        let k = 5;
        while (k-- >= 0) {
            this.sleep(3000);
            let homeTag = this.id('r6d').filter((v) => {
                return v && v.bounds() && v.bounds().left > 0 && v.bounds().top && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0;
            }).findOnce();
            if (homeTag) {
                break;
            }
        }
    },
}

// let i = 50;
// while (i--) {
//     Common.openApp();
//     Common.stopApp();
// }

// function aa() {
//     let a = Common.id('bk=').text('暂不公开').filter((v) => {
//         return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
//     }).findOnce();
//     a.click();
// }

// aa();

function mm() {
    if (android.os.Build.VERSION.RELEASE < 14) {
        //this.backApp();
        log(22);
        toast('关闭抖音');
        sleep(2000);
        let am = context.getSystemService(context.ACTIVITY_SERVICE);
        am.killBackgroundProcesses('com.ss.android.ugc.aweme');
        return true;
    }
}

// mm();

function s(){
    //let str = '粉丝：2344，';
    let str = textContains('粉丝').findOnce().text();
    log(str);
    let a = /粉丝[:：\s]+(\d+)万?[,，]/.exec(str);
    log(a);
}

s();
