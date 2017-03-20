$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var windowWd=$(window).width(),windowHt=$(window).height();


	//----------------------------------------页面初始化----------------------------------------
	iorient.init();//屏幕翻转锁定，默认锁定竖屏，横屏提示
//	icom.screenTo169(false);//article标签高度适配，把iphone4拉伸至iphone5
	loadBox.show();
	iuser.init(userGetted);
	
	//----------------------------------------微信用户登录验证----------------------------------------	
	function userGetted(data){
		console.log('用户头像：'+data.headimage);
		console.log('用户昵称：'+data.nickname);
		init_handler();
	}//end func
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		icom.fadeOut(loadBox,500);		
		price_handler();
	}//end func
	
	//-----------price
	var btnMore=$('a.btnMore');
	var panelMore=$('.panelMore');
	var btnPrice=$('a.btnPrice');
	var headBox=$('li.price .head');
	
	function price_handler(){
		btnMore.one('click',btnMore_click);
		imonitor.add({obj:btnMore,action:'touchend',category:'朋友圈',label:'更多'});
		imonitor.add({obj:btnPrice,action:'touchend',category:'朋友圈',label:'点赞'});
	}//end func
	
	function btnMore_click(e){
		if(!$(this).hasClass('active')){
			$(this).addClass('active');
			panelMore.css({opacity:0,x:100}).show().transition({opacity:1,x:0},250,function(){
				btnMore.one('click',btnMore_click);
				btnPrice.one('click',btnPrice_click);
			});
		}//end if
		else{
			$(this).removeClass('active');
			panelMore.transition({opacity:0,x:100},250,function(){
				$(this).hide();
				btnMore.one('click',btnMore_click);
				btnPrice.off();
			});
		}//end else
	};
	
	function btnPrice_click(e){
		$(this).siblings('i.hand').remove();
		if(!$(this).hasClass('active')){
			$(this).addClass('active');
			var txt='取消';
			$('<img>').attr({src:iuser.info.headimage}).appendTo(headBox);
		}//end if
		else{
			$(this).removeClass('active');
			var txt='赞';
			headBox.children('img').last().remove();
		}//end else
		panelMore.transition({opacity:0,x:50},250,function(){
			$(this).hide();
			btnPrice.children('span').html(txt);
			btnMore.removeClass('active');
		});
	};
	
});//end ready
