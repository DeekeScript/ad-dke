// let groupTag = descContains('群成员按钮').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().left >= 0;
// }).findOnce();

// if (!groupTag) {
//     throw new Error('找不到“groupTag“');
// }
// log(groupTag);
// groupTag.click();
// Common.sleep(2300);
// log(groupTag);

// let searchTag = textContains('搜索群成员').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().width() > 0 && v.bounds().left > 0;
// }).findOnce();

// log(searchTag);


console.log(textMatches(/\d+/).find());