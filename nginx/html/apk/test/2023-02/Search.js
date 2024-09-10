let Common = {
    //封装的方法
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

        try {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } catch (e) {
            try {
                click(tag.bounds().left + width, tag.bounds().top);
            } catch (e) {
                return false;
            }
        }

        sleep(500);
        return true;
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
        while (i--) {
            back();
            this.sleep(300 + Math.random() * 400);
        }
        this.log('back ' + i);
    },

    closeAll() {
        try {
            let closeTag = descContains('不再提醒').findOne(2000);
            if (closeTag) {
                Common.click(closeTag);
            }
        } catch (e) {
            console.log(e);
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

let Search = {
    //type = 0 视频  type = 1 用户  需要先进入搜索页
    intoSearchList(keyword, type) {
        if (!type) {
            type = 0;
        }
        //开始搜索
        let iptTag = Common.id('et_search_kw').findOne(2000);
        if (!iptTag) {
            throw new Error('没有找到输入框');
        }

        keyword = keyword.split('');
        let input = '';
        for (let i in keyword) {
            input += keyword[i];
            Common.sleep(500 + 1000 * Math.random());
            iptTag.setText(input);
        }

        Common.sleep(500);
        //找到搜索按钮
        let searchBtnTag = Common.id('uvl').desc('搜索').findOne(2000);
        if (!searchBtnTag) {
            throw new Error('没有找到搜索点击按钮');
        }

        Common.click(searchBtnTag);
        Common.sleep(3000 + 2000 * Math.random());

        let videoTag;
        if (type === 0) {
            videoTag = Common.aId('text1').text('视频').findOne(2000);
        } else if (type === 1) {
            videoTag = Common.aId('text1').text('用户').findOne(2000);
        }

        if (!videoTag) {
            throw new Error('找不到视频或者用户tab;type=' + type);
        }
        Common.click(videoTag);
        Common.sleep(3000 + 2000 * Math.random());
    },

    //从列表进入详情
    intoSearchVideo() {
        let descTag = Common.id('desc').findOne(2000);
        if (descTag) {
            Common.click(descTag);
            return true;
        }

        let container = Common.id('pw8').findOne(2000);
        if (container) {
            Common.click(container);
            return true;
        }

        let titleTag = Common.id('j=').findOne(2000);
        if (titleTag) {
            Common.click(titleTag);
            return true;
        }
        throw new Error('找不到视频输入');
    },

    //从主页到搜索页
    homeIntoSearchInputShow() {
        let searchTag = Common.id('iqo').desc('搜索').findOne(2000);
        if (!searchTag) {
            throw new Error('搜索框找不到');
        }
        Common.click(searchTag);
        let iptTag = Common.id('et_search_kw').findOne(2000);
        if (!iptTag) {
            throw new Error('搜索框');
        }

        Common.click(iptTag);
    },

    backIntoHome() {
        Common.back(3);
        return true;
    },

    //主页进入搜索视频详情
    homeIntoSearchVideo(keyword) {
        Search.homeIntoSearchInputShow();
        Search.intoSearchList(keyword, 0);
        Search.intoSearchVideo();
    }
}

// Search.homeIntoSearchInputShow();
// Search.intoSearchList('满江红', 0);
// Search.intoSearchVideo();

// Search.homeIntoSearchVideo('满江红');
