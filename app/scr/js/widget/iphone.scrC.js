//2016.1.12
(function($) {
	$.fn.extend({
		scrC: function(options) {
			var $this=$(this);
			var boxMask,boxCont,boxThis,boxBtnL,boxBtnR,boxMax,boxDis,boxTimer,boxDir,boxWd;
			var defaults = {delay:5000,speed:1000,auto:false,swipe:true};
			var opts = $.extend(defaults,options);
			init();

			function init(){	
				boxMask=$this.children(".boxMask");
				boxCont=boxMask.children();
				boxThis=boxCont.children().each(function(i) {$(this).data({id:i});});
				boxBtnL=$this.children("a.boxBtnL");
				boxBtnR=$this.children("a.boxBtnR");
				boxMax=boxThis.length;
				boxDir=-1;	
				boxWd=boxThis.first().outerWidth(true);
				boxCont.width(boxWd*boxMax);
				boxDis=boxCont.width()-boxMask.width();
				$this.on("off",this_off).on("prev",this_prev).on("next",this_next).on("stop",this_stop).on("play",this_play);
				if(opts.swipe) $this.one('swipeleft',this_next).one('swiperight',this_prev);
				if(boxBtnL.length>0) boxBtnL.on('touchend',this_prev);
				if(boxBtnR.length>0) boxBtnR.on('touchend',this_next);
				timer_handler();
			}//end func
			
			function this_off(e){
				$this.off("off prev next stop play");
				if(opts.swipe) $this.off('swipeleft',this_next).off('swiperight',this_prev);
				if(boxBtnL.length>0) boxBtnL.off('touchend',this_prev);
				if(boxBtnR.length>0) boxBtnR.off('touchend',this_next);
				if(opts.auto) clearTimeout(boxTimer);
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function this_stop(e){
				clearTimeout(boxTimer);
			}//end func
			
			function this_play(e){
				timer_handler();
			}//end func
			
			function this_prev(e){
				e.preventDefault();
				boxDir=1;
				box_roll();
			}//end func
			
			function this_next(e){
				e.preventDefault();
				boxDir=-1;
				box_roll();
			}//end func
			
			function timer_handler(){
				if(opts.auto){
					clearTimeout(boxTimer);
					boxTimer=setTimeout(box_roll,opts.delay);
				}//end if
			}//end func
			
			function box_roll(){
				if(!boxCont.hasClass("moving")){
					boxCont.addClass('moving');
					if(opts.swipe) $this.off('swipeleft',this_next).off('swiperight',this_prev);
					if(boxDis>0){
						boxThis=boxCont.children();
						if(boxDir==-1) {
							boxCont.transition({x:-boxWd }, opts.speed, function(){
								boxThis.last().after(boxThis.first());
								boxCont.css({x:0});
								box_complete();
							});
						}//end if
						else {
							boxThis.first().before(boxThis.last());
							boxCont.css({x:-boxWd});
							boxCont.transition({x:0}, opts.speed, box_complete);
						}//end else if
						if(opts.onStart) opts.onStart($this);
					}//end if boxDis>0
				}//end if(!boxCont.hasClass("moving") && boxDis>0)
			}//end func
			
			function box_complete(){
				boxCont.removeClass('moving');
				if(opts.swipe) $this.one('swipeleft',this_next).one('swiperight',this_prev);
				timer_handler();
				if(opts.onComplete) opts.onComplete($this);	
			}//end func
			
		},//end fn
		scrCPrev: function() {
			$(this).triggerHandler('prev');
		},//end fn
		scrCNext: function() {
			$(this).triggerHandler('next');
		},//end fn
		scrCStop: function() {
			$(this).triggerHandler('stop');
		},//end fn
		scrCPlay: function() {
			$(this).triggerHandler('play');
		},//end fn
		scrCOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend
})(jQuery);//闭包