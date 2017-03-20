//框架
var wrapBox=$('.wrap');//根结构
var turnBox=$('#turnBox');//翻转手机提示
var loadBox=$('#loadBox');//加载提示
var alertBox=$('#alertBox');//代替系统aler

//是否是安卓1080P屏
var isS4=os.android && screen.width==1080 && window.innerHeight>=850 && window.devicePixelRatio==3;
//是否是iphone5
var isIp5=os.ios && screen.width==320 && screen.height==568;
//是否是iphone4
var isIp4=os.ios && screen.width==320 && screen.height==480;


$(document).ready(function(e) {
	
	//弹窗
	var popBox=$('aside');
	
	//分享
	var btnShare=$('a.btnShare,#btnShare');
	var shareBox=$('#shareBox');
	
	//视频
	var videoBtn=$('a.btnVideo,#btnVideo');
	var videoBox=$('#videoBox');
	var videoClose=videoBox.children('a.close');
	
	init();

	
	function init(){
		window_resize();
		$(window).on('resize',window_resize);//屏幕大小改变的自适应
		$(document).on('touchmove',noEvent);//IOS里禁止上下滑动拖动屏幕移动
		$(window).on( "orientationchange",window_orientationchange);//横屏提示
		addEvent();
	}//end func
	
	//屏幕大小改变的自适应
	function window_resize(){
		wrapBox.css({height:$(window).height()});//根div.wrap撑满一屏
		console.log($(window).width()+'/'+$(window).height());
	}//end window_resize
	
	function window_orientationchange(e){//横屏提示
		if(e.orientation=='landscape') turnBox.show();
		else turnBox.hide();
	}//end func
	
	function addEvent(){//添加事件
		
		//弹窗
		popBox.on('click',popBox_close);
		
		//微信分享
		btnShare.on('click',btnShare_click);
		
		//-------------------视频
		if(videoBtn.length>0){
			if(os.ios) video_ios();
			else{
				videoBtn.on('click',video_android);
				videoClose.on('click',video_close);
			}//end else
		}//end if
		
	}//end func
	
	//--------弹窗
	function popBox_close(e){
		$(this).hide();
	}//end func
	
	//---------微信分享
	function btnShare_click(e){
		shareBox.show();
	}//end func
	
	//-------------------视频播放,支持优酷-------------------
	function video_ios(){
		videoBtn.each(function(i) {
            var vid=$(this).data('vid');
			if(vid && vid!=''){
				var type=$(this).data('type');
				type=type||'youku';
				if(type=='youku') var video=$('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen></iframe>').appendTo($(this));
				else{
					var video=$('<video type="video/mp4">').attr({src:vid}).appendTo($(this));
					var poster=$(this).data('poster');
					if(poster) video.attr({poster:poster});
					//if(os.iosVer==8) video.css({marginLeft:'-140%'})//ios8的video标签必须占据全屏宽度，否则VIDEO播放按钮无法居中显示
				}//end else
			}//end if
        });
		videoBox.remove();
	}//end funcs
	
	function video_android(e){
		var vid=$(this).data('vid');
		if(vid && vid!=''){
			var type=$(this).data('type');
			type=type||'youku';
			var poser=$(this).data('poser');
			var ht=$(window).width()*9/16;
			videoBox.show();
			if(type=='youku') var video=$('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen isAutoPlay="true"></iframe>').css({height:ht,marginTop:$(window).height()/2-ht/2}).prependTo(videoBox);
			else{
				var video=$('<video type="video/mp4" controls autoplay>').attr({src:vid}).css({height:ht,marginTop:$(window).height()/2-ht/2}).prependTo(videoBox);
				var poster=$(this).data('poster');
				if(poster) video.attr({poster:poster});
			}//end else
		}//end if
	}//end event
	
	function video_close(e){
		$(this).siblings().remove();
		videoBox.hide();
	}//end event
});


//--------------------------------公共函数
	
	//获得http url参数
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}//end func
	
	//带Loading的载入图片函数
	function imageLoad(src,callback){
		//载入图
		if(src){
			loadBox.show();
			var loader = new PxLoader();
			if($.type(src) === "string" && src!='') loader.addImage(src);
			else if($.type(src) === "array" && src.length>0){
				for(var i=0; i<src.length; i++){
					loader.addImage(src[i]);
				}//end for
			}//end else
			loader.addCompletionListener(function() {
				if(window.console) console.log('images load complete');
				loader=null;
				loadBox.hide();
				if(callback) callback(src);
			});			
			loader.start();	
		}//end if
	}//end func	
	
	function getSecond(t){
		var sec=Math.floor(t/1000);
		if(sec<10) sec="0"+sec;
		else sec=String(sec);
		var mil=String(t%1000);
		mil=mil.substr(0, 2);
		return sec+'.'+mil;
	}//end func 转换毫秒到字符串
	
	//打印json数据
	function jsonPrint(data){
		console.log("-----------------------------------------------------------------------------");
		for(var i=0; i<data.length; i++) objectPrint(data[i]);
		console.log("-----------------------------------------------------------------------------");
	}//end func
	
	//打印object数据
	function objectPrint(data){
		console.log("-----------------------------------------------------------------------------");
		var info="";
		for(var i in data) info+=i+":"+data[i]+"  "
		console.log(info);
		console.log("-----------------------------------------------------------------------------");
	}//end func
	
	function noEvent(e){
		e.preventDefault();
	}//end func	
	
	//--------------------------------摇一摇函数
	function shakeOn(option){
		var _delay,_hold,_max,_now,_callback;
		var _lastTime,_lastX,_lastY,_lastZ;
		if(option){
			_callback=option.callback;
			_hold=option.hold!=null?option.hold:500;
			_max=option.max!=null?option.max:5;
			_delay=option.delay!=null?option.delay:100;
		}//end option
		if(_callback) init();
		function init(){
			_hold=500;
			_max=5;
			_now=0;
			_lastTime=0;
			shakeOff();
			if(window.DeviceMotionEvent) $(window).on('devicemotion',deviceMotionHandler);
		}//end func
		function deviceMotionHandler(e) {
			var curTime = new Date().getTime();
			if ((curTime-_lastTime)>_delay) {
				var diffTime = curTime -_lastTime;
				_lastTime = curTime;
				// 获取含重力的加速度
				var acceleration = event.accelerationIncludingGravity; 
				var speed = Math.abs(acceleration.x+acceleration.y+acceleration.z-_lastX-_lastY-_lastZ)/diffTime*10000;
				if (speed >= _hold){
					_now++;
					if(_now>=_max){
						_now=0;
						_callback();
					}//end if
				}//end if
				else{
					_now--;
					_now=_now<0?0:_now;
				}//end else 
				_lastX=acceleration.x;
				_lastY=acceleration.y;
				_lastZ=acceleration.z;
			}//end if
		}//end event
	}//end func
	
	function shakeOff(){
		if (window.DeviceMotionEvent) window.removeEventListener('devicemotion');
	}//end func
	
	//微博分享
	function wbShare(option){
		var _url,_txt,_img,_this,imgHtml='';
		if(option && option.obj){
			_this=option.obj;
			_url=option.url||window.location.href;
			_txt=option.text||"";
			_img=option.image;
			_txt=encodeURIComponent(_txt);
			_url=encodeURIComponent(_url);
			if(_img && _img.length>0){
				imgHtml="&pic=";
				for(var i=0; i<_img.length; i++){
					imgHtml+=_img[i];
					if(i<_img.length-1) imgHtml+='||'
				}//end for
				imgHtml+='&searchPic=false';
			}//end for
			_this.attr({target:'_blank',"href":'http://service.weibo.com/share/share.php?url=' + _url + '&title=' + _txt  + imgHtml});
		}//end if
	}//end func
	
	//---------------------------------------数学函数
		
	function randomRange(min, max) {
		var randomNumber;
		randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		return randomNumber;
	}//end func 获得范围内随机整数
	
	function randomSort(ary) {
		var len=ary.length;
		var rnd = [];
		for (var i=0; i<=len-1; i++) {
			var ran = Math.floor(Math.random()*ary.length);//从数组shu中随机选一个元素（第k个）
			rnd.push(ary[ran]);//把数组shu中选出的元素的值赋给数组myArry第i个元素；
			ary.splice(ran,1);//把数组shu中第k个元素删掉（保证下一次选的一定不会重复)
		}//end for
		for (i=0; i<=len-1; i++) ary[i]=rnd[i];
	}//end func 随机排序一个数组
	
	function getRound(num,n){
		n=n||2;
		var r=Math.pow(10, n);
		return Math.round(num*r)/r;
	}//end func 获得几位小数点
	
	function randomPlus() {
		return Math.random()<0.5?-1:1;
	}//end func 随机正负
	
	function toRadian(degree) {
		return degree * Math.PI / 180;
	}//end func 角度转弧度

	function toDegree(radian) {
		return radian / Math.PI * 180;
	}//end func 弧度转角度	
	
	function getDis(pos1,pos2){
		var lineX=pos2[0]-pos1[0];
		var lineY=pos2[1]-pos1[1];
		return Math.sqrt(Math.pow(Math.abs(lineX),2)+Math.pow(Math.abs(lineY),2));
	}//end func 获得2点之间的距离
	
	function getDeg(pos1,pos2){
		var deg;
		if(pos1[0]==pos2[0] && pos1[1]==pos2[1]){deg=0;}
		else{
			var dis_y=pos2[1]-pos1[1];
			var dis_x=pos2[0]-pos1[0];	
			deg=Math.atan(dis_y/dis_x)*180/Math.PI;
			if (dis_x<0) {deg=180+deg;}
			else if (dis_x>=0 && dis_y<0) {deg=360+deg;}
		}//end else
		return deg;
	}//end func 获得2点之间的夹角
	
	function hitTest(obj1,obj2){
		var pos1=[obj1.offset().left+obj1.width()/2,obj1.offset().top+obj1.height()/2];
		var pos2=[obj2.offset().left+obj2.width()/2,obj2.offset().top+obj2.height()/2];

		var disX=Math.abs(pos2[0]-pos1[0]);
		var disY=Math.abs(pos2[1]-pos1[1]);
		if(disX<=obj1.width()/2+obj2.width()/2 && disY<=obj1.height()/2+obj2.height()/2) return true;
		else return false;
	}//end func 碰撞函数，测试2个DOM对象是否碰撞
	
	//等比缩放
	function mathAutoSize(aryNum,aryMax){
		var aryNow=new Array()
		var aryRate= aryNum[0]/aryNum[1];
		aryNow[0] = aryMax[0];
		aryNow[1] = Math.round(aryNow[0]/aryRate);
		if(aryNow[1]<aryMax[1]){
			aryNow[1]=aryMax[1];
			aryNow[0] = Math.round(aryNow[1]*aryRate);
		}//end if				
		return aryNow;
	}//end func

	
	//-------------------模仿:hover伪类的touch hover事件
	(function($) {	
		$.fn.extend({
			hoverOn: function() {	
				var _this=$(this);
				init();
				function init(){
					console.log('hoverOn');
					_this.on('off',this_off);
					_this.on('touchstart',this_touchstart).on('touchend',this_touchend);
				}//end func	
				function this_off(e){
					_this.off('off');
					_this.off('touchstart',this_touchstart).off('touchend',this_touchend);
				}//end func
				function this_touchstart(e){
					$(this).addClass('active');
				}//end func
				function this_touchend(e){
					$(this).removeClass('active');
				}//end func
			},//end fn
			hoverOff: function() {
				$(this).trigger('off');
			}//end fn
		});//end extend	
	})(jQuery);//闭包
	
	//-------------------安卓浏览器不支持原生requestAnimationFrame，这里做兼容性处理
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
		if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}());