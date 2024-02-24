let hours = [1, 2, 3, 5, 4];
hours = hours.sort((a, b) => {
    return a - b;
});

// console.log(hours);


// console.log(id('bh5').findOne(2000));

// function sw() {
//     let left = Math.random() * device.width * 0.8 + device.width * 0.2;
//     let bottom = device.height * 2 / 3 + device.height / 6 * Math.random();
//     let top = device.height / 2 - device.height / 12 * Math.random();
//     swipe(left, bottom, left, top, 150 + 100 * Math.random());//从下往上推，清除
// }

// sw();

const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },
}

function a() {
    let focusTag = Common.id('ola').text('关注').findOne(2000);
    if (focusTag) {
        Common.click(focusTag);
        return true;
    }

    let hasFocusTag = Common.id('olb').text('已关注').findOne(2000);
    if (hasFocusTag) {
        return true;
    }
    throw new Error('找不到关注和已关注');
}

// a();

let a = text('关注').id('ola').findOne(2000);

click(a.bounds().centerX(), a.bounds().centerY());
