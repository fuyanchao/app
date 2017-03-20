//2015.12.18
(function($) {	
	$.fn.extend({
		shineOn: function(options) {	
			var $this=$(this);
			var $end=false;
			var defaults = {num:50,speed:1000,delay:500,ratio:5,alphaMax:75,alphaMin:35,type:1,style:'style'};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){
				$this.on('off',this_off);
				box_creat();
			}//end func	
			
			function this_off(e){
				$this.off('off',this_off);
				$end=true;
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function box_creat() {
				$this.empty();
				for(var i=0; i<opts.num; i++){
					var box=$('<i></i>').hide().appendTo($this);
					setTimeout(box_new,imath.randomRange(0,opts.delay),box);
				}//end for
			}//end func
			
			function box_new(box){
				if(opts.type>1) box.removeClass().addClass(opts.style+imath.randomRange(1,opts.type));
				var ratio=imath.randomRange(1,opts.ratio);
				var scale=0.1+ratio*0.18;
				var x=imath.randomRange(0,$this.width());
				var y=imath.randomRange(0,$this.height());
				var opacity_tar=imath.randomRange(opts.alphaMin,opts.alphaMax)*0.01;
				var css={x:x,y:y,scale:scale,opacity:0};
				if(opts.rotate) css.rotate=imath.randomRange(-opts.rotate,opts.rotate);
				var speed=imath.randomRange(opts.speed*0.5,opts.speed);
				box.css(css).show().transition({opacity:opacity_tar},speed).transition({opacity:0},speed, function(){
					if(!$end){
						$(this).hide();
						setTimeout(box_new,imath.randomRange(0,opts.delay),$(this));
					}//end if
					else $(this).remove();
				});
			}//end func
			
		},//end fn
		shineOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包