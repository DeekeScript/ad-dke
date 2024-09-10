
//搜索用户列表
function swipeSearchUserOp() {
    if (!this.swipeSearchUserOpTarge) {
        this.swipeSearchUserOpTarge = id("com.ss.android.ugc.aweme:id/kf-").scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == device.width && v.bounds().top >= 0;
        }).findOnce();
    }
    log(this.swipeSearchUserOpTarge);
    this.swipeSearchUserOpTarge.scrollForward()
}

// swipeSearchUserOp();


//粉丝列表
function swipeFansListOp() {
    if (!this.swipeFansListOpTarge) {
        this.swipeFansListOpTarge = id("com.ss.android.ugc.aweme:id/p1-").scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == device.width && v.bounds().top >= 0;
        }).findOnce();
    }
    //log(this.swipeFansListOpTarge);
    this.swipeFansListOpTarge.scrollForward();
}

swipeFansListOp();


// let a = id("com.ss.android.ugc.aweme:id/p1-").scrollable(true).find();
// for (let i in a) {
//     if (isNaN(i)) {
//         continue;
//     }

//     log(a[i], a[i].scrollForward());
// }
