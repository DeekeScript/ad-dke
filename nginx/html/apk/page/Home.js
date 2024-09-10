let Config = require('../config/config');
importClass(android.util.DisplayMetrics);
let Home = {
    timer: undefined,
    dp: function (rate, inc) {
        let ht = device.height;
        let systemDM = new DisplayMetrics();
        //let wm = context.getSystemService(context.WINDOW_SERVICE);
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;

        //log('jq', systemDM.xdpi, systemDM.ydpi);

        ht = ht / (dpi / 160);//px变成了dp
        if (inc) {
            ht = ht - inc * rate;
        }
        return Math.round(ht / rate) + 'dp';
    },

    ldp: function (rate, inc) {
        let ht = device.width;
        let systemDM = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;
        ht = ht / (dpi / 160);//px变成了dp
        if (inc) {
            ht = ht - inc * rate;
        }
        return Math.round(ht / rate) + 'dp';
    },

    funcOpen: false,
    func(funcs, _this) {
        ui['marquee'] && ui['marquee'].requestFocus();
        if (this.funcOpen) {
            return true;
        }
        this.funcOpen = true;
        for (let i in _this.btns) {
            (function (i) {
                if (!ui[_this.btns[i]]) {
                    return false;
                }

                //粉丝截流 ，进入设置页面
                if (_this.btns[i] === 'task_dy_toker_fans') {
                    ui[_this.btns[i]].click(function (btn) {
                        _this.fansSetting();
                    });
                    return;
                } else if (_this.btns[i] === 'task_dy_search_user') {
                    ui[_this.btns[i]].click(function (btn) {
                        _this.searchUserSetting()
                    });
                    return;
                } else if (_this.btns[i] === 'task_dy_fans_inc') {
                    ui[_this.btns[i]].click(function (btn) {
                        _this.fansIncPage()
                    });
                    return;
                }

                ui[_this.btns[i]].click(function (btn) {
                    funcs[0][_this.btns[i]]();
                });
            })(i);
        }

        ui['task_dy_toker_tool'] && ui['task_dy_toker_tool'].click(() => {
            _this.tool();
        });
    },

    show(parent) {
        return ui.inflate(
            <frame id="current">
                {/* <text id="title" textColor="#ffffff" bg="#2E78FC" textStyle="bold" height={this.dp(40)} marginTop="0" paddingTop={this.dp(80)} paddingBottom={this.dp(80)} h="auto" gravity="center">{Config.name}</text>
                */}<frame>
                    <vertical>
                        {/* <vertical>
                            <horizontal height={"26dp"} marginTop="3dp">
                                <text w="*" id="marquee" padding="4dp" focusable="true" focusableInTouchMode="true" marqueeRepeatLimit="-1" ellipsize="marquee" textSize="12dp" singleLine="true" lineSpacingExtra="6dp" bg="#f3f3f3" text="本软件仅用于个人自动化学习及测试，请勿用于其他用途！          本软件仅用于个人自动化学习及测试，请勿用于其他用途！" />
                            </horizontal>
                        </vertical> */}
                        <ScrollView id="contain" height={this.dp(1.11)}>
                            <vertical h="auto" w="*">
                                <frame h={this.ldp(16 / 9)} w="*">
                                    <img scaleType="fitXY" id='banner-1' alpha="1" w="*" h={'*'} src={'file://img/home-top.png'} />
                                    <RelativeLayout w="*" h={'*'} marginLeft={"12dp"} marginTop={this.dp(7.5)}>
                                        <text id="task_dy_toker_test" text="" w={this.ldp(5)} h={this.dp(22.5)} />
                                    </RelativeLayout>
                                </frame>

                                <vertical bg="#f0f0f0" paddingTop="8dp" paddingLeft="12dp" marginTop={'-' + this.dp(15)} paddingRight="12dp">
                                    {/* <img h="24dp" w={this.ldp(1)} radius="10dp" scr="#f3f3f3" /> */}
                                    <horizontal layout_weight="1" h={this.ldp(2, 12)}>
                                        <vertical layout_weight="1" layout_gravity="left|top" h="*">
                                            <vertical h="*" id="task_dy_toker">
                                                <img w="*" h={'*'} src={'file://img/finger.png'} />
                                            </vertical>
                                        </vertical>

                                        <vertical layout_weight="1" layout_gravity="left|top" h="*" marginLeft="8dp">
                                            <vertical layout_weight="1" layout_gravity="top" w="*" h="*" id="task_dy_toker_city">
                                                <img w="*" h={'*'} src={'file://img/city.png'} />
                                            </vertical>

                                            <vertical layout_weight="1" layout_gravity="top" w="*" h="*" id="task_dy_toker_dominating_screen">
                                                <img w="*" h={'*'} src={'file://img/screen.png'} />
                                            </vertical>
                                        </vertical>
                                    </horizontal>

                                    <vertical h="auto" w="auto" padding="0 6dp">
                                        <horizontal marginLeft="4dp">
                                            <text marginLeft="0dp" textSize="16dp" textColor="#333333">常用服务</text>
                                        </horizontal>

                                        <horizontal height={this.dp(10.5)} marginTop="12dp">
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)}>
                                                <horizontal id="task_dy_toker_fans">
                                                    <img layout_weight={1} h={this.dp(22)} src={'file://img/fans.png'} />
                                                    <text layout_weight={3} layout_gravity="center">粉丝截流</text>
                                                </horizontal>
                                            </vertical>

                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)} marginLeft="8dp">
                                                <horizontal id="task_dy_toker_focus">
                                                    <img layout_weight={1} h={this.dp(22)} src={'file://img/anchor_focus.png'} />
                                                    <text layout_weight={3} layout_gravity="center">关注截流</text>
                                                </horizontal>
                                            </vertical>
                                        </horizontal>

                                        <horizontal height={this.dp(10.5)}>
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)}>
                                                <horizontal id="task_dy_toker_comment">
                                                    <img layout_weight={1} h={this.dp(22)} gravity="left" src={'file://img/speech-say.png'} />
                                                    <text layout_weight={3} layout_gravity="center" gravity="left">评论区截流</text>
                                                </horizontal>
                                            </vertical>

                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)} marginLeft="8dp">
                                                <horizontal id="task_dy_toker_live">
                                                    <img layout_weight={1} h={this.dp(22)} src={'file://img/live.png'} />
                                                    <text layout_weight={3} layout_gravity="center">直播间截流</text>
                                                </horizontal>
                                            </vertical>
                                        </horizontal>

                                        <horizontal height={this.dp(10.5)}>
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)}>
                                                <horizontal id="task_dy_fans_group">
                                                    <img layout_weight={1} h={this.dp(22)} src={'file://img/tuandui.png'} />
                                                    <text layout_weight={3} textColor="#FF3333" layout_gravity="center">粉丝群截流</text>
                                                </horizontal>
                                            </vertical>

                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)} marginLeft="8dp">
                                                <horizontal id="task_dy_search_inquiry">
                                                    <img layout_weight={1} h={this.dp(22)} src={'file://img/user-get.png'} />
                                                    <text layout_weight={3} textColor="#FF3333" layout_gravity="center">智能询盘</text>
                                                </horizontal>
                                            </vertical>
                                        </horizontal>

                                        <horizontal height={this.dp(10.5)}>
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)}>
                                                <horizontal id="task_dy_search_vertical">
                                                    <img layout_weight={1} h={this.dp(22)} src={"file://img/vertical.png"} />
                                                    <text layout_weight={3} textColor="#FF3333" layout_gravity="center">垂直养号</text>
                                                </horizontal>
                                            </vertical>

                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)} marginLeft="8dp">
                                                <horizontal id="task_dy_fans_inc">
                                                    <img layout_weight={1} h={this.dp(22)} src={'file://img/fans-inc.png'} />
                                                    <text layout_weight={3} textColor="#FF3333" layout_gravity="center">快速涨粉</text>
                                                </horizontal>
                                            </vertical>
                                        </horizontal>

                                        <horizontal height={this.dp(10.5)}>
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" width={this.ldp(2)}>
                                                <horizontal id="task_dy_toker_accurate_placement">
                                                    <img layout_weight={1} h={this.dp(22)} src={'file://img/hot.png'} />
                                                    <text layout_weight={3} textColor="#FF3333" layout_gravity="center">精准投放</text>
                                                </horizontal>
                                            </vertical>
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" w={this.ldp(2)} marginLeft="8dp">
                                                <horizontal id="task_dy_consum_user">
                                                    <img layout_weight={1} h={this.dp(22)} src={"file://img/precise-user.png"} />
                                                    <text layout_weight={3} textColor="#999999" layout_gravity="center">喜欢截流</text>
                                                </horizontal>
                                            </vertical>
                                        </horizontal>

                                        <horizontal height={this.dp(10.5)}>
                                            <vertical w={this.ldp(2)} bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1">
                                                <horizontal id="task_dy_search_user">
                                                    <img layout_weight={1} h={this.dp(22)} src={"file://img/rocket.png"} />
                                                    <text layout_weight={3} textColor="#FF3333" layout_gravity="center">精准行业</text>
                                                </horizontal>
                                            </vertical>
                                            <vertical w={this.ldp(2)} bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" marginLeft="8dp">
                                                <horizontal id="task_dy_live_barrage">
                                                    <img layout_weight={1} h={this.dp(22)} src={"file://img/barrage.png"} />
                                                    <text layout_weight={3} layout_gravity="center">直播间弹幕</text>
                                                </horizontal>
                                            </vertical>
                                        </horizontal>

                                        {/* <horizontal id="task_dy_live_zan" height={this.dp(10.5)}>
                                            <horizontal layout_weight={5} w={this.ldp(2)} bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)}>
                                                <img layout_weight={1} h={this.dp(22)} src={'file://img/live-zan.png'} />
                                                <text layout_weight={3} layout_gravity="center">直播循环点赞</text>
                                            </horizontal>
                                            <horizontal layout_weight={1} w={this.ldp(2)} bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)}>
                                                <vertical marginLeft={this.ldp(3)} bg="file://img/zan-1.png" w={this.dp(22)} h={this.dp(22)}></vertical>
                                            </horizontal>
                                        </horizontal> */}

                                        <horizontal w="*" marginTop={0} height={this.dp(10.5)}>
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" w={this.ldp(2)}>
                                                <horizontal id="task_dy_toker_test_2">
                                                    <img layout_weight={1} h={this.dp(22)} src={"file://img/show.png"} />
                                                    <text layout_weight={3} textColor="#999999" layout_gravity="center">功能演示</text>
                                                </horizontal>
                                            </vertical>
                                            <vertical bg="#ffffff" padding={"0 " + this.dp(50) + " 0 " + this.dp(50)} layout_weight="1" w={this.ldp(2)} marginLeft="8dp">
                                                <horizontal id="task_dy_toker_tool">
                                                    <img layout_weight={1} h={this.dp(22)} src={"file://img/tool.png"} />
                                                    <text layout_weight={6} layout_gravity="center">工具箱</text>
                                                </horizontal>
                                            </vertical>
                                        </horizontal>
                                    </vertical>
                                </vertical>
                            </vertical>
                        </ScrollView>
                    </vertical>
                </frame >
            </frame >
            , parent);
    }
}

module.exports = Home;
