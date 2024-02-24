let funcs = {};
//关闭除了main.js和index.js以及floaty.js应用，其他都关闭你
let closeOtherFuncs = function () {
    let tmp;
    let i = 0;
    for (let eng of engines.all()) {
        tmp = eng.getSource().toString().split('/');
        console.log(tmp[tmp.length - 1]);
        if (tmp[tmp.length - 1] == 'main.js' || tmp[tmp.length - 1] == 'floaty.js' || tmp[tmp.length - 1] == 'index.js') {
            continue;
        }
        i++;
        eng.forceStop();
    }
    return i;
};

///////////////特别说明，每个function里面都是执行外部的文件//////////////////
//第一个功能

let items = [
    ['task_dy_toker', '一键营销'],
    ['task_dy_toker_city', '同城营销'],
    ['task_dy_toker_city_incubate', '同城孵化'],
    ['task_dy_toker_test', '拓客演示'],
    ['task_dy_toker_test_2', '拓客演示-2'],
    ['task_dy_cancel_zan', '取消点赞'],
    ['task_dy_cancel_focus', '取消关注'],
    ['task_dy_cancel_fans', '清理粉丝'],
    ['task_dy_toker_live', '直播间截流'],
    ['task_dy_toker_comment', '评论区截流'],
    ['task_dy_toker_fans', '粉丝截流'],
    ['task_dy_toker_focus', '关注截流'],
    ['task_dy_toker_dominating_screen', '超级霸屏'],
    ['task_dy_toker_accurate_placement', '精准投放'],
    ['task_dy_fans_back_view', '粉丝回访'],
    ['task_dy_comment_back', '智能回复'],
    ['task_dy_tool_score', '智能打分[娱乐版]'],
    ['task_dy_tool_score_live', '智能打分[直播版]'],
    ['task_dy_live_zan', '直播点赞'],
    ['task_dy_live_barrage', '直播评论'],
    ['task_dy_search_vertical', '垂直养号'],
    ['task_dy_search_inquiry', '智能询盘'],
    ['task_dy_fans_group', '粉丝群截流'],
    ['task_dy_search_user', '精准行业'],
    ['task_dy_fans_inc', '快速涨粉'],
    ['task_dy_consum_user', '喜欢引流'],
    ['task_dy_grab_phone', '商家电话采集'],
    ['task_dy_grab', '微信群控'],
];

for (let item of items) {
    funcs[item[0]] = (function () {
        let newItem = item[0];
        return function () {
            threads.shutDownAll();//停止所有线程
            closeOtherFuncs();
            if (newItem === 'task_dy_toker_test_2') {
                newItem = 'task_dy_toker_test';
            }
            engines.execScriptFile('tasks/' + newItem + '.js');
        };
    })(item[0])
}

//暂停所有脚本
funcs.closeAll = function () {
    try {
        threads.shutDownAll();
        floaty.closeAll();
        let i = closeOtherFuncs();
        toast('成功');
    } catch (e) {
        log(e);
    }

    //java.lang.System.exit(0);//解决线程无法关闭的问题

    // var nowPid = android.os.Process.myPid();
    // var am = context.getSystemService(java.lang.Class.forName("android.app.ActivityManager"));
    // var list = am.getRunningAppProcesses();
    // for (var i = 0; i < list.size(); i++) {
    //     var info = list.get(i);
    //     if (info.pid != nowPid) {
    //         kill(info.pid);
    //     }
    // }
    // kill(nowPid);
    // function kill(pid) {
    //     android.os.Process.killProcess(pid);
    // }
};

let m = [funcs, items];
module.exports = m;
