//2015.12.18
(function($) {	
	$.fn.extend({
		bubbleOn: function(options) {	
			var $this=$(this);
			var $timer;
			var $end=false;
			var $box=$this.children();
			var defaults = {x:-1,y:-1,num:10,speed:0.5,delay:2000,ratio:5,roll2D:false,type:1,style:'style'};
			var opts = $.extend(defaults,options);
			
			init();
			
			function init(){
				$this.on('off',this_off);
				box_creat();
			}//end func	
			
			function this_off(e){
				$this.off('off');
				$end=true;
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function box_creat() {
				for(var i=0; i<opts.num; i++){
					var box=$('<i></i>').hide().addClass('hide').appendTo($this);
					setTimeout(box_new,imath.randomRange(0,opts.delay),box);
				}//end for
				$box=$this.children();
				$timer=setInterval($timerFunc,33);
			}//end func
			
			function box_new(box){
				if(opts.type>1) box.removeClass().addClass(opts.style+imath.randomRange(1,opts.type));
				var ratio=imath.randomRange(1,opts.ratio);//远近比例参数,10 LEVEL
				if(opts.ratio>1) var scale=0.1+ratio*0.18;
				else var scale=1;
				var x_tar=imath.randomRange(0,$this.width());
				if(opts.x!=-1) var x=opts.x;
				else var x=imath.randomRange(0,$this.width());
				if(opts.y!=-1) var y=opts.y;
				else var y=$this.height();
				var deg=imath.getDeg([opts.x,opts.y],[x_tar,$this.height()]);
				var css={x:x,y:y,scale:scale,rotate:0};
				var data={deg:deg,x:x,y:y,orgX:x,spX:3+ratio*5,spY:opts.speed+ratio*0.5*imath.randomRange(1,2),ang:imath.randomRange(0,360),angSp:1+ratio*imath.randomRange(1,2),timeNow:0,timeMax:imath.randomRange(100,200),rotate:0,rotateMax:imath.randomRange(30,60),rotateSpeed:imath.randomRange(2,4),rotateDir:imath.randomPlus()};
				box.css(css).removeClass('hide').show().data(data);
			}//end func
			
			function $timerFunc(){
				$box.each(function(i) {
					if(!$(this).hasClass('hide')){
						var data=$(this).data();
						data.ang+=data.angSp;
						if(opts.x!=-1 && opts.y!=-1) data.orgX+=data.spX*0.5*Math.cos(data.deg* Math.PI / 180);
						data.x=data.orgX+data.spX*Math.sin(data.ang* Math.PI / 180);
						data.y-=data.spY;
						if(opts.roll2D){
							data.timeNow++;
							if(data.timeNow>=data.timeMax){
								data.timeNow=0;
								data.timeMax=imath.randomRange(100,200)
								data.rotateMax=imath.randomRange(30,60);
							}//end if
							data.rotate+=data.rotateDir*data.rotateSpeed;
							if(data.rotate>data.rotateMax || data.rotate<-data.rotateMax) data.rotateSpeed=-data.rotateSpeed;
							$(this).css({rotate:data.rotate});
						}//end if
						$(this).css({x:data.x,y:data.y});
						if (data.y<=-$(this).height()){
							if(!$end){
								$(this).hide().addClass('hide');
								setTimeout(box_new,imath.randomRange(0,opts.delay),$(this));
							}//end if
							else{
								$(this).remove();
								$box=$this.children();
								if($box.length==0) clearInterval($timer);
							}//end else
						}//end if
					}//end if
				});
			}//end func
		},//end fn
		bubbleOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包