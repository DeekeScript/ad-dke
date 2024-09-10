
const Common = {
    //封装的方法
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },

    aId(name) {
        //android:id/text1
        return id('android:id/' + name);
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
}
// console.log(id('user_avatar').find());
// console.log(id('vhr').findOne(2000));

// console.log(textContains('广告').find());

// console.log(descContains('广告').find());


function viewDetail() {
    //let name = 'k+t';//Common.id(name).find()
    let tags = Common.getTags(text('查看详情').descContains('查看详情').find());
    for (let i in tags) {
        if (!tags[i] || !tags[i].bounds) {
            continue;
        }
        if (tags[i].bounds().top < 200) {
            continue;
        }
        if (tags[i].bounds().top > device.height) {
            continue;
        }
        return tags[i];
    }
    return false;
}

console.log(viewDetail());
