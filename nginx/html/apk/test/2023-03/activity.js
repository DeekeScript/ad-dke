console.log(currentActivity(), currentPackage());


// app.startActivity("mainActivity");


// launchApp("嘀客");
// log(app.getPackageName('嘀客'));


// app.intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

// app.startActivity({
//     action: "android.intent.action.MAIN",
//     packageName: "com.dke",
//     className: "com.stardust.autojs.execution.ScriptExecuteActivity",
// });

// var i = app.intent({
//     packageName: "com.dke",
//     className: "com.dke.com.stardust.autojs.execution.ScriptExecuteActivity",
//     flags: [Intent.FLAG_ACTIVITY_SINGLE_TOP]
// });
// context.startActivity(i);


let k = 5;
while (k--) {
    log(k);
    sleep(10000);
    device.wakeUp();
    //sleep(2000);
    //keyCode(26);
}
