let storage = require('../common/storage');
let TaskDetail = {
    taskIndex: undefined,
    _fields: {
        videoRule: {
            contain: '',
            no_contain: '',
            // min_zan: undefined,
            // max_zan: undefined,
            // min_comment: undefined,
            // max_comment: undefined,
            // min_collect: undefined,
            // max_collect: undefined,
            // min_share: undefined,
            // max_share: undefined,
        },
        talentRule: {
            min_age: undefined,
            max_age: undefined,
            gender: [],
            // contain: '',
            // no_contain: '',
            // min_zan: undefined,
            // max_zan: undefined,
            // min_focus: undefined,
            // max_focus: undefined,
            // min_fans: undefined,
            // max_fans: undefined,
            // min_works: undefined,
            // max_works: undefined,
            // ip: '',
            // open_window: undefined,
            // is_tuangou: undefined,
            // is_person: undefined,
        },
        commentRule: {
            contain: '',
            // no_contain: '',
            // min_comment: undefined,
            // max_comment: undefined,
            min_zan: undefined,
            max_zan: undefined,
            // ip: '',
        },
        userRule: {
            min_age: undefined,
            max_age: undefined,
            gender: [],
            // min_zan: undefined,
            // max_zan: undefined,
            // min_focus: undefined,
            // max_focus: undefined,
            // min_fans: undefined,
            // max_fans: undefined,
            // min_works: undefined,
            // max_works: undefined,
            // ip: '',
            // open_window: undefined,
            // is_tuangou: undefined,
            // is_person: undefined,
        },
        taskRule: {
            is_city: 0,
            distance: 0,
            video_fre: undefined,
            comment_video_fre: undefined,
            // comment_back_fre: undefined,
            zan_video_fre: undefined,
            zan_comment_fre: undefined,
            private_msg_fre: undefined,
            private_msg_author_fre: undefined,
            focus_fre: undefined,
            focus_author_fre: undefined,
            time: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        },
        fields: {

        }
    },

    setTaskIndex(index) {
        this.taskIndex = index;
        return this;
    },

    dp: function (rate) {
        let ht = device.height;
        let systemDM = new DisplayMetrics();
        //let wm = context.getSystemService(context.WINDOW_SERVICE);
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;

        ht = ht / (dpi / 160);//px变成了dp
        return Math.round(ht / rate) + 'dp';
    },

    ldp: function (rate, inc) {
        let ht = device.width;
        let systemDM = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(systemDM);
        let dpi = systemDM.densityDpi;
        ht = ht / (dpi / 160);//px变成了dp
        if (inc) {
            ht = ht - inc;
        }
        return Math.round(ht / rate) + 'dp';
    },

    copy() {
        let res = {};
        for (let i in this._fields) {
            if (undefined === res[i]) {
                res[i] = {};
            }
            for (let j in this._fields[i]) {
                res[i][j] = this._fields[i][j];
            }
        }
        return res;
    },

    func(funcs, page) {
        this.fields = this.copy();//JSON.parse(JSON.stringify(this._fields));
        let _this = this;
        this.setValues();

        ui.add && ui.add.click(() => {
            if (currentInput) {
                this.updateTaskDetail(currentInput, ui[currentInput].getText().toString());
            }
            this.updateTaskDetail(undefined, undefined);
            toast('成功');
            // setTimeout(() => {
            //     page.task();
            // }, 700);
        });

        //点击事件的反应
        let currentInput = undefined;
        let selectedInit = [];
        try {
            for (let i in this.fields) {
                //log(this.fields[i]);
                for (let j in this.fields[i]) {
                    if (!ui[i + '_' + j]) {
                        log(i + '_' + j);
                        continue;
                    }
                    if (ui[i + '_' + j].toString().indexOf('JsEditText') !== -1) {
                        (function (i, j) {
                            ui[i + '_' + j].on('touch_up', (v) => {
                                //log(i, j);
                                if (currentInput && currentInput !== i + '_' + j) {
                                    _this.updateTaskDetail(currentInput, ui[currentInput].getText().toString());
                                }
                                currentInput = i + '_' + j;
                            });
                        })(i, j);
                    } else if (ui[i + '_' + j].toString().indexOf('JsSpinner') !== -1) {
                        (function (i, j) {
                            let myAdapterListener = new android.widget.AdapterView.OnItemSelectedListener({
                                onItemSelected: function (parent, view, position, id) {
                                    //log('选中了第' + id + '项');
                                    let v = ui[i + '_' + j].getSelectedItemPosition();
                                    if (!selectedInit[i + '_' + j]) {
                                        selectedInit[i + '_' + j] = true;
                                        return true;
                                    }

                                    // if (i + '_' + j === 'taskRule_is_city') {
                                    //     log('taskRule_distance_box', v);
                                    //     ui['taskRule_distance_box'].attr('visibility', v === 0 ? 'gone' : 'visible');
                                    // }

                                    log(i + '_' + j, v);
                                    _this.updateTaskDetail(i + '_' + j, v);
                                }
                            });

                            ui[i + '_' + j].setOnItemSelectedListener(myAdapterListener);
                        })(i, j);
                    } else if (ui[i + '_' + j].toString().indexOf('CheckBox') !== -1) {
                        (function (i, j) {
                            //log(i + '_' + j);
                            ui[i + '_' + j].on("check", (v) => {
                                _this.updateTaskDetail(i + '_' + j, v);
                            });
                        })(i, j);
                    } else if (ui[i + '_' + j].toString().indexOf('JsLinearLayout') !== -1) {
                        if (i + '_' + j === 'userRule_gender' || i + '_' + j === 'talentRule_gender') {
                            for (let k = 1; k <= 3; k++) {
                                (function (i, j, k) {
                                    ui[i + '_' + j + '_' + k].on('check', (v) => {
                                        //log(i + '_' + j + '_' + k);
                                        _this.updateTaskDetail(i + '_' + j, v, k);
                                    });
                                })(i, j, k);
                            }
                        } else {
                            for (let k = 0; k <= 23; k++) {
                                //log(i + '_' + j + '_' + k);
                                (function (i, j, k) {
                                    ui[i + '_' + j + '_' + k].on('check', (v) => {
                                        _this.updateTaskDetail(i + '_' + j, v, k);
                                    });
                                })(i, j, k);
                            }
                        }
                    } else {
                        //log(ui[i + '_' + j].toString());
                    }
                }
            }
        } catch (e) {
            log(e);
        }

        ui.back && ui.back.click(() => {
            page.task();
        });
    },

    setValues() {
        let items = storage.getTaskDetail(this.taskIndex);
        log(items);
        if (!items) {
            return false;
        }

        try {
            for (let i in items) {
                if (i === 'taskIndex') {
                    continue;
                }
                for (let j in items[i]) {
                    if (ui[i + '_' + j] && ui[i + '_' + j].toString().indexOf('JsEditText') !== -1) {
                        ui[i + '_' + j].setText(items[i][j].toString());
                        this.fields[i][j] = items[i][j].toString();
                    } else if (ui[i + '_' + j] && ui[i + '_' + j].toString().indexOf('JsSpinner') !== -1) {
                        ui[i + '_' + j].setSelection(items[i][j] * 1);
                        this.fields[i][j] = items[i][j] * 1;
                    } else if (ui[i + '_' + j] && ui[i + '_' + j].toString().indexOf('CheckBox') !== -1) {
                        ui[i + '_' + j].attr('checked', items[i][j].toString() === 'true');
                        this.fields[i][j] = items[i][j].toString() === 'true';
                    } else if (ui[i + '_' + j] && ui[i + '_' + j].toString().indexOf('JsLinearLayout') !== -1) {
                        if (i === 'userRule' || i === 'talentRule') {
                            for (let k = 1; k <= 3; k++) {
                                //log(i + '_' + j + '_' + k, items[i][j], k, items[i][j].includes(k));
                                ui[i + '_' + j + '_' + k].attr('checked', items[i][j].includes(k));
                            }
                            this.fields[i][j] = items[i][j];
                        } else {
                            for (let k = 0; k <= 23; k++) {
                                ui[i + '_' + j + '_' + k].attr('checked', items[i][j][k].toString() === 'true');
                                this.fields[i][j][k] = items[i][j][k].toString() === 'true';
                            }
                        }
                    }
                }
            }
        } catch (e) {
            log(e);
        }

        //log(this.fields.taskRule.is_city, 'this.fields.taskRule.is_city');
        // if (this.fields.taskRule.is_city) {
        //     ui['taskRule_distance_box'].attr('visibility', 'visible');
        //     ui['taskRule_distance'].setSelection(this.fields.taskRule.distance * 1);
        // } else {
        //     ui['taskRule_distance_box'].attr('visibility', 'gone');
        // }
    },

    updateTaskDetail(currentInput, value, arrIndex) {
        //log('save');
        let values = this.fields;
        if (currentInput) {
            let index = currentInput.indexOf('_');
            let arr = [currentInput.substring(0, index), currentInput.substring(index + 1)];

            if (arrIndex !== undefined) {
                if (currentInput === 'userRule_gender' || currentInput === 'talentRule_gender') {
                    values[arr[0]][arr[1]] = [];
                    if (ui[currentInput + '_1'].isChecked()) {
                        values[arr[0]][arr[1]].push(1);
                    }
                    if (ui[currentInput + '_2'].isChecked()) {
                        values[arr[0]][arr[1]].push(2);
                    }
                    if (ui[currentInput + '_3'].isChecked()) {
                        values[arr[0]][arr[1]].push(3);
                    }
                    //log(values, ui[currentInput + '_1'].isChecked(), ui[currentInput + '_2'].isChecked(), ui[currentInput + '_3'].isChecked());
                } else {
                    values[arr[0]][arr[1]][arrIndex] = value;
                    this.fields[arr[0]][arr[1]][arrIndex] = value;
                }
            } else {
                values[arr[0]][arr[1]] = value;
                this.fields[arr[0]][arr[1]] = value;
            }

            //threads.start(() => {
            storage.updateTaskDetail(values);
            //});
        }
        values.taskIndex = this.taskIndex;

        if (currentInput === undefined && value === undefined) {
            //threads.start(() => {
            storage.updateTaskDetail(values, true);
            //  });
        }
        //log('save suc');
    },

    show(parent) {
        return ui.inflate(
            <frame id="current" bg={"#F6F6F6"}>
                <frame textColor="#333333" bg="#f6f6f6" height={this.dp(40)} marginTop="0" paddingTop={this.dp(80)} paddingBottom={this.dp(80)} h="auto">
                    <img id="back" gravity="center" layout_gravity="center|left" w={"15dp"} h={"15dp"} marginLeft="12dp" src={"file://img/back.png"} />
                    <text id="title" textColor="#333333" textStyle="bold" gravity="center">任务设置</text>
                </frame>

                <ScrollView id="contain" height={this.dp(1.20)} marginTop={this.dp(18)} paddingTop={0}>
                    <vertical id="containInner" paddingTop="0dp">
                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="12dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <text padding="12dp" textSize="16dp" lineSpacingExtra="6dp" text="本软件仅用于个人自动化学习及测试，请勿用于其他用途！" />
                            </card>
                        </vertical>
                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="12dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <vertical>
                                    <text textStyle="bold" textSize={'18dp'} textColor="#333333" marginLeft={'12dp'} marginTop="8dp" text={"任务类型"} />
                                    <progressbar marginTop={'8dp'} progressTint="#f6f6f6" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="任务类型:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_is_city" entries={'一键营销|同城营销'} />
                                    </horizontal>
                                </vertical>
                            </card>
                        </vertical>
                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="8dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <vertical>
                                    <text textStyle="bold" marginLeft="12dp" textSize={'18dp'} textColor="#333333" marginTop="8dp" text={"视频规则"} />
                                    <progressbar marginTop={'8dp'} progressTint="#dedede" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    <horizontal padding="12dp 0">
                                        <text w={'54dp'} textColor="black" text="关键词:" />
                                        <input w={'*'} id="videoRule_contain" textSize={'16dp'} textSizeHint="16dp" text="" hint="多个关键词使用逗号隔开，叠加关键词使用“+”" />
                                    </horizontal>


                                    <horizontal padding="12dp 0">
                                        <text w={'54dp'} textColor="black" text="不包含:" />
                                        <input w={'*'} id="videoRule_no_contain" textSize={'16dp'} textSizeHint="16dp" text="" hint="多个关键词使用逗号隔开，叠加关键词使用“+”" />
                                    </horizontal>

                                    {/* <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="点赞范围:" />
                                        <input layout_weight={6} id="videoRule_min_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小点赞数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="videoRule_max_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大点赞数" />
                                    </horizontal>

                                    <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="评论范围:" />
                                        <input layout_weight={6} id="videoRule_min_comment" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小评论数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="videoRule_max_comment" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大评论数" />
                                    </horizontal>

                                    <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="收藏范围:" />
                                        <input layout_weight={6} id="videoRule_min_collect" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小收藏数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="videoRule_max_collect" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大收藏数" />
                                    </horizontal>

                                    <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="分享范围:" />
                                        <input layout_weight={6} id="videoRule_min_share" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小分享数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="videoRule_max_share" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大分享数" />
                                    </horizontal> */}
                                </vertical>
                            </card>
                        </vertical>

                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="8dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <vertical>
                                    <text textSize={'18dp'} textColor="#333333" textStyle="bold" marginLeft={'12dp'} marginTop="12dp" text={"博主规则（视频作者）"} />
                                    <progressbar marginTop={'8dp'} progressTint="#dedede" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="年龄范围:" />
                                        <input layout_weight={6} id="talentRule_min_age" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小年龄" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="talentRule_max_age" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大年龄" />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="性别选项:" />
                                        <horizontal id="talentRule_gender">
                                            <checkbox id="talentRule_gender_1" text="男" />
                                            <checkbox id="talentRule_gender_2" text="女" />
                                            <checkbox id="talentRule_gender_3" text="未知" />
                                        </horizontal>
                                    </horizontal>

                                    {/* <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'60dp'} textColor="black" text="简介关键词:" />
                                        <input w={'*'} id="talentRule_contain" textSize={'16dp'} textSizeHint="16dp" lines="2" text="" hint="多个关键词使用逗号隔开，叠加关键词使用“+”" />
                                    </horizontal>

                                    <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'60dp'} textColor="black" text="简介不包含:" />
                                        <input w={'*'} id="talentRule_no_contain" textSize={'16dp'} textSizeHint="16dp" lines="2" text="" hint="多个关键词使用逗号隔开，叠加关键词使用“+”" />
                                    </horizontal> */}

                                    {/* <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="获赞范围:" />
                                        <input layout_weight={6} id="talentRule_min_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小获赞数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="talentRule_max_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大获赞数" />
                                    </horizontal> */}

                                    {/* <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="关注范围:" />
                                        <input layout_weight={6} id="talentRule_min_focus" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小关注数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="talentRule_max_focus" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大关注数" />
                                    </horizontal> */}

                                    {/* <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="粉丝范围:" />
                                        <input layout_weight={6} id="talentRule_min_fans" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小粉丝数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="talentRule_max_fans" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大粉丝数" />
                                    </horizontal> */}

                                    {/* <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="作品范围:" />
                                        <input layout_weight={6} id="talentRule_min_works" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小作品数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="talentRule_max_works" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大作品数" />
                                    </horizontal> */}

                                    {/* <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="IP｜省份:" />
                                        <input layout_weight={6} id="talentRule_ip" textSize={'16dp'} textSizeHint="16dp" text="" hint="多个省份逗号隔开，如：湖北，湖南" />
                                    </horizontal> */}

                                    {/* <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="其他选项:" />
                                        <vertical>
                                            <checkbox id="talentRule_open_window" text="已开通橱窗" />
                                            <checkbox id="talentRule_is_tuangou" text="已开通团购" />
                                            <checkbox id="talentRule_is_person" text="企业/机构号" />
                                        </vertical>
                                    </horizontal> */}
                                </vertical>
                            </card>
                        </vertical>
                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="8dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <vertical>
                                    <text textSize={'18dp'} textColor="#333333" textStyle="bold" marginLeft={'12dp'} marginTop="12dp" text={"评论规则（评论区）"} />
                                    <progressbar marginTop={'8dp'} progressTint="#dedede" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    <horizontal padding="12dp 0">
                                        <text w={'54dp'} textColor="black" text="关键词:" />
                                        <input w={'*'} id="commentRule_contain" textSize={'16dp'} textSizeHint="16dp" lines="2" text="" hint="评论关键词，多个使用逗号隔开" />
                                    </horizontal>

                                    {/* <horizontal padding="12dp 0">
                                        <text w={'54dp'} textColor="black" text="不包含:" />
                                        <input w={'*'} id="commentRule_no_contain" textSize={'16dp'} textSizeHint="16dp" lines="2" text="" hint="评论关键词，多个使用逗号隔开" />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="评论长度:" />
                                        <input layout_weight={6} id="commentRule_min_comment" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小长度" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="commentRule_max_comment" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大长度" />
                                    </horizontal> */}

                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="点赞范围:" />
                                        <input layout_weight={6} id="commentRule_min_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小点赞" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="commentRule_max_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大点赞" />
                                    </horizontal>

                                    {/* <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="IP｜省份:" />
                                        <input layout_weight={6} id="commentRule_ip" textSize={'16dp'} textSizeHint="16dp" text="" hint="多个省份逗号隔开，如：湖北，湖南" />
                                    </horizontal> */}
                                </vertical>
                            </card>
                        </vertical>

                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="8dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <vertical>
                                    <text textSize={'18dp'} textStyle="bold" textColor="#333333" marginLeft={'12dp'} marginTop="12dp" text={"用户规则（评论视频的用户）"} />
                                    <progressbar marginTop={'12dp'} progressTint="#dedede" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="年龄范围:" />
                                        <input layout_weight={6} id="userRule_min_age" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小年龄" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="userRule_max_age" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大年龄" />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="性别选项:" />
                                        <horizontal id="userRule_gender">
                                            <checkbox id="userRule_gender_1" text="男" />
                                            <checkbox id="userRule_gender_2" text="女" />
                                            <checkbox id="userRule_gender_3" text="未知" />
                                        </horizontal>
                                    </horizontal>

                                    {/* <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="获赞范围:" />
                                        <input layout_weight={6} id="userRule_min_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小获赞数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="userRule_max_zan" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大获赞数" />
                                    </horizontal>

                                    <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="关注范围:" />
                                        <input layout_weight={6} id="userRule_min_focus" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小关注数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="userRule_max_focus" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大关注数" />
                                    </horizontal>

                                    <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="粉丝范围:" />
                                        <input layout_weight={6} id="userRule_min_fans" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小粉丝数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="userRule_max_fans" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大粉丝数" />
                                    </horizontal>

                                    <horizontal visibility={'gone'} padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="作品范围:" />
                                        <input layout_weight={6} id="userRule_min_works" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最小作品数" />
                                        <text text={'-'} />
                                        <input layout_weight={6} id="userRule_max_works" inputType="number" textSize={'16dp'} textSizeHint="16dp" text="" hint="最大作品数" />
                                    </horizontal> */}

                                    {/* <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="IP｜省份:" />
                                        <input layout_weight={6} id="userRule_ip" textSize={'16dp'} textSizeHint="16dp" text="" hint="多个省份逗号隔开，如：湖北，湖南" />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="其他选项:" />
                                        <vertical>
                                            <checkbox id="userRule_open_window" text="已开通橱窗" />
                                            <checkbox id="userRule_is_tuangou" text="已开通团购" />
                                            <checkbox id="userRule_is_person" text="企业/机构号" />
                                        </vertical>
                                    </horizontal> */}
                                </vertical>
                            </card>
                        </vertical>

                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="8dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <vertical>
                                    <text textStyle="bold" textColor="#333333" textSize={'18dp'} marginLeft={'12dp'} marginTop="12dp" text={"任务规则"} />
                                    <progressbar marginTop={'8dp'} progressTint="#dedede" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    {/* <horizontal id="taskRule_distance_box" visibility="gone" padding="12dp 0">
                                        <text w={'72dp'} textColor="black" text="同城距离:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_distance" entries={'不限|3公里内|5公里内|10公里内|20公里内|30公里内|50公里内'} />
                                    </horizontal> */}

                                    <horizontal padding="12dp 0">
                                        <text w={'86dp'} textColor="black" text="刷视频频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_video_fre" entries={'低|中低|中|中高|高|超高'} />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="#ff3333" text="评论视频频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_comment_video_fre" entries={'不评论|低|中低|中|中高|高'} />
                                    </horizontal>

                                    {/* <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="#ff3333" text="回复评论频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_comment_back_fre" entries={'不评论|低|中低|中|中高|高'} />
                                    </horizontal> */}

                                    <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="black" text="点赞视频频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_zan_video_fre" entries={'不点赞|超低|低|中低|中|中高|高|超高'} />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="black" text="点赞评论频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_zan_comment_fre" entries={'不点赞|超低|低|中低|中|中高|高|超高'} />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="#33ff00" text="私信博主频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_private_msg_author_fre" entries={'不私信|低|中低|中|中高|高'} />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="#33ff00" text="私信用户频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_private_msg_fre" entries={'不私信|低|中低|中|中高|高'} />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="#3333ff" text="关注博主频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_focus_author_fre" entries={'不关注|低|中低|中|中高|高'} />
                                    </horizontal>

                                    <horizontal padding="12dp 0">
                                        <text w={'102dp'} textColor="#3333ff" text="关注用户频率:" />
                                        <spinner spinnerMode={'dialog'} id="taskRule_focus_fre" entries={'不关注|低|中低|中|中高|高'} />
                                    </horizontal>
                                </vertical>
                            </card>
                        </vertical>

                        <vertical marginLeft="12dp" marginRight="12dp" marginTop="8dp">
                            <card w="*" cardCornerRadius="6dp" margin="1dp">
                                <vertical>
                                    <text textStyle="bold" textColor="#333333" textSize={'18dp'} marginLeft={'12dp'} marginTop="12dp" text={"运行时段"} />
                                    <progressbar marginTop={'8dp'} progressTint="#dedede" id="progress" height={"1dp"} progress="100" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                                    <horizontal padding="4dp 0">
                                        <vertical id="taskRule_time">
                                            <horizontal>
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_0" text="0点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_1" text="1点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_2" text="2点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_3" text="3点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_4" text="4点" />
                                            </horizontal>

                                            <horizontal>
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_5" text="5点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_6" text="6点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_7" text="7点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_8" text="8点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_9" text="9点" />
                                            </horizontal>

                                            <horizontal>
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_10" text="10点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_11" text="11点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_12" text="12点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_13" text="13点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_14" text="14点" />
                                            </horizontal>

                                            <horizontal>
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_15" text="15点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_16" text="16点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_17" text="17点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_18" text="18点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_19" text="19点" />
                                            </horizontal>

                                            <horizontal>
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_20" text="20点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_21" text="21点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_22" text="22点" />
                                                <checkbox textSize="14dp" layout_weight="1" w={this.ldp(5, 38)} id="taskRule_time_23" text="23点" />
                                                <text layout_weight="1" w={this.ldp(5, 38)} />
                                            </horizontal>
                                        </vertical>
                                    </horizontal>
                                </vertical>
                            </card>
                        </vertical>
                        <card w="*" cardCornerRadius="6dp" marginLeft="12dp" marginTop="8dp" marginRight="12dp">
                            <button id='add' bg="#2E78FC" style="Widget.AppCompat.Button.Colored" text="确认" />
                        </card>
                    </vertical>
                </ScrollView>
            </frame >
            , parent);
    }
}

module.exports = TaskDetail;
