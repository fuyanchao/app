$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var windowWd=$(window).width(),windowHt=$(window).height();
	
	//----------------------------------------页面初始化----------------------------------------
	init_handler()
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		monitor_handler();
	}//end func

	
	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
//		imonitor.add({obj:$('a.cont'),action:'touchend',category:'朋友圈',label:'链接'});
	}//end func
	
});//end ready
