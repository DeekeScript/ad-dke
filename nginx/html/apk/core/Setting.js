let mHttp = require('../unit/mHttp.js');
let storage = require('../common/storage.js');
const machine = require('../common/machine.js');
importClass(android.graphics.Color);
let Config = require('../config/config');
let cos = require('../unit/cos');

let Setting = {
    userType: 0,
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
    func(funcs, page) {
        if (this.funcOpen) {
            return true;
        }
        this.funcOpen = true;
        //获取当前账号使用天数
        let _this = this;
        threads.start(function () {
            let res = mHttp.post('dke', 'getDate', {});
            if (res.code === 0) {
                ui.post(() => {
                    if (res.data.date > 10) {
                        ui['notice'].setText('本账号还可使用' + res.data.date + '天！');
                        ui['notice'].setTextColor(Color.parseColor("#E1C8B5"));
                    } else {
                        ui['notice'].setText('本账号还可使用' + res.data.date + '天！');
                        ui['notice'].setTextColor(Color.parseColor("#CC3333"));
                    }
                });
                _this.userType = res.data.type;
            }
        });

        ui.close_all && ui.close_all.click(function () {
            funcs[0].closeAll();
        });

        ui['kefu'].click(() => {
            let str = '';
            for (let i in Config.weixin) {
                str += "\n微信号：" + Config.weixin[i];
            }

            dialogs.alert('合作与咨询', str.substring(1));
        });

        //检查更新
        ui['check_update'] && ui['check_update'].click(function (btn) {
            if (page.is_update) {
                return;
            }

            page.is_update = true;
            try {
                threads.start(function () {
                    mHttp.updateApp();
                });
            } catch (e) {
                console.log(e);
            }
            page.is_update = false;
        });

        ui['logout'] && ui['logout'].click(() => {
            storage.removeToken();
            page.show();
        });

        ui['o_setting'] && ui['o_setting'].click(() => {
            page.oSetting();
        });

        ui['clear'] && ui['clear'].click(() => {
            dialogs.confirm('确定清理嘛？').then((v) => {
                if (v) {
                    log(v ? '清理日志' : '暂无清理');
                    machine.clear();
                }
            });
        });

        ui['upload_log'] && ui['upload_log'].click(() => {
            threads.start(function () {
                log('文件上传开始');
                cos.uploadLog();
                log('文件上传结束');
            });
        });

        ui['upload_log'] && ui['useIntroduction'].click(() => {
            dialogs.alert(Config.name + '入门', files.read("help/useIntroduction.txt"));
        });

        ui['noticeText'] && ui['noticeText'].click(() => {
            dialogs.alert('注意事项', files.read("help/notice.txt"));
        });
    },

    show(parent) {
        let version = ['正式版', '试用版', '试用版'];
        let makeMoney = storage.getMakeMoney();
        return ui.inflate(
            <frame id="current" bg="#F8F8FA">
                <frame textColor="#ffffff" height={this.dp(5)} marginTop="0" h="auto">
                    <img src="file://img/setting-top.png" w="*" scaleType="fitXY" />
                    <RelativeLayout w="*">
                        <horizontal w="*" marginTop={this.dp(20)} height={this.dp(9)}>
                            <vertical w="64dp" layout_weight="1">
                                <img marginLeft={'16dp'} radius="300dp" w={"64dp"} h={"64dp"} src={"file://img/robot.png"} />
                            </vertical>

                            <vertical layout_weight="7" gravity={"left|center"} marginLeft={"0dp"}>
                                <text textColor="#333333" textSize="16dp" textStyle="bold">账号：{storage.getMobile()}</text>
                                <text textColor="#333333" margin={'0 4dp'} textSize="14dp">设备ID：{storage.getMachineId()}</text>
                                <text textSize="14dp" w={'51dp'} h={'24dp'} bg={'#f3f3f3'} padding={'4dp 2dp'} text={version[this.userType]} />
                            </vertical>
                        </horizontal>
                    </RelativeLayout>
                </frame>

                <vertical w="*" h={this.dp(12)} marginTop={this.dp(6.15)} marginLeft="6dp" marginRight="6dp">
                    <card w="*" h="*" cardCornerRadius="12dp" margin="6dp" cardElevation="6dp">
                        <horizontal bg="#32364E" paddingLeft="6dp" paddingRight="6dp" paddingTop="12dp" gravity="top">
                            <img w={"20dp"} h={"20dp"} src={"file://img/notice-2.png"} />
                            <text id="notice" textColor="#E1C8B5" marginLeft={'6dp'}>本账号还可使用0天</text>
                        </horizontal>
                    </card>
                </vertical>

                {/* <horizontal visibility={makeMoney ? "visible" : "gone"} marginTop={this.dp(5.5)} marginLeft="4dp" marginRight="4dp">
                    <card layout_weight="1" id='all_money' gravity={"center_vertical"} height={this.dp(12.5)} alpha="1" marginTop={'1dp'}>
                        <img marginLeft={'12dp'} w={"36dp"} h={"36dp"} src={"file://7D72EBsettled.png"} />
                        <text gravity={"center_vertical"} marginLeft={'56dp'} lineSpacingExtra="6dp">已结算(点数) 0.00</text>
                    </card>
                    <card layout_weight="1" marginLeft="4dp" id='current_money' gravity={"center_vertical"} height={this.dp(12.5)} alpha="1" marginTop={'1dp'}>
                        <img marginLeft={'12dp'} w={"36dp"} h={"36dp"} src={"file://7D72EBxufei.png"} />
                        <text gravity={"center_vertical"} marginLeft={'56dp'} lineSpacingExtra="6dp">待结算(点数) 0.00</text>
                    </card>
                </horizontal> */}

                <vertical marginTop={makeMoney ? this.dp(3.4) : this.dp(4.7)} marginLeft="6dp" marginRight="6dp">
                    <card w="*" cardCornerRadius="6dp" margin="6dp">
                        <vertical bg="#ffffff">
                            <horizontal id='kefu' gravity="center_vertical" height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"24dp"} h={"24dp"} src={"file://img/kefu.png"} />
                                <text textColor="#333333" layout_weight="8" gravity={"left"}>联系官方</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                            <horizontal id='check_update' gravity={"center_vertical"} height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"24dp"} h={"24dp"} src={"file://img/update.png"} />
                                <text textColor="#333333" layout_weight="8" gravity="left">系统升级</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                            <horizontal id={'o_setting'} gravity={"center_vertical"} height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"22dp"} h={"22dp"} src={"file://img/sett.png"} />
                                <text textColor="#333333" layout_weight="8" gravity="left">其他设置</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                            <horizontal id='upload_log' gravity={"center_vertical"} height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"24dp"} h={"24dp"} src={"file://img/upload.png"} />
                                <text textColor="#333333" layout_weight="8" gravity="left">上传日志</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                            <horizontal id={'clear'} gravity={"center_vertical"} height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"22dp"} h={"22dp"} src={"file://img/clear.png"} />
                                <text textColor="#333333" layout_weight="8" gravity="left">清理数据</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                            <horizontal id={'close_all'} gravity={"center_vertical"} height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"21dp"} h={"21dp"} src={"file://img/close.png"} />
                                <text textColor="#333333" layout_weight="8" gravity="left">关闭任务</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                        </vertical>
                    </card>
                    <card w="*" margin="6dp">
                        <vertical bg="#ffffff">
                            <horizontal id={'noticeText'} gravity={"center_vertical"} height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"22dp"} h={"22dp"} src={"file://img/notice.png"} />
                                <text textColor="#333333" layout_weight="8" gravity="left">注意事项</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                            <horizontal id={'useIntroduction'} gravity={"center_vertical"} height={this.dp(14.5)}>
                                <img layout_weight="1" gravity="left" w={"21dp"} h={"21dp"} src={"file://img/new_user.png"} />
                                <text textColor="#333333" layout_weight="8" gravity="left">新手入门</text>
                                <img layout_weight="1" gravity="right" w={"12dp"} h={"12dp"} src={"file://img/into.png"} />
                            </horizontal>
                        </vertical>
                    </card>
                    <card w="*" margin="6dp">
                        <vertical bg="#ffffff">
                            <horizontal id={'logout'} gravity={"center_vertical|center"} height={this.dp(14.5)}>
                                <text textColor="#333333" gravity={"center_vertical"} textSize="18dp">退出账号</text>
                            </horizontal>
                        </vertical>
                    </card>
                    {/* <horizontal marginTop={this.dp(1.17)}>
                        <text gravity={"center"} w={'*'} textColor={'#999999'}>{app.versionName} ©{Config.name}技术团队提供计算支持</text>
                    </horizontal> */}
                </vertical>
            </frame>
            , parent);
    }
}

module.exports = Setting;
