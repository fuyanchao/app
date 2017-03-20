$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var windowWd=$(window).width(),windowHt=$(window).height();
	console.log('window size:'+windowWd+'/'+windowHt);
	
	
	//income
	var bgBox=$('div.bg');
	var incomeBox=$('aside.income');
	var incomeAnswer=$('aside.answer');
	var btnAnswer=$('.btnAnswer');
	
	//answer
	var timerBox=$('div.timer');
	var soundList;
	var btnHangup=$('.btnHangup');
	
	//----------------------------------------页面初始化----------------------------------------
	iuser.init(userGetted);
	sound_handler();
	
	//----------------------------------------微信用户登录验证----------------------------------------	
	function userGetted(data){
		console.log('用户头像：'+data.headimage);
		console.log('用户昵称：'+data.nickname);
		load_handler();
	}//end func
	
	function sound_handler(){
		soundList=iaudio.on([{src:'sound/phone.mp3',onEnded:page_next}]);
	}//edn func
	
	//----------------------------------------加载页面图片----------------------------------------
	function load_handler(){
		var loader = new PxLoader();
		loader.addImage('images/common/turn.gif');

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
		income_handler();
	}//end func
	
	function income_handler(){
		btnAnswer.one('touchend',answer_handler);
	}//end func
	
	function answer_handler(){
		incomeBox.hide();
		incomeAnswer.show();
		bgBox.addClass('blur');
		timer_handler();
		voice_handler();
	}//edn func
	
	function timer_handler(timer){
		timer=timer||0;
		console.log('timer:'+timer);
		var second=timer%60;
		var minute=Math.floor(timer/60);
		timerBox.html(num_handler(minute)+':'+num_handler(second));
		setTimeout(timer_handler,1000,timer+1);
	}//end func
	
	function num_handler(num){
		return num<10?'0'+num:num;
	}//end func
	
	function voice_handler(){
		btnHangup.one('touchend',function(e){
			soundList.phone.pause();
			page_next();
		});
		soundList.phone.play();
	}//edn func

	
	function page_next(){
		location.href='chat.html';
	}//end func
	
	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
		//imonitor.add({obj:$('a.btnTest'),action:'touchend',category:'首页',label:'测试按钮'});
	}//end func
	
});//end ready
