let wx = {
    id(name) {
        return id('com.tencent.mm:id/' + name).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
        });
    },

    sleep(time) {
        sleep(time);
    },

    click(tag, rate) {
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * rate + Math.random() * (tag.bounds().width() * p);
        let height = tag.bounds().height() * rate + Math.random() * (tag.bounds().height() * p);

        try {
            click(tag.bounds().left + width, tag.bounds().top + height);
        } catch (e) {
            this.log(e);
            try {
                click(tag.bounds().left + width, tag.bounds().top);
            } catch (e) {
                this.log(e);
                return false;
            }
        }

        this.sleep(500);
        return true;
    },

    openApp(index) {
        if (!index) {
            index = 0;
        }
        launch('com.tencent.mm');//打开抖音
        this.sleep(2000);
        let tags = id('android:id/text').text('微信').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).find();
        this.click(tags[index]);
    },

    awaitPermisson(permName) {
        importClass(android.content.pm.PackageManager);
        let perm = context.checkCallingOrSelfPermission(permName);
        while (perm != PackageManager.PERMISSION_GRANTED) {
            runtime.requestPermissions([permName]);
            this.sleep(3000);
            log('permName');
            perm = context.checkCallingOrSelfPermission(permName);
        }
        return true;
    },

    //添加手机号
    addContacts(name, phone) {
        this.awaitPermisson("android.permission.WRITE_CONTACTS");
        var a = new android.content.ContentValues();
        a.put("account_type", android.accounts.AccountManager.KEY_ACCOUNT_TYPE);
        a.put("account_name", android.accounts.AccountManager.KEY_ACCOUNT_NAME);

        var rawContactUri = context.getContentResolver().insert(android.provider.ContactsContract.RawContacts.CONTENT_URI, a);
        var rawContactId = android.content.ContentUris.parseId(rawContactUri)

        var b = new android.content.ContentValues();
        b['put(java.lang.String,java.lang.Long)']("raw_contact_id", rawContactId);
        b.put("mimetype", "vnd.android.cursor.item/name");
        b.put("data1", name);
        context.getContentResolver().insert(android.provider.ContactsContract.Data.CONTENT_URI, b);

        var c = new android.content.ContentValues();
        c['put(java.lang.String,java.lang.Long)']("raw_contact_id", rawContactId);
        c.put("mimetype", "vnd.android.cursor.item/phone_v2");
        c.put("data1", phone);
        c["put(java.lang.String,java.lang.Integer)"]("data2", 2);
        context.getContentResolver().insert(android.provider.ContactsContract.Data.CONTENT_URI, c);
    },

    //清空通讯录
    clearContacts() {
        this.awaitPermisson("android.permission.WRITE_CONTACTS");
        var ContentProviderOperation = android.content.ContentProviderOperation;
        var rawUri = android.provider.ContactsContract.Data.CONTENT_URI.buildUpon().appendQueryParameter("caller_is_syncadapter", "true").build();
        var ops = new java.util.ArrayList();
        var array = java.lang.reflect.Array.newInstance(java.lang.String, 1);
        array[0] = "-1";
        ops.add(ContentProviderOperation.newDelete(android.provider.ContactsContract.Data.CONTENT_URI).withSelection("_id>? ", array).build()) //sets deleted flag to 1
        ops.add(ContentProviderOperation.newDelete(rawUri).withSelection("_id>? ", array).build()) //erases
        context.getContentResolver().applyBatch("com.android.contacts", ops);
    },

    addFriend(mobile) {
        //进入搜索页面
        let wxTag = this.id('f2s').findOnce();//主界面tab “微信”
        if (!wxTag) {
            throw new Error('有误');
        }
        this.click(wxTag, 0.1);

        let searchTag = this.id('grs').clickable(true).findOnce();//搜索“+”按钮
        if (!searchTag) {
            throw new Error('有误');
        }

        searchTag.click();
        this.sleep(1500);

        let addFTag = this.id('knx').findOnce();//添加朋友
        this.click(addFTag);
        this.sleep(2000);

        let iptTag = this.id('jcd').findOnce();//输入框（账号/手机号）
        if (!iptTag) {
            throw new Error('找不到输入框');
        }

        this.click(iptTag);
        this.sleep(1500);

        iptTag = this.id('cd7').findOnce();
        iptTag.setText(mobile);
        this.sleep(2000);

        searchTag = this.id('kms').findOnce();
        if (!searchTag) {
            throw new Error('找不到搜索按钮');
        }

        this.click(iptTag);
        this.sleep(3000);

        //已经添加过的
        if (this.id('khj').findOnce()) {
            this.back(3, 800);
            return true;
        }

        //设置备注和标签
        let setTagTag = id('android:id/title').text('设置备注和标签').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).findOnce();
        if (!setTagTag) {
            throw new Error('找不到搜索按钮');
        }
        this.click(setTagTag);
        this.sleep(2000);

        let remarkTag = this.id('bo5').findOnce();
        if (!remarkTag) {
            throw new Error('找不到备注');
        }

        let remark = remarkTag.text();
        remarkTag.click();
        this.sleep(1000);

        remarkTag = this.id('bo5').findOnce();
        if (!remarkTag) {
            throw new Error('找不到备注');
        }
        remarkTag.setText(remark + '_' + mobile);
        this.sleep(1000);

        //保存
        let saveTag = this.id('en').text('保存').findOnce();
        if (!saveTag) {
            throw new Error('找不到备注');
        }

        saveTag.click();
        this.sleep(1500);
        this.back(3, 800);
    },

    swipe(type, sensitivity) {
        let left = Math.random() * device.width * 0.8 + device.width * 0.2;
        let bottom = device.height * 2 / 3 * sensitivity + device.height / 6 * Math.random();
        let top = device.height / 12 + device.height / 12 * Math.random();
        if (!type) {
            swipe(left, bottom, left, top, 200 + 100 * Math.random());//从下往上推，清除
            return true;
        }
        swipe(left, top, left, bottom, 200 + 100 * Math.random());//从上往下滑
    },

    //当前微信联系人总数，发送请求的内容，递增，最大添加好友数
    addTxlFriend(contacts, sendText, inc, maxNum) {
        //进入搜索页面
        let wxTag = this.id('f2s').findOnce();//主界面tab “微信”
        if (!wxTag) {
            throw new Error('有误');
        }
        this.click(wxTag, 0.1);

        let searchTag = this.id('grs').clickable(true).findOnce();//搜索“+”按钮
        if (!searchTag) {
            throw new Error('有误');
        }

        searchTag.click();
        this.sleep(1500);

        let contactTag = id('android:id/title').text('手机联系人').findOnce();//添加朋友
        if (!contactTag) {
            throw new Error('找不到通讯录');
        }

        this.click(contactTag);
        this.sleep(2000);

        //上传通讯录
        let tag = this.id('jdf').text('上传通讯录').findOnce();
        if (tag) {
            tag.click();
            this.sleep(5000);

            let sureTag = this.id('guw').text('确定').findOnce();
            sureTag.click();
        }

        //授权
        tag = this.id('permission_allow_button').text('允许').findOnce();
        if (tag) {
            tag.click();
            this.sleep(5000);
        }

        //提示： 看看手机通讯录里面谁已开通账号？
        tag = this.id('guw').text('确定').findOnce();
        if (tag) {
            tag.click();
            this.sleep(5000);
        }

        //先返回，再进入
        this.back(1, 1000);
        contactTag = id('android:id/title').text('手机联系人').findOnce();//添加朋友
        if (!contactTag) {
            throw new Error('找不到通讯录');
        }

        this.click(contactTag);
        this.sleep(5000);
        let total = 0;

        //开始加好友的逻辑
        while (true) {
            let containersTag = className('android.widget.LinearLayout').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < device.height;
            }).find();

            for (let i in containersTag) {
                let tag = containersTag[i].children().findOne(this.id('efh'));
                if (tag && tag.text() === '已添加') {
                    continue;
                }

                tag = containersTag[i].children().findOne(this.id('eff'));
                if (!tag) {
                    continue;
                }

                if (!contacts.includes(tag.text())) {
                    continue;
                }

                //遇到可以操作的
                let parentTag = containersTag[i].children().findOne(this.id('efc'));
                if (!parentTag) {
                    continue;
                }
                parentTag.click();

                //开始设置加好友内容
                let sendTextTag = this.id('j0w').findOnce();
                this.click(sendTextTag);
                this.sleep(1000);

                sendTextTag = this.id('j0w').findOnce();
                sendTextTag.setText(sendText);
                this.sleep(500);

                let submitTag = this.id('e9q').findOnce();
                if (!submitTag) {
                    throw new Error('找不到确认按钮');
                }
                submitTag.click();
                this.sleep(5000 + 2000 + Math.random());

                if (!this.id('khj').text('添加到通讯录').findOnce()) {
                    throw new Error('加好友可能异常');//可能是网络卡顿导致的 添加好友之后的页面没有加载出来
                }
                total = inc();//增加添加成功的次数
                this.back(1, 800);
                if (total >= maxNum) {
                    break;
                }
            }

            if (total >= maxNum) {
                break;
            }

            this.swipe(0, 0.5);
            this.sleep(2000 + Math.random() * 1000);
        }

        this.sleep(1500);
        this.back(2, 800);
        if (total >= maxNum) {
            return true;
        }
    }
}

// wx.addContacts('江桥-测试', '18888888888');
// wx.awaitPermisson("android.permission.WRITE_CONTACTS", 'write_contacts');

// log(text('确定').findOnce());

let storage = storages.create("com.dke.qiao");
storage.put('jq', null);
log(storage.get('jq'));
log(storage.get('jq') === null);
