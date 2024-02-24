let imageSimilar = require('../research/imageSimilar.js');
let dHashImageSimilar = require('../research/dHashImageSimilar.js');

//let dir = '/sdcard/dke/plays/';
//return (name.indexOf('和平精英') != -1 || name.indexOf('英雄联盟') != -1 || name.indexOf('金铲铲之战') != -1) && name.indexOf('log') == -1 && name.indexOf('txt') == -1;

function localImageSimilar(base, dir, filesFunc) {
    files.ensureDir(dir);
    let allFiles = files.listDir(dir, function (name) {
        return filesFunc(name);
    });

    if (allFiles.length == 0) {
        return false;
        //throw new Error('没有对比标本，请设置标本');
    }

    function compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    //颜色比对逻辑    目前还是存在一定的误差，效果不是很好
    function color(base) {
        images.save(images.scale(base, 0.1, 0.1), dir + 'base.jpg');
        base = dir + 'base.jpg';

        let similars = [];
        for (let j in allFiles) {
            let res;
            if (!files.exists(dir + allFiles[j] + '.log')) {
                images.save(images.scale(images.read(dir + allFiles[j]), 0.1, 0.1), dir + 'img.jpg');
                res = imageSimilar(base, dir + 'img.jpg', 0);
                if (res.imgData) {
                    files.write(dir + allFiles[j] + '.log', res.imgData.join(','));
                }
            } else {
                res = imageSimilar(base, files.read(dir + allFiles[j] + '.log').split(','), 1);
            }
            base = res.baseData;
            similars.push([res.data, dir + allFiles[j]]);
        }
        return similars.sort(compare(0));
    }

    function dHash(base) {
        let similars = [];
        for (let j in allFiles) {
            let res;
            if (!files.exists(dir + allFiles[j] + '.txt')) {
                res = dHashImageSimilar(base, images.read(dir + allFiles[j]));
                if (res.imgData) {
                    files.write(dir + allFiles[j] + '.txt', res.imgData);
                }
            } else {
                res = dHashImageSimilar(base, files.read(dir + allFiles[j] + '.txt'));
            }
            base = res.baseData;
            similars.push([res.data, dir + allFiles[j]]);
        }
        return similars.sort(compare(0));
    }

    return { colorCompare: color(base), dHash: dHash(base) };
}

module.exports = localImageSimilar;
