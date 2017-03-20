//2016.1.21

var ishare=importShare();

(function() {
	
	//-------------------------------------------------------定义当前站点的分享设置
	ishare.url=location.href.substr(0, location.href.lastIndexOf('/')+1);
	ishare.content={
		link:ishare.url,
		image:ishare.url+(ishare.url.substr(ishare.url.length-1)=='/'?'images/share.jpg':'/images/share.jpg')+'?v='+Math.random(),
		title:$('title').html(),
		friend:'分享给朋友的内容文字',
		timeline:'分享到朋友圈的内容文字',
		other:'分享到非微信环境的内容文字'
	};
	ishare.wxId='wxebba976e487ba7d7';//微信 appid
	ishare.wxKey='dd8h3gbidsb9';//老古生成的key
	
	if(os.weixin){
		document.write('<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
		ishare.wxSign();
	}//end if
	
}());

function importShare(){
	var imonitor=window.imonitor||{};
	var share={};
	share.wxSigned=false;
	
	//-------------------------------------------------------微信SDK验证
	share.wxSign=function(){
		$.getJSON("http://s.gumutianqi.com/jssdk/get_sign?callback=?&key="+share.wxKey+"&url="+ encodeURIComponent(location.href), function(data){
			if(data  && data.errcode == "0") {
				wx.config({
					debug: false,
					appId: share.wxId,
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
				share.wxSigned=true;//通过微信新SDK验证
				wx.ready(function(){
					wx.showOptionMenu();//用微信“扫一扫”打开，optionMenu是off状态，默认开启
					share.wxShare();
				});//end wx.ready
			}//end if(data)
		});//end ajax
	}//end func
	
	//-------------------------------------------------------微信分享函数
	share.wxShare=function(){
		if(share.wxSigned){
			var sharelink = share.content.link;
	        if (localStorage.openid) {
	            sharelink = sharelink + (sharelink.indexOf('?') > 0 ? '&' : '?') + 'from_openid=' + localStorage.openid;
	        }
	        wx.onMenuShareTimeline({
	            title: share.content.timeline, // 分享标题
	            link: sharelink, // 分享链接
	            imgUrl: share.content.image, // 分享图标
	            success: function () {
	                // 用户确认分享后执行的回调函数
	                if (imonitor.add) imonitor.add({ label: '分享到朋友圈' });
	                if (share.wxShareSuccess) share.wxShareSuccess();
	            },
	            cancel: function () {
	                // 用户取消分享后执行的回调函数
	                if (share.wxShareCancel) share.wxShareCancel();
	            }
	        });
	        wx.onMenuShareAppMessage({
	            title: share.content.title, // 分享标题
	            desc: share.content.friend, // 分享描述
	            link: sharelink, // 分享链接
	            imgUrl: share.content.image, // 分享图标
	            type: 'link', // 分享类型,music、video或link，不填默认为link
	            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	            success: function () {
	                // 用户确认分享后执行的回调函数
	                if (imonitor.add) imonitor.add({ label: '分享给朋友' });
	                if (share.wxShareSuccess) share.wxShareSuccess();
	            },
	            cancel: function () {
	                // 用户取消分享后执行的回调函数
	                if (share.wxShareCancel) share.wxShareCancel();
	            }
	        });
		}//end if
		else setTimeout(share.wxShare,250);
	}//end func
	
	//-------------------------------------------------------微博站外分享函数
	share.wbShare=function(option){
		var url,txt,img,imgHtml='';
		if(option.obj) var btn=option.obj;
		else var btn=$('a.btnShareWb');
		if(option && btn.length>0){
			url=option.url||window.location.href;
			txt=option.text||"";
			img=option.image;
			txt=encodeURIComponent(txt);
			url=encodeURIComponent(url);
			if(img && img.length>0){
				imgHtml="&pic=";
				if($.type(img) === "string") imgHtml+=img;
				else for(var i=0; i<img.length; i++){
					imgHtml+=img[i];
					if(i<img.length-1) imgHtml+='||'
				}//end for
				imgHtml+='&searchPic=false';
			}//end for
			btn.attr({target:'_blank',href:'http://service.weibo.com/share/share.php?url=' + url + '&title=' + txt + imgHtml });
		}//end if
	}//end func
	
	//-------------------------------------------------------qq空间站外分享函数
	share.qqShare=function(option){
		var url,txt,img,imgHtml='';
		if(option.obj) var btn=option.obj;
		else var btn=$('a.btnShareQq');
		if(option && btn.length>0){
			url=option.url||window.location.href;
			txt=option.text||"";
			img=option.image;
			txt=encodeURIComponent(txt);
			url=encodeURIComponent(url);
			if(img && img.length>0){
				imgHtml="&pics=";
				if($.type(img) === "string") imgHtml+=img;
				else for(var i=0; i<img.length; i++){
					imgHtml+=img[i];
					if(i<img.length-1) imgHtml+='||'
				}//end for
			}//end for
			btn.attr({target:'_blank',href:'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + share.content.link + '&title=' + txt + imgHtml + '&summary='});
		}//end if
	}//end func
	
	share.btnShare=function(btn,box){
		if(btn) var shareBtn=btn;
		else var shareBtn=$('a.btnShare,#btnShare');
		if(box) var shareBox=box;
		else var shareBox=$('#shareBox');
		if(shareBtn.length>0){
			if(os.weixin){
				if(shareBox.length==0) shareBox=$('<aside class="shareBox"><img src="images/common/share.png"></aside>').appendTo($('body'));
				shareBtn.on('touchend',shareBtn_click);
			}//end if
			else{
				if(!os.weibo) share.wbShare({ obj: shareBtn, url: share.content.link, text: share.content.other, image: share.content.image });
				var btnWb=$('a.btnShareWb');
				if(btnWb.length>0) share.wbShare({ obj: btnWb, url: share.content.link, text: share.content.other, image: share.content.image });
				var btnQq=$('a.btnShareQq');
				if(btnQq.length>0) share.qqShare({ obj: btnQq, url: share.content.link, text: share.content.other, image: share.content.image });
			}//end if
		}//end if
		function shareBtn_click(e){
			shareBox.show().one('touchend',function(e){
				$(this).hide();
			});
		}//end func
	}//end func
	
	return share;
}//end import