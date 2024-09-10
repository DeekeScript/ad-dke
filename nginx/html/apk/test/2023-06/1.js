// log(app.versionCode);
importClass(java.lang.Class);

let Common = {
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    getTags(tags) {
        let tgs = [];
        for (let i in tags) {
            if (isNaN(i) || typeof (tags[i]).toString() == 'function') {
                continue;
            }
            tgs.push(tags[i]);
        }
        return tgs;
    },

    sleep(time) {
        sleep(time);
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

        this.sleep(500);
        return true;
    },
}

// function viewDetail() {
//     //let name = 'k+t';//Common.id(name).find()
//     let tags = text('查看详情').descContains('查看详情').filter((v) => {
//         return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
//     }).findOnce();

//     if (tags) {
//         return true;
//     }

//     tags = Common.id('fwy').text('查看详情').filter((v) => {
//         return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
//     }).findOnce();
//     return tags || false;
// }

// log(viewDetail());

// log(device.model);

function closeBar() {
    let service = context.getSystemService("statusbar");
    if (null == service)
        return;
    try {
        let clazz = Class.forName("android.app.StatusBarManager");
        let sdkVersion = android.os.Build.VERSION.SDK_INT;
        let collapse = null;
        if (sdkVersion <= 16) {
            collapse = clazz.getMethod("collapse");
        } else {
            collapse = clazz.getMethod("collapsePanels");
        }
        
        collapse.getAccessFlags();
        collapse.invoke(service);
    } catch (e) {
        e.printStackTrace();
    }
}

// closeBar();

function intoLocal() {
    log('进入同城');
    let tjs = Common.getTags(Common.id('u5n').find());
    if (!tjs || tjs.length === 0) {
        throw new Error('找不到同城');
    }

    let tj = undefined;
    for (let i in tjs) {
        if (['探索', '关注', '商城', '推荐', '购物', '社区', '经验', '读书日'].includes(tjs[i].text())) {
            continue;
        }
        tj = tjs[i];
    }

    if (!tj) {
        throw new Error('找不到同城-2');
    }

    let top = tj.bounds().top + tj.bounds().height() / 2 * (Math.random() + 1 / 3);
    let right = tj.bounds().left + tj.bounds().width();
    swipe(right + 200, top, right + 500, top, 300);
    Common.sleep(1000);
    Common.click(Common.id('u5n').textContains(tj.text()).findOnce());
    Common.sleep(3500);
}

intoLocal();
