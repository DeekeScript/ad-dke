const DyCommon = require("./dy/Common");
const DyVideo = require("./dy/Video");
const DyUser = require("./dy/User");
const DyIndex = require("./dy/Index");
const DyComment = require("./dy/Comment");
const Http = require('../unit/mHttp');
let storage = require('../common/storage');
let statistics = require('../common/statistics');
let machine = require('../common/machine');
let baiduWenxin = require("../service/baiduWenxin");

let iDy = {
    me: {},//当前账号的信息
    taskConfig: {},
    titles: [],//今日刷视频的所有标题  标题+'@@@'+昵称   保证唯一，从而减少请求后台接口
    videoData: [],//所有视频数据时间
    zanVideoData: [],//当前任务所有的点赞视频时间
    zanCommentData: [],//当前任务所有的点赞评论时间
    commentData: [],//当前任务所有评论的时间
    privateMsgData: [],//当前任务私信的所有的时间
    viewUserPageData: [],//当前任务浏览用户的主页的所有时间
    viewVideoDate: [],//当前用户当前看到的视频时间点
    focusData: [],
    msgCount: 0,//当前账号消息数
    targetVideoCount: 0,//刷到目标视频数量
    videoCount: 0,//刷到视频数量
    provices: [],
    isCity: false,//是否是同城
    privateClose: false,//私信是否被禁，被禁之后，24小时之后自动解除  被禁之后，当天不再发内容
    nicknames: [],//所有的昵称，重复的忽略

    setIsCity(res) {
        this.isCity = res;
    },

    getData(name) {
        return this[name] || undefined;
    },

    getProvinces() {
        if (!this.provices.length) {
            if (storage.getMachineType() === 1) {
                this.provices = machine.getProvinces();
            } else {
                let config = Http.post('dke', 'getProvince', {});
                if (config.code !== 0) {
                    return false;
                }
                this.provices = config.data;
            }
        }
        return this.provices;
    },

    //获取任务列表
    getTask(params) {
        if (storage.getMachineType() === 1) {
            let res = { code: 0, data: machine.getTask({ isCity: params['isCity'] }).reverse() };
            //log('getTask', res);
            return res;
        }
        return Http.post('dke', 'getTaskList', { isCity: params['isCity'] });
    },

    //获取任务详情数据
    getTaskConfig() {
        let d = new Date();
        let today = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        if (!this.taskConfig || this.taskConfig.today !== today) {
            let config;
            if (storage.getMachineType() === 1) {
                config = { code: 0, data: machine.getTaskConfig(this.provices, this.taskId) };
                log('getTaskConfig', config.data.videoRules);
            } else {
                config = Http.post('dke', 'getTaskDetail', { id: this.taskId });
                if (config.code !== 0 || !config.data || !config.data.id) {
                    return false;
                }
            }

            config.data.today = today;
            this.taskConfig = config.data;
        }
        return this.taskConfig;
    },

    //获取视频，点赞，评论等的频率数据
    getConfig() {
        let dateData;
        if (storage.getMachineType() === 1) {
            dateData = { code: 0, data: machine.getConfig(this.taskId) };
            //log('getConfig', dateData);
        } else {
            dateData = Http.post('dke', 'getDateData', { task_id: this.taskId });
        }

        if (dateData.code !== 0) {
            dialogs.alert('数据请求异常，请重试！');
            return false;
        }

        let res = {
            zanVideoTimestamp: [],
            zanCommentTimestamp: [],
            commentTimestamp: [],
            focusTimestamp: [],
            privateMsgTimestamp: [],
            viewUserPageTimestamp: [],
            videoTimestamp: [],
            privateClose: false,
        }

        res = dateData.data;//res的数据格式如上图所示
        //log('各个频率的数据：', res);
        this.videoData = res.videoTimestamp;
        //log('this.videoData', this.videoData);
        this.zanVideoData = res.zanVideoTimestamp;
        this.zanCommentData = res.zanCommentTimestamp;
        this.commentData = res.commentTimestamp;
        this.privateMsgData = res.privateMsgTimestamp;
        this.viewUserPageData = res.viewUserPageTimestamp;
        this.focusData = res.focusTimestamp;
        this.privateClose = res.privateClose;
        return res;
    },

    getDouyinConfig() {
        let dateData;
        if (storage.getMachineType() === 1) {
            dateData = { code: 0, data: machine.getDouyinConfig(this.me.douyin) };
        } else {
            dateData = Http.post('dke', 'getDouyinConfig', { account: this.me.douyin });
        }

        if (dateData.code !== 0) {
            dialogs.alert('数据请求异常，请重试！');
            return false;
        }
        DyCommon.log('私信状态', !dateData.data.privateClose);
        this.privateClose = dateData.data.privateClose;
    },

    addDouyinConfig() {
        let config;
        if (storage.getMachineType() === 1) {
            config = { code: 0, data: machine.addDouyinConfig(this.me.douyin) };
        } else {
            config = Http.post('dke', 'addDouyinConfig', { account: this.me.douyin });
        }

        if (config.code !== 0) {
            return false;
        }
        this.privateClose = true;
    },

    //获取视频和目标视频数  用于判断是否完成任务
    getTaskVideoData() {
        let res = {
            videoCount: 0,
            targetVideoCount: 0,
        }

        if (storage.getMachineType() === 1) {
            return res;//永远不会结束
        }

        let dateData = Http.post('dke', 'getTaskVideoData', { task_id: this.taskId });
        if (dateData.code !== 0) {
            dialogs.alert('数据请求异常，请重试！');
            return false;
        }

        res = dateData.data;//res的数据格式如上图所示
        this.videoCount = res.videoCount;
        this.targetVideoCount = res.targetVideoCount;
        return res;
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.getMachineType() === 1) {
            if (storage.get('baidu_wenxin_switch')) {
                return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            }
            return machine.getMsg(type) || false;//永远不会结束
        }

        let res = Http.post('dke', 'getMsg', { type: type, lib_id: this.taskConfig.lib_id });
        if (res.code !== 0) {
            return false;
        }
        return res.data;
    },

    douyinExist(douyin) {
        if (storage.getMachineType() === 1) {
            return machine.douyinExist(douyin);//永远不会结束
        }

        let res = Http.post('dke', 'douyinExist', { douyin: douyin });
        if (res.code !== 0) {
            return true;
        }
        console.log('用户存在：' + res.data.isExist);
        return res.data.isExist;
    },

    videoExist(nickname, title) {
        if (storage.getMachineType() === 1) {
            return machine.videoExist(nickname, title);//永远不会结束
        }

        let res = Http.post('dke', 'videoExist', { nickname: nickname, title: title });
        if (res.code !== 0) {
            return true;
        }
        return res.data.isExist;
    },

    accountFreGt(nickname) {
        let res;
        if (storage.getMachineType() === 1) {
            res = machine.accountFreGt(nickname);
        } else {
            res = Http.post('dke', 'accountFre', { nickname: nickname });
        }

        if (res.code === 0) {
            return true;
        }
        return false;
    },

    //上报视频数据
    postVideoData(videoData, type) {
        if (storage.getMachineType() === 1) {
            return 0;
        }

        if (type === 0) {
            this.videoCount++;
        } else {
            this.targetVideoCount++;
        }

        let res = Http.post('dke', 'addVideo', {
            task_id: this.taskConfig.id,
            nickname: videoData.nickname,
            title: videoData.title,
            zan_count: videoData.zanCount || 0,
            comment_count: videoData.commentCount || 0,
            collect_count: videoData.collectCount || 0,
            share_count: videoData.shareCount || 0,
            keyword: videoData.containWord || '',
            no_keyword: videoData.noContainWord || '',
            watch_second: videoData.watchSecond || 0,
            type: type || 0,
        });
        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    //操作，0点赞视频，1点赞评论，2评论，3关注，4私信，5访问主页，6刷视频
    op(typeString) {
        let types = { 'zanVideo': 0, 'zanComment': 1, 'comment': 2, 'focus': 3, 'privateMsg': 4, 'viewUserPage': 5, 'refreshVideo': 6 };
        if (undefined === types[typeString]) {
            throw new Error('视频操作类型不对！');
        }

        if (storage.getMachineType() === 1) {
            machine.op(this.taskId, types[typeString]);
            return 0;
        }

        let res = Http.post('dke', 'op', {
            task_id: this.taskConfig.id,
            type: types[typeString] || 0,
        });
        return res.data.id;
    },

    //上报视频操作数据  ////操作
    addVideoOp(videoData, type) {
        log('storage.getMachineType()', storage.getMachineType());
        if (storage.getMachineType() === 1) {
            return 0;
        }

        if (videoData.userData) {
            videoData.userData.id = videoData.id;
            this.addVideoDouyin(videoData.userData);
        }

        let res = Http.post('dke', 'addVideoOp', {
            video_id: videoData.id,
            video_comment_id: videoData.videoCommentId || 0,
            type: type || 0,//0操作视频，1操作评论
            is_zan: videoData.isZan || 0,
            zan_time: videoData.zanTime || 0,
            is_private_msg: videoData.isPrivateMsg || 0,
            private_msg: videoData.privateMsg || '',
            is_comment: videoData.isComment || 0,
            comment_msg: videoData.commentMsg || '',
            comment_msg_time: videoData.commentMsgTime || 0,
            msg_time: videoData.msgTime || 0,
            is_focus: videoData.isFocus || 0,
            focus_time: videoData.focusTime || 0,
            task_id: this.taskConfig.id,
            is_view_user: videoData.isViewUser || 0,
            view_user_time: videoData.view_user_time || 0,
            is_view_video: videoData.isViewVideo || 0,
            is_view_target_video: videoData.isViewTargetVideo || 0,
        });

        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    //添加视频评论
    addVideoComment(data) {
        if (storage.getMachineType() === 1) {
            return 0;
        }
        let res = Http.post('dke', 'addVideoComment', {
            video_id: data.id,
            nickname: data.nickname || '',
            douyin: data.douyin || '',
            keyword: data.keyword || '',
            no_keyword: data.noKeyword || '',
            province_id: data.province_id || 0,
            in_time: data.in_time || 0,
            desc: data.desc || '',
        });
        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    updateVideoComment(data) {
        if (storage.getMachineType() === 1) {
            return 0;
        }

        let res = Http.post('dke', 'updateVideoComment', {
            id: data.id,
            douyin: data.douyin,
        });
        console.log('更新videoComment', res);
        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    addVideoDouyin(data) {
        if (storage.getMachineType() === 1) {
            return 0;
        }

        let res = Http.post('dke', 'addVideoDouyin', {
            video_id: data.id,
            nickname: data.nickname || '',
            douyin: data.douyin || '',
            zan_count: data.zanCount || 0,
            focus_count: data.focusCount || 0,
            fans_count: data.fansCount || 0,
            type: data.type || 0,
            task_id: this.taskConfig.id,
            works_count: data.worksCount,
            open_window: data.openWindow ? 1 : 0,//开启橱窗
            is_tuangou: data.tuangouTalent ? 1 : 0,
            province_id: this.getIdByIp(data.ip),
            is_person: !data.isCompany ? 1 : 0,//是否是机构 公司
            gender: data.gender,
            age: data.age,
            introduce: data.introduce,
        });
        if (res.code !== 0) {
            return 0;
        }
        return res.data.id;
    },

    freCheck(timestamps) {
        let currentTime = Date.parse(new Date()) / 1000;
        if (timestamps.length && timestamps[0] <= currentTime - 86400) {
            let k = 0;
            while (k++ < timestamps.length) {
                if (undefined === timestamps[0]) {
                    break;
                }

                if (timestamps[0] > currentTime - 86400) {
                    break;
                }

                timestamps.splice(0, 1);
            }
        }

        //this.taskConfig.hour 是任务配置的小时数
        return DyCommon.timestampsToFre(timestamps, JSON.parse(this.taskConfig.hour));
    },

    getIdByIp(ip) {
        for (let i in this.provices) {
            if (this.provices[i].name.indexOf(ip) !== -1) {
                return this.provices[i].id;
            }
        }
        return 0;
    },

    getIpById(id) {
        for (let i in this.provices) {
            if (this.provices[i].id === id) {
                return this.provices[i].name;
            }
        }
        return '';
    },

    //关注和私信一样 6个档 [0, 2, 3, 4, 5, 6]  每小时
    //新增，直接拉升3倍
    focusFreCheck(focusLimit) {
        if (focusLimit === 0) {
            return false;
        }

        if (this.focusData.length === 0) {
            return true;
        }

        focusLimit = [0, 2, 3, 4, 5, 6][focusLimit] * 3;
        let focusFre = this.freCheck(this.focusData);
        console.log('关注频率：', focusFre, focusLimit);

        //十分钟频率是否高于150%
        if (focusFre['tenMinuteFre']['tenMinute'] > focusLimit / 6 * 1.5) {
            return false;
        }

        //一小时之内不得大于130%
        if (focusFre['hourFre']['hour'] > focusLimit * 1.3) {
            return false;
        }

        //一小时之内不得大于10%
        if (focusFre['allFre']['hour'] > focusLimit * 1.10) {
            return false;
        }

        return true;
    },

    /**
     * 
      { label: '不点赞视频', value: 0 },
        { label: '小于5%【很安全】', value: 1 },
        { label: '5%-10%【很安全】', value: 2 },
        { label: '10%-15%【很安全】', value: 3 },
        { label: '15%-20%【较安全】', value: 4 },
        { label: '20%-30%【较安全】', value: 5 },
        { label: '30%-40%【不可持续】', value: 6 },
        { label: '大于50%【高危】', value: 7 },
     */
    //点赞频率检查  假设每小时可以超出预期 20%  每10分钟可以超出30%  每分钟可以超出40%  超出太多可能会触发风控
    zanVideoFreCheck(zanVideoLimit) {
        if (zanVideoLimit === 0) {
            return false;
        }

        if (this.zanVideoData.length === 0) {
            return true;
        }

        zanVideoLimit = [
            [],
            [0, 5],
            [5, 10],
            [10, 15],
            [15, 20],
            [20, 30],
            [30, 40],
            [50, 60],
        ][zanVideoLimit];
        zanVideoLimit = (zanVideoLimit[0] + (zanVideoLimit[1] - zanVideoLimit[0]) * Math.random()) / 100 * (1 + 0.5);//点赞提升0.5倍

        let zanFre = this.freCheck(this.zanVideoData);
        let videoFre = this.freCheck(this.videoData);//点赞需要获取视频的频率，再去乘以点赞的频率，即可得到最终的每秒点赞数量
        // DyCommon.log('点赞评论：', zanVideoLimit, zanFre, videoFre);
        //一分钟之内不得大于20%
        if (zanFre['minuteFre']['minute'] > videoFre['minuteFre']['minute'] * zanVideoLimit * 1.20) {
            return false;
        }

        //十分钟频率是否高于10%
        if (zanFre['tenMinuteFre']['tenMinute'] > videoFre['tenMinuteFre']['tenMinute'] * zanVideoLimit * 1.1) {
            return false;
        }

        //一小时之内不得大于30%
        if (zanFre['hourFre']['hour'] > videoFre['hourFre']['hour'] * zanVideoLimit * 1.30) {
            return false;
        }

        //一小时之内不得大于10%
        if (zanFre['allFre']['hour'] > videoFre['allFre']['hour'] * zanVideoLimit * 1.10) {
            return false;
        }

        return true;
    },

    /**
      { label: '不点赞视频评论', value: 0 },
        { label: '小于10个/小时【很安全】', value: 1 },
        { label: '10-20个/小时【很安全】', value: 2 },
        { label: '20-30个/小时【较安全】', value: 3 },
        { label: '30-40个/小时【较安全】', value: 4 },
        { label: '40-50个/小时【不可持续】', value: 5 },
        { label: '50-60个/小时【不可持续】', value: 6 },
        { label: '大于60个/小时【高危】', value: 7 },
     */
    //zanCommentLimit 大概是1小时60个
    zanCommentFreCheck(zanCommentLimit) {
        if (zanCommentLimit === 0) {
            return false;
        }

        if (this.zanCommentData.length === 0) {
            return true;
        }

        zanCommentLimit = [
            [],
            [0, 10],
            [10, 20],
            [20, 30],
            [30, 40],
            [40, 50],
            [50, 60],
            [60, 70],
        ][zanCommentLimit];
        zanCommentLimit = zanCommentLimit[0] + (zanCommentLimit[1] - zanCommentLimit[0]) * Math.random();

        let zanCommentFre = this.freCheck(this.zanCommentData);
        // DyCommon.log('评论频率：', zanCommentFre);
        //一分钟之内不得大于200%
        if (zanCommentFre['hourFre']['minute'] > zanCommentLimit / 60 * 2) {
            return false;
        }

        //十分钟频率是否高于50%
        if (zanCommentFre['hourFre']['tenMinute'] > zanCommentLimit / 6 * 1.5) {
            return false;
        }

        //一小时之内不得大于20%
        if (zanCommentFre['hourFre']['hour'] > zanCommentLimit * 1.20) {
            return false;
        }

        //总共之内不得大于10%
        if (zanCommentFre['allFre']['hour'] > zanCommentLimit * 1.10) {
            return false;
        }

        return true;
    },

    /**
      { label: '不私信用户', value: 0 },
        { label: '低【很安全】', value: 1 },
        { label: '中低【很安全】', value: 2 },
        { label: '中【较安全】', value: 3 },
        { label: '中高【较安全】', value: 4 },
        { label: '高【不可持续】', value: 5 },
     */
    //评论评论检查 6档 [0, 5, 10, 15, 20, 25]  每小时
    commentFreCheck(commentLimit) {
        if (commentLimit === 0) {
            return false;
        }

        if (this.commentData.length === 0) {
            return true;
        }

        commentLimit = commentLimit * 5 * (1 + 0.5);//评论频率提升50%

        let commentFre = this.freCheck(this.commentData);
        console.log('评论频率：', commentFre, commentLimit);
        //十分钟频率是否高于150%
        if (commentFre['tenMinuteFre']['tenMinute'] > commentLimit / 6 * 1.5) {
            return false;
        }

        //一小时之内不得大于20%
        if (commentFre['hourFre']['hour'] > commentLimit * 1.20) {
            return false;
        }

        //总共之内不得大于10%
        if (commentFre['allFre']['hour'] > commentLimit * 1.10) {
            return false;
        }

        return true;
    },

    //返回0正常，其他都不正常
    taskCheck(taskConfig) {
        //查看是否到了时间，没有的话，直接返回flase
        let hour;
        if (typeof (taskConfig.hour) === 'string') {
            hour = JSON.parse(taskConfig.hour);
        } else {
            hour = taskConfig.hour;
        }

        //log(hour, (new Date()).getHours());
        if (!hour.includes((new Date()).getHours())) {
            return 101;//不在任务时间
        }

        if (taskConfig.end_time && taskConfig.end_time <= Date.parse(new Date()) / 1000) {
            //return 102;//结束了
        }

        if (this.msgCount >= taskConfig.limit_count && taskConfig.end_type === 3) {
            //return 103;//消息数达到了
        }

        if (this.videoCount >= taskConfig.limit_count && taskConfig.end_type === 1) {
            //return 104;//任务视频数达到了
        }

        if (this.targetVideoCount >= taskConfig.limit_count && taskConfig.end_type === 2) {
            //return 105;//任务目标视频数达到了
        }
        return 0;
    },

    //刷视频频率检查  videoFreLimit 是每小时刷视频个数  一般300每小时
    refreshVideoFreCheck(refresh_video_fre) {
        //return true;//暂时不对视频滑动做频率限制
        let fre = [0, 100, 150, 250, 350, 400, 500];
        let refreshVideoLimit = fre[refresh_video_fre];

        if (this.videoData.length === 0) {
            return true;
        }

        let videoFre = this.freCheck(this.videoData);
        //log(JSON.stringify(this.videoData));
        console.log('刷视频频率：', JSON.stringify(videoFre), this.videoData.length, refreshVideoLimit);

        //一分钟之内不得大于100%
        if (videoFre['tenMinuteFre']['minute'] > refreshVideoLimit / 60 * 2) {
            return false;
        }

        //十分钟频率是否高于50%
        if (videoFre['tenMinuteFre']['tenMinute'] > refreshVideoLimit / 6 * 1.50) {
            return false;
        }

        //一小时之内不得大于20%
        if (videoFre['hourFre']['hour'] > refreshVideoLimit * 1.20) {
            return false;
        }

        //总计之内不得大于10%
        if (videoFre['allFre']['hour'] > refreshVideoLimit * 1.10) {
            return false;
        }

        return true;
    },

    //私信个数检查 6个档 [0, 2, 3, 4, 5, 6]
    privateMsgFreCheck(privateMsgLimit) {
        if (privateMsgLimit === 0) {
            return false;
        }

        privateMsgLimit = [0, 2, 3, 4, 5, 6][privateMsgLimit] * (1 + 0.5);

        if (this.privateMsgData.length === 0) {
            return true;
        }

        let privateMsgFre = this.freCheck(this.privateMsgData);
        //DyCommon.log('私信频率：', privateMsgFre, privateMsgLimit);

        //十分钟频率是否高于50%
        if (privateMsgFre['tenMinuteFre']['tenMinute'] > privateMsgLimit / 6 * 1.5) {
            return false;
        }

        //一小时之内不得大于30%
        if (privateMsgFre['hourFre']['hour'] > privateMsgLimit * 1.3) {
            return false;
        }

        //总数不能超过 10%
        if (privateMsgFre['allFre']['hour'] >= privateMsgLimit * 1.1) {
            return false;
        }

        return true;
    },

    //访问别人主页频率检查  1小时访问 60个人
    viewUserPageFreCheck(viewUserPageLimit) {
        if (this.viewUserPageData.length === 0) {
            return true;
        }

        let viewUserPageFre = this.freCheck(this.viewUserPageData);
        //DyCommon.log('查看用户首页频率：', viewUserPageFre);

        //一小时之内不得大于30%
        if (viewUserPageFre['hourFre']['hour'] > viewUserPageLimit * 1.3) {
            return false;
        }

        //十分钟频率是否高于50%
        if (viewUserPageFre['tenMinuteFre']['tenMinute'] > viewUserPageLimit / 6 * 1.50) {
            return false;
        }

        //总数不能超过 10%
        if (viewUserPageFre['allFre']['hour'] >= viewUserPageLimit * 1.1) {
            return false;
        }

        return true;
    },

    //用户规则检查
    userRuleCheck(userRules, userData) {
        //console.log(userData);
        //console.log(userRules);
        for (let rule of userRules) {
            //检测当前这个规则是否符合，是的话则直接返回
            let gender;
            if (typeof (rule.gender) === 'string') {
                gender = JSON.parse(rule.gender);
            } else {
                gender = rule.gender;
            }

            if (!gender.includes(userData.gender)) {
                continue;
            }

            // let provinces;
            // if (typeof (rule.province_id) === 'string') {
            //     provinces = JSON.parse(rule.province_id);
            // } else {
            //     provinces = rule.province_id;
            // }

            // if (!provinces.includes(0) && !provinces.includes(this.getIdByIp(userData.ip))) {
            //     continue;
            // }

            // if ((rule.is_person === 1 && userData.isCompany) || (rule.is_person === 2 && !userData.isCompany)) {
            //     continue;
            // }

            // if ((rule.open_window === 1 && !userData.openWindow) || (rule.open_window === 2 && userData.openWindow)) {
            //     continue;
            // }

            // if ((rule.is_tuangou === 1 && !userData.tuangouTalent) || (rule.is_tuangou === 2 && userData.tuangouTalent)) {
            //     continue;
            // }

            // if (rule.min_zan || rule.max_zan) {
            //     if (userData.zanCount < rule.min_zan || userData.zanCount > rule.max_zan) {
            //         continue;
            //     }
            // }

            // if (rule.min_fans || rule.max_fans) {
            //     if (userData.fansCount < rule.min_fans || userData.fansCount > rule.max_fans) {
            //         continue;
            //     }
            // }

            // if (rule.min_works || rule.max_works) {
            //     if (userData.worksCount < rule.min_works || userData.worksCount > rule.max_works) {
            //         continue;
            //     }
            // }

            // if (rule.min_focus || rule.max_focus) {
            //     if (userData.focusCount < rule.min_focus || userData.focusCount > rule.max_focus) {
            //         continue;
            //     }
            // }

            log('年龄：', rule.min_age, rule.max_age, userData.age);
            if (rule.min_age || rule.max_age) {
                if (!rule.min_age) {
                    rule.min_age = 0;
                }

                if (userData.age < rule.min_age || userData.age > rule.max_age) {
                    continue;
                }
            }

            // if (rule.contain) {
            //     userData.containWord = DyCommon.containsWord(rule.contain, userData.introduce);
            //     if (!userData.containWord) {
            //         continue;
            //     }
            // }

            // if (rule.no_contain) {
            //     userData.noContainWord = DyCommon.noContainsWord(rule.no_contain, userData.introduce);
            //     if (!userData.noContainWord) {
            //         continue;
            //     }
            // }

            return userData;
        }
        return false;
    },

    //评论规则检查
    commentRuleCheck(commentRules, commentData) {
        for (let rule of commentRules) {
            //0不限，1，字母；2数字；3汉字，4表情，5其他符号
            // let nicknameType;
            // if (typeof (rule.nickname_type) === 'string') {
            //     nicknameType = JSON.parse(rule.nickname_type);
            // } else {
            //     nicknameType = rule.nickname_type;
            // }

            // if (!nicknameType.includes(0)) {
            //     if (nicknameType.includes(1) && !/[a-zA-Z]+/.test(commentData.nickname)) {
            //         continue;
            //     }

            //     if (nicknameType.includes(2) && !/[0-9]+/.test(commentData.nickname)) {
            //         continue;
            //     }

            //     if (nicknameType.includes(3) && !/[\u4e00-\u9fa5]+/.test(commentData.nickname)) {
            //         continue;
            //     }

            /////     let reg = /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD]|[\u2660-\u2767]\u0020)/g;
            //     if (nicknameType.includes(4) && !reg.test(commentData.nickname)) {
            //         continue;
            //     }
            // }

            // if (rule.min_comment || rule.max_comment) {
            //     if (commentData.content.length < rule.min_comment || commentData.content.length > rule.max_comment) {
            //         continue;
            //     }
            // }

            if (rule.min_zan || rule.max_zan) {
                if (commentData.zanCount < rule.min_zan || commentData.zanCount > rule.max_zan) {
                    continue;
                }
            }

            // if (rule.in_time) {
            //     //30秒内的不回忽略
            //     if (commentData.time - (Date.parse(new Date()) / 1000) > rule.in_time + 30) {
            //         continue;
            //     }
            // }

            // let provinces;
            // if (typeof (rule.province_id) === 'string') {
            //     provinces = JSON.parse(rule.province_id);
            // } else {
            //     provinces = rule.province_id;
            // }

            //log(provinces, commentData.ip, this.getIdByIp(commentData.ip));
            // if (!provinces.includes(0) && !provinces.includes(this.getIdByIp(commentData.ip))) {
            //     continue;
            // }

            if (rule.contain) {
                commentData.containWord = DyCommon.containsWord(rule.contain, commentData.content);
                if (!commentData.containWord) {
                    continue;
                }
            }

            // if (rule.no_contain) {
            //     commentData.noContainWord = DyCommon.noContainsWord(rule.no_contain, commentData.content);
            //     if (!commentData.noContainWord) {
            //         continue;
            //     }
            // }

            return commentData;
        }
        return false;
    },

    //检测标题是否正常
    videoRulesCheckTitle(videoRules, title) {
        for (let rule of videoRules) {
            if (rule.contain) {
                log(rule.contain, title);
                let containWord = DyCommon.containsWord(rule.contain, title);
                if (!containWord) {
                    continue;
                }
            }

            if (rule.no_contain) {
                let noContainWord = DyCommon.noContainsWord(rule.no_contain, title);
                if (!noContainWord) {
                    continue;
                }
            }

            return true;
        }
        return false;
    },

    //视频规则是否符合条件
    videoRulesCheck(videoRules, videoData, isCity) {
        //log('视频规则是否符合条件', videoData, videoRules, isCity);
        for (let rule of videoRules) {
            //检测当前这个规则是否符合，是的话则直接返回
            if (isCity) {
                //判断距离和时间
                /*
                    0: { text: '不限' },
                    1: { text: '1小时内' },
                    2: { text: '12小时内' },
                    3: { text: '1天内' },
                    4: { text: '3天内' },
                    5: { text: '7天内' },
                    6: { text: '15天内' }, 
                */
                // if (rule.in_time && videoData.in_time > [0, 1, 12, 24, 72, 24 * 7, 24 * 15][rule.in_time] * 3600) {
                //     continue;
                // }

                /**
                    0: { text: '不限' },
                    1: { text: '3公里以内' },
                    2: { text: '5公里以内' },
                    3: { text: '10公里以内' },
                    4: { text: '20公里以内' },
                    5: { text: '30公里以内' },
                    6: { text: '50公里以内' },
                 */
                // log('距离', videoData.distance, [0, 3, 5, 10, 20, 30, 50][rule.distance]);
                // if (videoData.distance !== 0 && (rule.distance && videoData.distance > [0, 3, 5, 10, 20, 30, 50][rule.distance])) {
                //     continue;
                // }
            }

            //console.log(rule.min_zan, videoData.zanCount, rule.max_zan);
            // if (rule.min_zan || rule.max_zan) {
            //     if (videoData.zanCount < rule.min_zan || videoData.zanCount > rule.max_zan) {
            //         continue;
            //     }
            // }

            // if (rule.min_comment || rule.min_comment) {
            //     if (videoData.commentCount < rule.min_comment || videoData.commentCount > rule.max_comment) {
            //         continue;
            //     }
            // }

            // if (rule.min_collect || rule.max_collect) {
            //     if (videoData.collectCount < rule.min_collect || videoData.collectCount > rule.max_collect) {
            //         continue;
            //     }
            // }

            // if (rule.min_share || rule.max_share) {
            //     if (videoData.shareCount < rule.min_share || videoData.shareCount > rule.max_share) {
            //         continue;
            //     }
            // }

            if (rule.contain) {
                videoData.containWord = DyCommon.containsWord(rule.contain, videoData.title);
                log(videoData.containWord);
                if (!videoData.containWord) {
                    continue;
                }
            }

            if (rule.no_contain) {
                videoData.noContainWord = DyCommon.noContainsWord(rule.no_contain, videoData.title);
                log(videoData.containWord);
                if (!videoData.noContainWord) {
                    continue;
                }
            }

            return videoData;
        }
        return false;
    },

    refreshVideo(videoRules, isCity) {
        DyCommon.toast('现在是刷视频');
        let videoData;
        let errorCount = 0;
        let rpCount = 0;
        let noTitleCount = 5;

        let readVideoStartTime = 0;
        let readVideoEndTime = 0;

        while (true) {
            DyVideo.next();
            this.viewVideoDate[0] = Date.parse(new Date()) / 1000;
            DyCommon.toast('-------------------滑动视频----------------');
            try {
                if (!this.refreshVideoFreCheck(this.taskConfig.refresh_video_fre)) {
                    return 106;//视频频率达到了  此时可以休息10分钟  直接关掉抖音即可
                }

                log('-标题获取');
                readVideoStartTime = Date.parse(new Date()) / 1000;
                decSecond = Date.parse(new Date()) / 1000;
                let vContent = DyVideo.getContent();
                if (!vContent) {
                    noTitleCount--;
                    if (noTitleCount <= 0) {
                        throw new Error('可能异常！');
                    }
                    DyVideo.videoSlow();
                    DyCommon.sleep(1000 + 1000 * Math.random());
                    continue;
                }
                noTitleCount = 5;
                log('-标题检查');
                if (!this.videoRulesCheckTitle(videoRules, vContent)) {
                    log('不包含关键词', '随机休眠1-2秒');
                    DyVideo.videoSlow();
                    threads.start(() => {
                        this.postVideoData({ nickname: '-', title: vContent }, 0);
                        this.op('refreshVideo');
                    });
                    this.videoData.push(Date.parse(new Date()) / 1000);//将数据写上
                    continue;
                }

                log('-是否直播');
                if (DyVideo.isLiving()) {
                    DyCommon.toast('直播中，切换下一个视频');
                    DyVideo.videoSlow();
                    continue;
                }

                log('-昵称获取');
                let vNickname = DyVideo.getNickname();
                //同类型的
                let nicknames = storage.getExcNicknames();
                if (nicknames) {
                    nicknames = nicknames.split(/[,|，]/);
                    if (nicknames.includes(vNickname)) {
                        DyCommon.toast('排除的昵称');
                        DyVideo.videoSlow();
                        continue;
                    }
                }

                statistics.viewVideo();//刷视频数量加1

                let unique = vNickname + '_' + vContent;
                if (this.titles.includes(unique)) {
                    DyCommon.toast('重复视频');
                    rpCount++;
                    if (rpCount > 3) {
                        throw new Error('三次都没有解决错误，重启');
                    }
                    continue;
                }

                rpCount = 0;
                if (this.titles.length >= 100) {
                    this.titles.shift();
                }

                this.titles.push(unique);

                if (this.nicknames.includes(vNickname) || this.accountFreGt(vNickname)) {
                    DyCommon.toast(vNickname + '：重复或频率超出');
                    //防止刷视频出错
                    //this.postVideoData({ nickname: vNickname, title: vContent }, 1);
                    this.op('refreshVideo');
                    continue;
                }

                log('获取视频数据', readVideoStartTime);
                videoData = DyVideo.getInfo(isCity, { nickname: vNickname, title: vContent, commentCount: true });
                readVideoEndTime = Date.parse(new Date()) / 1000;
                log('获取视频数据结束', readVideoEndTime);
            } catch (e) {
                errorCount++;
                console.log(e);
                if (errorCount > 3) {
                    throw new Error('三次都没有解决错误');
                }
                continue;
            }
            errorCount = 0;
            if (!videoData.title) {
                DyCommon.toast('当前视频没有标题，切换到下一个');
                DyVideo.videoSlow();
                continue;
            }

            //查看是不是已经存在的视频
            if (this.videoExist(videoData.nickname, videoData.title)) {
                DyCommon.toast('已经存在的视频');
                continue;//13871593340
            }

            //接下来是视频的参数和config比对， 不合适则刷下一个
            let tmp = this.videoRulesCheck(videoRules, videoData, isCity);
            this.videoData.push(Date.parse(new Date()) / 1000);//将数据写上
            if (!tmp) {
                log('不符合条件');
                this.videoCount++;//视频数量增加
                //不合适的视频也会请求到后端
                this.viewVideoDate[1] = Date.parse(new Date()) / 1000;
                videoData.watchSecond = this.viewVideoDate[1] - this.viewVideoDate[0];
                threads.start(() => {
                    this.postVideoData(videoData, 0);
                    this.op('refreshVideo');
                });
                continue;
            }
            videoData = tmp;
            break;
        }

        statistics.viewTargetVideo();//目标视频数量加1

        //合适的视频，内容请求到后端  然后返回数据看看是否点赞 是否评论  评论数量等等 是否点赞等等， 主方法拿到返回值再去操作对应的方法
        //符合条件的视频，多看一会儿  首先看看是否有滑动条，有的话，观看30-60秒  没有的话 观看 15-30秒
        let processBar = DyVideo.getProcessBar();
        //console.log('processBar', processBar, processBar && processBar.bounds().height(), processBar && processBar.bounds().top);
        if (storage.getPackage() !== 'org.autojs.autoxjs.v6') {
            if (processBar) {
                let sleepSec = 20 + 20 * Math.random() - 5;
                sleepSec = sleepSec - (readVideoEndTime - readVideoStartTime);
                if (sleepSec <= 0) {
                    sleepSec = 0;
                }
                DyCommon.log('休眠' + sleepSec + 's');
                DyCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
            } else {
                let sleepSec = (15 + 10 * Math.random() - 5);
                sleepSec = sleepSec - (readVideoEndTime - readVideoStartTime);
                if (sleepSec <= 0) {
                    sleepSec = 0;
                }
                DyCommon.log('休眠' + sleepSec + 's');
                DyCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
            }
        } else {
            let sleepSec = (15 + 10 * Math.random() - 5);
            sleepSec = sleepSec - (readVideoEndTime - readVideoStartTime);
            if (sleepSec <= 0) {
                sleepSec = 0;
            }

            DyCommon.log('休眠' + sleepSec + 's');
            DyCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
        }

        this.viewVideoDate[1] = Date.parse(new Date()) / 1000;
        videoData.watchSecond = this.viewVideoDate[1] - this.viewVideoDate[0];
        this.op('refreshVideo');
        videoData.id = this.postVideoData(videoData, 1);
        if (!this.nicknames.includes(videoData.nickname)) {
            this.nicknames.push(videoData.nickname);
            if (this.nicknames.length > 3000) {
                this.nicknames.shift();
            }
        }

        return videoData;
    },

    commentDeal(videoData) {
        let windowOpen = false;
        if (this.commentFreCheck(this.taskConfig.comment_fre)) {
            DyCommon.log('评论频率检测通过');
            //随机评论视频
            let msg = this.getMsg(0, videoData.title);
            log('commentDeal', msg, videoData.commentCount);
            if (msg) {
                DyVideo.openComment(!!videoData.commentCount);
                DyCommon.log('开启评论窗口-1');
                windowOpen = true;
                DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                DyCommon.log('评论了');
                statistics.comment();//评论+1
                let tmp = JSON.parse(JSON.stringify(videoData));
                tmp.isComment = 1;
                tmp.commentMsg = msg.msg;
                tmp.commentMsgTime = Date.parse(new Date()) / 1000;
                this.op('comment');
                this.addVideoOp(tmp, 0);
                this.commentData.push(tmp.commentMsgTime);//将评论的数据写上
            }
        }

        log('评论数量：', videoData.commentCount);
        if (!windowOpen) {
            DyCommon.log('打开评论窗口-');
            DyVideo.openComment(!!videoData.commentCount);
        }

        //如果一开始没有评论 这里直接返回到视频
        if (videoData.commentCount === 0) {
            DyCommon.back(1);
            return true;
        }

        //随机点赞 评论回复
        let contains = [];//防止重复的
        let rps = 0;//大于2 则退出
        let opCount = 1 + Math.ceil(Math.random() * 5);//最多滑动5屏
        if (videoData.commentCount < 50) {
            opCount = 1;
        }

        while (true) {
            DyCommon.log('获取评论列表-开始');
            let comments = DyComment.getList();
            DyCommon.log('获取到了评论列表：' + comments.length);
            if (comments.length === 0) {
                break;
            }

            let rpCount = 0;
            let preOpCount = 1 + Math.floor(Math.random() * (comments.length - 1));
            for (let comment of comments) {
                //移除了comment.content
                if (contains.includes(comment.nickname)) {
                    rpCount++;
                    continue;
                }

                DyCommon.log('是否作者？', comment.isAuthor, comment.nickname, videoData.nickname);
                if (comment.nickname === this.me.nickname || comment.isAuthor || videoData.nickname === comment.nickname) {
                    DyCommon.log('作者或者自己忽略');
                    continue;
                }

                rps = 0;//只要有一个不在列表，则清零
                contains.push(comment.nickname);
                //查看是否匹配  匹配关键词就回复
                comment = this.commentRuleCheck(this.taskConfig.commentRules, comment);
                DyCommon.log('检测评论规则是否通过:' + (comment ? 1 : 0));
                if (!comment) {
                    continue;
                }

                let opComment = {
                    id: videoData.id,
                    nickname: comment.nickname || '',
                    douyin: videoData.douyin || '',
                    keyword: comment.containWord || '',
                    no_keyword: comment.noContainWord || '',
                    // province_id: this.getIdByIp(comment.ip),
                    // in_time: comment.time,
                    desc: comment.content,
                };
                videoData.videoCommentId = this.addVideoComment(opComment);

                log('赞频率；', this.zanCommentFreCheck(this.taskConfig.comment_zan_fre));
                if (this.zanCommentFreCheck(this.taskConfig.comment_zan_fre)) {
                    DyCommon.log('赞评论了哦', comment.tag);
                    try {
                        DyComment.clickZan(comment);//////////////////////操作
                        statistics.zanComment();//赞评论数量加1
                    } catch (e) {
                        log(e);
                    }

                    let tmp = JSON.parse(JSON.stringify(videoData));
                    tmp.isZan = 1;
                    tmp.zanTime = Date.parse(new Date()) / 1000;
                    this.op('zanComment');
                    this.addVideoOp(tmp, 1);
                    this.zanCommentData.push(tmp.zanTime);//将私信的数据写上
                    preOpCount--;
                }

                if (this.viewUserPageFreCheck(100)) {
                    DyComment.intoUserPage(comment);
                    //log(comment);
                    DyCommon.log('进入用户主页-2');
                    let userData;
                    try {
                        userData = DyUser.getUserInfo();////////操作   进入用户主页
                    } catch (e) {
                        log(e, '继续');
                        if (e.toString().indexOf('找不到昵称') !== -1) {
                            DyCommon.back();
                            DyCommon.sleep(1000);
                            continue;
                        }
                    }

                    statistics.viewUser();//访问用户主页数量加1

                    this.updateVideoComment({
                        id: videoData.videoCommentId,
                        douyin: userData.douyin,
                    });
                    if (userData) {
                        let tmp = JSON.parse(JSON.stringify(videoData));
                        tmp.isViewUser = 1;
                        tmp.viewUserTime = Date.parse(new Date()) / 1000;
                        tmp.userData = userData;
                        tmp.userData.type = 1;
                        tmp.douyin = userData.douyin;
                        this.op('viewUserPage');
                        this.viewUserPageData.push(tmp.viewUserTime);
                        this.addVideoOp(tmp, 1);
                    }

                    if (Math.random() < 0.6 && (this.privateMsgFreCheck(this.taskConfig.private_fre) || this.focusFreCheck(this.taskConfig.focus_fre))) {
                        let isPrivateAccount = DyUser.isPrivate();
                        DyCommon.log('是否是私密账号：' + isPrivateAccount);
                        //DyCommon.log('用户规则：' + this.userRuleCheck(this.taskConfig.commentUserRules, userData));

                        if (!isPrivateAccount && this.userRuleCheck(this.taskConfig.commentUserRules, userData)) {
                            console.log('关注频率：', this.focusFreCheck(this.taskConfig.focus_fre));
                            if (this.focusFreCheck(this.taskConfig.focus_fre)) {
                                DyCommon.log('关注了哦');
                                DyUser.focus();///////////////////////////操作  关注用户
                                statistics.focus();//关注视频数量加1
                                preOpCount--;
                                let tmp = JSON.parse(JSON.stringify(videoData));
                                tmp.isFocus = 1;
                                tmp.focusTime = Date.parse(new Date()) / 1000;
                                this.op('focus');
                                this.addVideoOp(tmp, 1);
                                this.focusData.push(tmp.focusTime);//将关注的数据写上
                                DyCommon.sleep(1000 + 1000 * Math.random());
                            }

                            console.log('私信频率：', this.privateMsgFreCheck(this.taskConfig.private_fre));
                            if (!this.privateClose && this.privateMsgFreCheck(this.taskConfig.private_fre)) {
                                if (!this.douyinExist(userData.douyin)) {
                                    let msg = this.getMsg(1, userData.nickname, userData.age, userData.gender);
                                    DyCommon.log('私信了哦');
                                    if (msg) {
                                        let privateRes = DyUser.privateMsg(msg.msg);//////////////////////操作  私信用户
                                        if (privateRes === -1) {
                                            this.addDouyinConfig();
                                        }
                                        statistics.privateMsg();//私信数量加1
                                        preOpCount--;
                                        let tmp = JSON.parse(JSON.stringify(videoData));
                                        tmp.isPrivateMsg = 1;
                                        tmp.privateMsg = msg.msg;
                                        tmp.msgTime = Date.parse(new Date()) / 1000;
                                        this.op('privateMsg');
                                        this.addVideoOp(tmp, 1);
                                        this.privateMsgData.push(tmp.msgTime);//将私信的数据写上
                                    }
                                }
                            }
                        }
                    } else {
                        //看看有没有视频，有的话，操作评论一下，按照20%的频率即可
                        let isPrivateAccount = DyUser.isPrivate();
                        DyCommon.log('是否是私密账号：' + isPrivateAccount, userData.worksCount);
                        DyCommon.log('用户规则：' + this.userRuleCheck(this.taskConfig.commentUserRules, userData, userData));
                        if (userData.worksCount > 0 && Math.random() < 0.9 && !isPrivateAccount && this.userRuleCheck(this.taskConfig.commentUserRules, userData)) {
                            log('即将进入视频');
                            if (DyVideo.intoUserVideo()) {
                                //查看视频是否被操作过
                                log('进入用户视频');
                                //log(DyVideo.getNickname(), DyVideo.getContent());
                                let videoTitle = DyVideo.getContent();
                                if (this.videoExist(DyVideo.getNickname(), videoTitle)) {
                                    DyCommon.back();//从视频页面到用户页面
                                } else {
                                    //点赞
                                    //if (Math.random() < 0.8) {
                                    DyVideo.clickZan();
                                    statistics.zan();//视频点赞数+1
                                    // }

                                    //随机评论视频
                                    if (Math.random() < 0.7) {
                                        let msg = this.getMsg(0, videoTitle);
                                        if (msg) {
                                            DyVideo.openComment(!!DyVideo.getCommentCount());
                                            DyCommon.log('开启评论窗口');
                                            DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                                            DyCommon.log('评论了');
                                            statistics.comment();//评论视频数量加1
                                            //let commentUserVideoData = DyVideo.getInfo();
                                            //let tmp = JSON.parse(JSON.stringify(commentUserVideoData));
                                            //tmp.isComment = 1;
                                            //tmp.commentMsg = msg.msg;
                                            //tmp.commentMsgTime = Date.parse(new Date()) / 1000;
                                            this.op('comment');
                                            //this.addVideoOp(tmp, 0);
                                            DyCommon.back(2, 800);
                                            //this.commentData.push(tmp.commentMsgTime);//将评论的数据写上  这里的评论不计算频率
                                        } else {
                                            DyCommon.back();//从视频页面到用户页面
                                        }
                                    } else {
                                        DyCommon.back();//从视频页面到用户页面
                                    }
                                }
                            } else {
                                log('未进入视频');
                            }
                        }
                    }

                    DyCommon.back();//从用户页面返回到评论页面
                    DyCommon.log('从用户页面返回到评论页面');
                    DyCommon.sleep(1000 * Math.random() + 500);
                }

                log('准备评论了');
                if (Math.random() < 0.6 && this.commentFreCheck(this.taskConfig.comment_back_fre)) {
                    DyCommon.log('评论频率检测通过了');
                    let msg = this.getMsg(0, videoData.title);
                    if (msg) {
                        DyCommon.log('回复了评论');
                        DyComment.backMsg(comment, msg.msg);////////////////////////////操作
                        statistics.comment();//回复评论数量加1
                        preOpCount--;
                        let tmp = JSON.parse(JSON.stringify(videoData));
                        tmp.isComment = 1;
                        tmp.commentMsg = msg.msg;
                        tmp.commentMsgTime = Date.parse(new Date()) / 1000;
                        this.op('comment');
                        this.addVideoOp(tmp, 1);
                        this.commentData.push(tmp.commentMsgTime);//将私信的数据写上
                    }
                }

                if (preOpCount <= 0) {
                    break;
                }
            }

            if (rpCount === comments.length) {
                rps++;
            } else {
                opCount--;
            }

            if (rps >= 2 || opCount <= 0) {
                DyCommon.log(rps + ':' + opCount);
                //DyCommon.back();//评论页面返回到视频页面
                break;
            }

            DyCommon.log('滑动评论');
            DyComment.swipeTop();
            DyCommon.sleep(2000 + 1000 * Math.random());
        }

        DyCommon.log('返回了哦');
        DyCommon.sleep(300);
        DyCommon.back();
        //漏洞修复  如果此时还在评论页面，则再一次返回
        DyCommon.sleep(1000);
        if (DyCommon.id('title').textContains('评论').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOnce()) {
            DyCommon.back();
            DyCommon.log('再次返回');
        }

        DyCommon.sleep(500 + 500 * Math.random());
    },

    run(taskId, type) {
        this.taskId = taskId;
        //获取省份数据
        let provices = this.getProvinces();
        if (provices === false) {
            //console.hide();
            DyCommon.log('没有省份数据');
            return false;
        }

        let taskConfig = this.getTaskConfig();
        if (taskConfig === false) {
            //console.hide();
            DyCommon.log('没有任务配置数据');
            return false;
        }

        let config = this.getConfig();
        if (config === false) {
            //console.hide();
            DyCommon.log('没有配置数据');
            return false;
        }

        //获取当前的视频数据
        let taskVideoData = this.getTaskVideoData();
        if (taskVideoData === false) {
            //console.hide();
            DyCommon.log('没有任务视频数据');
            return false;
        }

        if (type === 1) {
            return this.runTaskVideo();
        }

        return this.runTask();//返回指定编码
    },

    runTask() {
        //////开始测试里面的基本功能
        //已经通过的测试放在2.check.js里面

        //进入主页，获取个人的账号信息 然后进入视频界面
        DyCommon.toast('进入了主页', 1000);
        let inMyPage = false;
        if (!this.me || !this.me.nickname) {
            DyIndex.intoMyPage();
            DyCommon.toast('进入个人主页，记录自己的账号和抖音号');
            this.me = {
                nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
                douyin: DyUser.getDouyin(),
            }
            inMyPage = true;
        }

        this.msgCount = DyIndex.getMsgCount();
        DyCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));

        //开始获取当前账号是否能私信
        this.getDouyinConfig();
        if (inMyPage) {
            DyIndex.intoHome();
        }

        console.hide();
        if (this.isCity) {
            DyIndex.intoLocal();
        }

        let timeIndex = 0;
        //开始刷视频
        while (true) {
            let code = this.taskCheck(this.taskConfig);
            DyCommon.log('获取的code：' + code);
            if (0 !== code) {
                return code;
            }

            if (!this.refreshVideoFreCheck(this.taskConfig.refresh_video_fre)) {
                return 106;//视频频率达到了  此时可以休息10分钟  直接关掉抖音即可
            }

            DyCommon.log('开始获取视频数据');
            let videoData = this.refreshVideo(this.taskConfig.videoRules, this.isCity);
            DyCommon.log('视频数据获取完成');
            if (videoData === 106) {
                return 106;
            }

            DyCommon.log('看看是不是广告');
            //看看是不是广告，是的话，不操作作者
            if (DyVideo.viewDetail()) {
                let clickRePlayTag = tCommon.id('fw2').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().left > 0;
                }).findOnce();
                if (clickRePlayTag) {
                    log('点击重播');
                    clickRePlayTag.click();
                    DyCommon.sleep(1000);
                }
                click(500 + Math.random() * 200, 500 + Math.random() * 300);

                DyCommon.sleep(500);
                DyCommon.log('广告，开始处理评论区了');
                this.commentDeal(videoData);
                DyCommon.log('开始下个视频');
                continue;
            } else {
                DyCommon.log('不是广告，准备进入主页');
            }

            this.targetVideoCount++;
            timeIndex++;
            if (timeIndex % 20 === 1) {
                timeIndex = 0;
                this.msgCount = DyIndex.getMsgCount();
            }
            //看看是否可以点赞了
            if (this.zanVideoFreCheck(this.taskConfig.video_zan_fre) && !DyVideo.isZan()) {
                DyCommon.log('点赞了');
                DyVideo.clickZan();///////////////////////////////////操作  视频点赞
                statistics.zan();//点赞视频数量加1
                let tmp = JSON.parse(JSON.stringify(videoData));
                tmp.isZan = 1;
                tmp.zanTime = Date.parse(new Date()) / 1000;
                this.zanVideoData.push(tmp.zanTime);//将私信的数据写上
                this.op('zanVideo');
                this.addVideoOp(tmp, 0);
            }

            //现在决定是否对视频作者作者进行操作
            //查看频率是否允许操作作者
            //log('关注和点赞检查', this.focusFreCheck(this.taskConfig.focus_author_fre), this.privateMsgFreCheck(this.taskConfig.private_author_fre))
            if (this.focusFreCheck(this.taskConfig.focus_author_fre) || this.privateMsgFreCheck(this.taskConfig.private_author_fre)) {
                DyCommon.sleep(1000);
                DyVideo.intoUserPage();
                let userData;
                try {
                    userData = DyUser.getUserInfo();///////////操作  进入用户主页
                } catch (e) {
                    //看看是不是进入了广告
                    log('用户数据异常', e);
                    DyCommon.sleep(2000);
                    if (text('反馈').desc('反馈').clickable(true).filter((v) => {
                        return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
                    }).exists()) {
                        log('存在“反馈”字眼');
                        DyCommon.back();
                        if (text('确定').filter((v) => {
                            return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
                        }).exists()) {
                            let a = text('确定').filter((v) => {
                                return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
                            });
                            a.click();
                            DyCommon.sleep(2000);
                        }
                        continue;
                    }
                }

                statistics.viewUser();//目标视频数量加1
                if (userData) {
                    let tmp = JSON.parse(JSON.stringify(videoData));
                    tmp.isViewUser = 1;
                    tmp.viewUserTime = Date.parse(new Date()) / 1000;
                    tmp.userData = userData;
                    tmp.userData.type = 0;
                    this.viewUserPageData.push(tmp.viewUserTime);
                    this.op('viewUserPage');
                    tmp.douyin = userData.douyin;
                    this.addVideoOp(tmp, 0);
                    DyCommon.log('看到了用户数据了哦');
                } else {
                    DyCommon.back();
                    DyCommon.log('异常，返回回去');
                    DyCommon.sleep(1000);
                    continue;
                }

                let isPrivateAccount = DyUser.isPrivate();
                if (!isPrivateAccount && this.focusFreCheck(this.taskConfig.focus_author_fre) && this.userRuleCheck(this.taskConfig.userRules, userData)) {
                    DyCommon.log('关注了哦');
                    DyUser.focus();///////////////////////////////////操作  关注视频作者
                    statistics.focus();//关注数量加1
                    let tmp = JSON.parse(JSON.stringify(videoData));
                    tmp.isFocus = 1;
                    tmp.focusTime = Date.parse(new Date()) / 1000;
                    this.focusData.push(tmp.focusTime);//将私信的数据写上
                    this.op('focus');
                    this.addVideoOp(tmp, 0);
                }

                if (!this.privateClose && !this.douyinExist(userData.douyin)) {
                    if (!isPrivateAccount && this.privateMsgFreCheck(this.taskConfig.private_author_fre) && this.userRuleCheck(this.taskConfig.userRules, userData)) {
                        let msg = this.getMsg(1, userData.nickname);
                        DyCommon.log('私信了哦');
                        if (msg) {
                            let privateRes = DyUser.privateMsg(msg.msg);///////////////////////////////////操作  私信视频作者
                            if (privateRes === -1) {
                                this.addDouyinConfig();
                            }

                            statistics.privateMsg();//私信数量加1

                            let tmp = JSON.parse(JSON.stringify(videoData));
                            tmp.isPrivateMsg = 1;
                            tmp.privateMsg = msg.msg;
                            tmp.msgTime = Date.parse(new Date()) / 1000;
                            this.privateMsgData.push(tmp.msgTime);//将私信的数据写上  私信
                            this.op('privateMsg');
                            this.addVideoOp(tmp, 0);
                        }
                    }
                }

                DyCommon.back();
                DyCommon.log('返回首页了哦');
                DyCommon.sleep(2000 * Math.random());
            }

            //看看是否可以操作评论区了
            DyCommon.sleep(1000);
            DyCommon.log('开始处理评论区了');
            this.commentDeal(videoData);
            DyCommon.log('开始下个视频');
        }
    },

    //只刷视频点赞和霸屏，不做其他操作
    noEmoji: false,//首次为false 无表情的时候，报错，有的话，立马赋值
    runTaskVideo() {
        //////开始测试里面的基本功能
        //已经通过的测试放在2.check.js里面

        //进入主页，获取个人的账号信息 然后进入视频界面
        DyCommon.toast('进入了主页', 1000);
        DyIndex.intoMyPage();
        DyCommon.toast('进入个人主页，记录自己的账号和抖音号');
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
        }
        this.msgCount = DyIndex.getMsgCount();
        DyCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));

        //开始获取当前账号是否能私信
        this.getDouyinConfig();
        DyIndex.intoHome();
        console.hide();
        if (this.isCity) {
            DyIndex.intoLocal();
        }

        let timeIndex = 0;
        //开始刷视频
        while (true) {
            let code = this.taskCheck(this.taskConfig);
            DyCommon.log('获取的code：' + code);
            if (0 !== code) {
                return code;
            }

            if (!this.refreshVideoFreCheck(this.taskConfig.refresh_video_fre)) {
                return 106;//视频频率达到了  此时可以休息10分钟  直接关掉抖音即可
            }

            DyCommon.log('开始获取视频数据');
            let videoData = this.refreshVideo(this.taskConfig.videoRules, this.isCity);
            DyCommon.log('视频数据获取完成');
            if (videoData === 106) {
                return 106;
            }

            this.targetVideoCount++;
            timeIndex++;
            if (timeIndex % 20 === 1) {
                timeIndex = 0;
                this.msgCount = DyIndex.getMsgCount();
            }
            //看看是否可以点赞了
            if (this.zanVideoFreCheck(this.taskConfig.video_zan_fre) && !DyVideo.isZan()) {
                DyCommon.log('点赞了');
                DyVideo.clickZan();///////////////////////////////////操作  视频点赞
                statistics.zan();//点赞视频数量加1
                let tmp = JSON.parse(JSON.stringify(videoData));
                tmp.isZan = 1;
                tmp.zanTime = Date.parse(new Date()) / 1000;
                this.zanVideoData.push(tmp.zanTime);//将私信的数据写上
                this.op('zanVideo');
                this.addVideoOp(tmp, 0);
            }

            //看看是否可以操作评论区了
            DyCommon.sleep(1000);
            DyCommon.log('开始处理评论区了');

            //开始评论
            if (this.commentFreCheck(this.taskConfig.comment_fre)) {
                DyCommon.log('评论频率检测通过');
                //随机评论视频
                DyVideo.openComment(!!videoData.commentCount);
                DyCommon.log('开启评论窗口-1');
                let res = DyComment.commentImage();///////////////////////////////////操作  评论视频
                if (this.noEmoji === false && res === false) {
                    return 107;
                }

                this.noEmoji = true;
                DyCommon.log('评论了');
                statistics.comment();//评论视频数量加1
                let tmp = JSON.parse(JSON.stringify(videoData));
                tmp.isComment = 1;
                tmp.commentMsg = '[表情图片]';
                tmp.commentMsgTime = Date.parse(new Date()) / 1000;
                this.op('comment');
                this.addVideoOp(tmp, 0);
                this.commentData.push(tmp.commentMsgTime);//将评论的数据写上
                DyCommon.sleep(2000 + 1000 * Math.random());
            }

            DyCommon.log('开始下个视频');
        }
    },

    // douyinExist() {
    //     let res = Http.post('dke', 'focusUserExist', { account: account });
    //     return res.succss;//存在
    // },

    getBlackFocusUsers() {
        let res = Http.post('dke', 'getBlackFocusUsers', {});
        return res.data;
    },

    cityFocus(data) {
        let res = Http.post('dke', 'cityFocus', data);
        return res.success;
    },

    cityAccountExist(douyin) {
        let res = Http.post('dke', 'cityAccountExist', { douyin: douyin });
        return res.success;//存在
    },

    getUserIndexData() {
        let res = Http.post('dke', 'getYesterdayAccount', {});
        return res.data;//存在
    },

    focusUserOp(blackUsers, getData, setData, userIndexData) {
        DyIndex.intoMyPage();
        DyCommon.sleep(3000);

        let res = DyUser.fucosUserOp(DyVideo, DyComment, blackUsers, (title) => this.getMsg(0, title), (douyin) => {
            return Http.post('dke', 'cityCancelFocus', { douyin: douyin })
        }, getData, setData, () => {
            return DyUser.gotoIndex(userIndexData.index, userIndexData.account);
        }, (userData) => {
            //用户数据
            let data = Http.post('dke', 'cityUserUpdate', userData);
            return data;
        }, {
            push: (v) => {
                let data = getData('opUsers') || [];
                data.push(v);
                log('opUsers:', data);
                setData('opUsers', data);
            },
            includes: (v) => {
                let data = getData('opUsers') || [];
                log('opUsers::', data);
                return data.includes(v);
            }
        });

        if (res === false) {
            DyCommon.back(1, 800);
            return true;//没有数据
        }

        DyCommon.back(1, 800);
        return true;//完成了
    },

    //sucArr 为数组，第一个元素表示 评论完成，第二个元素表示 同城采集完成  第三个元素是关注人数， 大于150则表示完成
    runCity(taskId, type, getData, setData) {
        let sucArr = getData('sucArr') || [];
        this.taskId = taskId;
        let taskConfig = this.getTaskConfig();
        if (taskConfig === false) {
            //console.hide();
            DyCommon.log('没有任务配置数据');
            return false;
        }

        let config = this.getConfig();
        if (config === false) {
            //console.hide();
            DyCommon.log('没有配置数据');
            return false;
        }

        //获取黑名单数据
        let blackUsers = this.getBlackFocusUsers();

        let userIndexData = this.getUserIndexData();
        log('userIndexData', userIndexData);
        if (sucArr[0] === 1) {
            log('重置index');
            userIndexData.index = 0;
        }

        DyCommon.toast('进入了主页', 1000);
        DyIndex.intoMyPage();
        DyCommon.toast('进入个人主页，记录自己的账号和抖音号');
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
            focusCount: DyUser.getFocusCount(),
        }

        DyCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));

        //开始获取当前账号是否能私信
        this.getDouyinConfig();
        DyIndex.intoHome();
        console.hide();
        DyIndex.intoLocal();

        //关注开始时间
        let focusStartTime = Date.parse(new Date()) / 1000;

        let hour;
        if (typeof (taskConfig.hour) === 'string') {
            hour = JSON.parse(taskConfig.hour);
        } else {
            hour = taskConfig.hour;
        }
        hour = hour.sort();

        if (sucArr[0] === 2 && sucArr[1] === 1) {
            log('都已完成');
            return true;
        }

        if (sucArr[0] !== 2) {
            let min = Math.ceil(hour.length * type / 3);//这里不限制结束时间，主要是防止任务没有执行完成
            let startTime = hour[min];
            log('时间比对', (new Date()).getHours(), startTime);
            //如果时间符合 即可操作，或者刷视频已经完成了，也可以操作
            if ((new Date()).getHours() >= startTime || sucArr[1]) {
                this.focusUserOp(blackUsers, getData, setData, userIndexData);
                if (getData('commentCount') < 300 && sucArr[0] <= 1) {
                    sucArr[0]++;
                    setData('sucArr', sucArr[0], 0);
                } else {
                    sucArr[0] = 2;
                    setData('sucArr', sucArr[0], 0);
                }

                //重新进入
                throw new Error('重新进入');
            }
        }

        if (sucArr[1]) {
            log('刷视频完成');
            return true;
        }

        //开始刷视频
        while (true) {
            //查看当前时间是不是到了打招呼时间，是的话，则抛出异常
            if (sucArr[0] !== 2) {
                let min = Math.ceil(hour.length * type / 3);
                let startTime = hour[min];
                //如果时间符合 即可操作，或者刷视频已经完成了，也可以操作
                if ((new Date()).getHours() >= startTime || sucArr[1]) {
                    this.focusUserOp(blackUsers, getData, setData, userIndexData);
                    if (getData('commentCount') < 300 && sucArr[0] <= 1) {
                        sucArr[0]++;
                        setData('sucArr', sucArr[0], 0);
                    } else {
                        sucArr[0] = 2;
                        setData('sucArr', sucArr[0], 0);
                    }
                    throw new Error('重新进入');
                }
            }

            if (sucArr[0] === 2 && sucArr[1] === 1) {
                log('任务完成了');
                return true;
            }

            let code = this.taskCheck(this.taskConfig);
            DyCommon.log('获取的code：' + code);
            if (0 !== code) {
                if ((new Date()).getHours() > hour[hour.length - 1]) {
                    sucArr[1] = 1;//超出了时间，设置为已完成
                    setData('sucArr', 1, 1);

                    sucArr[0] = 2;
                    setData('sucArr', 2, 0);
                    log('时间到了，导致的任务完成');
                }
                return code;
            }

            if (!this.refreshVideoFreCheck(this.taskConfig.refresh_video_fre)) {
                return 106;//视频频率达到了  此时可以休息10分钟  直接关掉抖音即可
            }

            DyCommon.log('开始获取视频数据');

            let isFocus = DyVideo.isFocus();
            log('是否已关注：', isFocus);
            if (isFocus) {
                setData('refreshVideoCount', (getData('refreshVideoCount') || 0) + 1);
                DyVideo.next();
                DyVideo.videoSlow();
                continue;
            }

            let videoData = this.refreshVideo(this.taskConfig.videoRules, this.isCity);
            setData('refreshVideoCount', (getData('refreshVideoCount') || 0) + 1);

            DyCommon.log('视频数据获取完成');
            if (videoData === 106) {
                return 106;
            }

            if (Math.random() < 0.15) {
                DyVideo.clickZan();
                DyCommon.sleep(2000 + 2000 * Math.random());
            }

            let stepSecond = this.me.focusCount;//间隔时间跟关注数成一定比例
            log('stepSecond', stepSecond);

            //当关注数量不足100的时候，5分钟关注一个人
            if (this.me.focusCount <= 100) {
                stepSecond = 300 * Math.random();//每天刷8小时
            } else if (this.me.focusCount <= 500) {
                stepSecond = 200 * Math.random();//每天刷8小时
            } else if (this.me.focusCount <= 2000) {
                stepSecond = 120 * Math.random();//每天刷8小时
            } else {
                stepSecond = 60 * Math.random();//每天刷3小时
            }

            let currentTime = Date.parse(new Date()) / 1000;
            //决定是否进入主页
            if (currentTime - focusStartTime <= stepSecond) {
                log('时间不满足，不进入主页', currentTime - focusStartTime, stepSecond);
                continue;//时间不满足要求，不进入主页
            }

            //进入博主主页
            DyVideo.intoUserPage();
            let userData;
            try {
                userData = DyUser.getUserInfo();///////////操作  进入用户主页
            } catch (e) {
                //看看是不是进入了广告
                log('用户数据异常', e);
                DyCommon.sleep(2000);
                if (text('反馈').desc('反馈').clickable(true).filter((v) => {
                    return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
                }).exists()) {
                    log('存在“反馈”字眼');
                    DyCommon.back();
                    if (text('确定').filter((v) => {
                        return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
                    }).exists()) {
                        let a = text('确定').filter((v) => {
                            return v && v.bounds() && v.bounds().top < device.height / 5 && v.bounds().left > device.width * 2 / 3;
                        });
                        a.click();
                        DyCommon.sleep(2000);
                    }
                    continue;
                }
            }

            if (!userData) {
                DyCommon.back();
                DyCommon.log('异常，返回回去');
                DyCommon.sleep(1000);
                continue;
            }

            let isPrivateAccount = DyUser.isPrivate();
            if (!/^[a-z-A-Z0-9-_]+$/.test(userData.douyin)) {
                DyCommon.back(1, 1200);
                DyCommon.log('账号不符合条件，开始下个视频', userData.douyin);
                continue;
            }

            if (!isPrivateAccount && !DyUser.isFocus() && this.userRuleCheck(this.taskConfig.userRules, userData)) {
                DyCommon.log('关注了哦');
                if (!this.cityAccountExist(userData.douyin)) {
                    focusStartTime = currentTime;
                    DyUser.focus();///////////////////////////////////操作  关注视频作者
                    // userData.distance = videoData.distance;
                    this.cityFocus(userData);
                    DyCommon.sleep(2000 + 2000 * Math.random());
                    sucArr[2]++;
                    log('sucArr[2]', sucArr[2]);
                    setData('sucArr', sucArr[2], 2);
                    if (sucArr[2] >= 150) {
                        sucArr[1] = 1;
                        setData('sucArr', 1, 1);
                        log('刷视频完成了');
                        return true;
                    }
                } else {
                    log('账号存在', userData.douyin);
                }
            }

            DyCommon.back(1, 1200);
            DyCommon.log('开始下个视频');
        }
    },

    updateMyData(getData) {
        DyIndex.intoMyPage();
        DyCommon.sleep(2000 + 2000 * Math.random());
        let focusCount = DyCommon.numDeal(DyCommon.id('vq7').filter((v) => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOnce().text());

        let res = Http.post('dke', 'cityMachineData', {
            'focus_count': focusCount || 0,
            'inc_focus_count': getData('sucArr', 2) || 0,
            'dec_focus_count': getData('decFocusCount') || 0,
            'comment_count': getData('commentCount', 2) || 0,
            'zan_comment_count': getData('zanCommentCount') || 0,
            'zan_count': getData('zanCount') || 0,
            'refresh_video_count': getData('refreshVideoCount') || 0,
            'account': DyUser.getDouyin(),
        });
        return res.success;
    }
}

module.exports = iDy;
