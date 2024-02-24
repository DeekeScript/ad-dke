
let storage = storages.create("data");

let params = {
    mid: 'b3dd8c0b4dde5b45',
    token: storage.get('token'),
    data: JSON.stringify({ lib_id: '[3]', type: 0 }),
};
//{'contentType': "application/json"}


// launch(app.getPackageName('抖音'));
// sleep(3000);

// let res = http.post('https://dke.dkeapp.cn/dke/taskList', params);
// result = res.body.json();
// log(result);



let res = http.post('https://dke.dkeapp.cn/dke/getMsg', params);
result = res.body.json();
log(result);
