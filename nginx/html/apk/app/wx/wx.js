const cStorage = require('../../common/storage.js');
let Wx = {
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
        //华为
        let tags = textContains('微信').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
        }).find();

        //小米
        if (!tags || !tags[0]) {
            tags = descContains('微信').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < device.height;
            }).find();
        }

        if (tags.length - 1 < index) {
            return false;
        }

        this.click(tags[index]);
        this.sleep(7000);
        return true;
    },

    log() {
        let str = [];
        for (let i in arguments) {
            str.push(arguments[i]);
        }
        if (str.length === 1) {
            str = " " + str[0] + "\n";
        }

        console.log(str);
    },

    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }
        while (i--) {
            back();
            if (!time) {
                this.sleep(300 + Math.random() * 400);
                continue;
            }

            if (randTime) {
                this.sleep(time + randTime * Math.random());
                continue;
            }
            this.sleep(time);
        }
        this.log('back ' + i);
    },

    toast(msg, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }

        //toast(msg);
        this.log(msg);
        if (time) {
            this.sleep(time + randomTime * Math.random());
        }
    },

    showToast(msg) {
        toast(msg);
        log(msg);
    },

    backApp() {
        if (cStorage.getPackage() !== 'org.autojs.autoxjs.v6') {
            launch(cStorage.getPackage());
        }
    },

    stopApp() {
        if (app.openAppSetting('com.tencent.mm')) {
            this.sleep(2000);
            let stopTag = text('结束运行').findOne(2000) || text('强行停止').findOne(2000);
            //log('stopTag', stopTag);
            if (!stopTag) {
                return false;
            }
            let p = stopTag.bounds();
            click(p.centerX(), p.centerY());
            this.sleep(1000);
            p = text('确定').findOne(3000) || text('强行停止').findOne(3000);
            if (p) {
                p = p.bounds();
                click(p.centerX(), p.centerY());
            }

            this.sleep(5000);
            this.back();
            this.sleep(500);
            return true;
        }
        return false;
    },

    closeApp() {
        // if (android.os.Build.VERSION.RELEASE < 14 && 'JSN-AL00' === device.model) {
        //     home();
        //     this.toast('关闭抖音');
        //     this.sleep(2000);
        //     let am = context.getSystemService(context.ACTIVITY_SERVICE);
        //     am.killBackgroundProcesses('com.tencent.mm');
        //     this.sleep(2000);
        //     this.backApp();
        //     return true;
        // }

        this.stopApp();
        return true;
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

    queryContactId(number) {
        let ContactsContract = android.provider.ContactsContract;
        let cursor = context.contentResolver.query(ContactsContract.Data.CONTENT_URI, null, ContactsContract.CommonDataKinds.Phone.NUMBER + " = '" + number + "' AND "
            + ContactsContract.Data.MIMETYPE + " = '" + ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE + "'", null, null);
        if (cursor.moveToFirst()) {
            return cursor.getLong(cursor.getColumnIndex(ContactsContract.Data.RAW_CONTACT_ID));
        }
        return undefined;
    },

    deleteContact(mobile) {
        if (!mobile) {
            return false;
        }

        let contactId = this.queryContactId(mobile);
        console.log("删除联系人: id = %s, 内容 = ", contactId, mobile);
        if (contactId === undefined) {
            console.warn("失败: 联系人不存在");
            return false;
        }

        let ContactsContract = android.provider.ContactsContract;

        context.contentResolver.delete(ContactsContract.Data.CONTENT_URI,
            ContactsContract.Data.RAW_CONTACT_ID + " = " + contactId, null);
        context.contentResolver.delete(ContactsContract.RawContacts.CONTENT_URI,
            "_id = " + contactId, null);
        console.log("成功");
        return true;
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
        this.sleep(1500 + 3000 * Math.random());

        let addFTag = this.id('knx').text('添加朋友').findOnce();//添加朋友
        this.click(addFTag);
        this.sleep(2000 + 3000 * Math.random());

        let iptTag = this.id('jcd').findOnce();//输入框（账号/手机号）
        if (!iptTag) {
            throw new Error('找不到输入框');
        }

        this.click(iptTag);
        this.sleep(2500 + 3000 * Math.random());

        iptTag = this.id('cd7').clickable(true).findOnce();
        if (!iptTag) {
            throw new Error('找不到输入框');
        }

        iptTag.setText(mobile);
        this.sleep(2000 + 3000 * Math.random());

        searchTag = this.id('kms').findOnce();
        if (!searchTag) {
            throw new Error('找不到搜索按钮');
        }

        this.click(searchTag);
        this.sleep(3000 + 3000 * Math.random());

        //是不是不存在
        if (this.id('bmp').text('该用户不存在').findOnce()) {
            this.log('该用户不存在', mobile);
            this.back(2, 800 + 3000 * Math.random());
            return 1;
        }

        //已经添加过的
        if (this.id('khj').text('发消息').findOnce()) {
            this.back(3, 800 + 3000 * Math.random());
            return 2;
        }

        //添加到通讯录
        let addTag = this.id('khj').text('添加到通讯录').findOnce();
        if (!addTag) {
            throw new Error('找不到“添加到通讯录"');
        }

        this.click(addTag);
        this.sleep(3500 + 2000 * Math.random());

        sendTextTag = this.id('j0w').findOnce();
        if (!sendTextTag) {
            throw new Error('找不到发送申请内容2');
        }
        this.click(sendTextTag);
        sendTextTag.setText(sendText);
        this.sleep(500 + 2000 * Math.random());

        //备注
        remarkTag = this.id('j0z').findOnce();
        if (!remarkTag) {
            throw new Error('找不到备注');
        }

        this.click(remarkTag);
        this.sleep(1000 + 2000 * Math.random());
        remarkTag = this.id('j0z').findOnce();
        remarkTag.setText(remarkTag.text() + '_' + mobile);

        this.sleep(500 + 2000 * Math.random());

        let submitTag = this.id('e9q').findOnce();
        if (!submitTag) {
            throw new Error('找不到确认按钮');
        }
        submitTag.click();
        this.sleep(5000 + 2000 + Math.random());

        if (!this.id('khj').text('添加到通讯录').findOnce()) {
            throw new Error('加好友可能异常');//可能是网络卡顿导致的 添加好友之后的页面没有加载出来
        }

        this.sleep(1500 + 3000 * Math.random());
        this.back(3, 800 + 2000 * Math.random());
        return 2;
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
    addTxlFriend(sendText, inc, maxNum) {
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
        this.sleep(1500 + Math.random() * 2000);

        let addFriendTag = this.id('knx').text('添加朋友').findOnce();//添加朋友
        if (!addFriendTag) {
            throw new Error('找不到添加朋友');
        }

        this.click(addFriendTag);
        this.sleep(2000 + Math.random() * 2000);

        let contactTag = id('android:id/title').text('手机联系人').findOnce();//手机联系人
        if (!contactTag) {
            throw new Error('找不到通讯录');
        }

        this.click(contactTag);
        this.sleep(2000 + Math.random() * 2000);

        //上传通讯录
        let tag = this.id('jdf').text('上传通讯录').findOnce();
        if (tag) {
            tag.click();
            this.sleep(5000 + 2000 * Math.random());

            let sureTag = this.id('guw').text('确定').findOnce();
            sureTag.click();
        }

        //授权
        tag = this.id('permission_allow_button').text('允许').findOnce();
        if (tag) {
            tag.click();
            this.sleep(5000 + 2000 * Math.random());
        }

        //提示： 看看手机通讯录里面谁已开通账号？
        tag = this.id('guw').text('确定').findOnce();
        if (tag) {
            tag.click();
            this.sleep(5000 + 2000 * Math.random());
        }

        //先返回，再进入
        this.back(1, 2000 + 2000 * Math.random());
        contactTag = id('android:id/title').text('手机联系人').findOnce();//添加朋友
        if (!contactTag) {
            throw new Error('找不到通讯录');
        }

        this.click(contactTag);
        this.sleep(5000 + 2000 * Math.random());
        let total = 0;

        let arr = [];
        let rp = 0;
        //开始加好友的逻辑
        while (true) {
            let containersTag = className('android.widget.LinearLayout').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
            }).find();

            arr.push(JSON.stringify(contactTag));
            if (arr.length >= 2) {
                arr.shift();
            }

            if (arr[0] === arr[1]) {
                rp++;
                if (rp >= 3) {
                    this.back(2, 800 + 2000 * Math.random());
                    return true;
                }
            } else {
                rp = 0;
            }

            for (let i in containersTag) {
                if (isNaN(i)) {
                    continue;
                }

                let tag = containersTag[i].children().findOne(this.id('efh'));
                if (tag && tag.text() === '已添加') {
                    continue;
                }

                tag = containersTag[i].children().findOne(this.id('eff'));//昵称
                if (!tag) {
                    continue;
                }

                let tmp = tag.text().split('@tel:');
                let mobile = tmp[1];

                //遇到可以操作的
                let parentTag = containersTag[i].children().findOne(this.id('efc'));
                if (!parentTag) {
                    continue;
                }
                parentTag.click();
                this.sleep(2500);

                //开始设置加好友内容
                let sendTextTag = this.id('j0w').findOnce();
                if (!sendTextTag) {
                    throw new Error('找不到发送申请内容');
                }
                this.click(sendTextTag);
                this.sleep(1000 + 2000 * Math.random());

                sendTextTag = this.id('j0w').findOnce();
                if (!sendTextTag) {
                    throw new Error('找不到发送申请内容2');
                }
                sendTextTag.setText(sendText);
                this.sleep(500 + 2000 * Math.random());

                let submitTag = this.id('e9q').findOnce();
                if (!submitTag) {
                    throw new Error('找不到确认按钮');
                }
                submitTag.click();
                this.sleep(5000 + 2000 + Math.random());

                if (!this.id('khj').text('添加到通讯录').findOnce()) {
                    throw new Error('加好友可能异常');//可能是网络卡顿导致的 添加好友之后的页面没有加载出来
                }
                total = inc(mobile);//增加添加成功的次数
                this.back(1, 800 + 2000 * Math.random());
                if (total >= maxNum) {
                    break;
                }
            }

            if (total >= maxNum) {
                break;
            }

            this.swipe(0, 0.5);
            this.log('滑动');
            this.sleep(2000 + Math.random() * 1000);
        }

        this.sleep(1500);
        this.back(2, 800);
        if (total >= maxNum) {
            return true;
        }
    }
}

module.exports = Wx;
