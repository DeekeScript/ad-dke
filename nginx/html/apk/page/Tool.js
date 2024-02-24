let storage = require("../common/storage");

//let Config = require('../config/config');
let Tool = {
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

    funcOpen: false,
    func(funcs, _this) {
        if (this.funcOpen) {
            return true;
        }
        this.funcOpen = true;
        for (let i in page.btns) {
            (function (i) {
                if (!ui[_this.btns[i]]) {
                    return false;
                }

                ui[_this.btns[i]].click(function (btn) {
                    funcs[0][_this.btns[i]]();
                });
            })(i);
        }

        ui['back'].click((v) => {
            _this.home();
        });
    },

    show(parent) {
        let mobile = storage.getMobile();
        let visible = false;
        if (mobile.indexOf('177777777') === 0) {
            visible = true;
        }

        return ui.inflate(
            <frame id="current" bg={'#ffffff'}>
                <frame textColor="#ffffff" bg="#ffffff" height={this.dp(40)} marginTop="0" paddingTop={this.dp(80)} paddingBottom={this.dp(80)} h="auto">
                    <img id="back" gravity="center" layout_gravity="center|left" w={"15dp"} h={"15dp"} marginLeft="12dp" src={"file://img/back.png"} />
                    <text id="title" textColor="#666666" textStyle="bold" gravity="center">工具箱</text>
                </frame>

                <frame bg={"#ffffff"} marginTop={this.dp(18)}>
                    <vertical h="auto" w="*">
                        <vertical h="auto" w="*" paddingLeft="12dp" paddingRight="12dp" paddingTop="12dp">
                            <horizontal height={this.dp(10.5)}>
                                <vertical layout_weight="1" width={this.ldp(3)}>
                                    <vertical id="task_dy_fans_back_view">
                                        <img w="*" h={this.dp(22)} src={'file://img/view_back.png'} />
                                        <text textColor="#FF3333" marginTop={this.dp(120)} gravity="center">粉丝回访</text>
                                    </vertical>
                                </vertical>

                                <vertical layout_weight="1" width={this.ldp(3)}>
                                    <vertical id="task_dy_cancel_focus">
                                        <img w="*" h={this.dp(22)} src={'file://img/cancel_focus.png'} />
                                        <text marginTop={this.dp(120)} gravity="center">一键取关</text>
                                    </vertical>
                                </vertical>

                                <vertical layout_weight="1" width={this.ldp(3)}>
                                    <vertical id="task_dy_cancel_zan">
                                        <img w="*" h={this.dp(22)} src={'file://img/cancel_zan.png'} />
                                        <text marginTop={this.dp(120)} gravity="center">一键取赞</text>
                                    </vertical>
                                </vertical>
                            </horizontal>

                            {/* <horizontal height={this.dp(10.5)} marginTop="12dp">
                                <vertical layout_weight="1" width={this.ldp(3)}>
                                    <vertical id="task_dy_tool_score">
                                        <img w="*" h={this.dp(22)} src={'file://img/score.png'} />
                                        <text marginTop={this.dp(120)} gravity="center">智能打分(娱乐)</text>
                                    </vertical>
                                </vertical>

                                <vertical layout_weight="1" width={this.ldp(3)}>
                                    <vertical id="task_dy_comment_back">
                                        <img w="*" h={this.dp(22)} src={'file://img/msg_back.png'} />
                                        <text textColor="#FF3333" marginTop={this.dp(120)} gravity="center">智能回评</text>
                                    </vertical>
                                </vertical>

                                <vertical layout_weight="1" width={this.ldp(3)}>
                                    <vertical id="task_dy_tool_score_live">
                                        <img w="*" h={this.dp(22)} src={'file://img/score_live.png'} />
                                        <text marginTop={this.dp(120)} gravity="center">智能打分(直播)</text>
                                    </vertical>
                                </vertical>
                            </horizontal> */}
                        </vertical>

                        <vertical h="auto" w="*" paddingLeft="12dp" paddingRight="12dp" marginTop="24dp">
                            <horizontal h="auto" w="*" paddingLeft="4dp" paddingBottom="6dp">
                                <text textSize="18dp" textColor="#333333" textStyle="bold" text="其他功能" />
                            </horizontal>
                            <horizontal h="auto" w="*">
                                <vertical visibility={visible ? 'visible' : 'gone'} layout_weight="1" w={this.ldp(2)}>
                                    <card cardCornerRadius="6dp" cardElevation="6dp" margin="6dp">
                                        <vertical id="task_dy_grab_phone" padding={"0 " + this.dp(80) + " 0 " + this.dp(80)}>
                                            <img w="*" h="*" src={'file://img/phone.png'} />
                                            <text marginTop={this.dp(120)} gravity="center">商家电话采集</text>
                                        </vertical>
                                    </card>
                                </vertical>
                                <vertical layout_weight="1" w={this.ldp(2)} marginLeft="12dp">
                                    {/* <card cardCornerRadius="6dp" cardElevation="6dp" margin="6dp">
                                        <vertical id="task_dy_cancel_fans" padding={"0 " + this.dp(80) + " 0 " + this.dp(80)}>
                                            <img w="*" h="*" src={'file://img/clear_fans.png'} />
                                            <text marginTop={this.dp(120)} gravity="center">清理粉丝</text>
                                        </vertical>
                                    </card> */}
                                </vertical>
                            </horizontal>
                        </vertical>

                        {/* <vertical visibility={storage.getOpenWx() ? 'visible' : 'gone'} h="auto" w="*" paddingLeft="12dp" paddingRight="12dp" marginTop="24dp">
                            <horizontal h="auto" w="*" paddingLeft="4dp" paddingBottom="6dp">
                                <text textSize="18dp" textColor="#333333" textStyle="bold" text="群控功能" />
                            </horizontal>
                            <horizontal height={this.dp(10.5)} marginTop="12dp">
                                <vertical layout_weight="1">
                                    <card w="*" cardCornerRadius="10dp" margin="1px">
                                        <horizontal id="task_dy_grab" bg="#DDDDF3" paddingTop="16dp" paddingBottom="16dp" paddingLeft="12dp">
                                            <horizontal layout_weight={3}>
                                                <img w={this.dp(22)} h={this.dp(22)} src={'file://img/weixin.png'} />
                                                <text marginTop={this.dp(120)} marginLeft="6dp" textColor="#000000" gravity="center">智能群控</text>
                                            </horizontal>

                                            <horizontal layout_weight={1}>
                                                <img alpha="0.35" w={this.dp(22)} h={this.dp(22)} src={'file://img/grab.png'} />
                                            </horizontal>
                                        </horizontal>
                                    </card>
                                </vertical>
                            </horizontal>
                        </vertical> */}
                    </vertical>
                </frame>
            </frame>
            , parent);
    }
}

module.exports = Tool;
