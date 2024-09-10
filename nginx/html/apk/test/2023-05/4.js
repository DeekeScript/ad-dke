
let am = context.getSystemService(context.ACTIVITY_SERVICE);
am.killBackgroundProcesses('com.ss.android.ugc.aweme');


if (android.os.Build.VERSION.RELEASE < 14) {
    let am = context.getSystemService(context.ACTIVITY_SERVICE);
    am.killBackgroundProcesses('com.ss.android.ugc.aweme');

    let task = am.getRunningTasks(100);
    for (let i in task) {
        log(task[i].topActivity.getPackageName());
    }
}

