//2015.12.18
(function($) {
	$.fn.extend({
		raindropOn: function(options) {
			var $this=$(this);
			var $end=false;
			var defaults = {num:50,delay:250,width:$this.width(),height:$this.height()};
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
			
			function box_creat(){				
				for(var i=0; i<opts.num; i++){
					var box=$('<i></i>').hide().appendTo($this);
					setTimeout(box_new,imath.randomRange(0,opts.delay),box);
				}//edn for
			}//end func
			
			function box_new(box){
				var x=imath.randomRange(0,opts.width);
				var y=imath.randomRange(0,opts.height);
				var wd=0.5+imath.randomRange(1,6)*0.1;
				var ht=0.5+imath.randomRange(4,8)*0.1;
				var scale=imath.randomRange(5,10)*0.1;
				var alpha=0.2+imath.randomRange(1,3)*0.1;
				var css={x:x,y:y,scale:0,opacity:alpha};
				var data={x:x,y:y};
				box.css(css).data(data).show().transition({scale:scale}, 1000+imath.randomRange(1000,2000), function(){
					box_move($(this));
				});
			}//end func
			
			function box_move(box){
				var data=box.data();
				data.y+=Math.floor(Math.random()*40)+10;
				box.transition({x:data.x,y:data.y}, Math.floor((Math.random()*1000)+1000), "ease",function(){
					if(!$end){
						if(data.y>opts.height){
							$(this).hide();
							setTimeout(box_new,imath.randomRange(0,opts.delay),$(this));
						}//end if
						else setTimeout(box_move,opts.delay+imath.randomRange(0,40)*0.1,$(this));
					}//end if
					else box.transition({opacity:0,scale:0.1},1000,function(){
						$(this).remove();
					});
				});
			}//end func

				
		},//end fn
		raindropOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend
})(jQuery);//闭包