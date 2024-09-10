/**
 * 悬浮窗
 */
importClass(android.graphics.Color);
let mFloaty = {
    win: false,
    state: 0,//0待执行，1执行中，2异常
    index: 0,
    open() {
        floaty.closeAll();//关闭所有悬浮窗
        this.win = floaty.rawWindow(
            <frame gravity="center">
                {/* <text id="text" bg="#FFFF00" w="20dp" h="20dp"></text> */}
                <img id="text" w="20dp" h="20dp" src="file://img/test.png" />
            </frame>
        );
        this.win.setTouchable(false);
        return this;
    },

    show() {
        ui.post(() => {
            this.win && this.win.text.attr('visibility', 'visible');
        });
    },

    hiden() {
        ui.post(() => {
            this.win && this.win.text.attr('visibility', 'gone');
        });
    },

    close() {
        if (!this.win) {
            return true;
        }
        this.win.close();
        this.win = false;
        return true;
    },

    setState(state) {
        //log('state', state);
        this.state = state;
        if (this.state !== 1) {
            this.hiden();
            return false;
        }

        this.index++;
        if (this.index >= 3600) {
            this.index = 0;
        }

        if (this.index % 2 === 0) {
            this.hiden();
        } else {
            this.show();
        }
    },

    setText(text) {
        let _this = this;
        ui.run(function () {
            _this.win.text.setText(text);
        });
    },

    setPositions(x, y) {
        if (!this.win) {
            return false;
        }
        return this.win.setPosition(x, y);
    }
};

module.exports = mFloaty;
