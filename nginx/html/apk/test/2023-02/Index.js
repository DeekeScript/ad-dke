let Common = {
    //封装的方法
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
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
                //click(1, device.height - 1);
                //device.wakeUp();
            }
        });
    },

    sleep(time) {
        sleep(time);
    },

    stopApp() {
        if (app.openAppSetting('com.ss.android.ugc.aweme')) {
            dy.sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            while (!click(p.centerX(), p.centerY()));
            dy.sleep(1000);
            p = text('确定').findOne().bounds();
            while (!click(p.centerX(), p.centerY()));
            dy.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    click(tag) {
        let width = Math.floor(Math.random() * tag.bounds().width());
        let height = Math.floor(Math.random() * tag.bounds().height());
        if (tag.bounds().top + height <= device.height - 160) {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } else {
            click(tag.bounds().left + width, tag.bounds().top);
        }

        sleep(500);
    },

    openApp() {
        this.log('openApp');
        return launch('com.ss.android.ugc.aweme');
    },

    restartApp() {
        dy.stopApp();
        dy.openApp();
    },

    log() {
        //这里需要做日志记录处理
        let str = [];
        for (let i in arguments) {
            str.push(arguments[i]);
        }
        console.log(str);
    },

    back(i) {
        if (i === undefined) {
            i = 1;
        }
        this.log('返回', i);
        while (i--) {
            back();
            this.sleep(500);
        }
    },

    closeAll() {
        try {
            let closeTag = descContains('不再提醒').findOne(2000);
            if (closeTag) {
                this.click(closeTag);
            }
        } catch (e) {
            console.log(e);
        }
    },

    numDeal(text) {
        text = /[\d\.]+[\w]*/.exec(text);
        if (!text) {
            return 0;
        }
        if (text.indexOf('w') !== -1) {
            text = text.replace('w', '') * 10000;
        }
        return text[0];
    },
    closeApp() {
        recents();
        this.sleep(1000);
        let dy = textContains('抖音').id('title_view').findOne(2000);
        if (dy.bounds().top > 0 && dy.bounds().top < device.height && dy.bounds().left > 0 && dy.bounds().left < device.width) {
            swipe(device.width / 2, device.height / 2, device.width / 2, 20, 300);//从下往上推，清除
            this.sleep(1000);
            this.back();
            return true;
        }
        this.back();
        return false;
    }
}






let Index = {
    intoHome() {
        let homeTag = Common.id('r6d').text('首页').findOne(2000);
        if (!homeTag) {
            throw new Error('home找不到！');
        }
        Common.click(homeTag);
        Common.sleep(3000);
        Common.log('点击home');
    },

    intoMyPage() {
        //先点击“我” 再点击“首页”
        let meTag = Common.id('r6d').text('我').findOne(2000);
        if (!meTag) {
            throw new Error('me找不到！');
        }

        Common.click(meTag);
        Common.sleep(2000);
        Common.log('点击home');
    },

    //进入同城
    intoLocal() {
        let tjs = Common.getTags(Common.id('u5n').find());
        if (!tjs || tjs.length === 0) {
            throw new Error('找不到同城');
        }

        let tj = undefined;
        for (let i in tjs) {
            if (['探索', '关注', '商城', '推荐'].includes(tjs[i].text())) {
                continue;
            }
            tj = tjs[i];
        }

        if (!tj) {
            throw new Error('找不到同城-2');
        }

        let top = tj.bounds().top + tj.bounds().height() / 2 * (Math.random() + 1 / 3);
        let right = tj.bounds().left + tj.bounds().width();
        swipe(right + 500, top, right + 200, top, 300);
        Common.sleep(1000);
        Common.click(Common.id('u5n').textContains(tj.text()).findOne(2000));
        Common.sleep(2000);
    },

    //进入推荐
    intoRecommend() {
        let tj = Common.id('u5n').textContains('推荐').findOne(2000);
        let top = tj.bounds().top + tj.bounds().height() / 2 * (Math.random() + 1 / 3);
        let left = tj.bounds().left;
        swipe(left, top, left - 300, top, 300);
        Common.sleep(1000);
        Common.click(Common.id('u5n').textContains('推荐').findOne(2000));
        Common.sleep(2000);
    },
}

//Index.intoRecommend();
//Index.intoLocal();

let k = 20;
while (k--) {
    Index.intoHome();
    Index.intoMyPage();
}


//recents();
// Common.closeApp();

// Common.closeAlert();
// sleep(12000);
// let meTag = Common.id('r6d').text('我').findOne(2000);

// Common.click(meTag);
