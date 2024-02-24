//console.log(this.getData('taskConfig'));

// console.log({
//     videoData: this.getData('videoData'),
//     zanVideoData: this.getData('zanVideoData'),
//     zanCommentData: this.getData('zanCommentData'),
//     commentData: this.getData('commentData'),
//     privateMsgData: this.getData('privateMsgData'),
//     viewUserPageData: this.getData('viewUserPageData'),
//     focusData: this.getData('focusData'),
// });

//console.log(this.getMsg(0));

// console.log(this.douyinExist('douyin'));

// console.log(this.videoExist('nickname', 'title'));

// console.log(this.postVideoData({
//     nickname: '用户昵称',
//     title: '标题',
//     zanCount: 23,
//     commentCount: 33,
//     collectCount: 44,
//     shareCount: 55,
//     containWord: '呵呵',
//     noContainWord: '嘿嘿',
//     watchSecond: 60,
// }, 0));

// console.log(this.addVideoOp({
//     id: 1,
//     videoCommentId: 5,
//     isZan: 1,
//     zanTime: Date.parse(new Date()) / 1000,
//     isPrivateMsg: 1,
//     privateMsg: '私信',
//     isComment: 1,
//     commentMsg: '评论',
//     commentMsgTime: Date.parse(new Date()) / 1000,
//     msgTime: Date.parse(new Date()) / 1000,
//     isFocus: 1,
//     focusTime: Date.parse(new Date()) / 1000,
// }, 1));

// console.log(this.addVideoComment({
//     id: 12,
//     nickname: 'nickname',
//     douyin: 'douyin',
//     keyword: 'keyword',
//     noKeyword: 'no_keyword',
//     provinceId: 1,
//     inTime: Date.parse(new Date()) / 1000,
//     desc: 'desc',
// }), 0);

// console.log(this.addVideoDouyin({
//     id: 12,
//     nickname: 'nickname',
//     douyin: 'douyin',
//     zanCount: 12,
//     focusCount: 10,
//     fansCount: 43,
//     type: 0,
// }, 0));



// function generateTimestamp() {
//     let hours = [17, 19, 20, 21];
//     let timestamps = [];
//     for (let hour of hours) {
//         let times = 3600;
//         if (hour > (new Date()).getHours()) {
//             break;
//         }
//         for (let i = 1; i < times; i++) {
//             if (i % 100 <= 50) {
//                 timestamps.push(Date.parse(new Date()) / 1000 - ((new Date()).getHours() - hour) * 3600 + i);
//             }
//             if (timestamps[timestamps.length - 1] > (new Date()).getTime() / 1000 + 5) {
//                 break;
//             }
//         }
//     }
//     return timestamps;
// }

// this.taskConfig.hour = [17, 19, 20, 21];
// let a = generateTimestamp();
// // for (let i in a) {
// //     let d = new Date(a[i] * 1000);
// //     if (d.getHours() >= 8) {
// //         console.log(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
// //     }
// // }
// console.log(a.length, (new Date(a[0] * 1000)).getHours());
// console.log(this.freCheck(a));



//关注和私信一样 6个档 [0, 2, 3, 4, 5, 6]  每小时
// console.log(this.taskConfig.focus_fre, this.focusData);
// this.taskConfig.hour = [17, 18, 19, 20, 21];
// this.taskConfig.focus_fre = 5;
// let msgCount = 60;
// this.focusData.push(Date.parse(new Date()) / 1000 - 180);
// for (let i = 0; i < msgCount; i += 10) {
//     this.focusData.push(Date.parse(new Date()) / 1000 - msgCount + i);
// }

// console.log(this.focusFreCheck(this.taskConfig.focus_fre));





 //关注和私信一样 7个档 [0, 1, 2, 3, 4, 5, 6, 7]  每小时
//  this.taskConfig.hour = [17, 19, 20, 21];
//  this.videoData.push(Date.parse(new Date()) / 1000 - 1800);
//  let msgCount = 180;
//  for (let i = 0; i < msgCount; i += 1) {
//      this.videoData.push(Date.parse(new Date()) / 1000 - msgCount + i);
//  }

//  this.taskConfig.video_zan_fre = 7;
//  msgCount = 42;
//  this.zanVideoData.push(Date.parse(new Date()) / 1000 - 900);
//  for (let i = 0; i < msgCount; i += 1) {
//      this.zanVideoData.push(Date.parse(new Date()) / 1000 - msgCount + i);
//  }

//  console.log(this.zanVideoFreCheck(this.taskConfig.video_zan_fre));





//关注和私信一样 7个档 [0, 1, 2, 3, 4, 5, 6, 7]  每小时
// this.taskConfig.hour = [17, 19, 21, 22, 23];
// this.taskConfig.comment_zan_fre = 7;
// msgCount = 80;
// this.zanCommentData.push(Date.parse(new Date()) / 1000 - 1800);
// for (let i = 0; i < msgCount; i += 1) {
//     this.zanCommentData.push(Date.parse(new Date()) / 1000 - msgCount + i);
// }

// console.log(this.zanCommentFreCheck(this.taskConfig.comment_zan_fre));



//评论评论检查 6档 [0, 5, 10, 15, 20, 25]  每小时
// this.taskConfig.hour = [17, 19, 21, 22, 23];
// this.taskConfig.comment_fre = 4;
// msgCount = 32;
// this.commentData.push(Date.parse(new Date()) / 1000 - 7200);
// for (let i = 0; i < msgCount; i += 1) {
//     this.commentData.push(Date.parse(new Date()) / 1000 - msgCount + i);
// }

// console.log(this.commentFreCheck(this.taskConfig.comment_fre));




// this.videoCount = 23;
// this.msgCount = 23;
// this.targetVideoCount = 23;
// console.log(this.taskCheck(this.taskConfig));




//评论评论检查 6档 [0, 5, 10, 15, 20, 25]  每小时
// this.taskConfig.hour = [17, 19, 21, 22, 23];
// this.taskConfig.refresh_video_fre = 300;
// msgCount = 68;
// this.videoData.push(Date.parse(new Date()) / 1000 - 1800);
// for (let i = 0; i < msgCount; i += 1) {
//     this.videoData.push(Date.parse(new Date()) / 1000 - msgCount + i);
// }

// console.log(this.refreshVideoFreCheck(this.taskConfig.refresh_video_fre));


 //私信个数检查 6个档 [0, 2, 3, 4, 5, 6]
//  this.taskConfig.hour = [17, 19, 21, 22, 23];
//  this.taskConfig.private_fre = 5;
//  msgCount = 6;
//  this.privateMsgData.push(Date.parse(new Date()) / 1000 - 3600);
//  for (let i = 0; i < msgCount; i += 1) {
//      this.privateMsgData.push(Date.parse(new Date()) / 1000 - msgCount + i);
//  }

//  console.log(this.privateMsgFreCheck(this.taskConfig.private_fre));


// this.taskConfig.hour = [17, 19, 21, 22, 23];
// this.taskConfig.video_fre = 2;
// msgCount = 12;
// this.viewUserPageData.push(Date.parse(new Date()) / 1000 - 3600);
// for (let i = 0; i < msgCount; i += 1) {
//     this.viewUserPageData.push(Date.parse(new Date()) / 1000 - msgCount + i);
// }

// console.log(this.viewUserPageFreCheck((this.taskConfig.video_fre + 1) * 8));




// let userData = {
//     nickname: '纯汉字',
//     douyin: 'douyin',
//     age: 19,
//     introduce: '电视电商个体户',
//     zanCount: 1230,
//     focusCount: 182,
//     fansCount: 89,
//     worksCount: 11,
//     openWindow: 1,//开启橱窗
//     tuangouTalent: 1,
//     ip: '北京',
//     isCompany: 0,//是否是机构 公司
//     gender: 1,
// }

// console.log(this.userRuleCheck(this.taskConfig.userRules, userData) ? true : false);
// console.log(this.taskConfig.userRules);




// let commentData = {
//     nickname: '多少钱sdfl342📖',
//     content: '多少钱哦',
//     time: Date.parse(new Date()) / 1000,
//     ip: '北京',
//     zanCount: 2,
//     //isZan: this.isZan(),
//     //isAuthor: this.isAuthor(),
// }

// console.log(this.commentRuleCheck(this.taskConfig.commentRules, commentData) ? true : false);
// console.log(this.taskConfig.commentRules);



// let videoData = {
//     nickname: 'nickname',
//     title: '视频内容标题哦，嘿嘿事业',
//     zanCount: 13,
//     commentCount: 23,
//     collectCount: 33,
//     shareCount: 45,
// }

// console.log(this.videoRulesCheck(this.taskConfig.videoRules, videoData) ? true : false);
// console.log(this.taskConfig.videoRules);


//console.log(this.refreshVideo(this.taskConfig.videoRules));
