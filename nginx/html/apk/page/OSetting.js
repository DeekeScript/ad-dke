let storage = require('../common/storage');
let baiduWenxin = require('../service/baiduWenxin');
let OSetting = {
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
        this.setValue();
        // ui['closeType'].on('check', (v) => {
        //     storage.setMobileStopType(v ? 1 : 0);
        // });

        ui['baidu_wenxin_switch'].on('check', (v) => {
            storage.set('baidu_wenxin_switch', v ? 1 : 0);
            page.setSpeechFuncOpen();//让speech页面重现渲染 
        });


        ui['stable'] && ui['stable'].on('check', (v) => {
            storage.set('stable', v ? 1 : 0);
            auto.setStable(v ? 1 : 0);
        });

        ui['oSettingAdd'].click((v) => {
            storage.setCity(ui['city'].getText().toString());
            storage.setExcNicknames(ui['nicknames'].getText().toString());
            //判断是否成功
            threads.start(() => {
                if (storage.get('baidu_wenxin_switch')) {
                    if (!ui['key'].getText().toString() || !ui['secret'].getText().toString()) {
                        return dialogs.alert('请配置百度文心～');
                    }

                    let res = baiduWenxin.getToken(ui['key'].getText().toString(), ui['secret'].getText().toString());
                    console.log(res, '百度文心返回结果');
                    if (!res || !res['access_token']) {
                        isSuc = false;
                        return dialogs.alert('百度文心配置存在问题～');
                    }
                }
                storage.set('baidu_key', ui['key'].getText().toString());
                storage.set('baidu_secret', ui['secret'].getText().toString());
                return toast('配置成功');
            });
        });

        ui['back'].click((v) => {
            page.setting();
        });
    },

    setValue() {
        let stable = storage.get('stable') ? 1 : 0;
        ui['stable'] && ui['stable'].attr('checked', stable ? true : false);

        // let closeType = storage.getMobileStopType() || 0;
        // ui['closeType'].attr('checked', closeType ? true : false);
        ui['baidu_wenxin_switch'].attr('checked', storage.get('baidu_wenxin_switch') ? true : false);
        ui['city'].setText(storage.getCity() || '');
        ui['nicknames'].setText(storage.getExcNicknames() || '');
        ui['key'].setText(storage.get('baidu_key') || '');
        ui['secret'].setText(storage.get('baidu_secret') || '');
    },

    show(parent) {
        return ui.inflate(
            <frame id="current" bg={'#F6F6F6'}>
                <frame textColor="#333333" bg="#F6F6F6" height={this.dp(40)} marginTop="0" paddingTop={this.dp(80)} paddingBottom={this.dp(80)} h="auto">
                    <img id="back" gravity="center" layout_gravity="center|left" w={"15dp"} h={"15dp"} marginLeft="12dp" src={"file://img/back.png"} />
                    <text id="title" textColor="#333333" textStyle="bold" height={this.dp(40)} gravity="center">其他设置</text>
                </frame>
                <vertical id="containInner" marginTop={this.dp(18)} paddingLeft="11dp" paddingRight="11dp">
                    {/* <card w="*" cardCornerRadius="12dp" margin="1dp">
                        <vertical paddingTop="12dp">
                            <horizontal gravity={"center_vertical"} padding="12dp 0">
                                <text w={'96dp'} textColor="black" text="稳定模式:" />
                                <vertical gravity={"center_vertical"}>
                                    <checkbox id="stable" text="使用同城营销时打开" />
                                </vertical>
                            </horizontal>
                            <vertical>
                                <text padding="12dp" text="开启或者关闭后，需要重启无障碍服务才生效哦～" />
                            </vertical>
                        </vertical>
                    </card> */}
                    <card w="*" cardCornerRadius="12dp" margin="1dp 6dp">
                        <vertical padding="12dp">
                            {/* <horizontal gravity={"center_vertical"} padding="0">
                                <text w={'68dp'} textColor="#515151" text="关闭 D音:" />
                                <vertical gravity={"center_vertical"}>
                                    <checkbox id="closeType" text="上滑关闭D音" />
                                </vertical>
                            </horizontal> */}
                            {/* <progressbar progressTint="#f6f6f6" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" /> */}
                            <horizontal gravity={"center_vertical"} padding="0">
                                <text w={'57dp'} layout_weight="1" textColor="#515151" text="同城名称:" />
                                <vertical layout_weight="5" gravity={"center_vertical"}>
                                    <input w={'*'} id="city" textSize={'16dp'} textSizeHint="16dp" text="" hint="热门城市，如“武汉”" />
                                </vertical>
                            </horizontal>

                            <horizontal gravity={"center_vertical"} padding="0">
                                <text w={'57dp'} layout_weight="1" textColor="#515151" text="排除昵称:" />
                                <vertical layout_weight="5" gravity={"center_vertical"}>
                                    <input w={'*'} id="nicknames" textSize={'16dp'} textSizeHint="16dp" text="" hint="避免操作自己的账号" />
                                </vertical>
                            </horizontal>
                        </vertical>
                    </card>

                    <card w="*" cardCornerRadius="12dp" margin="1dp">
                        <vertical padding="12dp">
                            <text textColor="#515151" text="百度文心配置" paddingBottom="6dp" />
                            <progressbar progressTint="#f6f6f6" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                            <horizontal gravity={"center_vertical"} padding="0">
                                <text w={'80dp'} textColor="#515151" text="开启文心:" />
                                <vertical gravity={"center_vertical"}>
                                    <checkbox id="baidu_wenxin_switch" text="开启" />
                                </vertical>
                            </horizontal>
                            <horizontal gravity={"center_vertical"} padding="0">
                                <text w={'80dp'} layout_weight="1" textColor="#515151" text="API Key:" />
                                <vertical layout_weight="5" gravity={"center_vertical"}>
                                    <input w={'*'} id="key" textSize={'16dp'} textSizeHint="16dp" text="" hint="百度智能云购买配置" />
                                </vertical>
                            </horizontal>

                            <horizontal gravity={"center_vertical"} padding="0">
                                <text w={'80dp'} layout_weight="1" textColor="#515151" text="Secret Key:" />
                                <vertical layout_weight="5" gravity={"center_vertical"}>
                                    <input w={'*'} id="secret" textSize={'16dp'} textSizeHint="16dp" text="" hint="百度智能云购买配置" />
                                </vertical>
                            </horizontal>
                        </vertical>
                    </card>
                    <vertical h="*" gravity="bottom" marginBottom={"64dp"}>
                        <card w="*" cardCornerRadius="6dp" margin="1dp">
                            <button id='oSettingAdd' bg="#2E78FC" style="Widget.AppCompat.Button.Colored" text="确认" />
                        </card>
                    </vertical>
                </vertical>
            </frame >
            , parent);
    }
}

module.exports = OSetting;
