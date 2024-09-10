let statistic = require('../common/statistics');
importClass(android.graphics.Color);
importClass(android.view.View);
importClass(android.view.MotionEvent);
importClass(android.graphics.PorterDuff);

let Statistics = {
    height: device.height * 0.45,
    dp: function (rate) {
        let ht = device.height;
        let systemDM = new DisplayMetrics();
        //let wm = context.getSystemService(context.WINDOW_SERVICE);
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;

        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht / rate) + 'dp';
    },

    ldp: function (rate) {
        let ht = device.width;
        let systemDM = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;
        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht / rate) + 'dp';
    },

    rate() {
        let systemDM = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;
        return (dpi / 160);
    },

    funcOpen: false,
    func(funcs, page) {
        if (this.funcOpen) {
            //return true;//画布不允许这样操作
        }

        page.close = false;
        this.draw(ui.a, page);
        let _this = this;
        ui.a.setOnTouchListener(new View.OnTouchListener({
            onTouch: (v, m) => {
                if (m.action === MotionEvent.ACTION_MOVE) {
                    _this.x = m.getX();
                } else {
                    setTimeout(() => {
                        _this.x = undefined;
                    }, 2000);
                }
                //重画
                //drawView.invalidate();
                return true;
            }
        }));

        this.funcOpen = true;
        //数据渲染
        let todayData = statistic.getData();
        log(todayData);

        for (let i in todayData) {
            ui[i + '_text'].setText(todayData[i].toString());
        }

        let ids = ['s_viewVideo', 's_viewTargetVideo', 's_zan', 's_comment', 's_zanComment', 's_privateMsg', 's_focus', 's_viewUser'];
        for (let i in ids) {
            let _this = this;
            (function (i) {
                ui[ids[i]].click(() => {
                    for (let j in ids) {
                        ui[ids[j]].attr('alpha', '1');

                    }
                    ui[ids[i]].attr('alpha', '0.8');
                    _this.showData = _this.data[ids[i]];
                });
            })(i);
        }

        ui['back'] && ui['back'].click((v) => {
            page.setting();
        });
    },

    data: [],
    showData: [],
    x: undefined,
    draw(cv, page) {
        this.data = statistic.getWeekData();
        let paint = new Paint();
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(4);
        paint.setAntiAlias(true);
        paint['setColor(int)'](colors.parseColor("#333333"));
        this.showData = this.data['s_viewVideo'];

        try {
            cv.on("draw", (canvas) => {
                if (page.close) {
                    return true;
                }
                let left = 120;
                canvas.drawRGB(255, 255, 255);
                canvas.drawLine(left, 24, left, this.height, paint);
                canvas.drawLine(left, this.height, device.width - 120, this.height, paint);
                this.drawData(canvas, paint, device.width - 2 * left - 64, this.height - 64, this.showData, left);
            });
        } catch (e) {
            log(e);
        }
    },

    drawData(canvas, paint, width, height, data, left) {
        try {
            let t = 12;
            let max = 0;
            for (let i in data) {
                if (data[i][1] > max) {
                    max = data[i][1];
                }
            }

            if (max === 0) {
                max = 1000;
            }

            //横坐标
            let step = Math.ceil((width - 36) / (data.length - 1));
            paint.setTextSize(12 * this.rate()); // 设置文字大小 px
            for (let i = 0; i < data.length; i++) {
                canvas.drawLine(left + step * i, this.height - t, left + step * i, this.height, paint);
                canvas.drawText(data[i][0], left + step * i - step / 2 + t, this.height + 36, paint)
            }

            //纵坐标
            yStep = Math.ceil(height / data.length);
            canvas.drawText(0, left - 100, this.height, paint);
            for (let i = 1; i <= data.length; i++) {
                canvas.drawLine(left, this.height - yStep * i, left + t, this.height - yStep * i, paint);
                canvas.drawText(Math.ceil(yStep / (yStep * data.length / max)) * i, left - 100, this.height - yStep * i + t, paint)
            }

            let maxStep = Math.ceil(yStep / (yStep * data.length / max)) * data.length;

            //打点
            let xy = [];
            paint.setStyle(Paint.Style.FILL);
            let ___paint = new Paint();
            for (let i = 0; i < data.length; i++) {
                ___paint['setColor(int)'](colors.parseColor('#2E78FC'));
                ___paint.setStyle(Paint.Style.STROKE);
                ___paint.setStrokeWidth(4);
                ___paint.setAntiAlias(true);
                ___paint.setStyle(Paint.Style.FILL);
                ___paint.setTextSize(14 * this.rate()); // 设置文字大小 px

                let num = data[i][1] / maxStep * yStep * data.length;
                xy.push([left + i * step, this.height - num]);
                canvas.drawCircle(left + i * step, this.height - num, 12, ___paint);

                if (num === 0) {
                    canvas.drawText(data[i][1], left + i * step + 24, this.height - num + t - 32, ___paint);
                } else {
                    canvas.drawText(data[i][1], left + i * step + 24, this.height - num + t, ___paint);
                }
                ___paint.setXfermode(null);
            }

            //坐标系箭头
            canvas.drawLine(device.width - left, this.height, device.width - left - t, this.height - t, paint);
            canvas.drawLine(device.width - left, this.height, device.width - left - t, this.height + t, paint);

            canvas.drawLine(left, 2 * t, left + t, 3 * t, paint);
            canvas.drawLine(left, 2 * t, left - t, 3 * t, paint);

            //连线
            let __paint = new Paint();
            for (let i = 0; i < xy.length - 1; i++) {
                __paint['setColor(int)'](colors.parseColor('#2E78FC'));
                __paint.setStyle(Paint.Style.STROKE);
                __paint.setStrokeWidth(4);
                __paint.setAntiAlias(true);
                canvas.drawLine(xy[i][0], xy[i][1], xy[i + 1][0], xy[i + 1][1], __paint);
                __paint.setXfermode(null);
            }

            let _paint = new Paint();
            if (this.x && this.x > left && this.x < width + left) {
                _paint.setStyle(Paint.Style.STROKE);
                _paint.setStrokeWidth(4);
                _paint.setAntiAlias(true);
                _paint['setColor(int)'](colors.parseColor("#eeeeee"));
                canvas.drawLine(this.x, height + 64, this.x, 64, _paint);
                _paint.setXfermode(null);
            }

            //图表名称
            canvas.drawText('近7天数据统计', left + 2 * step + 24, this.height + t + 90, paint);
            paint.setXfermode(null);
        } catch (e) {
            log(e);
        }
    },

    show(parent) {
        return ui.inflate(
            <frame id="current">
                <frame textColor="#ffffff" height={this.dp(6)} marginTop="0" h="auto">
                    <img src="file://img/task-bg.png" w="*" scaleType="fitXY" />
                    <RelativeLayout w="*">
                        <frame h="auto" w="*" paddingTop={this.dp(40)}>
                            <img id="back" gravity="center" layout_gravity="center|left" w={"15dp"} h={"15dp"} marginLeft="12dp" src={"file://img/back.png"} />
                            <text id="title" textSize="16dp" gravity="center" textColor="#333333" textStyle="bold" layout_gravity="center|center">数据统计</text>
                        </frame>
                    </RelativeLayout>
                </frame>
                <RelativeLayout w="*" h="*" marginLeft="6dp" marginRight="6dp" marginTop={this.dp(15)}>
                    <vertical id="containInner" w="*" height={this.dp(1.22)}>
                        <card w="*" h="*" cardCornerRadius="12dp" margin="6dp" cardElevation="6dp">
                            <vertical>
                                <horizontal margin="6dp">
                                    <card id="s_viewVideo" alpha="0.8" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical w="*" padding="4dp 6dp 4dp 6dp">
                                            <text w="*" gravity="center" textSize="16dp">今日累积视频</text>
                                            <text id="s_viewVideo_text" gravity="center" textSize="16dp" textStyle="bold">0</text>
                                        </vertical>
                                    </card>
                                    <card id="s_viewTargetVideo" alpha="1" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical padding="4dp 6dp 4dp 6dp">
                                            <text gravity="center" textSize="16dp">今日目标视频</text>
                                            <text id="s_viewTargetVideo_text" gravity="center" textStyle="bold" textSize="16dp">0</text>
                                        </vertical>
                                    </card>
                                </horizontal>
                                <horizontal margin="6dp 0 6dp 6dp">
                                    <card id="s_zan" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical w="*" padding="4dp 6dp 4dp 6dp">
                                            <text w="*" gravity="center" textSize="16dp">今日点赞</text>
                                            <text gravity="center" id="s_zan_text" textSize="16dp" textStyle="bold">0</text>
                                        </vertical>
                                    </card>
                                    <card id="s_comment" alpha="1" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical padding="4dp 6dp 4dp 6dp">
                                            <text gravity="center" textSize="16dp">今日评论</text>
                                            <text id="s_comment_text" gravity="center" textStyle="bold" textSize="16dp">0</text>
                                        </vertical>
                                    </card>
                                    <card id="s_zanComment" alpha="1" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical padding="4dp 6dp 4dp 6dp">
                                            <text gravity="center" textSize="16dp">今日点赞评论</text>
                                            <text id="s_zanComment_text" gravity="center" textStyle="bold" textSize="16dp">0</text>
                                        </vertical>
                                    </card>
                                </horizontal>
                                <horizontal margin="6dp 0 6dp 6dp">
                                    <card id="s_privateMsg" alpha="1" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical padding="4dp 6dp 4dp 6dp">
                                            <text gravity="center" textSize="16dp">今日私信</text>
                                            <text id="s_privateMsg_text" gravity="center" textStyle="bold" textSize="16dp">0</text>
                                        </vertical>
                                    </card>
                                    <card id="s_focus" alpha="1" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical padding="4dp 6dp 4dp 6dp">
                                            <text gravity="center" textSize="16dp">今日关注</text>
                                            <text id="s_focus_text" gravity="center" textStyle="bold" textSize="16dp">0</text>
                                        </vertical>
                                    </card>
                                    <card id="s_viewUser" alpha="1" layout_weight="1" cardCornerRadius="4dp" margin="2dp" cardElevation="2dp">
                                        <vertical padding="4dp 6dp 4dp 6dp">
                                            <text gravity="center" textSize="16dp">今日访问用户</text>
                                            <text id="s_viewUser_text" gravity="center" textStyle="bold" textSize="16dp">0</text>
                                        </vertical>
                                    </card>
                                </horizontal>

                                <vertical>
                                    <canvas id="a" w="*" h="auto" />
                                </vertical>
                            </vertical>
                        </card>
                    </vertical>
                </RelativeLayout>
            </frame>
            , parent);
    }
}

module.exports = Statistics;
