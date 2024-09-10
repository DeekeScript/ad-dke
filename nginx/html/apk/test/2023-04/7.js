// media.playMusic('file://mp3/live_score.mp3');


log(className('android.widget.EditText').clickable(true).filter((v) => {
    return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() && v.bounds().width() > 0;
}).findOnce());
