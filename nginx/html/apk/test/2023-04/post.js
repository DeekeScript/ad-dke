function p(controller, action, params) {
    let res = http.post('https://kcd.yizetech.com.cn/' + controller + '/' + action, params);
    let result = [];
    let type = 1;
    try {
        if (type === 1) {
            result = res.body.string();
            console.log('服务器返回：', result);
        } else {
            result = res.body.json();
        }
    } catch (e) {
        console.log(e);
    }
}

let timestamp = Date.parse(new Date()) / 1000;
let data = {
    'mobile': 2132,
    'password': 2343,
    'machine_id': 3,
};

let params = {
    timestamp: timestamp,
    machine_id: 3,
    mobile: 99999,
    secret: 342343,
    data: data ? JSON.stringify(data) : '[]'
};

p('dke', 'login', params);
