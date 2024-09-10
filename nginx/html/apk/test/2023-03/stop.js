function stopApp() {
    if (app.openAppSetting('com.ss.android.ugc.aweme')) {
        this.sleep(2000);
        let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
        if (!stopTag) {
            return false;
        }
        let p = stopTag.bounds();
        click(p.centerX(), p.centerY());
        this.sleep(1000);
        p = text('确定').findOne(3000) || text('强行停止').findOne(3000);
        if (p) {
            p = p.bounds();
            while (!click(p.centerX(), p.centerY()));
        }

        this.sleep(5000);
        this.back();
        this.sleep(500);
        return true;
    }
    return false;
}


console.log(stopApp());
