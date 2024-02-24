let cStorage = {
    getToken() {
        let storage = storages.create("data");
        return storage.get("token");
    },
    setToken(token) {
        let storage = storages.create("data");
        return storage.put("token", token);
    },

    setPackage(name) {
        let storage = storages.create("data");
        return storage.put("package", name);
    },

    getPackage() {
        let storage = storages.create("data");
        return storage.get("package");
    }
}

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

    stopApp() {
        if (app.openAppSetting('com.ss.android.ugc.aweme')) {
            this.sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            while (!click(p.centerX(), p.centerY()));
            this.sleep(1000);
            p = text('确定').findOne(3000) || text('强行停止').findOne(3000);
            if (p) {
                p = p.bounds();
            }
            while (!click(p.centerX(), p.centerY()));
            this.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    click(tag) {
        let width = tag.bounds().width() * 0.05 + Math.floor(Math.random() * (tag.bounds().width() * 0.95));
        let height = tag.bounds().height() * 0.05 + Math.floor(Math.random() * (tag.bounds().height() * 0.95));
        //console.log(width, height);

        try {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } catch (e) {
            this.log(e);
            try {
                click(tag.bounds().left + width, tag.bounds().top);
            } catch (e) {
                this.log(e);
                return false;
            }
        }

        this.sleep(500);
        return true;
    },

    openApp() {
        this.log('openApp', currentPackage(), cStorage.getPackage());
        if (currentPackage() !== cStorage.getPackage()) {
            launch(cStorage.getPackage());
            this.sleep(1500);
        }

        return launch('com.ss.android.ugc.aweme');
    },

    restartApp() {
        this.stopApp();
        this.openApp();
    },

    log() {
        //这里需要做日志记录处理
        let str = [];
        for (let i in arguments) {
            str.push(arguments[i]);
        }
        if (str.length === 1) {
            str = " " + str[0] + "\n";
        }

        console.log(str);
        this.logs.push(str);
        if (this.logs.length > 20) {
            threads.start(() => {
                console.log(JSON.stringify(this.logs));
                cHttp.post('dke', 'log', { desc: JSON.stringify(this.logs) });
                this.logs = [];
            });
        }

    },

    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }
        while (i--) {
            back();
            if (!time) {
                this.sleep(300 + Math.random() * 400);
                continue;
            }

            if (randTime) {
                this.sleep(time + randTime * Math.random());
                continue;
            }
            this.sleep(time);
        }
        this.log('back ' + i);
    },

    closeAll() {
        try {
            let closeTag = descContains('不再提醒').findOne(2000);
            if (closeTag) {
                this.click(closeTag);
            }
        } catch (e) {
            this.log(e);
        }
    },

    numDeal(text) {
        text = /[\d\.]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('万', '') * 10000;
        }
        return text[0];
    },
    closeApp() {
        let mDevice = files.read('/sdcard/dke/device.json');
        if (mDevice) {
            mDevice = JSON.parse(mDevice);
        }

        if (mDevice && mDevice['mobileStopType'] * 1 === 1) {
            this.stopApp();
            return true;
        }

        home();
        this.sleep(1000);
        recents();
        this.sleep(1000);
        let dy = text('抖音').boundsInside(0, 0, device.width, device.height / 2).clickable(false).findOne(2000);
        if (!dy) {
            dy = descContains('抖音').boundsInside(0, 0, device.width, device.height).findOne(2000);
        }

        //部分机型width为负数
        if (!dy || dy.bounds().width() < 0) {
            return this.stopApp();
        }

        let btm = device.height * (0.5 + Math.random() * 0.1);
        let lf = 300 * Math.random();
        swipe(device.width / 2 - 150 + lf, btm, device.width / 2 - 150 + lf, device.height * (0.1 + 0.05 * Math.random()), 100 + 200 * Math.random());//从下往上推，清除
        this.sleep(1000);
        this.back();
        return true;
    },

    //关闭弹窗
    closeAlert() {
        return threads.start(() => {
            this.log('开启线程监听弹窗');
            while (true) {
                try {
                    if (text("稍后").exists()) {
                        text("稍后").findOne(2000).click();
                    }
                    if (text("以后再说").exists()) {
                        text("以后再说").findOne(2000).click();
                    }
                    if (text("我知道了").exists()) {
                        text("我知道了").findOne(2000).click();
                    }
                    if (text("下次再说").exists()) {
                        text("下次再说").findOne(2000).click();
                    }
                    if (text("满意").exists()) {
                        let a = text("满意").clickable(true).findOne(2000);
                        if (a) {
                            a.click();
                        }
                    }

                    if (text("不感兴趣").exists()) {
                        let a = text("不感兴趣").clickable(true).findOne(2000);
                        if (a) {
                            a.click();
                        }
                    }

                    if (text("好的").exists()) {
                        let a = text("好的").clickable(true).findOne(2000);
                        if (a) {
                            a.click();
                        }
                    }

                    if (text("确定").exists()) {
                        text("确定").findOne(2000).click();
                    }

                    if (this.id('dz7').text("取消").exists()) {
                        text("确定").findOne(2000).click();
                    }

                    if (text("拒绝").exists()) {
                        text("拒绝").findOne(2000).click();
                    }

                    //暂时取消掉
                    // if (this.id('close').boundsInside(0, 0, device.width, device.height / 2).desc('关闭').exists()) {
                    //     //this.id('close').boundsInside(0, 0, device.width, device.height / 2).desc('关闭').findOne(2000).click();
                    // }
                    this.sleep(500);
                } catch (e) {
                    console.log(e);
                }
            }
        });
    },

    sleepFunc(func, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }
        func();
        this.sleep(time + randomTime * Math.random());
    },

    toast(msg, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }

        //toast(msg);
        this.log(msg);
        if (time) {
            this.sleep(time + randomTime * Math.random());
        }
    },

    showToast(msg) {
        toast(msg);
    },

    //一坨时间  换成频率  当前任务频率，当前一小时频率，10分钟频率，1分钟频率
    //特别注意hours参数， 这个参数规定了执行的小时数，不在这里面的时间段不能算进来
    timestampsToFre(timestamps, hours) {
        let firstTime = timestamps[0];//第一次时间戳
        let currentTime = Date.parse(new Date()) / 1000;

        //获取第一次的执行时间   再获取当前时间的小时，  把不在hours里面的小时数计算处理
        let firstHour = (new Date(timestamps[0] * 1000)).getHours();
        let currentHour = (new Date()).getHours();

        let ignoreHourCount = 0;
        //计算最开始到现在  有几个不符合时间的  不符合的拉出去
        for (let i = firstHour; i <= currentHour; i++) {
            if (!hours.includes(i)) {
                ignoreHourCount++;
            }
        }

        //this.log(timestamps.length, (currentTime - firstTime - 3600 * ignoreHourCount));
        let second = Math.round(timestamps.length / (currentTime - firstTime - 3600 * ignoreHourCount) * 10000) / 10000;//每秒操作几次
        let allFre = {
            second: second,
            minute: second * 60,//每分钟操作几次
            tenMinute: second * 60 * 10,//每分钟操作几次
            hour: second * 60 * 60,//每小时操作几次
        };

        let hourCount = 0;
        let tenMinuteCount = 0;
        let minuteCount = 0;

        for (let timestamp of timestamps) {
            //1小时内
            if (timestamp > currentTime - 3600) {
                hourCount++;
            }

            //10分钟内
            if (timestamp > currentTime - 600) {
                tenMinuteCount++;
            }

            //一分钟内
            if (timestamp > currentTime - 60) {
                minuteCount++;
            }
        }

        //this.log('hourCount', hourCount, tenMinuteCount, minuteCount);
        let hourFre = {
            second: hourCount / 3600,
            minute: hourCount / 60,//每分钟操作几次
            tenMinute: hourCount / 10,//每分钟操作几次
            hour: hourCount,//每小时操作几次
        }

        second = Math.round(tenMinuteCount / 60 / 10 * 1000) / 1000;
        let tenMinuteFre = {
            second: tenMinuteCount / 60 / 10,
            minute: tenMinuteCount / 10,//每分钟操作几次
            tenMinute: tenMinuteCount,//每10分钟操作几次
            hour: tenMinuteCount * 6,//每小时操作几次
        }

        let minuteFre = {
            second: minuteCount / 60,
            minute: minuteCount,//每分钟操作几次
            tenMinute: minuteCount * 10,//每分钟操作几次
            hour: minuteCount * 60,//每小时操作几次
        }

        return {
            allFre: allFre,
            hourFre: hourFre,
            tenMinuteFre: tenMinuteFre,
            minuteFre: minuteFre
        }
    },

    //关键词拆分
    splitKeyword(keyword) {
        keyword = keyword.replace(/，/g, ',');
        keyword = keyword.split(',');
        let ks = [];
        for (let i in keyword) {
            let tmp = keyword[i];
            if (keyword[i].indexOf('&') !== -1) {
                tmp = keyword[i].split('&');
            }
            ks.push(tmp);
        }
        return ks;
    },

    containsWord(contain, title) {
        contain = this.splitKeyword(contain);
        for (let con of contain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return [con];
            }

            if (typeof (con) === 'object') {
                let _true = true;
                for (let i in con) {
                    if (title.indexOf(con[i]) === -1) {
                        _true = false;
                    }
                }
                if (_true) {
                    return con;
                }
            }
        }
        return false;
    },

    noContainsWord(noContain, title) {
        noContain = this.splitKeyword(noContain);
        for (let con of noContain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return false;
            }

            if (typeof (con) === 'object') {
                let len = 0;
                for (let i in con) {
                    if (title.indexOf(con[i]) !== -1) {
                        len++;
                    }
                }
                if (len === con.length) {
                    return false;
                }
            }
        }
        return noContain;
    }
}

let k = 5;
cStorage.setPackage(currentPackage());
console.log(currentPackage());

while (k--) {
    Common.openApp();
    sleep(7000);
    Common.closeApp();
}
