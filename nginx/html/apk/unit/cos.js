let Common = require('../app/dy/Common');
let mHttp = require('./mHttp');
importClass(java.io.File);

let cos = {
    lock: false,
    timestamp: 0,
    listFileSortByModifyTime(dir) {
        let _files = files.listDir(dir, function (name) {
            return true;
        });

        let res = [];
        for (let i = _files.length - 1; i >= 0; i--) {
            let file = new File('/sdcard/dke/log/' + _files[0]);
            res.push([file.lastModified(), dir + _files[i]]);
        }

        res.sort((m, n) => {
            return m[0] - n[0];
        });

        let s = [];
        for (let i in res) {
            s.push(res[i][1]);
            if (s.length >= 5) {
                break;
            }
        }

        return s;
    },

    uploadLog() {
        if (this.lock) {
            toast('请不要重复点击');
            return false;
        }

        if (this.timestamp + 600 > Date.parse(new Date()) / 1000) {
            ui.post(() => {
                alert('十分钟内只能上传一次');
            });
            return false;
        }

        this.lock = true;
        try {
            let _files = this.listFileSortByModifyTime('/sdcard/dke/log/');
            if (_files.length === 0) {
                this.lock = false;
                return Common.toast('暂无日志');
            }
            console.log(_files);
            let res = mHttp.postFile('dke', 'uploadLog', { files: _files, string: 'string' }, {
                type: 2,
                ext: 'txt',
            });
            log('日志上传结果：', res);
            if (res.code === 0) {
                this.timestamp = Date.parse(new Date()) / 1000;
                ui.post(() => {
                    alert('成功');
                });
            } else {
                ui.post(() => {
                    alert(res.msg);
                });
            }
        } catch (e) {
            ui.post(() => {
                alert(e);
            });
        }
        this.lock = false;
    }
}

module.exports = cos;
