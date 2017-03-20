//2016.1.12
(function($) {	
	jQuery.fn.extend({
		focusR: function(options) {	
			var $this=$(this);
			var boxMask,boxCont,boxThis,boxList,boxPrev,boxNext,boxWd,boxHt,boxMax,boxesWd,boxesHt,boxDis,boxTar,boxTimer,boxNow,boxBtn,boxDir,boxJump;
			var defaults = {delay:5000,speed:1000,auto:false,swipe:true};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){
				boxWd=$this.width();
				boxHt=$this.height();
				boxMask=$this.children('.boxMask');
				boxCont=boxMask.children();
				boxThis=boxCont.children().css({width:$this.width(),height:$this.height()});
				boxList=$this.children("a.boxList");
				boxPrev=$this.children("a.boxPrev");
				boxNext=$this.children("a.boxNext");
				boxTar=0;
				boxNow=0;
				boxDir=-1;
				boxJump=false;
				boxMax=boxThis.length;//一共有几张图
				boxesWd=boxMax*boxWd;//总长度
				boxesHt=boxMax*boxHt;//总高度
				boxCont.width(boxesWd);
				boxDis=boxesWd-boxWd;
				$this.on("off",this_off).on("goto",this_goto).on("prev",this_prev).on("next",this_next).on("stop",this_stop).on("play",this_play);
				if(opts.swipe) $this.one('swipeleft',this_next).one('swiperight',this_prev);
				if(boxMax<=1){
					boxPrev.hide();
					boxNext.hide();
					boxList.hide();
				}//end if
				if(boxPrev.length>0) boxPrev.on('touchend',this_prev);
				if(boxNext.length>0) boxNext.on('touchend',this_next);
				if(boxList.length>0){
					for(var i=0; i<boxMax; i++) boxList.append('<span></span>');
					boxBtn=boxList.children();
					boxBtn.on('touchend',btn_click);
				}//end if
				btn_change();
				timer_handler();
			}//end func
			
			function this_off(e){
				$this.off("off goto prev next stop play");
				if(opts.swipe) $this.off('swipeleft',this_next).off('swiperight',this_prev);
				if(boxPrev.length>0) boxPrev.off();
				if(boxNext.length>0) boxNext.off();
				if(boxList.length>0) boxBtn.off();
				if(opts.auto) clearTimeout(boxTimer);
				if(opts.onOff) opts.onOff($this);
			}//end func	
			
			function this_stop(e){
				clearTimeout(boxTimer);
			}//end func
			
			function this_play(e){
				timer_handler();
			}//end func
			
			function this_goto(e,id,jump){
				if(boxDis>0 && boxNow!=id){
					boxNow=id;
					if(boxNow==0) boxDir=-1;
					else if(boxNow==boxMax-1) boxDir=1;
					boxJump=jump;
					box_motion();
					timer_handler();
				}//end if
			}//end func		
			
			function btn_click(e){
				var _obj=$(e.target);
				var _id=_obj.index();
				if(!boxCont.hasClass("moving") && boxDis>0){
					var last=boxNow;
					boxNow=_id;
					boxDir=boxNow>last?1:boxDir;
					boxDir=boxNow<last?-1:boxDir;
					box_motion();
				}//end if
			}//end func
			
			function this_prev(e){
				if(!boxCont.hasClass("moving") && boxDis>0 && boxNow > 0){	
					boxNow--;
					boxDir=-1;
					box_motion();
				}//end if
			}//end func
			
			function this_next(e){
				if(!boxCont.hasClass("moving") && boxDis>0 && boxNow < boxMax-1){	
					boxNow++;
					boxDir=1;
					box_motion();
				}//end if
			}//end func
			
			function timer_handler(){
				if(opts.auto){
					clearTimeout(boxTimer);
					boxTimer=setTimeout(box_roll,opts.delay);
				}//end if
			}//end func
			
			function box_roll(){
				if(!boxCont.hasClass("moving") && boxDis>0){	
					if(boxNow==0 || boxNow==boxMax-1) boxDir=-boxDir;
					if(boxDir==-1) boxNow--;
					else boxNow++;
					box_motion();
				}//end if
			}//end func
			
			function box_motion(){
				if(boxJump){
					boxJump=false;
					boxCont.css({x:-boxNow * boxWd});
				}//end if
				else{	
					boxCont.addClass('moving');
					if(opts.swipe) $this.off('swipeleft',this_next).off('swiperight',this_prev);
					boxCont.transition({ x:-boxNow * boxWd}, opts.speed, box_complete);
				}//end else
				btn_change();
				if(opts.onStart) opts.onStart(boxNow,$this);
			}//end func
			
			function box_complete(){
				boxCont.removeClass('moving');
				if(opts.swipe) $this.one('swipeleft',this_next).one('swiperight',this_prev);
				timer_handler();
				if(opts.onComplete) opts.onComplete(boxNow,$this);
			}//end if
			
			function btn_change(){
				if(boxPrev.length>0 && boxNext.length>0){
					if(boxNow==0){
						boxPrev.removeClass("active");
						boxNext.addClass("active");
					}else if(boxNow==boxMax-1){
						boxPrev.addClass("active");
						boxNext.removeClass("active");
					}else{
						boxPrev.addClass("active");
						boxNext.addClass("active");
					}//end if
				}//end if
				if(boxList.length>0) boxBtn.removeClass().eq(boxNow).addClass("active");				
			}//end func
			
		},//end fn
		focusRGoto: function(id,jump) {
			id=id!=null?id:1;
			jump=jump!=null?jump:false;
			$(this).triggerHandler('goto', [id,jump]);
		},//end fn
		focusRPrev: function() {
			$(this).triggerHandler('prev');
		},//end fn
		focusRNext: function() {
			$(this).triggerHandler('next');
		},//end fn
		focusRStop: function() {
			$(this).triggerHandler('stop');
		},//end fn
		focusRPlay: function() {
			$(this).triggerHandler('play');
		},//end fn
		focusROff: function() {
			$(this).triggerHandler('off');
		}//end fn			
	});//end extend
})(jQuery);//闭包
