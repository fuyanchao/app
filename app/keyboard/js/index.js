$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var htBox=$('.ht');
	
	var windowWd=$(window).width(),windowHt=$(window).height();
	console.log('window size:'+windowWd+'/'+windowHt);
	
	//----------------------------------------页面初始化----------------------------------------
	iorient.init();//屏幕翻转初始化
	icom.screenTo169(false,false);//把article标签拉伸至iphone5的高宽比例
	init_handler();
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		console.log(iorient.dir);
		console.log('init handler');
		icom.keyboard($('input'),$('section'));
		window_resize();
		$(window).on('resize',window_resize)
	}//end 
	
	function window_resize(e){
		htBox.html(window.innerHeight);
	}//edn func
	
	
});//end ready
