const machine = require('../common/machine');
let FansIncPage = {
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

        ui['fansIncPageSubmit'].click((v) => {
            let stable = machine.getFansIncPageRate();
            let res = {}
            for (let i in stable) {
                res[i] = ui[i].getText().toString()
            }
            machine.setFansIncPageRate(res);
            log(res);
            toast('立即执行');
            funcs[0]['task_dy_fans_inc']();
        });

        ui['back'].click((v) => {
            log('back');
            page.home();
        });
    },

    setValue() {
        let stable = machine.getFansIncPageRate();
        for (let i in stable) {
            ui[i.toString()] && ui[i.toString()].setText(stable[i].toString());
        }
    },

    show(parent) {
        return ui.inflate(
            <frame id="current" bg={'#F6F6F6'}>
                <vertical>
                    <frame textColor="#333333" bg="#F6F6F6" height={this.dp(40)} marginTop="0" paddingTop={this.dp(80)} paddingBottom={this.dp(80)} h="auto">
                        <img id="back" gravity="center" layout_gravity="center|left" w={"15dp"} h={"15dp"} marginLeft="12dp" src={"file://img/back.png"} />
                        <text id="title" textColor="#333333" textStyle="bold" height={this.dp(40)} gravity="center">快速涨粉</text>
                    </frame>
                    <ScrollView id="contain" height={this.dp(1.11)}>
                        <vertical id="containInner" paddingLeft="11dp" paddingRight="11dp">
                            <card w="*" cardCornerRadius="12dp" margin="1dp 6dp">
                                <vertical padding="12dp">
                                    {/* <horizontal h="40dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="关键词:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="keyword" textSize={'16dp'} textSizeHint="16dp" text="" hint="不设置，则所有视频都操作" />
                                        </vertical>
                                    </horizontal> */}

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="视频操作频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="videoOpRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，50%表示每2个视频操作一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>


                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="点赞频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="zanRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，50表示2个用户点赞一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="评论频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="commentRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，5表示2个用户评论一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="点赞评论频率:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="zanCommentRate" textSize={'16dp'} textSizeHint="16dp" text="" hint="0到100之间，5表示2个用户评论一个" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>

                                    <horizontal h="60dp" gravity={"center_vertical"} padding="0">
                                        <text w={'90dp'} layout_weight="2" textColor="#515151" text="点赞个数:" />
                                        <vertical layout_weight="7" gravity={"center_vertical"}>
                                            <input w={'*'} id="zanCount" textSize={'16dp'} textSizeHint="16dp" text="" hint="每个视频点赞个数，默认5连赞" />
                                        </vertical>
                                        <text text="%" />
                                    </horizontal>
                                </vertical>
                            </card>
                            <vertical h="*" gravity="bottom" marginBottom={"64dp"}>
                                <card w="*" cardCornerRadius="6dp" margin="1dp">
                                    <button id='fansIncPageSubmit' style="Widget.AppCompat.Button.Colored" text="立即执行" />
                                </card>
                            </vertical>
                        </vertical>
                    </ScrollView>
                </vertical>
            </frame >
            , parent);
    }
}

module.exports = FansIncPage;
