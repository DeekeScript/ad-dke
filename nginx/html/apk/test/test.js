sleep(5000);
// console.log(textContains('米粒粒').find());

// console.log(textContains('米粒粒').parent());

// console.log(textContains('米粒粒').parent().parent());

let tags = id('opq').findOnce().children().find(textMatches(/[\s\S]+/)).filter((v) => {
    return v && !v.text().includes('我的信息') && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height - 300 && v.bounds().left === 0 && v.bounds().width() === device.width;
});

console.log(tags);
