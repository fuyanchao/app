//2015.11.16
(function($) {	
	jQuery.fn.extend({
		swingOn: function(options) {
			var $this=$(this);
			var $end=false;
			var $rotateOrg;
			var defaults = {degree:30,speed:50};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){
				$rotateOrg=$this.css('rotate');
				$this.on("off",this_off);
				swing_handler();
			}//end func
			
			function this_off(e){
				$this.off("off");
				$end=true;
				if(opts.onOff) opts.onOff($this);
			}//end func
						
			function swing_handler(){
				$this.each(function(i,n) {
                    $(n).data({dir:imath.randomPlus()})
					swing_set($(n));
                });
			}//end func
			
			function swing_set($n){
				var dir=$n.data('dir');
				var range=imath.randomRange(Math.floor(opts.degree*0.5),opts.degree);
				var speed=range*opts.speed;
				$n.transition({ rotate: dir*range },speed,'in-out',function(){
					$n.transition({ rotate: -dir*range },speed,'in-out',function(){
						if(!$end) swing_set($n);
						else $n.transition({ rotate: $rotateOrg },speed);
					});
				});
			}//end func
			
		},//end fn
		swingOff: function(value) {
			$(this).triggerHandler('off');
		}//end fn	
	});//end extend
})(jQuery);//闭包