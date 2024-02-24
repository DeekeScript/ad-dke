
//log(id('android:id/text1').textContains('喜欢').findOne(2000));

//log(id('container').find());

function _id(name) {
    return id('com.ss.android.ugc.aweme:id/' + name);
}

function intoLikeVideo() {
    //首先知道喜欢的菜单
    let sw = 3;
    let likeTag;
    while (sw-- > 0) {
        likeTag = id('android:id/text1').textContains('喜欢').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOne(2000);
        if (likeTag) {
            break;
        }
        let left = device.width * 0.2 + Math.random() * device.width * 0.8;
        swipe(left, device.height * 2 / 3, left, device.height / 3, 300);
    }

    if (!likeTag) {
        return false;
    }

    log(likeTag);
    click(likeTag.bounds().centerX(), likeTag.bounds().centerY());
    sleep(3000);

    sw = 3;
    let containerTag;
    while (sw-- > 0) {
        containerTag = this._id('container').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOne(2000);

        if (containerTag) {
            break;
        }
        let left = device.width * 0.2 + Math.random() * device.width * 0.8;
        swipe(left, device.height * 2 / 3, left, device.height / 3, 300);
    }

    if (!containerTag) {
        return false;
    }

    log(containerTag);
    click(containerTag.bounds().centerX(), containerTag.bounds().centerY());
    sleep(3000);
}

intoLikeVideo();
