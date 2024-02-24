let storage = require('./storage');
let machine = {
    db() {
        let storage = storages.create("com.dke.qiao.data");
        return storage;
    },

    clear() {
        this.db().clear();
        toast('成功');
    },

    getDate() {
        let d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    },

    getTask(params) {
        let task = storage.getTask();
        if (!task || !task.length) {
            return [];
        }

        let t = [];
        for (let i in task) {
            //log(task[i]);
            if (task[i].state !== true) {
                continue;
            }

            let detail = storage.getTaskDetail(task[i].index);
            //log(detail);
            if (params.isCity !== undefined && !!detail.taskRule.is_city * 1 !== params.isCity) {
                continue;
            }

            t.push({
                id: task[i].index,
                name: task[i].title,
            });
        }
        return t;
    },

    getTaskConfig(province, index) {
        let detail = storage.getTaskDetail(index);
        let res = detail['taskRule'] || {};
        res.hour = [];
        for (let i in res.time) {
            if (res.time[i]) {
                res.hour.push(i * 1);
            }
        }
        res.hour = JSON.stringify(res.hour);
        res.end_type = 0;//结束类型，不限制
        res.comment_zan_fre = res.zan_comment_fre || 0;
        res.video_zan_fre = res.zan_video_fre || 0;
        res.comment_fre = res.comment_video_fre || 0;
        res.comment_back_fre = res.comment_back_fre || 0;
        res.private_fre = res.private_msg_fre || 0;
        res.private_author_fre = res.private_msg_author_fre || 0;
        res.focus_fre = res.focus_fre || 0;
        res.focus_author_fre = res.focus_author_fre || 0;
        res.refresh_video_fre = res.video_fre || 1;//刷视频频率默认1起步

        //规则都是多维的，这里进行处理
        res.userRules = [detail['talentRule']];
        if (res.userRules[0].ip) {
            res.userRules[0].ip = res.userRules[0].ip.replace(/，/g, ',');
            res.userRules[0].ip = res.userRules[0].ip.split(',');
            res.userRules[0].province_id = [];
            for (let i in res.userRules[0].ip) {
                for (let j in province) {
                    if (province[j].name.indexOf(res.userRules[0].ip[i]) !== -1) {
                        res.userRules[0].province_id.push(province[j].id);
                    }
                }
            }
        } else {
            res.userRules[0].province_id = [0];
        }

        res.videoRules = [detail['videoRule']];
        res.videoRules[0].distance = detail['taskRule'].distance;
        res.videoRules[0].in_time = 6;//15天内

        res.commentRules = [detail['commentRule']];
        res.commentRules[0].in_time = 5;//7天内
        res.commentRules[0].nickname_type = [0];
        if (res.commentRules[0].ip) {
            res.commentRules[0].province_id = [];
            res.commentRules[0].ip = res.commentRules[0].ip.replace(/，/g, ',');
            res.commentRules[0].ip = res.commentRules[0].ip.split(',');
            for (let i in res.commentRules[0].ip) {
                for (let j in province) {
                    if (province[j].name.indexOf(res.commentRules[0].ip[i]) !== -1) {
                        res.commentRules[0].province_id.push(province[j].id);
                    }
                }
            }
        } else {
            res.commentRules[0].province_id = [0];
        }

        res.commentUserRules = [detail['userRule']];
        if (res.commentUserRules[0].ip) {
            res.commentUserRules[0].ip = res.commentUserRules[0].ip.replace(/，/g, ',');
            res.commentUserRules[0].ip = res.commentUserRules[0].ip.split(',');
            res.commentUserRules[0].province_id = [];
            for (let i in res.commentUserRules[0].ip) {
                for (let j in province) {
                    if (province[j].name.indexOf(res.commentUserRules[0].ip[i]) !== -1) {
                        res.commentUserRules[0].province_id.push(province[j].id);
                    }
                }
            }
        } else {
            res.commentUserRules[0].province_id = [0];
        }

        return res;
    },

    getConfig(index) {
        let db = this.db();
        return {
            videoTimestamp: JSON.parse(db.get('config_' + index + '_videoTimestamp_' + this.getDate()) || '[]'),
            zanVideoTimestamp: JSON.parse(db.get('config_' + index + '_zanVideoTimestamp_' + this.getDate()) || '[]'),
            zanCommentTimestamp: JSON.parse(db.get('config_' + index + '_zanCommentTimestamp_' + this.getDate()) || '[]'),
            commentTimestamp: JSON.parse(db.get('config_' + index + '_commentTimestamp_' + this.getDate()) || '[]'),
            focusTimestamp: JSON.parse(db.get('config_' + index + '_focusTimestamp_' + this.getDate()) || '[]'),
            privateMsgTimestamp: JSON.parse(db.get('config_' + index + '_privateMsgTimestamp_' + this.getDate()) || '[]'),
            viewUserPageTimestamp: JSON.parse(db.get('config_' + index + '_viewUserPageTimestamp_' + this.getDate()) || '[]'),
            privateClose: false,
        }
    },

    getDouyinConfig(account) {
        let db = this.db();
        let key = 'privateClose_' + account;
        let res = db.get(key);
        if (!res) {
            return { privateClose: false };
        }

        if (typeof (res) !== 'object') {
            res = JSON.parse(res);
        }

        if (Date.parse(new Date()) / 1000 - res.timestamp > 86400) {
            return { privateClose: false };
        }
        db.remove(key);
        return { privateClose: true };
    },

    addDouyinConfig(account) {
        let db = this.db();
        let key = 'privateClose_' + account;
        db.put(key, {
            timestamp: Date.parse(new Date()) / 1000,
        });
    },

    getMsg(type) {
        let speechs = storage.getSpeech();
        if (speechs.length === 0) {
            return undefined;
        }

        let tmp = [];
        let types = ["评\n论", "私\n信"];
        for (let i in speechs) {
            if (speechs[i]['typeName'] === types[type]) {
                tmp.push(speechs[i].title);
            }
        }

        if (tmp.length === 0) {
            return undefined;
        }

        let rd = Math.round(Math.random() * (tmp.length - 1));
        return { msg: tmp[rd] };
    },

    douyinExist(account) {
        let res = this.db().get('douyinExist_' + account);
        if (res) {
            return true;
        }
        this.db().put('douyinExist_' + account, true);
        return false;
    },

    videoExist(nickname, title) {
        let res = this.db().get('videoExist_' + nickname + '_' + title);
        if (res) {
            return true;
        }
        this.db().put('videoExist_' + nickname, true);
        return false;
    },

    //存一个月的内容
    accountFreGt(nickname) {
        let key = 'accountFreGt_' + nickname;
        let res = this.db().get(key);
        let current = Date.parse(new Date()) / 1000;
        if (!res) {
            this.db().put(key, JSON.stringify([current]));
            return { code: 1 };
        }

        res = JSON.parse(res);//存的时间戳
        if (res.length === 0) {
            this.db().put(key, JSON.stringify([current]));
            return { code: 1 };
        }


        while (res.length && current - res[0] * 1 > 30 * 86400) {
            res.splice(0, 1);
        }

        if (res.length >= 5) {
            return { code: 0 };
        }

        let k = 0;
        for (let i in res) {
            if (current - res[i] * 1 < 86400) {
                k++;
            }
        }

        if (k >= 2) {
            return { code: 0 };
        }
        this.db().put(key, JSON.stringify([current]));
        return { code: 1 };
    },

    //let types = { 'zanVideo': 0, 'zanComment': 1, 'comment': 2, 'focus': 3, 'privateMsg': 4, 'viewUserPage': 5, 'refreshVideo': 6 };
    op(index, type) {
        let db = this.db();
        let current = Date.parse(new Date()) / 1000;
        if (type === 6) {
            let res = db.get('config_' + index + '_videoTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_videoTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 0) {
            let res = db.get('config_' + index + '_zanVideoTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_zanVideoTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 1) {
            let res = db.get('config_' + index + '_zanCommentTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_zanCommentTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 2) {
            let res = db.get('config_' + index + '_commentTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_commentTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 3) {
            let res = db.get('config_' + index + '_focusTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_focusTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 4) {
            let res = db.get('config_' + index + '_privateMsgTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_privateMsgTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 5) {
            let res = db.get('config_' + index + '_viewUserPageTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_viewUserPageTimestamp_' + this.getDate(), JSON.stringify(res));
        }
    },

    getProvinces() {
        return [
            { id: 1, name: '北京市' },
            { id: 2, name: '天津市' },
            { id: 3, name: '河北省' },
            { id: 4, name: '山西省' },
            { id: 5, name: '内蒙古自治区' },
            { id: 6, name: '辽宁省' },
            { id: 7, name: '吉林省' },
            { id: 8, name: '黑龙江省' },
            { id: 9, name: '上海市' },
            { id: 10, name: '江苏省' },
            { id: 11, name: '浙江省' },
            { id: 12, name: '安徽省' },
            { id: 13, name: '福建省' },
            { id: 14, name: '江西省' },
            { id: 15, name: '山东省' },
            { id: 16, name: '河南省' },
            { id: 17, name: '湖北省' },
            { id: 18, name: '湖南省' },
            { id: 19, name: '广东省' },
            { id: 20, name: '广西壮族自治区' },
            { id: 21, name: '海南省' },
            { id: 22, name: '重庆市' },
            { id: 23, name: '四川省' },
            { id: 24, name: '贵州省' },
            { id: 25, name: '云南省' },
            { id: 26, name: '西藏自治区' },
            { id: 27, name: '陕西省' },
            { id: 28, name: '甘肃省' },
            { id: 29, name: '青海省' },
            { id: 30, name: '宁夏回族自治区' },
            { id: 31, name: '新疆' },
            { id: 32, name: '台湾省' },
            { id: 33, name: '香港' },
            { id: 34, name: '澳门' }
        ];
    },

    getFansSettingRate() {
        return {
            privateRate: this.get('fansSetting_privateRate') || 0,
            focusRate: this.get('fansSetting_focusRate') || 0,
            zanRate: this.get('fansSetting_zanRate') || 40,
            commentRate: this.get('fansSetting_commentRate') || 25,
            fansMinCount: this.get('fansSetting_fansMinCount') || 0,
            fansMaxCount: this.get('fansSetting_fansMaxCount') || 1000000,
            worksMinCount: this.get('fansSetting_worksMinCount') || 0,
            worksMaxCount: this.get('fansSetting_worksMaxCount') || 10000,
            opCount: this.get('fansSetting_opCount') || 100,
            account: this.get('fansSetting_account') || '',
        }
    },

    setFansSettingRate(item) {
        return this.set('fansSetting_privateRate', item.privateRate)
            && this.set('fansSetting_focusRate', item.focusRate)
            && this.set('fansSetting_zanRate', item.zanRate)
            && this.set('fansSetting_commentRate', item.commentRate)
            && this.set('fansSetting_fansMinCount', item.fansMinCount)
            && this.set('fansSetting_fansMaxCount', item.fansMaxCount)
            && this.set('fansSetting_worksMinCount', item.worksMinCount)
            && this.set('fansSetting_worksMaxCount', item.worksMaxCount)
            && this.set('fansSetting_opCount', item.opCount)
            && this.set('fansSetting_account', item.account || '')
    },

    getSearchUserSettingRate() {
        return {
            privateRate: this.get('searchUserSetting_privateRate') || 0,
            focusRate: this.get('searchUserSetting_focusRate') || 0,
            zanRate: this.get('searchUserSetting_zanRate') || 40,
            commentRate: this.get('searchUserSetting_commentRate') || 25,
            fansMinCount: this.get('searchUserSetting_fansMinCount') || 0,
            fansMaxCount: this.get('searchUserSetting_fansMaxCount') || 1000000,
            worksMinCount: this.get('searchUserSetting_worksMinCount') || 0,
            worksMaxCount: this.get('searchUserSetting_worksMaxCount') || 10000,
            opCount: this.get('searchUserSetting_opCount') || 100,
            keyword: this.get('searchUserSetting_keyword') || '',
        }
    },

    setSearchUserSettingRate(item) {
        return this.set('searchUserSetting_privateRate', item.privateRate)
            && this.set('searchUserSetting_focusRate', item.focusRate)
            && this.set('searchUserSetting_zanRate', item.zanRate)
            && this.set('searchUserSetting_commentRate', item.commentRate)
            && this.set('searchUserSetting_fansMinCount', item.fansMinCount)
            && this.set('searchUserSetting_fansMaxCount', item.fansMaxCount)
            && this.set('searchUserSetting_worksMinCount', item.worksMinCount)
            && this.set('searchUserSetting_worksMaxCount', item.worksMaxCount)
            && this.set('searchUserSetting_opCount', item.opCount)
            && this.set('searchUserSetting_keyword', item.keyword)
    },

    getFansIncPageRate() {
        return {
            //keyword: this.get('fansIncPage_keyword') || '',
            videoOpRate: this.get('fansIncPage_videoOpRate') || 100,
            commentRate: this.get('fansIncPage_commentRate') || 100,
            zanRate: this.get('fansIncPage_zanRate') || 100,
            zanCommentRate: this.get('fansIncPage_zanCommentRate') || 100,
            zanCount: this.get('fansIncPage_zanCount') || 5,
        }
    },

    setFansIncPageRate(item) {
        //this.set('fansIncPage_keyword', item.keyword)
        return this.set('fansIncPage_videoOpRate', item.videoOpRate)
            && this.set('fansIncPage_commentRate', item.commentRate)
            && this.set('fansIncPage_zanRate', item.zanRate)
            && this.set('fansIncPage_zanCommentRate', item.zanCommentRate)
            && this.set('fansIncPage_zanCount', item.zanCount)
    },

    //尽量 文件名 + key的模式
    get(key) {
        let db = this.db();
        return db.get(key);
    },

    //尽量 文件名 + key的模式
    set(key, value) {
        let db = this.db();
        db.put(key, value);
        return true;
    }
};

module.exports = machine;
