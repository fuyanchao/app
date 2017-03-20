//2015.12.15
(function($) {
	jQuery.fn.extend({
		circleOn: function(options) {			
			var $this=$(this);
			var $box=$this.children();
			var $data=[],$max=$box.length,$dir=-1, $now=0,$tar=0,focusTimer,circleTimer;
			var defaults = {rx:$this.width()*0.5,ry:$this.height()*0.25,speed:10,fps:30,auto:true,delay:5000,blur:false,focus:true,offsetX:0,offsetY:0};
			var opts = $.extend(defaults,options);
			var $inter=Math.floor(1000/opts.fps);
			init();
			
			function init(){
				$box.each(function(i){
					$data[i]={ag:360/$max*i,agTar:360/$max*i,wd:$(this).width(),ht:$(this).height()};
				});
				$this.on("off",this_off).on("left",this_left).on("right",this_right).on("stop",this_stop).on("play",this_play);
				if(opts.focus) $this.one('swipeleft',swipeleft_handler).one('swiperight',swiperight_handler);
				else $this.on('swipeleft',swipeleft_handler).on('swiperight',swiperight_handler);
				if(opts.focus) {
					box_set();
					box_focus();
				}//end else
				else box_circle();
			}//end func
			
			function this_off(e){
				$this.off("off goto left stop play");
				$this.off('swipeleft',swipeleft_handler).off('swiperight',swiperight_handler);
				if(opts.focus) clearTimeout(focusTimer);
				else clearTimeout(circleTimer);
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function this_stop(e){
				if(opts.focus) clearTimeout(focusTimer);
				else clearTimeout(circleTimer);
			}//end func
			
			function this_play(e){
				if(opts.focus){
					clearTimeout(focusTimer);
					focusTimer=setTimeout(box_roll,opts.delay);
				}//end if
				else{
					clearTimeout(circleTimer);
					circleTimer=setTimeout(box_circle,$inter);
				}//end if
			}//end func
			
			function this_left(e){
				$dir=-1;
				if(opts.focus) box_roll();
			}//end func
			
			function this_right(e){
				$dir=1;
				if(opts.focus) box_roll();
			}//end func
			
			function swipeleft_handler(e){
				console.log('focus swipe left');
				e.preventDefault();
				this_left();
			}//end func
			function swiperight_handler(e){
				console.log('focus swipe right');
				e.preventDefault();
				this_right();
			}//end func
			
			function box_focus(){
				if(opts.auto){
					clearTimeout(focusTimer);
					focusTimer=setTimeout(box_roll,opts.delay);
				}//end if
			}//end func
			
			function box_roll(){
				if(!$this.hasClass('moving')){
					$tar-=$dir;
					$tar=$tar<0?$max-1:$tar;
					$tar=$tar>$max-1?0:$tar;
					//console.log('$tar:'+$tar);
					$box.each(function(i){
						$data[i].agTar+=360/$max*$dir;
						//console.log('agTar '+i+':'+$data[i].agTar);
					});
					$this.off('swipeleft',swipeleft_handler).off('swiperight',swiperight_handler);
					if(!$this.hasClass('moving')) $this.addClass('moving');
					box_circle();
				}//end if
			}//end func
			
			function box_circle(){
				$box.each(function(i){
					if(opts.focus){
						$data[i].ag=imath.ease($data[i].ag,$data[i].agTar,opts.speed,0.5);
						if($data[i].ag%360==0) $now=i;
					}//end if
					else{
						$data[i].ag+=opts.speed*$dir;
						$data[i].ag=$data[i].ag<360?$data[i].ag:0;
						$data[i].ag=$data[i].ag>-360?$data[i].ag:0;
						if($data[i].ag==0){
							$now=i;
							if(opts.onComplete) opts.onComplete($now,$this);
						}//end if
					}//end else
				});
				box_set();
				if(opts.focus){
					if($now==$tar){
						if(opts.onComplete) opts.onComplete($now,$this);
						$this.removeClass('moving');
						$this.one('swipeleft',swipeleft_handler).one('swiperight',swiperight_handler);
						box_focus();
					}//end if
					else setTimeout(box_circle,$inter);
				}//end else
				else circleTimer=setTimeout(box_circle,$inter);
			}//end func
			
			function box_set(){
				$box.each(function(i){
					var xbit = Math.sin(imath.toRadian($data[i].ag));
					var ybit = Math.cos(imath.toRadian($data[i].ag));
					var zbit=Math.floor(100*ybit);
					var scale=(150+50*ybit)/200;	
					$(this).show().css({x:$this.width()/2+xbit*opts.rx-$data[i].wd/2+opts.offsetX,y:$this.height()/2+ybit*opts.ry-$data[i].ht/2+opts.offsetY,scale:scale, zIndex:zbit});
					if(opts.roll3D) $(this).css({ perspective:400, rotateY:$data[i].ag });
					if(opts.blur){
						var blur=Math.cos(imath.toRadian($data[i].ag-180))*0.5;
						$(this).css({ '-webkit-filter':'blur('+blur+'rem)' });
					}//end if
				});
			}//end func

		},//end fn
		circleStop: function() {
			$(this).triggerHandler('stop');
		},//end fn
		circlePlay: function() {
			$(this).triggerHandler('play');
		},//end fn
		circleRight: function() {
			$(this).triggerHandler('right');
		},//end fn
		circleLeft: function() {
			$(this).triggerHandler('left');
		},//end fn
		circleOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend
})(jQuery);//闭包