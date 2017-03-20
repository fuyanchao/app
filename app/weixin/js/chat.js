$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var windowWd=$(window).width(),windowHt=$(window).height();
	
	//sound
	var soundList={},soundMax=0,soundLoaded=0;
	var bgmTime,bgmPlay,bgmBtn;
	
	//chat
	var chatStep=0;
	var chatSpeed=1;
	
	//interface
	var interfaceBox=$('section.interface');
	
	//chatInterface
	var chatInterface=interfaceBox.children('.chatInterface');
	var chatContainer=chatInterface.find('.cont');
	
	//inputInterface
	var inputInterface=interfaceBox.children('.inputInterface');
	
	var inputPanel=inputInterface.children('.panel');
	var inputPanelSpan=inputPanel.children('span');
	
	var inputWay=inputInterface.children('.way');
	var inputWayBtn=inputWay.children('a');
	var inputWayHand=inputWay.children('i.hand');
	
	var inputIme=inputInterface.children('.ime');
	var inputImeCon=inputIme.children();
	
	
	var inputKeyboard=inputInterface.children('.keyboard');
	var inputKeyboardHand=inputKeyboard.children('i.hand');
	var btnSend=inputKeyboard.children('a.btnSend');
	
	
	
	//----------------------------------------页面初始化----------------------------------------
	iorient.init();//屏幕翻转锁定，默认锁定竖屏，横屏提示
	icom.screenTo169(false,false);//article标签高度适配，把iphone4拉伸至iphone5
	loadBox.show();
	iuser.init(userGetted);
	sound_handler();
	
	//----------------------------------------微信用户登录验证----------------------------------------	
	function userGetted(data){
		console.log('用户头像：'+data.headimage);
		console.log('用户昵称：'+data.nickname);
		load_handler();
	}//end func
	
	//----------------------------------------加载页面图片----------------------------------------
	function load_handler(){
		//loadBox.show();
		var loader = new PxLoader();
		loader.addImage('images/common/turn.gif');
		loader.addImage('images/common/share.png');
		loader.addImage('images/chat/voice.gif');
		loader.addImage('images/input/keyboard.png');
		
		loader.addProgressListener(function(e) {
			//var per=Math.round(e.completedCount/e.totalCount*100);
		}); 	

		loader.addCompletionListener(function() {
			console.log('页面图片加载完毕');
			init_handler();
			loader=null;
		});
		loader.start();	
	}//end func	
	
	//----------------------------------------加载声音及处理----------------------------------------
	function sound_handler(){
		soundList=iaudio.on([{src:'sound/send.mp3'}]);
	}//end func
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		icom.fadeOut(loadBox,500);
		monitor_handler();
		chat_init();
	}//end func
	
	//----------------------------join
	function join_handler(num){
		num=num||0;
		num++;
		if(num>chatMember.length){
			console.log('join complete');
			chat_handler();
		}//edn if
		else{
			console.log(chatMember[num-1]);
			var join=$('<div class="join"></div>');
			var span=$('<span></span>').html(chatMember[num-1]+'加入了群聊').appendTo(join);
			join.appendTo(chatContainer).css({opacity:0}).transition({opacity:1},500);
			setTimeout(join_handler,500,num);
		}//end else
	}//edn func
	
	//----------------------------chat
	function chat_init(){
		chatInterface.css({'height':windowHt-inputPanel.outerHeight()});
		inputInterface.css({visibility:'visible'});
		chatInterface.scrbar({panelFade:true,speed:0.5});
		time_handler();
		if(chatMember && chatMember.length>0) join_handler();
		else chat_handler();
	}//end func
	
	function chat_next(delay){
		delay=delay||2000*chatSpeed;
		chatStep++;
		if(chatStep<chatData.length){
			setTimeout(chat_handler,delay);
		}//end if
		else{
			console.log('chat complete!');
		}//end else
	}//edn func
	
	function chat_handler(){
		var data=chatData[chatStep];
		icom.objectPrint(data);
		var style=data.style!=null?data.style:'me';
		var auto=data.auto!=null?data.auto:1;
		var type=data.type!=null?data.type:'text';
		if(style=='other'){
			if(type=='image'){
				icom.imageLoad(data.image,function(){
					chat_add(data);
					if(auto) chat_next(data.delay);
				});
			}//end if
			else if(type=='voice'){
				chat_add(data);
			}//end else
			else{
				chat_add(data);
				if(auto) chat_next(data.delay);
			}//end else
		}//end if
		else{
			inputPanelSpan.html(data.text+'<i>|</i>');
			inputIme.show();
			inputImeCon.show();
			keyboard_slideIn();
			btnSend.one('touchend',{data:data},btnSend_click);
		}//end if 
	}//end func
	
	function btnSend_click(e){
		var data=e.data.data;
		chat_add(data);
		setTimeout(function(){
			keyboard_slideOut();
			chat_next();
		},1000*chatSpeed);
	}//end func
	
	function chat_add(data){
		var style=data.style!=null?data.style:'me';
		var type=data.type!=null?data.type:'text';
		var head=data.head!=null?data.head:'images/chat/other.jpg';
		head=style!='me'?head:iuser.info.headimage;
		var chat=$('<div class="chat clearFix"><img class="head" ><div class="dialog"><i class="ar"></i></div></div>').addClass(style+' '+type);
		var head=chat.children('img.head').attr({src:head});
		var dialog=chat.children('div.dialog');
		var ar=dialog.children('i.ar');
		if(type=='text'){
			$('<span></span>').html(data.text).prependTo(dialog);
		}//end if
		else if(type=='image'){
			var div=$('<div class="image"></div>').prependTo(dialog);
			$('<img>').attr({src:data.image}).prependTo(div);
			$('<img>').attr({src:data.image}).prependTo(ar);
		}//end else
		else if(type=='voice'){
			var voice=$('<img class="voice">').attr({src:'images/chat/voice.png'}).prependTo(dialog);
			var point=$('<i class="point"></i>').appendTo(dialog);
			var dur=$('<i class="dur"></i>').html(data.dur+"''").appendTo(dialog);
			var hand=$('<i class="hand"><b></b></i>').appendTo(dialog);
			dialog.one('touchend',{src:data.voice},voice_play);
		}//end else
		else if(type=='html') dialog.html(data.html);
		if(data.className && data.className!="") chat.addClass(data.className);
		chat.appendTo(chatContainer).css({opacity:0}).transition({opacity:1},500);
		chatInterface.scrbarBottom();
		soundList.send.play();
		if(data.callbackId) chat_callback(data.callbackId);
	}//end func
	
	function voice_play(e){
		var _this=$(this);
		var src=e.data.src;
		var point=$(this).children('i.point').hide();
		var hand=$(this).children('i.hand').hide();
		var img=$(this).children('img.voice');
		img.attr({src:'images/chat/voice.gif'});
		var voice=iaudio.on([{src:src,autoPlay:true,onEnded:function(event){
			img.attr({src:'images/chat/voice.png'});
			_this.one('touchend',{src:src},voice_play);
			if(!_this.hasClass('active')) chat_next();
			_this.addClass('active');
		}}]);
	}//end func
	
	function time_handler(){
		var time=new Date();
		var hours=time.getHours();
		var minutes=time.getMinutes();
		var halfday=hours<=12?'AM':'PM';
		var timeBox=chatContainer.find('div.time span');
		timeBox.html(hours+':'+minutes+' '+halfday);
	}//end func
	
	function keyboard_slideIn(){
		chatInterface.transition({'height':windowHt-inputInterface.outerHeight()},500,function(){
			chatInterface.scrbarBottom();
		});
	}//end func
	function keyboard_slideOut(){
		inputPanelSpan.html('')
		chatInterface.transition({'height':windowHt-inputPanel.outerHeight()},500,function(){
			chatInterface.scrbarBottom();
		});
	}//end func
	
	
	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
//		imonitor.add({obj:inputWayBtn.eq(0),action:'touchend',category:'首页',label:'bsk_oct_adorable'});
//		imonitor.add({obj:inputWayBtn.eq(1),action:'touchend',category:'首页',label:'bsk_oct_annoying'});
//		imonitor.add({obj:btnSend,action:'touchend',category:'首页',label:'bsk_oct_send'});
	}//end func
	
});//end ready
