/**
 * 特殊的采集过程函数集
 * 默认氧气性别识别
 * 可以通过传入selector来自定义要是别的区域和
 * 通过 {
 * 	type: 'eval',
 *	exec: 'helper.[function name].apply(this)'
 * } 调用
 */
let baiduImageRead = require('../service/baiduImageRead.js');

let helper = {
	yqGetSexByColor: function(region, color){
		let img = captureScreen();
		if(!region){
			// 默认氧气抓取
			var item = id('zone_player_name_tv').findOne().bounds();
			var region = [item.left+item.width()+20, item.top+10, 30, item.height()-20];
		}else{
			if(typeof region == 'string'){
				let vo = visibleToUser(true).id(region).findOne();
				if(vo){
					let bounds = vo.bounds();
					region = [bounds.left, bounds.top, bounds.right-bounds.left, bounds.bottom-bounds.top];
				}
			}
		}
		if(!color) color = '#ffff63bf';
		let point = images.findColor(img, color, {
			region: region,
			threshold: 20
		});
		img.recycle();
		this.data.gs_item.gender = point === null?'男':'女';
	},
	baiduOcr: function(key, id, left, width, top, fromRight){
		try{
			let img = captureScreen();
			top = top ? top : 0;

			let vo = visibleToUser(true).id(id).findOne(2000);
			if(!vo) throw new Error('找不到控件： '+id);
			let bounds = vo.bounds();
			left = fromRight ? bounds.right+left : bounds.left + left;
            let clip = images.clip(img, left, bounds.top+top, width, bounds.height());
			let level = helper._getFromStoredImgs(clip)
			if(level === false){
				level = baiduImageRead.read(images.toBase64(clip))
				helper._storeImg(clip, level);
			}
			eval("this.data."+key +'=' +level);
			clip.recycle();
			img.recycle();
            //console.log(clip);
            //files.remove(dir+"ks-level-base.png");
        }catch(e){
            console.log(e);
            console.log('图片处理失败');
            eval("this.data."+key +'=' +0);
        }
	},
	baiduOcrYM: function(key, id, left, width, top, fromRight){
		try{
			let img = captureScreen();
			top = top ? top : 0;

			let vo = visibleToUser(true).id(id).findOne(2000);
			if(!vo) throw new Error('找不到控件： '+id);
			let bounds = vo.bounds();
			left = fromRight ? bounds.right+left : bounds.left + left;
            let clip = images.clip(img, left-10, bounds.top+top-10, width+20, bounds.height()+20);
			let level = helper._getFromStoredImgs(clip)
			log('baiduOcrYM', level)
			if(level === false){
				let levelType = images.findColor(clip, '#fffc644c', {
					threshold: .8
				}) ? "s" : "";
				level = baiduImageRead.read(images.toBase64(clip));
				level = level ? level : 1;
				level = levelType+level;
				helper._storeImg(clip, level);
			}
			eval("this.data."+key +'="' +level+'"');
			// images.save(clip, "/sdcard/level.png");
			clip.recycle();
			img.recycle();
            //console.log(clip);
            //files.remove(dir+"ks-level-base.png");
        }catch(e){
            console.log(e);
            console.log('图片处理失败');
            eval("this.data."+key +'=' +0);
        }
	},
	baiduOcrHelloLevel: function(){
		try{
			let vos = visibleToUser(true).boundsInside(0, 277, device.width, 370).className('android.view.ViewGroup').find();
			if(vos.empty()) return;
			let bounds = vos.get(vos.size()-1).bounds();
			if(bounds.width()<20) return;
			let img = captureScreen();
			let clip = images.clip(img, bounds.left-20, bounds.top-20, bounds.width()+40, bounds.height()+40);
			let level = helper._getFromStoredImgs(clip)
			if(level === false){
				let level1 = baiduImageRead.readText(images.toBase64(clip));
				let level2 = '';
				if(!/.*\d$/.test(level1)) level2 = baiduImageRead.read(images.toBase64(clip));
				level = (level1?level1:'') + (level2?level2:'');
				level = level?level:'1';
				helper._storeImg(clip, level);
			}
			eval('this.data.gs_item.level="'+level+'"');
			// log(this.data)
			clip.recycle();
			img.recycle();
		}catch(e){
			console.log(e);
            console.log('图片处理失败');
		}
	},
	_storeImg(img, name){
		images.save(img, '/sdcard/dke/imgs/'+(new Date().getTime())+'_'+name+'.png');
	},
	_getFromStoredImgs: function(img){
		let _files = files.listDir("/sdcard/dke/imgs");
		files.ensureDir('/sdcard/dke/imgs/1')
		for(var i in _files){
			let limg = images.read('/sdcard/dke/imgs/'+_files[i]);
			try{
				if(findImage(limg, img, {
					threshold: 0.99
				})){
					log('stored img matched')
					limg.recycle();
					return _files[i].split('.')[0].split('_').pop();
				}
			}catch(e){}
			limg.recycle();
		}
		log('no stored img matched')
		return false;
	}
};

module.exports = helper;