//let mHttp = require('../unit/mHttp');
let storage = require('../common/storage.js');
let runCheck = {
    run() {
        //storage.setInit(false);
        if (!storage.getInit() || storage.getInit() * 1 !== 1) {
            threads.start(() => {
                this.insertSpeech();
                this.insertTask();
                storage.setInit(true);
            });
        }
    },

    insertSpeech() {
        let speechs = [
            '你很有知识哦！',
            '你的观察力很强!',
            '你真是个聪明的孩子！',
            '你越来越了不起了！',
            '你做的非常好！',
            '我看见了你正在努力！',
            '你很专业哦！',
            '你真可爱！',
            '你很有想法哦！',
            '你今天给了我很多的惊喜！',
            '你很有想象力哦！',
            '你的作品真棒！',
            '你太厉害了！',
            '你真的很能干哦！',
            '你的想法很有创意！',
            '您每天都这么精神！',
            '听君一席话，胜读十年书，今天听您讲解，我受益匪浅。',
            '在同龄人中，您的能力真是出类拔萃。',
            '凭您的能力，又年轻，太有发展潜力了。',
            '从您这儿，我算知道什么是聪明了，以后有机会教教我。',
            '你有时候是不是特孤独？世界上这么优秀的人就只有你一个。',
            '您真不简单，我很欣赏您，我很佩服您!',
            '您给人感觉很智慧。',
            '你最近进步很大，继续保持。',
            '您在这方面真是非常优秀的，您能不能教教我。',
            '您是一位有恒心有毅力的人，我很佩服您！',
            '风流倜傥，一表人才，人见人爱，花见花开。',
            '你很有气质。',
            '你总是说话得体。',
            '你的言语精炼，易懂而深远，是佳品。',
            '真佩服，满腹经纶！这果然是奥妙！',
            '你的思考深邃而独到，让我受益匪浅。',
            '你的发言让大家赞叹不已！',
            '首先我很赞赏和佩服您的远见卓识。',
            '好！好！好！尽在不言中。',
            '我不知道该怎样表达你留在我心中的最强最深的印象。',
            '拍的不错，花了心思了，角度把握的很好。',
            '比今天的你更好看的只有明天的你哦~',
            '厉害，想给你一个眼花缭乱的赞。',
            '优秀，你也太棒了吧，做的超级好。',
            '你拍的视频非常精致。',
            '干得漂亮！不愧是你，牛！',
            '你每天都是如此的魅力无穷。',
            '开始以为是青铜，没想到是个王者。',
            '你在我心里的位置连我自己都羡慕。',
            '等我一分钟去找个夸你的句子。',
            '很棒，你是第一，点个赞，鼓鼓掌。',
            '你真是人间人爱，花见花开，车见车爆胎。',
            '从你的言谈话语中看见了你的高贵，从你的举止面貌中看见了你的清秀。',
            '我一直以为人无完人，直到看见你。',
            '跟我走，不迷路。',
            '优秀善良努力的你，抖音有你的一片天地。',
            '过来看看你',
            'nick非常棒',
            '这个拍的真不错',
            '支持 上个热门',
            '非常不错 支持一个',
            '希望有更好的作品 非常厉害了',
            '加油 支持一个',
            '哇，又刷到你了',
            '可看到你更新作品了，不容易啊',
            '原来可以这样玩，学到了',
            '期待更优秀的你出现',
            '好巧啊！看看我的作品吧',
            '感谢缘分让我们相遇、共同学习',
            '果然评论区都是人才，我是来看评论的',
            '每天都有关注你更新作品，向你学习，我们一起加油吧',
            '报团取暖，直播时候我去捧场',
            '默默关注你回个呗',
            '很高兴认识你',
            '交个朋友吧！',
            '来我主页看看',
            '认识你是一种缘分',
            '给你的赞可能回迟到，但从不会缺席',
            '常来常往，我来看你了，记得来看我哦',
        ];

        for (let i in speechs) {
            let tmp = {
                title: speechs[i],
                typeName: ["私\n信", "评\n论"][1],
                index: 'init_comment_' + i,
            }
            storage.addSpeech(tmp);
        }

        speechs = [
            '有你世界更加美好。', '抖音正能量。', '你真的很棒！', '你很优秀！', '加油！你一定能成功的。', '你的作品真棒！', '你太厉害了！', '你的抖音做得挺好的！', '你视频拍得挺好的！', '你刚刚做短视频吗？', '你做短视频多久了？', '你是做啥行业的？', '发来贺电。', '给你点一个大大的赞。', '你可以的。',
        ];

        for (let i in speechs) {
            let tmp = {
                title: speechs[i],
                typeName: ["私\n信", "评\n论"][0],
                index: 'init_private_' + i,
            }
            storage.addSpeech(tmp);
        }
    },

    insertTask() {
        let tasks = ['一键营销任务', '同城营销任务'];
        let fields = {
            videoRule: {
                contain: '',
                no_contain: '',
                min_zan: 0,
                max_zan: 100000,
                min_comment: 0,
                max_comment: 1000,
                min_collect: 0,
                max_collect: 1000,
                min_share: 0,
                max_share: 1000,
            },
            talentRule: {
                min_age: 0,
                max_age: 120,
                gender: [1, 2, 3],
                contain: '',
                no_contain: '',
                min_zan: 0,
                max_zan: 100000,
                min_focus: 0,
                max_focus: 1000,
                min_fans: 0,
                max_fans: 1000,
                min_works: 1,
                max_works: 10000,
                ip: '',
                open_window: undefined,
                is_tuangou: undefined,
                is_person: undefined,
            },
            commentRule: {
                contain: '',
                no_contain: '',
                min_comment: 0,
                max_comment: 20,
                min_zan: 0,
                max_zan: 3,
                ip: '',
            },
            userRule: {
                min_age: 0,
                max_age: 120,
                gender: [1, 2, 3],
                min_zan: 0,
                max_zan: 100000,
                min_focus: 0,
                max_focus: 10000,
                min_fans: 0,
                max_fans: 10000,
                min_works: 1,
                max_works: 1000,
                ip: '',
                open_window: undefined,
                is_tuangou: undefined,
                is_person: undefined,
            },
            taskRule: {
                is_city: undefined,
                video_fre: 3,
                comment_video_fre: 3,
                comment_back_fre: 3,
                zan_video_fre: 4,
                zan_comment_fre: 4,
                private_msg_fre: 3,
                private_msg_author_fre: 3,
                focus_fre: 3,
                focus_author_fre: 3,
                time: [false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
            },
        };

        let kws = ['', ''];
        for (let i in tasks) {
            if (!tasks[i]) {
                return toast('任务名称为空');
            }

            let d = new Date();
            let month = d.getMonth() + 1;
            let date = d.getDate();
            let h = d.getHours();
            let m = d.getMinutes();
            let s = i;

            let data = {
                title: tasks[i],
                index: d.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date) + ' ' + (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s),
            }
            storage.addTask(data);
            fields.taskIndex = data.index;
            fields.videoRule.contain = kws[i];
            fields.taskRule.is_city = i % 2;
            storage.updateTaskDetail(fields, true);
        }
    }
}

module.exports = runCheck;
