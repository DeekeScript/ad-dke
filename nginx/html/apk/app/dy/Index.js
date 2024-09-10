let storage = require('../../common/storage.js');
let Common = require('./Common.js');
const Index = {
    intoHome() {
        let homeTag = Common.id('u+h').text('首页').findOnce();
        if (!homeTag) {
            throw new Error('home找不到！');
        }
        Common.click(homeTag);
        Common.sleep(2000 + Math.random() * 1000);
        Common.log('点击home');
    },

    intoMyMessage() {
        //先点击“我” 再点击“首页”
        Common.sleep(3000);
        let msgTag = Common.id('u+h').text('消息').findOnce();
        if (!msgTag) {
            throw new Error('消息-找不到！');
        }

        Common.click(msgTag);
        Common.sleep(2000);
        Common.log('点击message');
    },

    //进入我的页面
    intoMyPage() {
        Common.sleep(3000);
        let meTag = Common.id('u+h').text('我').findOnce();
        if (!meTag) {
            throw new Error('me找不到！');
        }

        Common.click(meTag);
        Common.sleep(2000);
        Common.log('点击home');
    },

    //进入我喜欢的视频列表
    intoMyLikeVideo() {
        //首先知道喜欢的菜单
        let sw = 3;
        let likeTag;
        while (sw-- > 0) {
            likeTag = id('android:id/text1').textContains('喜欢').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height;
            }).findOnce();
            if (likeTag) {
                log(likeTag);
                Common.click(likeTag);
                break;
            }

            let left = device.width * 0.2 + Math.random() * device.width * 0.8;
            swipe(left, device.height * 2 / 3, left, device.height / 3, 300);
        }

        if (!likeTag) {
            return false;
        }

        Common.sleep(3000);
        sw = 3;
        let containerTag;
        while (sw-- > 0) {
            containerTag = Common.id('container').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height - 300 && v.bounds().width() > 0 && v.bounds().height() > 0;
            }).findOnce();

            if (containerTag) {
                break;
            }
            let left = device.width * 0.2 + Math.random() * device.width * 0.8;
            swipe(left, device.height * 2 / 3, left, device.height / 3, 300);
            Common.sleep(1000);
        }

        if (!containerTag) {
            return false;
        }

        log(containerTag);
        Common.click(containerTag);
        Common.sleep(3000);
        return true;
    },

    //进入同城
    intoLocal() {
        log('进入同城');
        let tjs = Common.getTags(Common.id('yic').find());
        if (!tjs || tjs.length === 0) {
            throw new Error('找不到同城');
        }

        let tj = undefined;
        for (let i in tjs) {
            if (!tjs[i].text() || ['探索', '关注', '商城', '推荐', '购物', '社区', '经验', '读书日', '直播', '团购', '长视频'].includes(tjs[i].text())) {
                continue;
            }
            tj = tjs[i];
        }

        if (!tj) {
            throw new Error('找不到同城-2');
        }

        let top = tj.bounds().top + tj.bounds().height() / 2 * (Math.random() + 1 / 3);
        let right = tj.bounds().left + tj.bounds().width();
        swipe(right + 200, top, right + 500, top, 300);
        Common.sleep(1000);

        Common.click(Common.id('yic').textContains(tj.text()).findOnce());
        Common.sleep(3500);

        //这里查看其他设置中的同城设置，有设置的话，直接调用
        let city = storage.getCity();
        if (city) {
            log('切换到城市：', city, tj.text());
            let times = 3;
            let cityTag;
            while (times--) {
                cityTag = tj
                if (!cityTag) {
                    continue;
                }
                break;
            }
            Common.click(cityTag);
            Common.sleep(2000);
            cityTag = text(city).findOnce();
            if (!cityTag) {
                toast('找不到城市');
                throw new Error('找不到城市');
            }

            Common.click(cityTag);
            Common.sleep(2000);

            cityTag = descContains(city).className('androidx.appcompat.app.ActionBar$Tab').findOnce();
            if (!cityTag) {
                toast('找不到城市-2');
                throw new Error('找不到城市-2');
            }
        }

        let meTag = Common.id('u+h').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOnce();

        click(device.width / 3 + device.width / 2 * Math.random(), meTag.bounds().top - 300);
        Common.sleep(1000);
    },

    //进入推荐
    intoRecommend() {
        let tj = Common.id('yic').textContains('推荐').findOnce();
        let top = tj.bounds().top + tj.bounds().height() / 2 * (Math.random() + 1 / 3);
        let left = tj.bounds().left;
        swipe(left, top, left - 300, top, 300);
        Common.sleep(1000);
        Common.click(Common.id('yic').textContains('推荐').findOnce());
        Common.sleep(2000);
    },
    //获取消息数
    getMsgCount() {
        let msgTag = Common.id('u_z').textMatches(/[\d]+/).findOnce();
        if (msgTag) {
            return Common.numDeal(msgTag.text());
        }
        return 0;
    },

    //从主页进入搜索页
    intoSearchPage() {
        Common.sleep(3000);
        let searchTag = Common.id('hfr').filter((v) => {
            return v && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOnce();
        log(searchTag);
        if (!searchTag) {
            throw new Error('找不到搜索框，无法进入搜索页');
        }
        searchTag.click();
        Common.sleep(1000);
        return true;
    }
}

module.exports = Index;
