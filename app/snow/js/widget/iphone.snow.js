//2015.12.18
(function($) {	
	$.fn.extend({
		snowOn: function(options) {	
			var $this=$(this);
			var $end=false;
			var defaults = {x:-1,y:-1,num:50,speed:5000,delay:5000,ratio:5,roll2D:false,roll3D:false,skew:false,type:1,style:'style',offset:0};
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
					var box=$('<i></i>').hide().appendTo($this);
					setTimeout(box_new,imath.randomRange(0,opts.delay),box);
				}//end for
			}//end func
			
			function box_new(box){
				if(opts.type>1) box.removeClass().addClass(opts.style+imath.randomRange(1,opts.type));
				var ratio=imath.randomRange(1,opts.ratio);//远近比例参数,5 LEVEL
				box.css({zIndex:ratio});
				if(opts.ratio>1) var scale=0.1+ratio*0.18;
				else var scale=1;
				var x_tar=imath.randomRange(-Math.abs(opts.offset),$this.width()+Math.abs(opts.offset));
				if(opts.x!=-1) var x=opts.x;
				else var x=x_tar-opts.offset;
				if(opts.y!=-1) var y=opts.y;
				else y=-box.height();
				var y_tar=$this.height();
				var speed=opts.speed+(opts.ratio-ratio)*imath.randomRange(opts.speed,opts.speed*2);
				speed=Math.round((y_tar-y)/y_tar*speed);
				x=x_tar-(y_tar-y)/y_tar*opts.offset;
				var rotate=imath.getDeg([x,y],[x_tar,y_tar])-90;
				var css={x:x,y:y,scale:scale,rotate:rotate};
				var trans={x:x_tar,y:y_tar,rotate:rotate};
				if(opts.roll2D) trans.rotate='+='+(opts.speed*0.1*imath.randomRange(10,20)*0.1*imath.randomPlus());
				if(opts.roll3D){
					css.perspective=400;
					css.rotateX=imath.randomRange(-45,45);
					css.rotateY=imath.randomRange(-45,45);
					trans.rotateX=360+imath.randomRange(0,360);
				}//end else
				if(opts.skew){
					css.skewX=imath.randomRange(-45,45);
					css.skewY=imath.randomRange(-45,45);
				}//end else
				box.css(css).show().transition(trans,speed,'linear', function(){
					if(!$end){
						$(this).hide();
						setTimeout(box_new,imath.randomRange(0,opts.delay),$(this));
					}//end if
					else $(this).remove();
				});
			}//end func
			
		},//end fn
		snowOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包