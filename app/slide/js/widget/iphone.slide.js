//2015.11.16
(function($) {	
	jQuery.fn.extend({
		slideOn: function(options) {	
			var $this=$(this);
			var boxBtn,boxBtnThis,boxBtnL,boxBtnR,boxHt=$this.height(),boxMax,boxNow,boxDir,boxJump;
			var touchLast=[],boxPos=0,boxPosLast=0;
			var defaults = {speed:1500,percent:25,seal:false};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){
				boxBtn=$this.children("a.boxBtn");
				boxBtnL=$this.children("a.boxBtnL");
				boxBtnL.css({top:$this.outerHeight()/2-boxBtnL.height()/2});
				boxBtnR=$this.children("a.boxBtnR");
				boxBtnR.css({top:$this.outerHeight()/2-boxBtnR.height()/2});
				boxMax=$this.children().length;//一共有几张图
				boxNow=0;
				boxDir=-1;
				boxJump=false;
				$this.on("off",this_off).on("goto",this_goto).on("prev",this_prev).on("next",this_next);
				$this.on("touchstart",this_touchstart);
				if(boxBtnL.length>0) boxBtnL.on('touchend',this_prev);
				if(boxBtnR.length>0) boxBtnR.on('touchend',this_next);
				if(boxBtn.length>0){
					for(var i=0; i<boxMax; i++) boxBtn.append('<span></span>');
					boxBtnThis=boxBtn.children();
					boxBtnThis.on('touchend',btn_click);
				}//end if
				btn_change();
			}//end func		
			
			function this_off(e){
				$this.off("off goto prev next");
				$this.off("touchstart",this_touchstart);
				if(boxBtnL.length>0) boxBtnL.off();
				if(boxBtnR.length>0) boxBtnR.off();
				if(boxBtn.length>0) boxBtnThis.off();
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function this_goto(e,id){
				if(boxNow!=id){
					boxNow=id;
					boxJump=true;
					box_motion();
				}//end if
			}//end func		
			
			function this_touchstart(e){
				touchLast=[e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY];
				boxPosLast=boxPos;
				$(this).on("touchmove",this_touchmove).one("touchend",this_touchend);
			}//end func
			
			function this_touchmove(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				var offset=e.originalEvent.changedTouches[0].clientY-touchLast[1];
				var dir=offset>0?-1:1;
				var rate=1;
				if( (boxPos<=0 && dir==-1) || (boxPos>=(boxMax-1)*boxHt && dir==1) ) rate=opts.seal?0:0.2;
				boxPos-=offset*rate;
				$this.css({y:-boxPos});
				touchLast=[e.originalEvent.changedTouches[0].clientX,e.originalEvent.changedTouches[0].clientY];
			}//end func
			
			function this_touchend(e){
				$(this).off("touchmove",this_touchmove);
				var offset=boxPos-boxPosLast;
				if(offset!=0){
					boxDir=offset>0?1:-1;
					if(Math.abs(offset)>=boxHt*opts.percent*0.01){
						boxNow+=boxDir;
						boxNow=boxNow<0?0:boxNow;
						boxNow=boxNow>boxMax-1?boxMax-1:boxNow;
						var restore=false;
					}//end if
					else var restore=true;
					box_motion(restore);
				}//end if
			}//end func
			
			function btn_click(e){
				var _obj=$(e.target);
				var id=_obj.index();
				if(!$this.hasClass("moving")){
					var last=boxNow;
					boxNow=id;
					boxDir=boxNow>last?1:boxDir;
					boxDir=boxNow<last?-1:boxDir;
					box_motion();
				}//end if
			}//end func
			
			function this_prev(e){
				if(!$this.hasClass("moving") && !$this.hasClass("lockup") && boxNow > 0){
					boxNow--;
					boxDir=-1;
					box_motion();
				}//end if
			}//end func
			
			function this_next(e){
				if(!$this.hasClass("moving") && !$this.hasClass("lockdown") && boxNow < boxMax-1){	
					boxNow++;
					boxDir=1;
					box_motion();
				}//end if
			}//end func		
			
			function box_motion(restore){
				restore=restore||0;
				var tar=boxNow*boxHt;
				if(opts.onStart && !restore) opts.onStart(boxNow,boxDir,$this);
				btn_change();
				if(boxJump){
					boxJump=false;
					boxPos=tar;
					$this.css({y:-boxPos});
					if(opts.onComplete && !restore) opts.onComplete(boxNow,boxDir,$this);
				}//end if
				else{	
					$this.addClass('moving');
					$this.off("touchstart",this_touchstart);
					var dur=opts.speed*Math.abs(tar-boxPos)/boxHt;
					boxPos=tar;
					$this.transition({ y:-boxPos}, dur,function(){
						$this.removeClass('moving');
						$this.on("touchstart",this_touchstart);
						if(opts.onComplete && !restore) opts.onComplete(boxNow,boxDir,$this);
					});
				}//end else
			}//end func

			function btn_change(){
				if(boxBtnL.length>0 && boxBtnR.length>0){
					if(boxNow==0){
						boxBtnL.removeClass("active");
						boxBtnR.addClass("active");
					}else if(boxNow==boxMax-1){
						boxBtnL.addClass("active");
						boxBtnR.removeClass("active");
					}else{
						boxBtnL.addClass("active");
						boxBtnR.addClass("active");
					}//end if
				}//end if
				if(boxBtn.length>0) boxBtnThis.removeClass().eq(boxNow).addClass("active");				
			}//end func
			
		},//end fn	
		slideReset: function() {
			$(this).triggerHandler('reset');
		},//end fn	
		slideGoto: function(id) {
			id=id!=null?id:1;
			$(this).triggerHandler('goto', [id]);
		},//end fn
		slidePrev: function() {
			$(this).triggerHandler('prev');
		},//end fn
		slideNext: function() {
			$(this).triggerHandler('next');
		},//end fn
		slideOff: function() {
			$(this).triggerHandler('off');
		}//end fn			
	});//end extend
})(jQuery);//闭包
