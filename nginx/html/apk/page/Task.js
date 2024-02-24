let storage = require('../common/storage');
let Task = {
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
        let items = storage.getTask();
        if (items.length) {
            items = items.reverse();
        }

        ui.post(() => {
            ui.list.setDataSource(items);
            ui.load.attr('visibility', 'gone');

            ui.list.on("item_bind", function (itemView, itemHolder) {
                itemView.delete.click((v) => {
                    dialogs.confirm('确认删除吗？').then((v) => {
                        if (v) {
                            storage.removeTask(itemHolder.item.index);
                            for (let i in items) {
                                if (items[i].index === itemHolder.item.index) {
                                    items.splice(i, 1);
                                }
                            }
                        }
                    });
                });

                itemView.edit.click((v) => {
                    dialogs.singleChoice('请选择修改类型', ['修改名称', '编辑详情']).then((v) => {
                        if (v === 0) {
                            dialogs.rawInput("请输入任务名称", itemHolder.item.title).then((title) => {
                                if (title.length === 0) {
                                    return toast('名称不能为空');
                                }
                                for (let i in items) {
                                    if (items[i].index === itemHolder.item.index) {
                                        storage.updateTask(items[i].index, title);
                                        items[i].title = title;
                                        ui.list.setDataSource(items);
                                    }
                                }
                            });
                        } else if (v === 1) {
                            page.taskDetail(itemHolder.item.index);
                        }
                    });
                });
            });
        });

        ui.add && ui.add.click(() => {
            dialogs.rawInput("请输入任务名称：", "").then((title) => {
                if (!title) {
                    return toast('任务名称为空');
                }

                if (title.length > 32) {
                    return toast('名称长度不能大于30个字符')
                }

                let d = new Date();
                let month = d.getMonth() + 1;
                let date = d.getDate();
                let h = d.getHours();
                let m = d.getMinutes();
                let s = d.getSeconds();

                let data = {
                    title: title,
                    index: d.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date) + ' ' + (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s),
                }
                let res = storage.addTask(data);
                if (res.length) {
                    res = res.reverse();
                }
                items = res;
                ui.list.setDataSource(res);
                page.taskDetail(data.index);
            });
        });
    },

    show(parent) {
        return ui.inflate(
            <frame id="current">
                <frame textColor="#ffffff" height={this.dp(6)} marginTop="0" h="auto">
                    <img src="file://img/task-bg.png" w="*" scaleType="fitXY" />
                    <RelativeLayout w="*">
                        <frame h="auto" w="*" paddingTop={this.dp(40)}>
                            <text id="title" textSize="16dp" gravity="center" textColor="#333333" textStyle="bold" layout_gravity="center|center">任务管理</text>
                            <img id="add" gravity="center" layout_gravity="center|right" radius={20} marginTop="1dp" w={"24dp"} h={"24dp"} marginRight="12dp" src={"file://img/add.png"} />
                        </frame>
                    </RelativeLayout>
                </frame>
                <RelativeLayout w="*" h="*" marginLeft="6dp" marginRight="6dp" marginTop={this.dp(15)}>
                    <vertical id="containInner" w="*" height={this.dp(1.19)}>
                        <card w="*" cardCornerRadius="12dp" margin="6dp" cardElevation="6dp">
                            <img marginLeft={this.ldp(3)} width={this.ldp(3)} id="load" src="file://img/load.gif" />
                            <ScrollView id="contain" height={this.dp(1.23)} w="*">
                                <list id="list" w="*">
                                    <vertical w="*">
                                        <horizontal marginTop={'1dp'} w="*">
                                            <frame bg={"#ffffff"} width={this.ldp(100 / 75)} minHeight={this.dp(14.5)}>
                                                <text lineSpacingExtra="6dp" layout_gravity={"center_vertical"} marginLeft="12dp" padding={"0 6dp 0 6dp"} text="{{this.title}}" />
                                                {/* <text gravity="center" layout_gravity={"left|bottom"} textSize="12dp" w={'138dp'} h={'21dp'} bg={'#f6f6f6'} padding={'6dp 2dp'} text="{{this.index}}" /> */}
                                            </frame>
                                            <frame width={this.ldp(100 / 10)} id="edit" h='*' bg={"#ffffff"} gravity={"center_vertical"} minHeight={this.dp(14.5)}>
                                                <img layout_weight={2} w={"20dp"} h={"20dp"} src={"file://img/edit.png"} marginRight={'12dp'} />
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
                    </vertical>
                </RelativeLayout>
            </frame>
            , parent);
    }
}

module.exports = Task;
