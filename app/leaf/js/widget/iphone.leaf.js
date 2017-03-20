//2015.11.16
(function($) {	
	$.fn.extend({
		leafOn: function(options) {	
			var $this=$(this);
			var $box=$this.children();
			var $timer;
			var $end=false;
			var defaults = {x:-1,y:-1,num:10,speed:1,delay:2000,ratio:5,roll2D:true,roll3D:true,skew:false,type:1,style:'style'};
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
				$timer=setInterval(timer_handler,33);
			}//end func
			
			function box_new(box){
				if(opts.type>1) box.removeClass().addClass(opts.style+imath.randomRange(1,opts.type));
				var ratio=imath.randomRange(1,opts.ratio);//远近比例参数,10 LEVEL
				box.css({zIndex:ratio});
				if(opts.ratio>1) var scale=0.1+ratio*0.18;
				else var scale=1;
				var x_tar=imath.randomRange(0,$this.width());
				if(opts.x!=-1) var x=opts.x;
				else var x=imath.randomRange(0,$this.width());
				if(opts.y!=-1) var y=opts.y;
				else var y=-box.height();
				var deg=imath.getDeg([opts.x,opts.y],[x_tar,$this.height()]);
				var css={x:x,y:y,scale:scale,rotate:0,perspective: 400,rotateX:imath.randomRange(0,45),rotateY:imath.randomRange(0,45)};	
				if(opts.skew){
					css.skewX=imath.randomRange(-30,30);
					css.skewY=imath.randomRange(-30,30);
				}//end if
				var data={deg:deg,x:x,y:y,orgX:x,spX:2+ratio*5,spY:opts.speed+ratio*0.5*imath.randomRange(1,2),ang:imath.randomRange(0,360),angSp:2+ratio*0.5*imath.randomRange(1,2),timeNow:0,timeMax:imath.randomRange(100,200),rotate:0,rotateMax:imath.randomRange(30,60),rotateSpeed:imath.randomRange(2,4),rotateDir:imath.randomPlus(),rotateXSpeed:imath.randomRange(5,10),rotateXDir:imath.randomPlus()};
				box.css(css).removeClass('hide').show().data(data);
			}//end func
			
			function timer_handler(){
				$box.each(function(i) {
					if(!$(this).hasClass('hide')){
						var data=$(this).data();
						data.ang+=data.angSp;
						if(opts.x!=-1 && opts.y!=-1) data.orgX+=data.spX*0.5*Math.cos(data.deg* Math.PI / 180);
						data.x=data.orgX+data.spX*Math.sin(data.ang* Math.PI / 180);
						data.y+=data.spY;
						$(this).css({x:data.x,y:data.y});
						data.rotate+=data.rotateDir*data.rotateSpeed;
						if(data.rotate>data.rotateMax || data.rotate<-data.rotateMax) data.rotateSpeed=-data.rotateSpeed;
						if(opts.roll2D) $(this).css({rotate:data.rotate});
						if(opts.roll3D){
							data.timeNow++;
							if(data.timeNow>=data.timeMax){
								data.timeNow=0;
								data.timeMax=imath.randomRange(100,200)
								data.rotateXDir=imath.randomPlus();
								data.rotateXSpeed=imath.randomRange(5,10);
								data.rotateMax=imath.randomRange(30,60);
							}//end if
							$(this).css({rotateX:'+='+data.rotateXDir*data.rotateXSpeed});
						}//end if
						if (data.y>=$this.height()){
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
		leafOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包