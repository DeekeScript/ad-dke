let mFloaty = require('core/floaty.js');
let storage = require('common/storage.js');
importClass(java.lang.Class);

let core = {
    floaty: undefined,
    state: 0,
    run() {
        let _this = this;
        events.on("notice", function (msg) {
            if (storage.getTag() === undefined) {
                storage.removeToken();
            }

            if (storage.getToken()) {
                if (!_this.floaty) {
                    _this.floaty = mFloaty.open();
                }
            } else {
                _this.floaty && _this.floaty.close();
                _this.floaty = undefined;
            }

            if (_this.floaty) {
                _this.state = { '待执行': 0, '执行中': 1, '异常': 2 }[msg];
                _this.floaty.setState(_this.state);
                _this.floaty.setPositions(0, device.height / 3);
            }
        });

        //保持脚本运行
        let base = 27;
        let k = base;
        setInterval(() => {
            //相当于一两分钟执行一次点击  这就要求手机亮屏时间设置为5分钟以上
            if (--k <= 0) {
                k = base;
                if (_this.state === 1) {
                    device.wakeUp();
                } else {
                    click(device.width - 48, 1);
                }
            }
            _this.closeBar();
            //console.log('悬浮窗···');
        }, 10000);
    },
    closeBar() {
        let service = context.getSystemService("statusbar");
        if (null == service)
            return;
        try {
            let clazz = Class.forName("android.app.StatusBarManager");
            let sdkVersion = android.os.Build.VERSION.SDK_INT;
            let collapse = null;
            if (sdkVersion <= 16) {
                collapse = clazz.getMethod("collapse");
            } else {
                collapse = clazz.getMethod("collapsePanels");
            }
            collapse.setAccessible(true);
            collapse.invoke(service);
        } catch (e) {
            e.printStackTrace();
        }
    }
}

try {
    core.run();
} catch (e) {
    console.log('悬浮窗挂掉');
}
