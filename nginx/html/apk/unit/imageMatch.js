/**
 * 
 * @param {*} img1 
 * @param {*} img2 
 * @returns 
 * 注意，这个函数实际上是检查小图片是不是在大图片内  本项目用于检查两个同规格的图片是不是相等
 */
let imageMatch = function(dir,imgs,img2){
    try{
        let img1;
        let result;
        let level = 0;
        let max_similarity = 0;
        for(let i in imgs){
            try{
                img1 = images.read(dir+imgs[i]);
                if(img1.width>=img2.width && img1.height>=img2.height){
                    result = images.matchTemplate(img1, img2,{
                        threshold:0.988
                    });
                }else{
                    result = images.matchTemplate(img2, img1,{
                        threshold:0.988
                    });
                }
                if(result && result.matches && result.matches[0] && result.matches[0].similarity){
                    let tmp = imgs[i].split('.');
                    if(result.matches[0].similarity>max_similarity){
                        level = tmp[0];
                        max_similarity = result.matches[0].similarity;
                    }
                }
            }catch(e){
                //不做处理
            }
        }
        return level;
    }catch(e){
        //不做处理
    }
    return 0;
}

module.exports = imageMatch;//比较两个图片是否相同，是的话则返回true，否则返回false
