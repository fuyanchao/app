$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var windowWd=$(window).width(),windowHt=$(window).height();
	console.log('window size:'+windowWd+'/'+windowHt);
	
	//slide
	var slideBox=$('.slide');
	var slideHandle=slideBox.children('.handle');
	var slideTxt=slideBox.children('.txt');
	var slideDis,slideX,slideXLast;
	
	//----------------------------------------页面初始化----------------------------------------
	init_handler();
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		console.log('init handler');
		slide_handler();
	}//end func
	
	//----------------slide
	
	function slide_handler(){
		console.log('slide_handler');
		slideDis=slideBox.width()-slideHandle.width();
		slideHandle.one('touchstart',slide_touchstart);
	}//edn func
	
	function slide_touchstart(e){
		e.preventDefault();
		slideXLast=e.originalEvent.touches[0].clientX;
		slideX=0;
		slideTxt.removeClass('fade');
		slideBox.on('touchmove',slide_touchmove).one('touchend',slide_touchend);
	}//edn func
	
	function slide_touchmove(e){
		e.preventDefault();
		var dis=e.originalEvent.touches[0].clientX-slideXLast;
		slideXLast=e.originalEvent.touches[0].clientX;
		slideX+=dis;
//		console.log('slideX：'+slideX);
		slideX=slideX<0?0:slideX;
		slideX=slideX>slideDis?slideDis:slideX;
		slideHandle.css({x:slideX});
		var width=windowWd-slideX-windowWd*0.1;
		slideTxt.css({width:width,opacity:1-0.9*slideX/slideDis});
		if(slideX>=slideDis){
			slideBox.off();
			icom.alert('滑动成功');
		}//edn if
	}//edn func
	
	function slide_touchend(e){
		e.preventDefault();
		slideBox.off('touchmove',slide_touchmove);
		if(slideX<slideDis){
			slideHandle.transition({x:0},250,function(){
				slideHandle.on('touchstart',slide_touchstart);
			});
			slideTxt.addClass('fade').transition({width:windowWd,opacity:1},250);
		}//edn if
	}//edn func
	
	
});//end ready
