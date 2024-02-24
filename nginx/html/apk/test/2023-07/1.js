function c() {
    launch('com.tencent.mm');//打开抖音
    sleep(2000);
    let tags = descContains('微信').filter((v) => {
        return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
    }).find();

    log(tags);
}

// c();

function b() {
    let containersTag = className('android.widget.LinearLayout').filter((v) => {
        return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
    }).find();

    for (let i in containersTag) {
        if (isNaN(i)) {
            continue;
        }

        let tag = containersTag[i].children().findOne(this.id('efh'));
        if (tag && tag.text() === '已添加') {
            continue;
        }

        tag = containersTag[i].children().findOne(this.id('eff'));//昵称
        if (!tag) {
            continue;
        }

        let tmp = tag.text().split('@tel:');
        let mobile = tmp[1];

        //遇到可以操作的
        let parentTag = containersTag[i].children().findOne(this.id('efc'));
        if (!parentTag) {
            continue;
        }
        parentTag.click();
        this.sleep(2500);
    }
}

// b();
// log(id('com.tencent.mm:id/khj').text('发消息').findOnce());


function d(){
    let addTag = id('com.tencent.mm:id/khj').text('添加到通讯录').findOnce();
    if (!addTag) {
        throw new Error('找不到“添加到通讯录"');
    }

    addTag.parent().click();
}

d();
