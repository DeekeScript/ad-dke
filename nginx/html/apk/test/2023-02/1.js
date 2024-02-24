// importClass(android.provider.Settings);
// importClass(android.content.Intent);

// try {
//     getPermission();
//     //gotoAccessSetting('READ_PRIVILEGED_PHONE_STATE');
//     //console.log(device);
//     console.log(device.getIMEI());
//     console.log(device.getAndroidId());
// } catch (e) {
//     console.log(e);
// }

function getPermission() {
    runtime.requestPermissions([
        //'record_audio',
        'read_phone_state',
        //'read_privileged_phone_state',
    ]);
}

// function gotoAccessSetting(premission) {
//     try {
//         let intent = new Intent("android.settings." + premission);
//         intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//         context.startActivity(intent);
//         return true;
//     } catch (e) {
//         log(e);
//         return false;
//     }
// }
importClass(android.telephony.TelephonyManager);
importClass(java.util.UUID);
importClass(android.os.Build);

function getUUID() {
    return UUID.random();
}

let tm= context.getSystemService(context.TELEPHONY_SERVICE);
 
let number = tm.getLine1Number();
