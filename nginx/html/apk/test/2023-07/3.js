

let Common = {
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },
    aId(name) {
        //android:id/text1
        return id('android:id/' + name);
    },
}

/**
  curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "user", "content": "Say this is a test!"}],
     "temperature": 0.7
   }'
 */
function get(content) {
    let params = {
        url: 'https://api.openai.com/v1/chat/completions',
        key: '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',
    }

    let body = {
        "model": "code-search-babbage-text-001",
        "messages": [{ "role": "user", "content": content }],
        "temperature": 0.7
    };

    log(JSON.stringify(body));
    let re = http.request(params.url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.key,
        },
        method: 'POST',
        body: JSON.stringify(body),
    });

    console.log(re.body.string());
}

// get('你是谁？');

// console.log(Common.id('ghw').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0;
// }).findOnce() ? '未关注' : '已关注');


// console.log(Common.id('gia').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().left < device.width && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0;
// }).findOnce() ? '未关注' : '已关注');



// log(Common.id('vq7').filter((v) => {
//     return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height;
// }).findOnce().text());

// log((new Date()).getHours());

function as() {
    let k = 10;
    let arr = [];
    while (k--) {
        let containers = Common.id('root_layout').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height - 300;
        }).find();

        if (containers.length === 0) {
            errorCount++;
            log('containers为0');
        }

        arr.push(JSON.stringify(containers));
        if (arr.length > 2) {
            arr.shift();
        }

        if (arr[0] === arr[1]) {
            break;
        }
    }
}

// as();

function check() {
    // let tag = Common.id('uia').findOnce();
    // click(tag.bounds().centerX(), tag.bounds().centerY());
    // sleep(3000);

    let tag = Common.id('uh+').textContains('最早关注').findOnce();
    return tag ? true : false;
}

// check();

// log(check());

// let contain = Common.id('lc-').filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().height() > 0 && v.bounds().width() > 0;
// }).findOnce();

// log(contain);

let tag = Common.id('title').filter((v) => {
    return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < device.height && v.bounds().height() > 0 && v.bounds().width() > 0;
}).findOnce();

log(tag);
