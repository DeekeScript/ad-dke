// let a = id('desc').filter((v) => {
//     return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
// }).findOnce();

// log(a);

// log(currentActivity());

// auto.setStable(0);
// log(auto.getStable());

const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    click(tag, rate) {
        //this.log('click', tag, tag.bounds().height(), tag.bounds().width());
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * rate + Math.random() * (tag.bounds().width() * p);
        let height = tag.bounds().height() * rate + Math.random() * (tag.bounds().height() * p);

        try {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } catch (e) {
            this.log(e);
            try {
                click(tag.bounds().left + width, tag.bounds().top);
            } catch (e) {
                this.log(e);
                return false;
            }
        }

        sleep(500);
        return true;
    },
}

// let containers = Common.id('container').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
// }).find();

// Common.click(containers[0], 0.2);

let workTag = id('android:id/text1').descContains('作品').filter((v) => {
    return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < device.height - v.bounds().height();
}).findOnce();
if (workTag && !workTag.parent().selected()) {
    Common.click(workTag);
    log('点击workTag');
    Common.sleep(2000);

    // press(workTag.bounds().centerX(), workTag.bounds().centerY(), 50);
    // //press(workTag.bounds().centerX(), workTag.bounds().centerY(), 50);
    // Common.sleep(3000);
}
