//2014.12.9
(function($) {	
	jQuery.fn.extend({
		w360: function(option) {	
			var _this=$(this);
			var imgU,imgUMax,imgWd,imgHt,imgSelf,imgPath,imgTest;
			var posXSt,posYSt,posXLast,posYLast;
			var idBox;
			if(option){
				imgUMax=option.umax!=null?option.umax:30;//水平向图片多少张
				imgPath=option.path!=null?option.path:'images/360/outer/';//360图片路径
				imgWd=option.width;
				imgHt=option.height;
				imgTest==option.test!=null?option.test:false;//是否测试
			}//end if
			else{
				imgUMax=30;//u向图片多少张
				imgPath='images/360/outer/';//360图片路径
				imgTest=false;
			}//end else
			init();
			
			function init(){
				_this.empty();
				if(imgTest) idBox=$('<i></i>').appendTo(_this);	
				imgSelf=$('<img>').appendTo(_this);	
				var size=[];
				if(imgWd && imgHt && imgWd>0 && imgHt>0){
					size=mathAutoSize([imgWd,imgHt],[_this.width(),_this.height()]);
					imgSelf.css({width:size[0],height:size[1],marginLeft:Math.floor(_this.width()/2-size[0]/2),marginTop:Math.floor(_this.height()/2-size[1]/2)});
				}//end if	
				_this.on("reset",resetFunc).on("goto",gotoFunc);
				_this.on("touchstart",touchstartHandler);
				resetFunc();
			}//end func
			
			
						
			//--------自定义事件
			function resetFunc(event){
				if(window.console) console.log('carw360 reset');
				imgU=0;	
				upShowCar();
			}//end func
			function gotoFunc(event,value){
				imgU=value;	
				upShowCar();
			}//end func				
			
			//-----------------touch事件
			function touchstartHandler(e){
				e.preventDefault();	
				posXLast=posXSt=event.touches[0].clientX;
				posYLast=posYSt=event.touches[0].clientY;
				_this.on("touchmove",touchmoveHandler);
				_this.on("touchend",touchendHandler);
			}//end func
			function touchmoveHandler(e){
				e.preventDefault();
				moveHandler(event.changedTouches[0].clientX,event.changedTouches[0].clientY);
				posXLast=event.changedTouches[0].clientX;
				posYLast=event.changedTouches[0].clientY;
			}//end func
			function touchendHandler(e){
				e.preventDefault();
				_this.off("touchmove",touchmoveHandler).off("touchend",touchendHandler);
			}//end func
			
			
			function moveHandler(x,y){
				var disX=Math.floor(Math.abs(posXSt-x));
				var disY=Math.floor(Math.abs(posYSt-y));
				var moveX=Math.abs(posXLast-x);
				var moveY=Math.abs(posYLast-y);
				if( moveY<=moveX*2.5 && disX%2==0 ){
					if(posXLast>x) imgU++;
					else imgU--;
				}//end if
				upShowCar();
			}//end func
			
			//----------图片切换
			function upShowCar(){
				imgU=imgU>imgUMax-1?0:imgU;
				imgU=imgU<0?imgUMax-1:imgU;
				var src=imgPath+imgU+'.jpg';
				if(window.console) console.log('src:'+src);
				if(imgTest) idBox.text(src);
				imgSelf.attr({src:src});
			};//end func
			
			//---------通用函数
			
			function mouseSelectOff(){
				document.onselectstart = function () { return false; };	
				document.unselectable= "on";
				$('body').css({"-moz-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none"});
			}//end func
	
			function mouseSelectOn(){
				document.onselectstart = function () { return true; };
				document.unselectable= "off";
				$('body').css({"-moz-user-select":"auto","-webkit-user-select":"auto","-ms-user-select":"auto","user-select":"auto"});
			}//end func
		
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
		w360Reset: function() {
			$(this).trigger('reset');
		},//end fn
		w360Goto: function(value) {
			value=value||0;
			$(this).trigger('goto',[value]);
		}//end fn		
	});//end extend
})(jQuery);//闭包