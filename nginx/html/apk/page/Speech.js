let storage = require('../common/storage');
// importClass(android.animation.ObjectAnimator);

let Speech = {
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
    baiduWenxinSwitch: storage.get('baidu_wenxin_switch') || false,
    func(funcs, page) {
        if (this.funcOpen) {
            return true;
        }

        this.funcOpen = true;
        let items = storage.getSpeech();
        if (items.length) {
            items.reverse();
        }

        for (let i in items) {
            if (items[i].typeName == "私\n信") {
                items[i].color = "#5BAFF6";
            } else {
                items[i].color = "#F0863D";
            }
            items[i].typeName = items[i].typeName.replace("\n", '');
        }

        ui.post(() => {
            // animator = ObjectAnimator.ofFloat(ui.load, "rotation", 0, 720);
            // animator.setDuration(1500);
            // animator.start();
            ui.list.setDataSource(items);
            ui.list.on("item_bind", function (itemView, itemHolder) {
                itemView.delete.click((v) => {
                    dialogs.confirm('确认删除吗？').then((v) => {
                        if (v) {
                            storage.removeSpeech(itemHolder.item.index);
                            for (let i in items) {
                                if (items[i].index === itemHolder.item.index) {
                                    items.splice(i, 1);
                                }
                            }
                        }
                    });
                });
            });
            ui.load.attr('visibility', 'gone');
        });

        ui.add && ui.add.click(() => {
            let i = dialogs.singleChoice("请选择类型", ["私信", "评论"]).then((i) => {
                if (i < 0) {
                    return toast('你取消了选择');
                }

                dialogs.rawInput("请输入话术内容：", "").then((title) => {
                    if (!title) {
                        return toast('话术为空');
                    }

                    let data = [];
                    let titles = title.split("\n");

                    for (let title of titles) {
                        data.push({
                            title: title,
                            typeName: ["私\n信", "评\n论"][i],
                            index: Date.parse(new Date()) + '_' + Math.random() * 100000,
                        });
                    }

                    let res = storage.addSpeechAll(data);
                    if (res.length) {
                        res = res.reverse();
                    }
                    items = res;

                    for (let i in items) {
                        if (items[i].typeName == "私\n信") {
                            items[i].color = "#5BAFF6";
                        } else {
                            items[i].color = "#F0863D";
                        }
                        items[i].typeName = items[i].typeName.replace("\n", '');
                    }
                    ui.list.setDataSource(res);
                });
            });
        });

        ui.delete_all && ui.delete_all.click(() => {
            dialogs.confirm('温馨提示', '确定清空吗？', (i) => {
                if (i) {
                    ui.list.setDataSource([]);
                    storage.clearSpeech();
                    toast('成功');
                }
            });
        });
    },

    show(parent) {
        this.baiduWenxinSwitch = storage.get('baidu_wenxin_switch') || false;
        return ui.inflate(
            <frame id="current" bg={"#f0f0f0"}>
                <frame textColor="#ffffff" height={this.dp(6)} marginTop="0" h="auto">
                    <img src="file://img/task-bg.png" w="*" scaleType="fitXY" />
                    <RelativeLayout w="*">
                        <frame h="auto" w="*" paddingTop={this.dp(40)}>
                            <horizontal visibility={this.baiduWenxinSwitch ? 'gone' : 'visible'} id="delete_all" gravity="left" layout_gravity="center|left" marginTop="1dp" marginLeft="12dp">
                                <img w={"24dp"} h={"24dp"} src={"file://img/delete.png"} />
                                <text marginLeft="4dp" textSize="16dp" text="清空" />
                            </horizontal>

                            <text id="title" textSize="16dp" gravity="center" textColor="#333333" textStyle="bold" layout_gravity="center|center">话术管理</text>
                            <img id="add" visibility={this.baiduWenxinSwitch ? 'gone' : 'visible'} gravity="center" layout_gravity="center|right" radius={20} marginTop="1dp" w={"24dp"} h={"24dp"} marginRight="12dp" src={"file://img/add.png"} />
                        </frame>
                    </RelativeLayout>
                </frame>

                <RelativeLayout w="*" h="*" marginLeft="6dp" marginRight="6dp" marginTop={this.dp(15)}>
                    <vertical id="containInner" w="*" height={this.dp(1.19)}>
                        <card visibility={this.baiduWenxinSwitch ? 'gone' : 'visible'} w="*" cardCornerRadius="12dp" margin="6dp" cardElevation="6dp">
                            <img marginLeft={this.ldp(3)} width={this.ldp(3)} id="load" src="file://img/load.gif" />
                            <ScrollView id="contain" height={this.dp(1.23)} w="*">
                                <list id="list" w="*">
                                    <vertical w="*">
                                        <horizontal marginTop={'1dp'} w="*">
                                            <frame bg={"#ffffff"} width={this.ldp(100 / 85)} minHeight={this.dp(14.5)}>
                                                <text gravity={"center"} layout_gravity={"center_vertical"} marginTop="12dp" marginBottom="12dp" textSize="12dp" w={'40dp'} marginLeft="12dp" textColor="{{this.color}}" bg={'#EEF7FE'} padding={'2dp 6dp'} text="{{this.typeName}}" />
                                                <text gravity={"left|center"} lineSpacingExtra="6dp" layout_gravity={"center_vertical"} marginLeft="72dp" h={'*'} paddingTop={'6dp'} paddingBottom={'6dp'} text="{{this.title}}" />
                                            </frame>
                                            <frame width={this.ldp(100 / 10)} id="delete" h='*' bg={"#ffffff"} gravity={"center_vertical"} minHeight={this.dp(14.5)}>
                                                <img layout_weight={2} w={"20dp"} h={"20dp"} src={"file://img/delete.png"} marginRight={'12dp'} />
                                            </frame>
                                        </horizontal>
                                        <progressbar progressTint="#f5f5f5" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    </vertical>
                                </list>
                            </ScrollView>
                        </card>

                        <card visibility={!this.baiduWenxinSwitch ? 'gone' : 'visible'} w="*" cardCornerRadius="12dp" margin="6dp" cardElevation="6dp">
                            <vertical padding="12dp 24dp" w="*">
                                <text textSize="24dp" textColor="#2E78FC" text="恭喜～，百度文心已开启～" />
                                <text marginTop="12dp" lineSpacingExtra="8dp" textSize="18dp" textColor="#333333" text="系统将使用智能AI话术，千人千面，根据视频标题自动生成积极正向的引人注目的评论，将根据每个用户的昵称、年龄、性别等信息生成智能AI打招呼私信话术～" />
                            </vertical>
                        </card>
                    </vertical>
                </RelativeLayout>
            </frame>
            , parent);
    }
}

module.exports = Speech;
