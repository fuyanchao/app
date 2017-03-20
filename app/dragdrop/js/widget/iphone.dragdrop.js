//2015.12.15
(function($) {	
	$.fn.extend({
		dragdropOn: function($target,options) {
			if($target && $target.length>0){
				var $this=$(this);
				var $parent=$this.parent();
				var defaults = {moveHit:false};
				var opts = $.extend(defaults,options);
				var hitted=false;
				init();
			}//end if
			
			function init(){
				$target.data({x:$target.position().left,y:$target.position().top});
				$this.data({x:$this.position().left,y:$this.position().top});
				$this.on("off",this_off);
				$this.on('touchstart',this_touchstart);
			}//end func
			
			function this_off(e){
				$this.off("off");
				$this.off('touchstart',this_touchstart);
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function this_touchstart(e){
				e.preventDefault();
				e.stopPropagation();
				console.log('this_touchstart')
				if(!$(this).hasClass('locked')){
					hitted=false;
					$(this).on('touchmove',this_touchmove).one('touchend',this_touchend);
					if(opts.onStart) opts.onStart($(this),$target);
				}//end if
			}//end func
	
			function this_touchmove(e){
				e.preventDefault();
				e.stopPropagation();
				$(this).css({left:e.originalEvent.touches[0].pageX-$parent.offset().left-$(this).width()*0.5,top:e.originalEvent.touches[0].pageY-$parent.offset().top-$(this).height()*0.5});
				if(imath.hitTest($(this),$target)){
					hitted=true;
					$(this).addClass('hitted');
					$target.addClass('hitted');
					if(opts.moveHit){
						$(this).off('touchmove',this_touchmove).off('touchend',this_touchend);
						if(opts.onHit) opts.onHit($(this),$target);
					}//end if
				}//end if
				else{
					$(this).removeClass('hitted');
					$target.removeClass('hitted');
				}//end else
				if(opts.onMove) opts.onMove($(this),$target);
			}//end func
			
			function this_touchend(e){
				e.preventDefault();
				e.stopPropagation();
				$(this).off('touchmove',this_touchmove);
				if(hitted){
					if(opts.onHit) opts.onHit($(this),$target);
				}//end if
				else{
					$(this).transition({left:$(this).data().x,top:$(this).data().y},250);
					if(opts.onMiss) opts.onMiss($(this),$target);
				}//end else
				if(opts.onEnd) opts.onEnd($(this),$target);
			}//end func
			
		},//end fn
		dragdropOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend
})(jQuery);//闭包