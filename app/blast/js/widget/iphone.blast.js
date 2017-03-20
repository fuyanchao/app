//2015.11.16
(function($) {	
	$.fn.extend({
		blast: function(options) {	
			var $this=$(this);
			var $boxes,$removes;
			var defaults = {x:0,y:0,num:50,speed:250,ratio:5,roll2D:false,roll3D:false,skew:false,type:1,style:'style',offsetY:0,offsetX:0,rangeX:$(window).width()*0.5,rangeY:$(window).height()*0.5};
			var opts = $.extend(defaults, options);
			
			init();
			
			function init(){
				$this.empty().hide();
				$this.on('off',$this_off).on('on',$this_on);
				box_creat();
			}//end func	
			
			function $this_on(){
				$this.show();
				$removes=0;
				for(var i=0; i<$boxes.length; i++) box_move($boxes[i]);
			}//end func
			
			function $this_off(e){
				$this.off('off',$this_off).off('on',$this_on).remove();
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function box_creat() {
				$boxes=[];
				for(var i=0; i<opts.num; i++){
					var box=$('<i></i>').appendTo($this);
					box_set(box,i);
				}//end for
				if(opts.onLoaded) opts.onLoaded($this);
			}//end func
			
			function box_set(box,id){
				if(opts.type>1) box.removeClass().addClass(opts.style+imath.randomRange(1,opts.type));
				var ratio=imath.randomRange(1,opts.ratio);//远近比例参数,5 LEVEL
				if(opts.ratio>1) var scale=0.1+ratio*0.18;
				else var scale=1;
				var x=opts.x;
				if(opts.offsetX!=0) x+=imath.randomRange(-opts.offsetX,opts.offsetX);
				var y=opts.y;
				if(opts.offsetY!=0) y+=imath.randomRange(-opts.offsetY,opts.offsetY);
				var x_tar=x+imath.randomRange(-opts.rangeX,opts.rangeX);
				var y_tar=y+imath.randomRange(-opts.rangeY,opts.rangeY);
				var speed=opts.speed+(opts.ratio-ratio)*imath.randomRange(opts.speed,opts.speed*2);
				var rotate=imath.getDeg([x,y],[x_tar,y_tar])-90;
				var css={x:x,y:y,scale:scale,rotate:rotate,opacity:1};
				var trans={x:x_tar,y:y_tar,rotate:rotate,opacity:0};
				if(opts.roll2D) trans.rotate='+='+(opts.speed*0.1*imath.randomRange(10,20)*0.1*imath.randomPlus());
				if(opts.roll3D){
					css.perspective=400;
					css.rotateX=imath.randomRange(-45,45);
					css.rotateY=imath.randomRange(-45,45);
					trans.rotateX=360+imath.randomRange(0,360);
					trans.rotateY=360+imath.randomRange(0,360);
				}//end else
				if(opts.skew){
					css.skewX=imath.randomRange(-45,45);
					css.skewY=imath.randomRange(-45,45);
				}//end else
				var data={speed:speed,trans:trans,id:id};
				box.css(css).data(data);
				$boxes.push(box);
			}//end func
			
			function box_move(box){
				var data=box.data();
				var speed=data.speed;
				var trans=data.trans;
				var id=data.id;
				box.transition(trans,speed,function(){
					$(this).remove();
					$boxes.splice(id,1,null);
					$removes++;
					if($removes==opts.num){
						$this_off();
						if(opts.onComplete) opts.onComplete($this);
					}//end if
				});
			}//end func
			
		},//end fn
		blastOn: function() {
			$(this).triggerHandler('on');
		},
		blastOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包