//2015.11.16
(function($) {
	$.fn.extend({
		scr: function(options) {
			var $this=$(this);
			var boxMask,boxCont,boxThis,boxBtnL,boxBtnR,boxMax,boxTimer,boxWd;
			var boxMoving=true;
			var defaults = {speed:1000,dir:1};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){	
				boxMask=$this.children(".boxMask");
				boxCont=boxMask.children();
				boxThis=boxCont.children().each(function(i) {$(this).data({id:i});});
				boxBtnL=$this.children("a.boxBtnL");
				boxBtnR=$this.children("a.boxBtnR");
				boxMax=boxThis.length;
				boxWd=boxThis.first().outerWidth(true);
				boxCont.width(boxWd*boxMax);
				$this.on("off",this_off).on("prev",this_prev).on("next",this_next).on("stop",this_stop).on("play",this_play).on("speed",this_speed).on("dir",this_dir);
				$this.on('swipeleft',this_prev).on('swiperight',this_next);
				if(boxBtnL.length>0) boxBtnL.on('touchend',this_prev);
				if(boxBtnR.length>0) boxBtnR.on('touchend',this_next);
				box_scroll();
			}//end func
			
			function this_off(e){
				$this.off("off prev next stop play");
				$this.off('swipeleft swiperight');
				if(boxBtnL.length>0) boxBtnL.off('touchend',this_prev);
				if(boxBtnR.length>0) boxBtnR.off('touchend',this_next);
				this_stop();
			}//end func
			function this_speed(e,speed){
				opts.speed=speed;
			}//end func	
			function this_dir(e,dir){
				opts.dir=dir;
			}//end func	
			function this_play(e){
				boxMoving=true;
				box_scroll();
			}//end func	
			function this_stop(e){
				boxMoving=false;
			}//end func
			function this_prev(e){
				opts.dir=-1;
			}//end func
			function this_next(e){
				opts.dir=1;
			}//end func	
						
			function box_scroll(){
				boxThis=boxCont.children();
				if(opts.dir==-1){
					boxCont.transition({x:-boxWd }, opts.speed,'linear', function(){
						boxThis.last().after(boxThis.first());
						boxCont.css({x:0});
						if(boxMoving) box_scroll();
					});
				}//end if
				else {
					boxThis.first().before(boxThis.last());
					boxCont.css({x:-boxWd});
					boxCont.transition({x:0}, opts.speed,'linear', function(){
						if(boxMoving) box_scroll();
					});
				}//end else if
			}//end func
		},//end fn
		scrPrev: function() {
			$(this).triggerHandler('prev');
		},//end fn
		scrNext: function() {
			$(this).triggerHandler('next');
		},//end fn
		scrStop: function() {
			$(this).triggerHandler('stop');
		},//end fn
		scrPlay: function() {
			$(this).triggerHandler('play');
		},//end fn
		scrSpeed: function(speed) {
			speed=speed<0?0:speed;
			$(this).triggerHandler('speed',[speed]);
		},//end fn
		scrDir: function(dir) {
			dir=dir!=1?-1:1;
			$(this).triggerHandler('dir',[dir]);
		},//end fn
		scrOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend
})(jQuery);//闭包