//2016.6.13
(function($) {	
	jQuery.fn.extend({
		frameOn: function(options) {
			var $this=$(this);
			var $box=$this.children('.box');
			var $load=$this.find('.load');
			var $sign=$this.children('.sign');
			var $now,$self;
			var $rate=Math.round($(window).width()/320);
			var xSt,ySt,xLast,yLast;
			var defaults = {num:30,type:'jpg',repeat:true};
			var opts = $.extend(defaults,options);
			if(opts.path) load_handler();
			
			function load_handler(){
				$load.show();
				var loader = new PxLoader();
				var loadTxt=$load.children('b');
				for(var i=0; i<opts.num; i++) loader.addImage(opts.path+i+'.'+opts.type);			
				loader.addProgressListener(function(e) { 
					loadTxt.html(Math.round(e.completedCount/e.totalCount*100)); 
				}); 			
				loader.addCompletionListener(function() {
					console.log('frame images load complete');
					loader=null;
					$load.hide();	
					init();
				});			
				loader.start();	
			}//end func
			
			function init(){
				$sign.show();
				$box.empty();
				$self=$('<img>').appendTo($box);	
				var size=[];
				if(opts.width && opts.height && opts.width>0 && opts.height>0){
					size=imath.autoSize([opts.width,opts.height],[$box.width(),$box.height()]);
					$self.css({width:size[0],height:size[1],marginLeft:Math.floor($box.width()/2-size[0]/2),marginTop:Math.floor($box.height()/2-size[1]/2)});
				}//end if
				$this.on("off",this_off).on("reset",this_reset).on("goto",this_goto);
				$this.on("touchstart",touch_start).on("touchmove",touch_move);
				this_reset();
			}//end func
			
			function this_off(e){
				$this.off("off reset goto");
				$this.off("touchstart",touch_start).off("touchmove",touch_move);
				if(opts.onOff) opts.onOff($this);
			}//end func
						
			function this_reset(e){
				$now=0;	
				image_switch();
			}//end func
			function this_goto(e,id){
				$now=id;	
				image_switch();
			}//end func	
			
			function touch_start(e){
				e.preventDefault();	
				xLast=xSt=e.originalEvent.touches[0].clientX;
				yLast=ySt=e.originalEvent.touches[0].clientY;
			}//end func
			
			function touch_move(e){
				e.preventDefault();
				e.stopPropagation();
				move_handler(e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY);
				xLast=e.originalEvent.touches[0].clientX;
				yLast=e.originalEvent.touches[0].clientY;
			}//end func
			
			function move_handler(x,y){
				var disX=Math.floor(Math.abs(xSt-x));
				var disY=Math.floor(Math.abs(ySt-y));
				var moveX=Math.abs(xLast-x);
				var moveY=Math.abs(yLast-y);
				if( moveY<=moveX*2.5 && disX%$rate==0 ){
					if(opts.repeat) $now=xLast<x?$now-1:$now+1;
					else $now=xLast>x?$now-1:$now+1;
				}//end if
				image_switch();
			}//end func
			
			function image_switch(){
				if(opts.repeat){
					$now=$now>opts.num-1?0:$now;
					$now=$now<0?opts.num-1:$now;
				}//end if
				else{
					$now=$now>opts.num-1?opts.num-1:$now;
					$now=$now<0?0:$now;
				}//end else
				var src=opts.path+$now+'.'+opts.type;
				//console.log('img src:'+src);
				$self.attr({src:src});
				if(os.iphone6 || os.iphone6Plus){
					$self.css({opacity:0.99});
					setTimeout(function(){
						$self.css({opacity:1});
					},50);
				}//edn if
			};//end func
			
		},//end fn		
		frameReset: function() {
			$(this).triggerHandler('reset');
		},//end fn
		frameGoto: function(id) {
			id=id||0;
			$(this).triggerHandler('goto',[id]);
		},//end fn	
		frameOff: function() {
			$(this).triggerHandler('off');
		}//end fn	
	});//end extend
})(jQuery);//闭包