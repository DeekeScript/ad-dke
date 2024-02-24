let Common = require('./Common.js');
let User = require('./User.js');

const Search = {
    //type = 0 视频  type = 1 用户  需要先进入搜索页
    intoSearchList(keyword, type) {
        if (!type) {
            type = 0;
        }
        //开始搜索
        let iptTag = Common.id('et_search_kw').findOne(3000);
        if (!iptTag) {
            throw new Error('没有找到输入框');
        }

        keyword = keyword.split('');
        let input = '';
        for (let i in keyword) {
            input += keyword[i];
            Common.sleep(300 + 500 * Math.random());
            iptTag.setText(input);
        }

        Common.sleep(1500);
        //找到搜索按钮
        let searchBtnTag = Common.id('x=2').desc('搜索').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOnce();
        if (!searchBtnTag) {
            throw new Error('没有找到搜索点击按钮');
        }

        log('searchBtnTag', searchBtnTag);
        Common.click(searchBtnTag);
        Common.sleep(3000 + 2000 * Math.random());

        let videoTag;
        if (type === 0) {
            videoTag = Common.aId('text1').text('视频').findOnce();
        } else if (type === 1) {
            videoTag = Common.aId('text1').text('用户').findOnce();
        }

        if (!videoTag) {
            throw new Error('找不到视频或者用户tab;type=' + type);
        }
        Common.click(videoTag);
        Common.sleep(3000 + 2000 * Math.random());
    },

    //跟上面的方法基本相同，搜索链接进入视频  不需要点击搜索列表，系统自动跳转到对应视频
    intoSearchLinkVideo(keyword) {
        //开始搜索
        let iptTag = Common.id('et_search_kw').findOne(3000);
        if (!iptTag) {
            throw new Error('没有找到输入框');
        }

        iptTag.setText(keyword);
        Common.sleep(1500);
        //找到搜索按钮
        let searchBtnTag = Common.id('x=2').desc('搜索').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOnce();
        if (!searchBtnTag) {
            throw new Error('没有找到搜索点击按钮');
        }

        log('searchBtnTag', searchBtnTag);
        Common.click(searchBtnTag);
        Common.sleep(5000 + 2000 * Math.random());
        return true;
    },

    //从列表进入详情
    intoSearchVideo() {
        let descTag = Common.id('desc').findOnce();
        if (descTag) {
            Common.click(descTag);
            return true;
        }

        let container = Common.id('sg6').findOnce();
        if (container) {
            Common.click(container);
            return true;
        }

        let titleTag = Common.id('j=').findOnce();
        if (titleTag) {
            Common.click(titleTag);
            return true;
        }
        throw new Error('找不到视频输入');
    },

    //从搜索页进入用户主页
    intoSeachUser(keyword) {
        let userTag = descContains('抖音号：' + keyword).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOnce();

        if (!userTag) {
            userTag = descContains('抖音号').descContains(keyword).filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
            }).findOnce();
        }

        if (userTag) {
            log('userTag', userTag.bounds(), userTag.bounds().width(), userTag.bounds().height());
            Common.click(userTag);
            Common.sleep(2000 + 1000 * Math.random());
            return true;
        }

        throw new Error('找不到用户');
    },

    intoLiveRoom(keyword) {
        let userTag = descContains('抖音号：' + keyword).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOnce();

        if (!userTag) {
            userTag = descContains('抖音号').descContains(keyword).filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
            }).findOnce();
        }

        if (userTag) {
            log('userTag', userTag.bounds(), userTag.bounds().width(), userTag.bounds().height());
            click(userTag.bounds().left - 100, userTag.bounds().centerX());
            Common.sleep(5000 + 3000 * Math.random());
            return true;
        }

        throw new Error('找不到用户');
    },

    backIntoHome() {
        Common.back(3);
        return true;
    },

    //主页进入搜索视频详情
    homeIntoSearchVideo(keyword) {
        Search.intoSearchList(keyword, 0);
        Search.intoSearchVideo();
    },

    //主页进入搜索用户页面
    homeIntoSearchUser(keyword) {
        if (keyword.indexOf('+') !== 0) {
            Search.intoSearchList(keyword, 1);
            Search.intoSeachUser(keyword);
        } else {
            keyword = keyword.substring(1);
            User.intoFocusList();
            Common.sleep(3000);
            User.focusListSearch(keyword);
        }
    },

    //进入搜索后的用户直播间
    intoUserLiveRoom(douyin, type) {
        this.intoSearchList(douyin, type);
        let tag = textContains(douyin).filter((v) => {
            return v && v.id() === null && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().height() > 0;
        }).findOnce().parent().children().findOne(textContains('直播'));

        if (!tag) {
            return false;
        }
        Common.click(tag);
        Common.sleep(5000);
        return true;
    },

    //搜索，进入用户页面，再进入视频页面
    intoUserVideoPage(douyin, type) {
        this.intoSearchList(douyin, type);
        let tag = textContains(douyin).filter((v) => {
            return v && v.id() === null && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().height() > 0;
        }).findOnce()
        if (!tag) {
            return false;
        }
        Common.click(tag);
        Common.sleep(2500);

        let workTag = id('android:id/text1').descContains('作品').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
        }).findOnce();
        if (workTag) {
            Common.click(workTag);
            log('点击workTag');
            Common.sleep(2000);

            press(workTag.bounds().centerX(), workTag.bounds().centerY(), 50);
            Common.sleep(1500);
        }

        let rp = 3;
        let container;
        while (rp-- > 0) {
            container = Common.id('container').filter((v) => {
                return v && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < device.height - 200 && !v.children().findOne(descContains('置顶'));
            }).findOnce();
            if (!container) {
                Common.swipe(0, 0.5);
                Common.sleep(2000);
                continue;
            }
            break;
        }

        if (!container) {
            throw new Error('找不到视频');
        }

        log(container);
        Common.click(container);
        Common.sleep(5000);
        return true;
    },

    contents: [],
    userList(getAccounts, decCount, DyUser, DyComment, DyVideo, setAccount, getMsg, params) {
        let settingData = params.settingData;
        log('开始执行用户列表');
        let textTag = Common.id('u-o').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOnce();
        let rpCount = 0;
        let arr = [];
        let errorCount = 0;

        while (true) {
            let tags = className('android.widget.FrameLayout').focusable(true).filter((v) => {
                return v && v.bounds() && v.bounds().left === 0 && v.bounds().top > textTag.bounds().top + textTag.bounds().height() && v.bounds().top + v.bounds().height() < device.height && !!v.children() && !!v.children().findOne(textContains('粉丝'));
            }).find();
            log('tags', tags.length);

            if (tags.length === 0) {
                errorCount++;
                log('containers为0');
            }

            arr.push(JSON.stringify(tags));
            if (arr.length >= 3) {
                arr.shift();
            }

            for (let i in tags) {
                if (isNaN(i)) {
                    continue;
                }

                let child = tags[i].children().findOne(textContains('粉丝'));
                if (!child || !child.text() || !child.bounds() || child.bounds().left < 0 || child.bounds().width() < 0 || child.bounds().top < 0 || child.bounds().height() < 0 || child.bounds().height() + child.bounds().top > device.height) {
                    continue;
                }

                if(child.bounds().top <= textTag.bounds().top + textTag.bounds().height()){
                    continue;
                }

                let text = child.text().split(/[,|，]/);
                let account = text[2].replace('抖音号：', '').replace('按钮', '');
                log(account, 'account');

                if (!account || this.contents.includes(account) || getAccounts(account)) {
                    continue;
                }

                // log(child);
                // let fansMatch = /粉丝[:：\s]+(\d+)万?[,，]/.exec(child.text());
                // if (!fansMatch || fansMatch[1] * 1 > params['fansCount']) {
                //     log(fansMatch[1] * 1, params['fansCount']);
                //     continue;
                // }

                try {
                    Common.click(child);//部分机型超出范围
                } catch (e) {
                    continue;
                }
                Common.sleep(2000 + 1000 * Math.random());

                //看看有没有视频，有的话，操作评论一下，按照20%的频率即可
                let isPrivateAccount = DyUser.isPrivate();
                Common.log('是否是私密账号：' + isPrivateAccount);
                if (isPrivateAccount) {
                    Common.back();
                    Common.sleep(500);
                    if (decCount() <= 0) {
                        return true;
                    }
                    setAccount(account);
                    this.contents.push(account);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let worksCount = DyUser.getWorksCount();
                if (worksCount < settingData.worksMinCount || worksCount > settingData.worksMaxCount) {
                    log('作品数不符合', worksCount, settingData.worksMinCount, settingData.worksMaxCount);
                    setAccount(account);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let fansCount = 0;
                try {
                    fansCount = DyUser.getFansCount();
                } catch (e) {
                    log(e);
                    continue;//大概率是没有点击进去
                }

                if (fansCount < settingData.fansMinCount * 1 || fansCount > settingData.fansMaxCount * 1) {
                    log('粉丝数不符合', fansCount, settingData.fansMinCount, settingData.fansMaxCount);
                    setAccount(account);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                let nickname = DyUser.getNickname();

                if (Math.random() * 100 <= settingData.focusRate * 1) {
                    DyUser.focus();
                }

                if (Math.random() * 100 <= settingData.privateRate * 1) {
                    DyUser.privateMsg(getMsg(1, nickname, DyUser.getAge(), DyUser.getGender()).msg);
                }

                let commentRate = Math.random() * 100;
                let zanRate = Math.random() * 100;

                log('即将进入视频');
                if ((settingData.isFirst || commentRate < settingData.commentRate * 1 || zanRate < settingData.zanRate * 1) && DyVideo.intoUserVideo()) {
                    //点赞
                    if (settingData.isFirst || zanRate <= settingData.zanRate * 1) {
                        DyVideo.clickZan();
                    }

                    //随机评论视频
                    log('评论频率检测', commentRate, settingData.commentRate * 1);
                    if (settingData.isFirst || commentRate <= settingData.commentRate * 1) {
                        let msg = getMsg(0, DyVideo.getContent());
                        if (msg) {
                            DyVideo.openComment(!!DyVideo.getCommentCount());
                            Common.log('开启评论窗口');
                            DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                            Common.log('评论了');
                            Common.back(1, 800);//回到视频页面
                        }
                    }
                    log('视频页面到用户页面')
                    Common.back(1, 800);//从视频页面到用户页面
                } else {
                    log('未进入视频');
                }

                let r = decCount();
                settingData.isFirst = false;
                log('r', r);
                if (r <= 0) {
                    return true;
                }

                setAccount(account);
                console.log(account, getAccounts(account));
                this.contents.push(account);
                Common.back(1, 800);//用户页到列表页
                if (Common.id('v0f').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0;
                }).findOnce()) {
                    Common.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
                }

                Common.sleep(500 + 500 * Math.random());
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            if (arr[0] === arr[1]) {
                rpCount++;
            } else {
                rpCount = 0;
            }
            log('rpCount', rpCount);

            if (rpCount >= 3) {
                return true;
            }

            Common.swipeSearchUserOp();
            Common.sleep(2000 + 1000 * Math.random());
        }
    }
}

module.exports = Search;
