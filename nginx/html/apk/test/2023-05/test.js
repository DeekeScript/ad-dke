log('开始执行用户列表');
// engines.stopAll();
sleep(5000);
let textTag = id('android:id/text1').filter((v) => {
    return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < device.height;
}).text('用户').findOnce();
log(textTag);
let rpCount = 0;
let arr = [];


let tags = className('android.widget.FrameLayout').focusable(true).filter((v) => {
    return v && v.bounds() && v.bounds().left === 0 && v.bounds().top > textTag.bounds().top + textTag.bounds().height() + 30 && v.bounds().top + v.bounds().height() < device.height && !!v.children() && !!v.children().findOne(textContains('粉丝'));
}).find();
log('tags', tags.length);

arr.push(JSON.stringify(tags));
if (arr.length >= 3) {
    arr.shift();
}

for (let i in tags) {
    try {
        if (isNaN(i)) {
            continue;
        }

        let child = tags[i].children().findOne(textContains('粉丝'));

        if (!child || !child.text() || !child.bounds() || child.bounds().left < 0 || child.bounds().width() < 0 || child.bounds().top < 0 || child.bounds().height() < 0) {
            continue;
        }

        if (i > 0 && tags[i].bounds().height() === tags[0].bounds().height()) {
            continue;
        }

        let text = child.text().split(/[,|，]/);
        let account = text[2].replace('抖音号：', '').replace('按钮', '');

        log('account', account);
        click(child.bounds().centerX(), child.bounds().centerY());
        break;
    } catch (e) {
        log(e);
    }
}
