let storage = require("../common/storage");

let baiduWenxin = {
    getToken(key, secret) {
        key = key || storage.get('baidu_key');
        secret = secret || storage.get('baidu_secret');
        let url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret;
        let res = http.get(url);
        let result = res.body.json();
        return result;
    },

    getComment(title) {
        if (title.length > 50) {
            title = title.substring(0, 50) + '..';
        }

        let res = storage.get('baidu_access_token');
        if (res) {
            res = JSON.parse(res);
        }

        let access_token;
        if (res && res['expire_in'] < Date.parse(new Date()) / 1000) {
            access_token = res['access_token'];
        } else {
            res = this.getToken();
            res['expires_in'] = Date.parse(new Date()) / 1000 + res['expires_in'] - 60;
            access_token = res['access_token'];
            storage.set('baidu_access_token', JSON.stringify(res));
        }

        let len = 15 + Math.round(15 * Math.random());
        let params = {
            "messages": [
                {
                    "role": "user",
                    "content": title ? '别人抖音视频的标题是“' + title + '”，请你给这个视频写一条长度小于' + len + '字的吸引人的评论内容' : '请你写一条长度小于' + len + '字的吸引人的评论内容去评论别人的视频'
                }
            ]
        }

        res = http.postJson('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + access_token, params);
        let result = res.body.json();
        log('百度文心返回话术-1', title ? '别人抖音视频的标题是“' + title + '”，请你给这个视频写一条长度小于' + len + '字的吸引人的评论内容' : '请你写一条长度小于' + len + '字的吸引人的评论视频内容去评论别人的视频', result);
        if (result && result['result']) {
            if (result['result'].substring(0, 1) === '"' && result['result'].substring(result['result'].length - 1) === '"') {
                result['result'] = result['result'].substring(1, result['result'].length - 1);
            }
        }
        return result['result'] || false;
    },

    getChat(nickname, age, gender) {
        let res = storage.get('baidu_access_token');
        if (res) {
            res = JSON.parse(res);
        }

        let access_token;
        if (res && res['expire_in'] < Date.parse(new Date()) / 1000) {
            access_token = res['access_token'];
        } else {
            res = this.getToken();
            res['expires_in'] = Date.parse(new Date()) / 1000 + res['expires_in'] - 60;
            access_token = res['access_token'];
            storage.set('baidu_access_token', JSON.stringify(res));
        }

        let len = 15 + Math.round(10 * Math.random());
        let content = '对方的昵称是：' + nickname;
        if (age) {
            content += '，年龄是：' + age + '岁';
        }

        if (gender) {
            content += '，性别是：' + ['男性', '女性'][gender - 1];
        }

        let params = {
            "messages": [
                {
                    "role": "user",
                    "content": content + '，请帮我生成一条长度小于' + len + '字的吸引人的打招呼话术'
                }
            ]
        }
        res = http.postJson('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + access_token, params);
        let result = res.body.json();
        log('百度文心返回话术', content + '，请帮我生成一条长度小于' + len + '字的吸引人的打招呼话术和他打招呼', result);
        if (result && result['result']) {
            if (result['result'].substring(0, 1) === '"' && result['result'].substring(result['result'].length - 1) === '"') {
                result['result'] = result['result'].substring(1, result['result'].length - 1);
            }
        }
        return result['result'] || false;
    }
}

module.exports = baiduWenxin;
