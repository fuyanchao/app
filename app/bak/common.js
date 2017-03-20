//2015.5.12

//iphone4不做一屏兼容，内容高度拉伸到与iphone5，默认false
var scrollIphone4=false;

//-------------------------------------------------------定义当前站点URL，分享功能会调用到
var siteUrl='http://t.buzzreader.cn/common/iphone/';

//-------------------------------------------------------微信公众号授权
var	wxAppId='wx7cdae278cdb40e02';//客户公众号的appid
var wxKey='dsglgj21csi1';//老古给的key
var wxContent={
	link:siteUrl,
	image:siteUrl+"images/share.jpg",
	pic:siteUrl+"images/share.jpg",
	title:'分享给朋友的标题文字',
	friend:'分享给朋友的内容文字',
	timeline:'分享到朋友圈的内容文字',
	weibo:'分享到新浪微博的内容文字'
};
var wxSigned=false;
if(os.weixin){
	document.write('<script type="text/javascript" src="js/base/jweixin.js"></script>');
	weixin_sign();//微信公众号认证
}//end if

//判断是否处于微信内置浏览器
var isWeixin=detectWeixin();
//判断是否处于微博内置浏览器
var isWeibo=detectWeibo();
//是否是iphone6 plus
var isIphone6Plus=os.ios && screen.width==414 && screen.height==736 && window.devicePixelRatio==3;
//是否是iphone6
var isIphone6=os.ios && screen.width==375 && screen.height==667;
//是否是iphone5
var isIphone5=os.ios && screen.width==320 && screen.height==568;
//是否是iphone4
var isIphone4=os.ios && screen.width==320 && screen.height==480;
//是否是16:9标准三星屏（有物理按键的标准16:9屏，不是的话就是SONY坑爹屏）
var isSamsung = os.android && ( (screen.width==480 && screen.height==854) || (screen.width >= 540 && screen.width/screen.height==0.5625) );
//是否是安卓1080P、2K、4K高清屏（有物理按键的标准16:9屏）
var isFullHD=isSamsung && screen.width>=1080 && window.devicePixelRatio==3;

//loading浮层
var loadBox=$('#loadBox');

//翻转提示浮层
var turnBox;

//主结构
var htmlBox=$('body');
var articleBox=$('article');

//分享
var shareBtn=$('a.btnShare,#btnShare');
var shareBox=$('#shareBox');

$(document).ready(function(e) {	
	
	//输入框
	var inputBox=$('input[type=text],input[type=tel],textarea');
	
	init();
	
	function init(){
		window_resize();
		$(window).on('resize',window_resize);//自适应窗口大小
		$(window).on('orientationchange',window_orientationchange);//横屏提示
		if(scrollIphone4 && isIphone4){
			if(os.weixin) articleBox.css({height:'121.2%'});
			else articleBox.css({height:'123.6%'});
		}//end if
		else $(document).on('touchmove',noEvent);//禁止页面上下滑动
		if(shareBtn.length>0){
			if(os.weixin){
				if(shareBox.length<1) shareBox=$('<aside class="shareBox"><img src="images/common/share.png"></aside>').appendTo(htmlBox);
				shareBtn.on('touchend',shareBtn_click);
			}//end if
			else if(!os.weibo) wb_share(shareBtn);
		}//end if
		//安卓输入法改变窗体高度，缩回后窗体高度无法及时弹回的BUG解决方案
		if(os.android && inputBox.length>0){
			inputBox.on('focus blur',input_resize);
			$(window).on('resize',input_resize);
		}//end if
	}//end func
	
	function window_resize(e){//自适应窗口大小
		if($(window).width()<$(window).height())
		console.log('window size:'+$(window).width()+'/'+$(window).height());
	}//end if
	
	//遇到有输入框的页面，在安卓下，打开输入法会直接改变窗体高度，则必须对输入框所在内容容器进行高度刷新，好让输入法关闭后内容容器高度回到正常
	function input_resize(e){
		articleBox.css({height:$(window).height()});
	}//end if
	
	function window_orientationchange(e){//横屏提示
		if(e.orientation=='landscape') turnBox=$('<aside class="turnBox"><img src="images/common/turn.png" class="turn"><p>请将手机调至竖屏状态，获得最佳浏览体验！</p></aside>').appendTo(htmlBox);
		else turnBox.remove();
	}//end func
	
	function shareBtn_click(e){
		shareBox.show().one('touchend',function(e){
			$(this).hide();
		});
	}//end func

});//end docuemnt ready

//--------------------------------微信分享设置
function weixin_sign(){
	var localUrl = encodeURIComponent(window.location.href);
	$.getJSON("http://s.gumutianqi.com/jssdk/get_sign?callback=?&key="+wxKey+"&url="+ localUrl, function(data){
		if(data  && data.errcode == "0") {
			wx.config({
		        debug: false,
		        appId: wxAppId,
		        timestamp: data.result.timestamp,
		        nonceStr: data.result.noncestr,
		        signature: data.result.signature,
		        jsApiList: [
		            'checkJsApi',
		            'onMenuShareTimeline',
		            'onMenuShareAppMessage',
		            'onMenuShareQQ',
		            'onMenuShareWeibo',
		            'hideMenuItems',
		            'showMenuItems',
		            'hideAllNonBaseMenuItem',
		            'showAllNonBaseMenuItem',
		            'translateVoice',
		            'startRecord',
		            'stopRecord',
		            'onRecordEnd',
		            'playVoice',
		            'pauseVoice',
		            'stopVoice',
		            'uploadVoice',
		            'downloadVoice',
		            'chooseImage',
		            'previewImage',
		            'uploadImage',
		            'downloadImage',
		            'getNetworkType',
		            'openLocation',
		            'getLocation',
		            'hideOptionMenu',
		            'showOptionMenu',
		            'closeWindow',
		            'scanQRCode',
		            'chooseWXPay',
		            'openProductSpecificView',
		            'addCard',
		            'chooseCard',
		            'openCard'
		        ]
			});//end wx.config
			wxSigned=true;//通过微信新SDK验证
			wx.ready(function(){
				wx.showOptionMenu();//用微信“扫一扫”打开，optionMenu是off状态，默认开启
				wx_share();
			});//end wx.ready
		}//end if(data)
	});//end ajax
}//end func

function wx_share(content){
	if(wxSigned){
		if(content){
			wxContent.link=content.link!=null?content.link:wxContent.link;
			wxContent.image=content.image!=null?content.image:wxContent.image;
			wxContent.title=content.title!=null?content.title:wxContent.title;
			wxContent.friend=content.friend!=null?content.friend:wxContent.friend;
			wxContent.timeline=content.timeline!=null?content.timeline:wxContent.timeline;
		}//end if
		wx.onMenuShareTimeline({
			title: wxContent.timeline, // 分享标题
			link: wxContent.link, // 分享链接
			imgUrl: wxContent.image, // 分享图标
			success: function () { 
				// 用户确认分享后执行的回调函数
				monitorAdd({label:'分享到朋友圈'});
			},
			cancel: function () { 
				// 用户取消分享后执行的回调函数
			}
		});
		wx.onMenuShareAppMessage({
			title: wxContent.title, // 分享标题
			desc: wxContent.friend, // 分享描述
			link: wxContent.link, // 分享链接
			imgUrl: wxContent.image, // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function () { 
				// 用户确认分享后执行的回调函数
				monitorAdd({label:'分享给朋友'});
			},
			cancel: function () { 
				// 用户取消分享后执行的回调函数
			}
		});
	}//end if
	else setTimeout(wx_share,250,content);
}//end func

//--------------------------------新浪微博分享
function wb_share(btn) {
    if (btn && btn.length > 0){
		btn.each(function(i) {
           wbShare({ obj: $(this), url: wxContent.link, text: wxContent.weibo, image: wxContent.pic }); 
        });
	}//end if
}//end func

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
			if($.type(_img) === "string") imgHtml+=_img;
			else for(var i=0; i<_img.length; i++){
				imgHtml+=_img[i];
				if(i<_img.length-1) imgHtml+='||'
			}//end for
			imgHtml+='&searchPic=false';
		}//end for
		_this.attr({target:'_blank',href:'http://service.weibo.com/share/share.php?url=' + _url + '&title=' + _txt + imgHtml });
	}//end if
}//end func

//--------------------------------判断是否处于微信内置浏览器
function detectWeixin(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)=="micromessenger") return true;
	else return false;
}//end func

//--------------------------------判断是否处于微博内置浏览器
function detectWeibo(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/weibo/i)=="weibo") return true;
	else return false;
}//end func

//--------------------------------iPhone4恢复一屏锁定
function unscrollIphone4(){
	scrollIphone4=false;
	$(document).on('touchmove',noEvent);
	articleBox.css({height:'100%'});
}//end func
	
//-------------------------------新增测试版提示信息
function addSignBar(text){
	$('#signBar').remove();
    var sign=$('<div id="signBar"></div>').appendTo('body');
	var text=$('<span></span>').html(text).appendTo(sign);
}//end func

function removeSignBar(){
	$('#signBar').remove();
}//end func

//--------------------------------公共函数
	
//简易版popOn
function popOn(option){
	var _obj=option.obj;
	var _text=option.text;
	var _callback=option.callback;
	var _remove=option.remove;
	var _closeEvent=option.closeEvent||'touchend';
	var _close;
	if(_obj){
		if(_text) _obj.find('.text').html(_text);
		_obj.show();
		_close=_obj.find('a.close');
		if(_close.length>0) _close.one(_closeEvent,obj_close);
		else _obj.one(_closeEvent,obj_close);
	}//end if
	function obj_close(e){
		if(_close.length>0) _close.off();
		else _obj.off();
		if(_remove) _obj.remove();
		else _obj.hide();
		if(_callback) _callback();
	}//end func
}//end func

//取代jquery的fadeIn
function fadeIn(obj,dur,callback){
	if(obj){
		dur=dur||500;
		obj.show().css({opacity:0}).transition({opacity:1},dur,function(){
			if(callback) callback();
		});
	}//end if
}//end func

//取代jquery的fadeOut
function fadeOut(obj,dur,callback){
	if(obj){
		dur=dur||500;
		obj.transition({opacity:0},dur,function(){
			$(this).hide();
			if(callback) callback();
		});
	}//end if
}//end func

function alertFunc(text,callback){
	var box=$('<aside class="alertBox"><div><p class="text"></p><p class="btn"><a class="close">确认</a></p></div></aside>').appendTo(htmlBox);
	popOn({obj:box,text:text,callback:callback,remove:true,closeEvent:'click'});
}//end func


//获得http url参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]); return null;
}//end func

//获得http url文件名末尾的数字
function getQueryId(len){
	len=len!=null?len:1;
	var path=window.location.pathname.split('/');
	var file=path[path.length-1];
	var str=file.split('.');
	return parseInt(str[0].substr(str[0].length-len));
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
			console.log('images load complete');
			loader=null;
			loadBox.hide();
			if(callback) callback(src);
		});			
		loader.start();	
	}//end if
}//end func	

//开启网页上下滑动，默认是静止的
function pageScrollOn() {
	$(document).off('touchmove',noEvent);
	if(isIphone4){
		if(os.weixin) articleBox.css({height:'121.2%'});
		else articleBox.css({height:'123.6%'});
	}//end if
}//end func

//禁止网页上下滑动
function pageScrollOff() {
	$(document).on('touchmove',noEvent);
}//end func

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

//取消默认事件
function noEvent(e){
	e.preventDefault();
}//end func	

//常用正则
function checkStr(str,type){
	type=type||0;
	switch(type){
		case 0:
			var reg= new RegExp(/^1[3-9]\d{9}$/);//手机号码验证
		break;
		case 1:
			var reg= new RegExp(/^\d+$/);//是否为0-9的数字
		break;
		case 2:
			var reg= new RegExp(/^[a-z]+$/);//是否为小写
		break;
		case 3:
			var reg= new RegExp(/^[A-Z]+$/);//是否为大写
		break;
		case 4:
			var reg= new RegExp(/^\w+$/);//匹配由数字、26个英文字母或者下划线组成的字符串
		break;
		case 5:
			var reg= new RegExp(/^[\u0391-\uFFE5]+$/);//匹配中文
		break;
		case 6:
			var reg= new RegExp(/\w+@\w+/);//匹配EMAIL
		break;
		case 7:
			var reg= new RegExp(/^[a-zA-Z\u0391-\uFFE5]+$/);//不能包含数字和符号
		break;
		case 8:
			var reg= new RegExp(/^\d{9}$/);//，9位数字
		break;
		case 9:
			var reg= new RegExp(/^[a-zA-Z\u0391-\uFFE5]*[\w\u0391-\uFFE5]*$/);//不能以数字或符号开头
		break;
		default: 
		break;
	}//end switch
	if(reg.exec($.trim(str))) return true;
	else return false;
}//end func

//---------------------------------------常用数学函数
	
//获得范围内随机整数
function randomRange(min, max) {
	var randomNumber;
	randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
	return randomNumber;
}//end func 

//随机打乱一个数组
function randomSort(ary) {
	var len=ary.length;
	var rnd = [];
	for (var i=0; i<=len-1; i++) {
		var ran = Math.floor(Math.random()*ary.length);//从数组shu中随机选一个元素（第k个）
		rnd.push(ary[ran]);//把数组shu中选出的元素的值赋给数组myArry第i个元素；
		ary.splice(ran,1);//把数组shu中第k个元素删掉（保证下一次选的一定不会重复)
	}//end for
	for (i=0; i<=len-1; i++) ary[i]=rnd[i];
}//end func 

//随机正负
function randomPlus() {
	return Math.random()<0.5?-1:1;
}//end func 

//等比缩放
function autoSize(aryNum,aryMax){
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

//缓动函数
function ease(_now,_tar,_speed,_space){
	_speed=_speed||10;
	_space=_space||0.1;
	var _dis=_tar-_now;
	if(Math.abs(_dis)>_space) return _dis/_speed+_now;
	else return _tar;
}//end func

//角度转弧度
function toRadian(degree) {
	return degree * Math.PI / 180;
}//end func 

//弧度转角度
function toDegree(radian) {
	return radian / Math.PI * 180;
}//end func 

//获得2点之间的距离
function getDis(pos1,pos2){
	var lineX=pos2[0]-pos1[0];
	var lineY=pos2[1]-pos1[1];
	return Math.sqrt(Math.pow(Math.abs(lineX),2)+Math.pow(Math.abs(lineY),2));
}//end func 

//获得2点之间的夹角
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
}//end func

//碰撞函数，测试2个DOM对象是否碰撞
function hitTest(obj1,obj2){
	if(obj1 && obj2){
		var pos1=[obj1.offset().left+obj1.outerWidth()/2,obj1.offset().top+obj1.outerHeight()/2];
		var pos2=[obj2.offset().left+obj2.outerWidth()/2,obj2.offset().top+obj2.outerHeight()/2];
		var disX=Math.abs(pos2[0]-pos1[0]);
		var disY=Math.abs(pos2[1]-pos1[1]);
		if(disX<=obj1.outerWidth()/2+obj2.outerWidth()/2 && disY<=obj1.outerHeight()/2+obj2.outerHeight()/2) return true;
		else return false;
	}//end if
	else return false;
}//end func

//获得几位小数点
function getRound(num,n){
	n=n||2;
	var r=Math.pow(10, n);
	return Math.round(num*r)/r;
}//end func

//碰撞函数，测试1个点是否在一个区域内
function hitPoint(pt,obj){
	if(pt && obj){
		var area=[obj.offset().left,obj.offset().left+obj.width(),obj.offset().top,obj.offset().top+obj.height()];
		if(pt[0]>=area[0] && pt[0]<=area[1] && pt[1]>=area[2] && pt[1]<=area[3]) return true;
		else return false;
	}//end if
	else return false;
}//end func 

//碰撞函数，测试一个点是否在透明区域
function hitPixel(pt,size,pixel){
	if(pt && size && pixel){
		var id=pt[0]+pt[1]*size[0];
		if(pixel[id*4+3]) return true;
		else return false;
	}//end if
	else return false;
}//end func