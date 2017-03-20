//2014.12.9
(function($) {	
	jQuery.fn.extend({
		spriteOn: function(option) {
			var _this=$(this);
			var _box=_this.children('.box');
			var _load=_this.children('.load');
			var _sign=_this.children('.sign');
			var _file,_sp,_dir,_timer;
			var imgNow,imgMax,imgWd,imgHt,imgSelf,imgPath,imgTest;
			var posXSt,posYSt,posXLast,posYLast;
			var idBox;
			if(option){
				imgMax=option.num!=null?option.num:30;//图片多少张
				imgPath=option.path!=null?option.path:_this.data('path');//360图片路径
				imgWd=option.width;
				imgHt=option.height;
				imgTest==option.test!=null?option.test:false;//是否测试
				_file=option.file!=null?option.file:'jpg';
				_sp=option.speed!=null?option.speed:50;
			}//end if
			else{
				imgMax=30;//u向图片多少张
				imgPath=_this.data('path');//360图片路径
				imgTest=false;
				_file='jpg';
				_sp=50;
			}//end else
			
			loadFunc();
			
			function loadFunc(){
				//载入图
				var loader = new PxLoader();
				for(var i=0; i<imgMax; i++) loader.addImage(imgPath+i+'.'+_file);			
				loader.addProgressListener(function(e) { 
					_load.html(Math.round(e.completedCount/e.totalCount*100)); 
				}); 			
				loader.addCompletionListener(function() {
					if(window.console) console.log('load complete');
					_load.remove();
					_sign.show();
					init();
					loader=null;
				});			
				loader.start();	
			}//end func
			
			function init(){
				_dir=1;
				_box.empty();
				if(imgTest) idBox=$('<i></i>').appendTo(_box);	
				imgSelf=$('<img>').appendTo(_box);	
				var size=[];
				if(imgWd && imgHt && imgWd>0 && imgHt>0){
					size=mathAutoSize([imgWd,imgHt],[_box.width(),_box.height()]);
					imgSelf.css({width:size[0],height:size[1],marginLeft:Math.floor(_box.width()/2-size[0]/2),marginTop:Math.floor(_box.height()/2-size[1]/2)});
				}//end if
				_this.on("off",_this_off).on("reset",resetFunc);
				_this.on("click",_this_click);
				resetFunc();
			}//end func
			
			
			//关闭功能
			function _this_off(e){
				_this.off("off",_this_off).off("reset",resetFunc);
				_this.off("click",_this_click);
			}//end func
						
			//--------自定义事件
			function resetFunc(event){
				if(window.console) console.log('frame reset');
				imgNow=0;	
				upShowCar();
			}//end func
			
			//----------------click事件
			function _this_click(e){
				_sign.hide();
				if(imgNow==0) _dir=1;
				else if(imgNow==imgMax-1) _dir=-1;
				_this.off("click",_this_click);
				clearTimeout(_timer);
				_timer=setTimeout(sequence,_sp);
			}//end if
			
			function sequence(){
				imgNow+=_dir;
				upShowCar();
				if( (_dir>0 && imgNow<imgMax-1) || (_dir<0 && imgNow>0) ){
					_timer=setTimeout(sequence,_sp);
				}//end if
				else _this.on("click",_this_click);
			}//end func
			
			//----------图片切换
			function upShowCar(){
				var src=imgPath+imgNow+'.'+_file;
				//console.log('src:'+src);
				if(imgTest) idBox.text(src);
				imgSelf.attr({src:src});
			};//end func
		
			function mathAutoSize(aryNum,aryMax){
				var aryNow=new Array()
				var aryRate = aryNum[0]/aryNum[1];
				aryNow[0] = aryMax[0];
				aryNow[1] = Math.round(aryNow[0]/aryRate);
				if(aryNow[1]>aryMax[1]){
					aryNow[1] = aryNow[1]<=aryMax[1] ? aryNow[1] : aryMax[1];
					aryNow[0] = Math.round(aryNow[1]*aryRate);
				}//end if
				return aryNow;
			}//end func
			
		},//end fn		
		spriteReset: function() {
			$(this).trigger('reset');
		},//end fn
		spriteOff: function(value) {
			$(this).trigger('off');
		}//end fn	
	});//end extend
})(jQuery);//闭包