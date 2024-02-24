let wechatWorkMsg = {
    url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send',
    key: '',
    setKey: (key) => {
        wechatWorkMsg.key = key;
    },
    sendMsg: (content, type) => {
        let params = {
            "msgtype": "text",
            "text": {
                "content": content,
            }
        }

        if (type === undefined) {
            params['text']['mentioned_mobile_list'] = ["13545356522", "@all"];
        }

        let res = http.postJson(wechatWorkMsg.url + '?key=' + wechatWorkMsg.key, params);
        console.log('机器人消息通知结果：', res.body.json());
    },

    sendImageText: (title, content, picurl) => {
        let params = {
            "msgtype": "news",
            "news": {
                "articles": [
                    {
                        "title": title,
                        "description": content,
                        "url": picurl,
                        "picurl": picurl
                    }
                ]
            }
        };
        let res = http.postJson(wechatWorkMsg.url + '?key=' + wechatWorkMsg.key, params);
        console.log('机器人消息通知结果：', res.body.json());
    },

    sendImage: (imageBase64, imageMd5) => {
        let params = {
            "msgtype": "image",
            "image": {
                "base64": imageBase64,
                "md5": imageMd5
            }
        }
        let res = http.postJson(wechatWorkMsg.url + '?key=' + wechatWorkMsg.key, params);
        console.log('机器人消息通知结果：', res.body.json());
    }
};

module.exports = wechatWorkMsg;
