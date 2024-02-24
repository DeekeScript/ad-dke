
let key = 'NZmgn5urWoHhKWe8XbGMdbUp';
let secret = 'brIq133KaAPNEkn109avxl7MXUHHWkg0';


function getToken(key, secret) {
    let url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret;
    let res = http.get(url);
    let result = res.body.json();
    return result['access_token'];
}

function chat(access_token) {
    let params = {
        "messages": [
            {
                "role": "user",
                "content": '抖音视频的标题是“想创业的人，这2个风口项目不要错过#创业 #赚钱 #生意 #干货 #项目 #副业 #赢家小宇说”，请你给这个视频写一条长度小于30字的积极正能量的评论内容'
            }
        ]
    }
    res = http.postJson('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + access_token, params);
    let result = res.body.json();
    return result;
}


let token = getToken(key, secret);
console.log(token);
let cht = chat(token);
console.log(cht);
