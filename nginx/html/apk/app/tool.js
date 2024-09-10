let Common = require('./dy/Common');
let tool = {
    //垃圾号
    wasteAccount(fansCount, focusCount) {
        if (focusCount / fansCount >= 10) {
            return 10 + Math.random() * 10;
        }

        if (focusCount / fansCount >= 1) {
            return 20 + Math.random() * 10;
        }

        if (focusCount / fansCount >= 0.1) {
            return 30 + Math.random() * 10;
        }

        return 0;
    },

    getScore(fansCount, focusCount, zanCount, worksCount) {
        let baseScore = 0;
        if (fansCount < 100) {
            baseScore = 30;
        } else if (fansCount < 500) {
            baseScore = 50;
        } else if (fansCount < 1000) {
            baseScore = 70;
        } else if (fansCount < 2000) {
            baseScore = 75;
        } else if (fansCount < 5000) {
            baseScore = 80;
        } else if (fansCount < 10000) {
            baseScore = 85;
        } else if (fansCount < 20000) {
            baseScore = 90;
        } else if (fansCount < 50000) {
            baseScore = 95;
        } else {
            baseScore = 100;
        }

        if (fansCount / focusCount < 1) {
            baseScore *= 0.7;
        } else if (fansCount / focusCount < 10) {
            baseScore *= 0.8;
        } else if (fansCount / focusCount < 100) {
            baseScore *= 0.9;
        } else {
            baseScore *= 1;
        }

        if (zanCount / worksCount < 10) {
            baseScore *= 0.6;
        } else if (zanCount / worksCount < 20) {
            baseScore *= 0.7;
        } else if (zanCount / worksCount < 50) {
            baseScore *= 0.75;
        } else if (zanCount / worksCount < 100) {
            baseScore *= 0.8;
        } else if (zanCount / worksCount < 1000) {
            baseScore *= 0.9;
        }
        return baseScore;
    },

    getPotential(zanCount, worksCount) {
        let baseScore = '王者';
        if (zanCount / worksCount < 10) {
            baseScore = '需要努力';
        } else if (zanCount / worksCount < 20) {
            baseScore = '继续加油';
        } else if (zanCount / worksCount < 50) {
            baseScore = '还不错';
        } else if (zanCount / worksCount < 100) {
            baseScore = '很好';
        } else if (zanCount / worksCount < 200) {
            baseScore = '非常好';
        } else if (zanCount / worksCount < 500) {
            baseScore = '特别好';
        }
        return baseScore;
    },

    getCps(zanCount, worksCount, fansCount) {
        let baseScore = '特别好';
        if (zanCount / worksCount / fansCount < 0.005) {
            baseScore = '极低[泛粉多]';
        } else if (zanCount / worksCount < 0.01) {
            baseScore = '低[泛粉较多]';
        } else if (zanCount / worksCount < 0.02) {
            baseScore = '一般';
        } else if (zanCount / worksCount < 0.03) {
            baseScore = '较好';
        } else if (zanCount / worksCount < 0.05) {
            baseScore = '很好';
        } else if (zanCount / worksCount < 0.1) {
            baseScore = '非常好';
        }
        return baseScore;
    },

    getAdvice(userInfo) {
        let str = '';
        let i = 1;
        if (userInfo.introduce < 10) {
            str = i + '.账号介绍需要完善一下' + "\n";
            i++;
        } else if (userInfo.introduce < 30) {
            str = i + '.账号介绍还可以再完善一下' + "\n";
            i++;
        }

        if (userInfo.nickname.indexOf('用户') || userInfo.nickname.length < 6) {
            str += i + '.昵称需要优化' + "\n";
            i++;
        }

        if (userInfo.douyin.length !== 11 && userInfo.douyin.length > 8) {
            str += i + '.抖音账号需要优化' + "\n";
            i++;
        }

        if (userInfo.gender === 3) {
            str += i + '.账号隐私信息可以优化一下' + "\n";
            i++;
        }

        if (userInfo.worksCount <= 50) {
            str += i + '.还需要多发作品' + "\n";
            i++;
        }

        return str || '继续保持';
    },

    getVideoMsg(userInfo, func) {
        let score = this.wasteAccount(userInfo.fansCount, userInfo.focusCount);
        if (score) {

        } else {
            score = this.getScore(userInfo.fansCount, userInfo.focusCount, userInfo.zanCount, userInfo.worksCount);
        }

        potential = this.getPotential(userInfo.zanCount, userInfo.worksCount);
        func();
        Common.sleep(2000);
        return {
            score: score,
            potential: potential,
            userInfo: userInfo,
            advice: this.getAdvice(userInfo),
            cps: this.getCps(userInfo.zanCount, userInfo.worksCount, userInfo.fansCount),
        }
    },

    showDetail(res, second) {
        let info = '';
        info += "昵称：" + res.userInfo.nickname + "\n";
        info += "账号：" + res.userInfo.douyin + "\n\n";

        info += "评分：" + Math.round(res.score * 100) / 100 + "\n";
        info += "垂直度：" + res.cps + "\n\n";
        info += "作品曝光度：" + res.potential + "\n\n";
        info += "建议如下：\n" + res.advice;
        Common.back(3, 700);
        if (second) {
            return dialogs.alert('评分结果[' + second + '秒后关闭]', info);
        }
        dialogs.alert('评分结果', info);
    }
}

module.exports = tool;
