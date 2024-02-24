let storage = require('../common/storage');
const Config = require('../config/config');
importClass(android.content.Intent);
importClass(android.widget.MediaController);
importClass(android.webkit.WebSettings);
importClass(android.media.MediaPlayer);

let Study = {
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
        let videoUrl = [
            Config.cos + "/video/%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8.mov",
            Config.cos + "/video/%E8%90%A5%E9%94%80%E8%83%BD%E5%8A%9B.mov",
            Config.cos + '/video/%E7%96%91%E9%9A%BE%E8%A7%A3%E7%AD%94.mov',
        ];

        let isPlay = [false, false, false];

        for (let i = 1; i <= 3; i++) {
            (function (i) {
                let videoView = ui['videoView-' + i];
                videoView.setVideoPath(videoUrl[i - 1]);
                //let mediaController = new MediaController(activity);
                //videoView.setMediaController(mediaController); //让videoView 和 MediaController相关联
                videoView.setFocusable(true); //让VideoView获得焦点
                videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener({
                    onPrepared: function (mp) {
                        mp.setOnInfoListener(new MediaPlayer.OnInfoListener({
                            onInfo: function (mp, what, extra) {
                                if (what == MediaPlayer.MEDIA_INFO_VIDEO_RENDERING_START) {
                                    ui['play-img-' + i].attr('visibility', 'gone');
                                    ui['play-' + i].attr('visibility', 'gone');
                                }
                                isPlay[i - 1] = true;
                                return true;
                            }
                        }));
                    }
                }));

                videoView.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
                    onCompletion: function (mp) {
                        ui['play-' + i].attr('visibility', 'visible');
                        ui['play-img-' + i].attr('visibility', 'visible');
                    }
                }));

                videoView.attr('visibility', 'visible');
                ui['play-' + i].click(() => {
                    ui['play-' + i].attr('visibility', 'gone');
                    if (isPlay[i - 1]) {
                        ui['play-img-' + i].attr('visibility', 'gone');
                    }
                    videoView.start(); //开始播放视频
                });
            })(i);
        }
    },

    show(parent) {
        return ui.inflate(
            <frame id="current">
                <text id="title" textColor="#ffffff" bg="#2E78FC" textStyle="bold" height={this.dp(40)} marginTop="0" paddingTop={this.dp(80)} paddingBottom={this.dp(80)} h="auto" gravity="center">{Config.name}入门</text>
                <vertical marginTop={this.dp(19)} w={"*"} h="auto" id="containInner">
                    <vertical w={"*"} h={this.ldp(16 / 9)}>
                        <RelativeLayout w="auto" h={'auto'} marginLeft={0} marginTop={0}>
                            <VideoView visibility="gone" w="*" h="auto" id="videoView-1" />
                            <img id="play-img-1" scaleType="fitXY" w="*" h="auto" src="file://banner/study-1.jpeg" />
                            <img id="play-1" tint="#FFFFFF" marginLeft={this.ldp(2, 60)} marginTop={this.dp(7.26, 60)} w="60dp" h="60dp" src="file://img/play.png" />
                        </RelativeLayout>
                    </vertical>
                    <vertical w={"*"} h={this.ldp(16 / 9)} marginTop="3dp" marginBottom="3dp">
                        <RelativeLayout w="auto" h={'auto'} marginLeft={0} marginTop={0}>
                            <VideoView visibility="gone" w="*" h="auto" id="videoView-2" />
                            <img id="play-img-2" scaleType="fitXY" w="*" h="auto" src="file://banner/study-2.jpeg" />
                            <img id="play-2" tint="#FFFFFF" marginLeft={this.ldp(2, 60)} marginTop={this.dp(7.26, 60)} w="60dp" h="60dp" src="file://img/play.png" />
                        </RelativeLayout>
                    </vertical>
                    <vertical w={"*"} h={this.ldp(16 / 9)}>
                        <RelativeLayout w="auto" h={'auto'} marginLeft={0} marginTop={0}>
                            <VideoView visibility="gone" w="*" h="auto" id="videoView-3" />
                            <img id="play-img-3" scaleType="fitXY" w="*" h="auto" src="file://banner/study-3.jpeg" />
                            <img id="play-3" tint="#FFFFFF" marginLeft={this.ldp(2, 60)} marginTop={this.dp(7.26, 60)} w="60dp" h="60dp" src="file://img/play.png" />
                        </RelativeLayout>
                    </vertical>
                </vertical>
            </frame>
            , parent);
    }
}

module.exports = Study;
