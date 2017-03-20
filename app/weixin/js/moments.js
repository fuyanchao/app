$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var windowWd=$(window).width(),windowHt=$(window).height();
	console.log('window size:'+windowWd+'/'+windowHt);
	
	//list
	var containerBox=$('.container');
	var listBox=containerBox.children('.list');
	
	//pics
	var picsBox=$('.pics');
	
	//price
	var btnMore=$('a.btnMore');
	var btnMorePanel=$('.panelMore');
	
	//comment
	var commentBox=$('aside.comment');
	var commentBg=commentBox.children('.bg');
	var commentCont=commentBox.children('.cont');
	var commentPanel=commentCont.children('.panel');
	var commentInput=commentPanel.children('input').data({value:''});
	var btnSend=$('a.btnSend');
	
	//emoji
	var emojiBox=commentCont.children('.emoji');
	var emojiFocus=emojiBox.children('div');
	var emojiShell=emojiFocus.find('ul');
	var emojiSize=20;
	var emojiBlock=Math.floor(emojiList.length/emojiSize);
	var btnEmoji=$('a.btnEmoji');
	
	
	//----------------------------------------页面初始化----------------------------------------
	iorient.init();//屏幕翻转锁定，默认锁定竖屏，横屏提示
	loadBox.show();
	iuser.init(userGetted);
//	load_handler();

	//----------------------------------------微信用户登录验证----------------------------------------	
	function userGetted(data){
		console.log('用户头像：'+data.headimage);
		console.log('用户昵称：'+data.nickname);
		load_handler();
	}//end func
	
	//----------------------------------------加载页面图片----------------------------------------
	function load_handler(){
		var loader = new PxLoader();
		loader.addImage('images/common/turn.png');
		
		loader.addCompletionListener(function() {
			console.log('页面图片加载完毕');
			init_handler();
			loader=null;
		});
		loader.start();	
	}//end func	
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		console.log('init handler');
		icom.fadeOut(loadBox,500);
		monitor_handler();
		more_handler();
		pics_handler();
		video_handler();
	}//end func
	
	//------------------------------------video
	function video_handler(){
		ivideo.on({autoplay:true,playsinline:true,poster:'images/moments/poster.jpg'});
	}//edn func
	
	//------------------------------------pic
	function pics_handler(){
		var pic=picsBox.children();
		pic.on('click',pic_click);
	}//edn func
	
	function pic_click(e){
		var id=$(this).index();
		console.log('id：'+id);
		var parent=$(this).parent();
		var pics=parent.children();
		var list=[];
		pics.each(function(i,n){
			list.push(ishare.url+$(n).data('big'));
		});
		console.log('list：'+list[id]);
		if (os.weixin) {
			wx.previewImage({
			    current: list[id], // 当前显示图片的http链接
			    urls: list // 需要预览的图片http链接列表
			});
		}
	}//edn func
	
	
	//------------------------------------more
	function more_handler(){
		emoji_handler();
		btnMore.one('touchend',btnMore_click);
	}//edn func
	
	function btnMore_click(e){
		console.log('btnMore_click');
		var id=$(this).index('a.btnMore');
		console.log('id:'+id);
		var _this=$(this);
		var panelMore=$(this).siblings('.panelMore');
		var btnPrice=panelMore.children('a.btnPrice');
		var btnComment=panelMore.children('a.btnComment');
		if(!$(this).hasClass('active')){
			btnMore.removeClass('active');
			btnMorePanel.hide();
			$(this).addClass('active');
			panelMore.css({opacity:0,x:100}).show().transition({opacity:1,x:0},250,function(){
				_this.one('touchend',btnMore_click);
				btnPrice.off().one('touchend',{id:id},btnPrice_click);
				btnComment.off().one('touchend',{id:id},btnComment_click);
			});
		}//end if
		else btnMore_close($(this));
	}//edn func
	
	function btnMore_close(_this){
		_this.off().removeClass('active');
		var panelMore=_this.siblings('.panelMore');
		var btnPrice=panelMore.children('a.btnPrice');
		var btnComment=panelMore.children('a.btnComment');
		btnPrice.off();
		btnComment.off();
		panelMore.transition({opacity:0,x:100},250,function(){
			$(this).hide();
			_this.one('touchend',btnMore_click);
		});
	}//edn func
	
	//------------------------------------price
	function btnPrice_click(e){
		console.log('btnPrice_click');
		var id=e.data.id;
		var content=$(this).parents('.content');
		var price=content.find('.comments .price');
		var span=price.children('span');
		if(!$(this).hasClass('active')){
			$(this).addClass('active');
			$(this).children('span').html('取消');
			var str=span.last().html();
			span.last().html(str+'，');
			$('<span></span>').html(nickname).appendTo(price);
		}//end if
		else{
			$(this).removeClass('active');
			$(this).children('span').html('赞');
			var str=span.eq(span.length-2).html();
			span.eq(span.length-2).html(str.substring(0,str.length-1));
			span.last().remove();
		}//end else
		var panelMore=$(this).parent();
		var btnMore=panelMore.siblings('a.btnMore');
		btnMore_close(btnMore);
	}//edn func
	
	//------------------------------------comment
	function btnComment_click(e){
		console.log('btnComment_click');
		var id=e.data.id;
		panelMore.transition({opacity:0,x:50},250,function(){
			$(this).hide();
			btnMore.one('touchend',btnMore_click);
		});
		commentInput.val('');
		btnEmoji.removeClass('btnKeyboard');
		commentBox.show();
		commentCont.css({y:commentCont.outerHeight()}).show().transition({y:emojiBox.outerHeight()},250,function(){
			commentBg.off().one('touchstart',comment_close);
			btnSend.off().one('touchend',{id:id},btnSend_click);
			btnEmoji.off().on('touchend',btnEmoji_click);
			commentInput.off().on('focus',commentInput_focus).on('blur',commentInput_blur);
		});
		var panelMore=$(this).parent();
			var btnMore=panelMore.siblings('a.btnMore');
			btnMore_close(btnMore);
	}//end func
	
	function commentInput_focus(e){
		btnEmoji.removeClass('btnKeyboard');
		commentCont.css({y:emojiBox.outerHeight()});
		if(os.ios) emojiBox.css({visibility:'hidden'});
	}//edn func
	
	function commentInput_blur(e){
		if(os.ios) emojiBox.css({visibility:'visible'});
	}//edn func
	
	function comment_close(e){
		commentBg.off();
		btnSend.off();
		btnEmoji.off();
		commentBox.hide();
		if(os.ios) commentInput.blur();
	}//end func
	
	function btnSend_click(e){
		comment_close();
		if(commentInput.val()!=''){
			var id=e.data.id;
			var shell=listBox.eq(id).find('.content .comments .comment');
			var p=$('<p></p>').appendTo(shell);
			var name=$('<span class="name"></span>').html(nickname+'：').appendTo(p);
			var str=txt_get(commentInput.val());
			var word=$('<span class="word"></span>').html(str).appendTo(p);
		}//end if
	}//end func
	
	//------------------------------------emoji
	function btnEmoji_click(e){
		if(!$(this).hasClass('btnKeyboard')){
			$(this).addClass('btnKeyboard');
			emojiFocus.focusRGoto(0,true);
			commentCont.transition({y:0},250);
		}//edn if
		else{
			$(this).removeClass('btnKeyboard');
			commentCont.transition({y:emojiBox.outerHeight()},250);
		}//edn else
		if(os.ios) commentInput.blur();
	}//edn func
	
	function emoji_handler(){
		for(var i=0; i<emojiBlock; i++){
			var li=$('<li></li>').appendTo(emojiShell);
			for(var j=0; j<emojiSize; j++){
				var id=i*emojiSize+j;
				var icon=$(emojiList[id]).data({id:id}).appendTo(li);
				icon.on('click',icon_click);
			}//edn for
			var back=$('<img>').attr({src:'images/emoji/btn_back.png'}).appendTo(li);
			back.on('touchend',emoji_back);
		}//edn for
		emojiFocus.focusR({speed:500});
		commentBox.css({opacity:1}).hide();
	}//edn func
	
	function icon_click(e){
		var id=$(this).data('id');
		console.log('emoji id:'+id);
		var val=commentInput.val();
		var emo=$(this).attr('alt');
		commentInput.val(val+'['+emo+']');
	}//end func
	
	function txt_get(str){
		var txt='';
		var arr = str.split("]");
		if(arr.length==1) txt=str;
		else{
			for (var i = 0; i < arr.length-1; i++) {
				var str1=arr[i].split("[",2);
				console.log(str1);
				txt+=str1[0];
				var img=emojiList[emoji_get(str1[1])];
				txt+=img;
			}//end for
			txt+=arr[arr.length-1];
		}//edn else
		return txt;
	}//edn func
	
	function emoji_get(str){
		var id=-1;
		for(var i=0; i<emojiLabel.length; i++){
			if(str==emojiLabel[i]){
				id=i;
				break;
			}//end if
		}//end for
		return id;
	}//edn func
	
	function emoji_back(e){
		if(commentInput.val()!=''){
			var str=commentInput.val();
			var arr = str.split("]");
			var txt='';
			if(arr.length==1) txt=str.substring(0,str.length-1);
			else if(arr[arr.length-1]==''){
				for (var i = 0; i < arr.length-1; i++) {
					if(i<arr.length-2) txt+=arr[i]+']';
					else{
						var str1=arr[i].split("[",2);
						txt+=str1[0];
					}//edn else
				}//end for
				txt+=arr[arr.length-1];
			}//edn if
			else txt=str.substring(0,str.length-1);
			commentInput.val(txt);
		}//edn if
	}//edn func
	

	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
		imonitor.add({obj:$('.pics img'),action:'click',category:'朋友圈',label:'图片'});
		imonitor.add({obj:$('a.btnMore'),action:'click',category:'朋友圈',label:'更多'});
		imonitor.add({obj:$('a.btnPrice'),action:'click',category:'朋友圈',label:'点赞'});
		imonitor.add({obj:$('a.btnComment'),action:'click',category:'朋友圈',label:'评论'});
		imonitor.add({obj:$('a.btnSend'),action:'click',category:'朋友圈',label:'发送'});
	}//end func
	
});//end ready
