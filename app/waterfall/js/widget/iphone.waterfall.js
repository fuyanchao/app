//2015.11.16
(function($) {
	$.fn.extend({
		waterfallInit: function(options) {
			var $this=$(this);
			var $box,$boxWd,$boxHt,$htMin,$boxColumn,$boxLast;
			var $boxPics,$boxPicsNow,$boxPicsMax,$boxAdd,$boxPadding;
			var loadBox=$('aside.loadBox');
			var defaults = {speed:5,image:".pic"};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){
				$boxLast=0;
				$boxPadding=0;
				$this.on("off",this_off).on("add",this_add);
				$(window).on("resize",this_reset);
			}//end func
			
			function this_off(){
				$this.off("off add");
				$(window).off("resize",this_reset);
				if(opts.onOff) opts.onOff($this);
			}//end if
			
			function this_reset(){
				$box=$this.children();
				$boxLast=$box.length;
				$boxWd=$box.last().outerWidth();
				$htMin=[];
				$boxColumn=Math.floor($this.innerWidth()/($boxWd+opts.speed*2));
				$boxColumn=$boxColumn<1?1:$boxColumn;
				$boxPics=$box.children(opts.image).children("img");
				var col=$box.length<$boxColumn?$box.length:$boxColumn;
				$boxPadding=Math.floor(($this.innerWidth()-($boxWd+opts.speed*2)*col)/2);
				$boxAdd=false;
				box_load();
			}//end func
			
			function this_add(e){
				if($boxLast>$boxColumn-1){
					var boxes=$this.children();
					$box=boxes.eq($boxLast-1).nextAll();
					$boxPics=$box.children(opts.image).children("img");
					$boxLast=boxes.length;
					$this.data({num:$boxLast});
					$box.hide();
					$boxAdd=true;
					box_load();
				}//end if
				else setTimeout(this_reset,100);
			}//end func
			
			function box_load(){
				loadBox.show();
				var loader = new PxLoader();
				$boxPics.each(function(i) {
				   loader.addImage($(this).attr('src'));
                });
				loader.addCompletionListener(function() {
					console.log('all load complete!');	
					icom.fadeOut(loadBox,250);
					box_handler();
				});			
				loader.start();
			}//end func
			
			function box_handler(){
				for (var i=0; i<$box.length; i++){
					var box=$box.eq(i);
					var ht=box.outerHeight()+opts.speed;
					if(i<$boxColumn && !$boxAdd){
						$htMin[i]=ht+opts.speed;
						box.css({x:$boxPadding+opts.speed + i * ($boxWd + opts.speed*2),y:0,visibility:'visible',opacity:0}).transition({opacity:1},250);
					}//end 第一行
					else{
						var minH=Math.min.apply({}, $htMin);//获得最短列的高
						var minId;
						for(var j=0; j<$htMin.length; j++){
							if(minH==$htMin[j]){
								minId=j;
								break;
							}//end if
						}//end for //获得最短列的序列号
						$htMin[minId] += ht+opts.speed; //从新赋值最短列的高度
						//将单元塞入最短列的下方
						box.show().css({x:$boxPadding+opts.speed + minId * ($boxWd + opts.speed*2),y:minH,visibility:'visible',opacity:0}).transition({opacity:1},250);;
					}//end 第二行以上
				}//end for
				$this.height(Math.max.apply({}, $htMin));
			}//end func
		},//end fn	
		waterfallAdd: function() {
			$(this).triggerHandler('add');
		},//end fn
		waterfallOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend
})(jQuery);//闭包