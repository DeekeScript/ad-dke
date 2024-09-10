const machine = require('../common/machine');
let FansSetting = {
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

        ui['fansSettingSubmit'].click((v) => {
            let stable = machine.getFansSettingRate();
            let res = {}
            for (let i in stable) {
                res[i] = ui['f_' + i.toString()].getText().toString()
            }
            machine.setFansSettingRate(res);
            log(res);
            toast('立即执行');
            funcs[0]['task_dy_toker_fans']();
        });

        ui['f_back'].click((v) => {
            page.home();
        });
    },

    setValue() {
        let stable = machine.getFansSettingRate();
        for (let i in stable) {
            ui['f_' + i.toString()] && ui['f_' + i.toString()].setText(stable[i].toString());
        }
    },

    show(parent) {
        return ui.inflate(
            <frame id="current" bg={'#F6F6F6'}>
                <vertical>
                    <frame textColor="#333333" bg="#F6F6F6" height={this.dp(40)} marginTop="0" paddingTop={this.dp(80)} paddingBottom={this.dp(80)} h="auto">
                        <img id="f_back" gravity="center" layout_gravity="center|left" w={"15dp"} h={"15dp"} marginLeft="12dp" src={"file://img/back.png"} />
                        <text id="title" textColor="#333333" textStyle="bold" height={this.dp(40)} gravity="center">粉丝截流设置</text>
                    </frame>
                    <ScrollView id="contain" height={this.dp(1.11)}>
                        <vertical id="containInner" paddingLeft="11dp" paddingRight="11dp">
                            <card w="*" cardCornerRadius="12dp" margin="1dp 6dp">
                                <vertical padding="12dp">
                                    <horizontal h="40dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="对方账号:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_account" textSize={'16dp'} textSizeHint="16dp" text="" hint="要操作的账号" />
                                        </vertical>
                                    </horizontal>

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="私信频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_privateRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，50%表示2个用户私信一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="关注频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_focusRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，50%表示2个用户关注一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="点赞频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_zanRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，50表示2个用户点赞一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="评论频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_commentRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，50表示2个用户评论一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>

                                    <horizontal h="40dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="粉丝最小数:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_fansMinCount" textSize={'16dp'} textSizeHint="16dp" text="" hint="粉丝数小于此数字不操作" />
                                        </vertical>
                                    </horizontal>

                                    <horizontal h="40dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="粉丝最大数:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_fansMaxCount" textSize={'16dp'} textSizeHint="16dp" text="" hint="粉丝数大于此数字不操作" />
                                        </vertical>
                                    </horizontal>

                                    <horizontal h="40dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="作品最小数:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_worksMinCount" textSize={'16dp'} textSizeHint="16dp" text="" hint="作品数小于此数字不操作" />
                                        </vertical>
                                    </horizontal>

                                    <horizontal h="40dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="作品最大数:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_worksMaxCount" textSize={'16dp'} textSizeHint="16dp" text="" hint="作品数大于此数字不操作" />
                                        </vertical>
                                    </horizontal>

                                    <horizontal h="40dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="执行次数:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="f_opCount" textSize={'16dp'} textSizeHint="16dp" text="" hint="执行N次之后停止" />
                                        </vertical>
                                    </horizontal>
                                </vertical>
                            </card>
                            <vertical h="*" gravity="bottom" marginBottom={"64dp"}>
                                <card w="*" cardCornerRadius="6dp" margin="1dp">
                                    <button id='fansSettingSubmit' bg="#2E78FC" style="Widget.AppCompat.Button.Colored" text="立即执行" />
                                </card>
                            </vertical>
                        </vertical>
                    </ScrollView>
                </vertical>
            </frame >
            , parent);
    }
}

module.exports = FansSetting;
