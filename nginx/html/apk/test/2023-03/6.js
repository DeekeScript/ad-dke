// id('com.ss.android.ugc.aweme:id/pn1').findOne(2000).click();

function closeAlert() {
    this.log('开启线程监听弹窗');
    let k = 0;
    k++;
    if (k > 1000) {
        k = 0;
    }
    try {
        // if (text("稍后").exists()) {
        //     text("稍后").findOne(2000).click();
        // }
        // if (text("以后再说").exists()) {
        //     text("以后再说").findOne(2000).click();
        // }
        // if (text("我知道了").exists()) {
        //     text("我知道了").findOne(2000).click();
        // }
        // if (text("下次再说").exists()) {
        //     text("下次再说").findOne(2000).click();
        // }
        // if (text("满意").exists()) {
        //     let a = text("满意").clickable(true).findOne(2000);
        //     if (a) {
        //         a.click();
        //     }
        // }

        // if (text("不感兴趣").exists()) {
        //     let a = text("不感兴趣").clickable(true).findOne(2000);
        //     if (a) {
        //         a.click();
        //     }
        // }

        if (text("好的").exists()) {
            let a = text("好的").clickable(true).findOne(2000);
            if (a) {
                a.click();
            }
        }

        if (text("确定").exists()) {
            text("确定").findOne(2000).click();
        }

        if (this.id('dz7').text("取消").exists()) {
            text("确定").findOne(2000).click();
        }

        if (text("拒绝").exists()) {
            text("拒绝").findOne(2000).click();
        }

        //id('com.ss.android.ugc.aweme:id/pn1').findOne(2000).click(); 进入主页直接弹出对话框页面
        if (this.id('pn1').clickable(true).exists()) {
            //this.id('pn1').clickable(true).findOne(2000).click();
            log(this.id('pn1').clickable(true).findOne(2000).bounds().top,this.id('pn1').clickable(true).findOne(2000).bounds().left);
            log(this.id('j_1').clickable(true).findOne(2000));
        }

        //暂时取消掉
        // if (this.id('close').boundsInside(0, 0, device.width, device.height / 2).desc('关闭').exists()) {
        //     //this.id('close').boundsInside(0, 0, device.width, device.height / 2).desc('关闭').findOne(2000).click();
        // }
        this.sleep(500);
    } catch (e) {
        console.log(e);
    }

    //相当于一两分钟执行一次点击  这就要求手机亮屏时间设置为5分钟以上
    if (k % 30 === 0) {
        click(1, device.height - 1);
        device.wakeUp();
    }
}


// closeAlert();


function a(){
    log(this.id('ssq').findOne(2000).bounds().top);
    if (this.id('pn1').clickable(true).exists() && !this.id('ssq').exists()) {
        this.id('pn1').clickable(true).findOne(2000).click();//ssq是私信页面的ID  防止私信页面也被点击
    }
}

a();
