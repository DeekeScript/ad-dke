"ui";
let page = require('core/page.js');
let storage = require('common/storage');
let config = require('config/config');

let core = {
    closeOtherFuncs() {
        let tmp;
        for (let eng of engines.all()) {
            tmp = eng.getSource().toString().split('/');
            console.log(tmp[tmp.length - 1]);
            if (tmp[tmp.length - 1] == 'main.js' || tmp[tmp.length - 1] == 'floaty.js' || tmp[tmp.length - 1] == 'index.js') {
                continue;
            }
            eng.forceStop();
        }
    },

    check() {
        //抖音版本号监测
        let dyVersion = config.getDyVersion();
        if (dyVersion && dyVersion !== config.dyVersion) {
            log(dyVersion, config.dyVersion);
            dialogs.alert('请使用' + config.dyVersions + '抖音版本');
        }
    },

    run() {
        page.show();
        page.listener();
        storage.setPackage(currentPackage());//启动抖音的时候需要
        this.check();
        // events.on("notice", function (msg) {
        //     page.btnRemark(0);
        // });

        // events.on("show", function (res) {
        //     //page.show();
        // });

        events.observeKey();
        let volumeUpTime = [];
        events.onKeyDown("volume_up", () => {
            volumeUpTime.push(Date.parse(new Date()));
            if (volumeUpTime.length > 2) {
                volumeUpTime.shift();
            }

            if (volumeUpTime[1] - volumeUpTime[0] <= 500) {
                threads.shutDownAll();
                floaty.closeAll();
                this.closeOtherFuncs();
                dialogs.alert('任务关闭了');
                log('关闭任务', volumeUpTime);
            }
        });
    }
}

core.run();

setInterval(function () {
    //console.log('index run');
    //检测是否登陆过期
    if (!storage.getToken()) {
        if (page.current !== undefined && page.current !== 'login') {
            //查看是否登陆，是的话则进行index 否的话，则进行login
            launch(storage.getPackage());
            threads.shutDownAll();//停止所有线程
            core.closeOtherFuncs();

            page.show();
            toast('登陆过期');
            log('登陆过期');
        }
    }
}, 10000);
