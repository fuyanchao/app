//	@@拍照涂鸦工具类
//
//	@@依赖类库：jquery.js jcanvas.js 要先加载这两个类
//
//	@@使用方法：
//		#canvas 是当前使用的canvas对对象的ID
//		$("#canvas").DrawBoardOn();
//		注：该功能包括上传图片和绘图功能 绘图功能默认是关闭的
//		需要通过 DrawBoardUnLock()方法来解锁
//
//	@@参数：
//		stageWidth 画布的宽度     (必填)
//		stageHeight 画布的高度   (必填)
//		picUploaded 图片上传成功回调函数   
//		picDownload 图片下载回调函数 返回的是图片的base64格式
//
//	@@关于用法
//		基本上所有接口都是基于a标签来定制的
//		例如上传图片 <a href="#drawBoard" data-cameraPic  = "true">上传照片</a>
//		a标签的href改用什么？答：其实就是#加canvas的ID
//
//	下面具体描述一下 接口功能的定义属性
//	@@照片上传相关定义
//		data-cameraPic = "true" 上传照片 值其实可以随便填写的 用true是好看~~~~~ 只要data-cameraPic存在于a标签上面就行
//		data-cameraLarger = "true" 照片放大 值的含义等同于上传照片
//		data-cameraSmall = "true" 照片缩小 值的含义等同于上传照片
//
//	@@涂鸦相关定义
//		data-sketchClear = "true" 重新画 值的含义等同于上传照片
//		data-sketchCancel = "true" 上一步 值的含义等同于上传照片
//		data-sketchDownLoad = "true" 下载图片 值的含义等同于上传照片
//		data-sketchColor = "#fff" 更换画笔的颜色 值的写法和css的color一样 
//		data-sketchSize = "1" 更换画笔粗细 这里只允许输入整数 1-10 默认是没有大小限制的 最好还是根据项目实际效果来添加 



(function($) {
	$.fn.extend({
		DrawBoardOn:function(opts){
			var cameraTool = null; 
			var sketchTool = null;
			var canvas = $(this);
			var options = $.extend({
				stageWidth:320,
				stageHeight:320,
				picUploaded:null,//图片上传成功
				picDownload:null//图片下载
			},opts);
			//初始化
			init();
			
			function init(){	
				initEvents();
				initDelegate();
				initTool();
			}			
			function initEvents(){
				canvas.one("off",destoryHandler);
				canvas.on("lock",lockHandler).on("unlock",unLockHandler);
			}
			function initDelegate(){
				$("body").delegate("a[href=\"#" + (canvas.attr('id')) + "\"]",'click',delegateHandler);
			}
			//初始化工具
			function initTool(){
				cameraTool = new CameraTool(canvas);
				sketchTool = new SketchTool(canvas);
			}
			//事件代理
			function delegateHandler(e){
				var $this = $(this);
				if($this.attr('data-cameraPic')){
					
					cameraTool.cameraPic(function(){
						sketchTool.resetDraw();
						if(options.picUploaded)
						{
							options.picUploaded();
						}
					});
				}
				else if($this.attr('data-cameraLarger')){
					canvas.clearCanvas();
					cameraTool.cameraLarger();
					sketchTool.resetDraw();
				}
				else if($this.attr('data-cameraSmall')){
					canvas.clearCanvas();
					cameraTool.cameraSmall();
					sketchTool.resetDraw();
				}
				else if($this.attr('data-sketchColor')){
					sketchTool.setColor($this.attr('data-sketchColor'));
				}
				else if($this.attr('data-sketchSize')){
					sketchTool.setSize($this.attr('data-sketchSize'));
				}
				else if($this.attr('data-sketchDownLoad')){
					if(options.picDownload)
					{
						options.picDownload(sketchTool.download());
					}
				}
				else if($this.attr('data-sketchCancel')){
					canvas.clearCanvas();
					cameraTool.redraw();
					sketchTool.cancel();
				}
				else if($this.attr('data-sketchClear')){
					canvas.clearCanvas();
					cameraTool.redraw();
					sketchTool.clear();
				}
			}
			function destoryHandler(){
				cameraTool.destory();
				cameraTool = null;
				$("body").undelegate("a[href=\"#" + (canvas.attr('id')) + "\"]",'click',delegateHandler);
			}
			function lockHandler(){
				sketchTool.setLock(true);
				cameraTool.setLock(false);
			}
			function unLockHandler(){
				sketchTool.setLock(false);
				cameraTool.setLock(true);
			}
		},
		DrawBoardOff:function(){
			$(this).trigger('off');
		},
		DrawBoardLock:function(){
			$(this).trigger('lock');
		},
		DrawBoardUnLock:function(){
			$(this).trigger('unlock');
		},
		DrawBoardDownLoad:function(){
			sketchTool.download();
		}
	});
	
	//拍照 上传本地图片工具类
	CameraTool = (function(){
		function CameraTool(canvas){
			var self = this;
			self.isLock = false;
			self.imgUrl = null;
			self.options = {
				speed:0.05,
				imgScale:1,
				scaleMin:0.1,
				scaleMax:2
			};
			self.control = {
				mutiTouch:false,
				posLast1:[],
				posLast2:[],
				disLast:null,
				degSt:null,
				degLast:null,
				changeObj:{
					x:0,
					y:0,
					rotate:0
				}
			};
			self.imgScale = self.options.imgScale;
			self.canvas = canvas;
			self.picW = self.picH = 0;
			self.fileBox = null;
			self.fileInput = null;
			//初始化			
			self.init();
			self.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', self.onEvent.bind(this));
		}
		CameraTool.prototype.init = function(){
			var self = this;
			self.fileBox = $('<div id="fileBox"><input type="file" capture="camera" accept="image/*" name="fileInput"/></div>').appendTo($("body"));
			self.fileInput = self.fileBox.children();
			
		}
		CameraTool.prototype.onEvent = function(e){
			var self = this;
			if(self.isLock || self.imgUrl == null)return;
			if (e.originalEvent && e.originalEvent.targetTouches) {
				if (e.type == 'touchend')
					e.pageX = e.originalEvent.pageX;
				else {
					e.pageX = e.originalEvent.targetTouches[0].pageX;
					e.pageY = e.originalEvent.targetTouches[0].pageY;
				}
			}
			switch(e.type){
				case 'mousedown':
				
					break;
				case 'mouseup':
				case 'mouseout':
				case 'mouseleave':
				case 'touchstart':
					if(event.touches.length==1){
						self.control.mutiTouch = false;
						self.control.posLast1 = [event.touches[0].clientX,event.touches[0].clientY];
					}
					else if(event.touches.length>=2){
						self.control.mutiTouch=true;
						self.control.posLast1 = [event.touches[0].clientX,event.touches[0].clientY];
						self.control.posLast2 = [event.touches[1].clientX,event.touches[1].clientY];
						self.control.disLast = self.getDis(self.control.posLast1,self.control.posLast2);
						self.control.degSt = self.control.degLast = self.getDeg(self.control.posLast1,self.control.posLast2);
					}//end if
					break;
				case 'touchmove':
					
					if(!self.control.mutiTouch && event.touches.length==1){
						var pos1 = [event.touches[0].clientX,event.touches[0].clientY];
						self.control.changeObj.x += pos1[0] - self.control.posLast1[0];
						self.control.changeObj.y += pos1[1] - self.control.posLast1[1];
						self.control.posLast1 = pos1;
					}
					else if(event.touches.length>=2){
						var pos1 = [event.touches[0].clientX,event.touches[0].clientY];
						var pos2 = [event.touches[1].clientX,event.touches[1].clientY];
						var dis = self.getDis(pos1,pos2);
						var deg = self.getDeg(pos1,pos2);
						if(Math.abs(dis - self.control.disLast) > 0.5){
							self.imgScale += 0.01*(dis - self.control.disLast) / Math.abs(dis - self.control.disLast);
							self.setScale();
						}
						self.control.changeObj.rotate += deg - self.control.degLast;
						self.control.posLast1 = pos1;
						self.control.posLast2 = pos2;
						self.control.disLast = dis;
						self.control.degLast = deg;
					}
					self.canvas.clearCanvas();
					self.redraw();
					break;
				case 'touchend':
					self.control.mutiTouch = (event.touches.length >= 1)?true:false;
					break;
			}
		}
		CameraTool.prototype.getDis = function(arr1,arr2){
			//获得2点之间的距离
			var lineX=arr2[0]-arr1[0];
			var lineY=arr2[1]-arr1[1];
			return Math.sqrt(Math.pow(Math.abs(lineX),2)+Math.pow(Math.abs(lineY),2));
		}
		CameraTool.prototype.getDeg = function(arr1,arr2){
			//获得2点之间的夹角
			var deg;
			if(arr1[0] == arr2[0] && arr1[1] == arr2[1])
			{
				deg=0;
			}else{
				var dis_y = arr2[1]-arr1[1];
				var dis_x = arr2[0]-arr1[0];	
				deg = Math.atan(dis_y/dis_x)*180/Math.PI;
				if (dis_x<0) {deg=180+deg;}
				else if (dis_x>=0 && dis_y<0) {deg=360+deg;}
			}
			return deg;
		}
		CameraTool.prototype.setLock = function(value){
			var self = this;
			self.isLock = value;
		}
		CameraTool.prototype.destory = function(){
			
		}
		//重绘
		CameraTool.prototype.redraw = function(){
			var self = this;
			if(self.imgUrl == null)return;
			
			self.canvas.drawImage({
//				layer:true,
				name:"Camera",
				source: self.imgUrl,
				width:self.picW*self.imgScale,
				height:self.picH*self.imgScale,
				x: self.canvas.width()*0.5+self.control.changeObj.x,
				y: self.canvas.height()*0.5+self.control.changeObj.y,
				rotate:self.control.changeObj.rotate,
				fromCenter: true
			});
			self.setScale();
		}
		//上传照片
		CameraTool.prototype.cameraPic = function(back){
			var self = this;
			self.cameraPicBack = back;
			self.fileInput.one('change',fileSelected);
			self.fileInput.click();
			function fileSelected(e){
				var file = this.files[0];
				if (file) {
				  	var reader = new FileReader();  
				  	reader.onloadend = function() {
						if(this.result.length>0) imgCreate(this.result);
						else alert('无法正确读取图片');
				  	}
					reader.readAsDataURL(file);	
		        }
			}
			function imgCreate(src){
				self.canvas.clearCanvas();
				self.imgUrl = src;
				self.imgScale = self.options.imgScale;
				self.control.mutiTouch = false;
				self.control.posLast1 = [];
				self.control.posLast2 = [];
				self.control.disLast = null;
				self.control.degSt = null;
				self.control.degLast = null;
				self.control.changeObj = {
					x:0,
					y:0,
					rotate:0
				}
				var img = new Image();
				img.onload = function(){
					self.picW = img.width;
					self.picH = img.height;
					if(self.picW > self.canvas.width() || self.picH > self.canvas.height())
					{
						var sizeArr = autoSize([self.picW,self.picH],[self.canvas.width(),self.canvas.height()]);
						self.picW = sizeArr[0];
						self.picH = sizeArr[1];
					}
					self.redraw();
					if(self.cameraPicBack)
					{
						self.cameraPicBack();
					}
				}
				img.src = src;
			}
			//等比缩放
			function autoSize(aryNum,aryMax){
				var aryNow=new Array()
				var aryRate= aryNum[0]/aryNum[1];
				aryNow[0] = aryMax[0];
				aryNow[1] = Math.round(aryNow[0]/aryRate);
				if(aryNow[1]<aryMax[1]){
					aryNow[1]=aryMax[1];
					aryNow[0] = Math.round(aryNow[1]*aryRate);
				}			
				return aryNow;
			}
		}
		//放大
		CameraTool.prototype.cameraLarger = function(){
			var self = this;
			self.imgScale += self.options.speed;
			self.setScale();
			self.redraw();
		}
		//缩小
		CameraTool.prototype.cameraSmall = function(){
			var self = this;
			self.imgScale -= self.options.speed;
			self.setScale();
			self.redraw();
		}
		//计算缩放比列 限制在最小和最大之间
		CameraTool.prototype.setScale = function(){
			var self = this;
			self.imgScale = (self.imgScale<=self.options.scaleMin)?self.options.scaleMin:self.imgScale;
			self.imgScale = (self.imgScale>=self.options.scaleMax)?self.options.scaleMax:self.imgScale;
		}
		
		return CameraTool;
	})();
	
	
	//绘图工具类
	SketchTool = (function(){
		function SketchTool(canvas,opts){
			var self = this;
			self.isLock = true;
			self.actions = [];
			self.action = null;
			self.canvas = canvas;
			
			self.options = $.extend({
				defaultColor: '#000000',
				defaultSize: 5
			}, opts);
			self.painting = false;
			self.color = self.options.defaultColor;
			self.size = self.options.defaultSize;
			
			self.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', self.onEvent.bind(this));
		}
		//提供下载接口
		SketchTool.prototype.download = function(format) {
			var self = this;
			var mime;
			format || (format = "png");
			if (format === "jpg") {
				format = "jpeg";
			}
			mime = "image/" + format;
			return self.canvas[0].toDataURL(mime);
//			return window.open();
		};
		//是否锁定
		SketchTool.prototype.setLock = function(value){
			var self = this;
			self.isLock = value;
		}
		SketchTool.prototype.onEvent = function(e) {
			var self = this;
			if(self.isLock)return;
			if (e.originalEvent && e.originalEvent.targetTouches) {
				if (e.type == 'touchend')
					e.pageX = e.originalEvent.pageX;
				else {
					e.pageX = e.originalEvent.targetTouches[0].pageX;
					e.pageY = e.originalEvent.targetTouches[0].pageY;
				}
			}
			switch (e.type) {
				case 'mousedown':
				case 'touchstart':
					self.startPainting();
					break;
				case 'mouseup':
				case 'mouseout':
				case 'mouseleave':
				case 'touchend':
				case 'touchcancel':
					self.stopPainting();
					break;
			}
			if (self.painting) {
				self.action.events.push({
					x: e.pageX - self.canvas.offset().left,
					y: e.pageY - self.canvas.offset().top,
					event: e.type
				});
				self.redraw();
			}
			e.preventDefault();
			return false;
		}
		SketchTool.prototype.setColor = function(color){
			var self = this;
			self.color = color;
		}
		SketchTool.prototype.setSize = function(size){
			var self = this;
			self.size = size;
		}
		SketchTool.prototype.resetDraw = function(){
			var self = this;
			for(var i = 0; i < self.actions.length; i++){
				self.action = self.actions[i];
				self.redraw();
			}
		}
		SketchTool.prototype.cancel = function() {
			var self = this;
			self.actions.pop();
			for(var i = 0; i < self.actions.length; i++){
				self.action = self.actions[i];
				self.redraw();
			}
		}
		SketchTool.prototype.clear = function() {
			var self = this;
			self.actions = [];
		}
		SketchTool.prototype.startPainting = function() {
			var self = this;
			self.painting = true;
			self.action = {
				color: self.color,
				size: parseFloat(self.size),
				events:[]
			};
		}
		SketchTool.prototype.stopPainting = function() {
			var self = this;
			if (self.action) {
				self.actions.push(self.action);
			}
			self.painting = false;
//			self.redraw();
			self.action = null;
		}
		SketchTool.prototype.redraw = function() {
			var self = this,ref,i,len,event;
			if(self.action == null)return;
			
			//默认先画一个 避免用户点击一下 没有出现点点的问题
			var obj1 = {
				strokeStyle: self.action.color,
			    strokeWidth: self.action.size,
			    rounded: true,
			    x1:self.action.events[0].x,y1:self.action.events[0].y,
			    x2:self.action.events[0].x+0.1,y2:self.action.events[0].y+0.11,
			};
			self.canvas.drawLine(obj1);
			
			
			var obj = {
				strokeStyle: self.action.color,
			    strokeWidth: self.action.size,
			    rounded: true
			};
			ref = self.action.events;
			for (i = 0, len = ref.length; i < len; i++) {
				event = ref[i];
				obj['x'+(i+1)] = event.x;
  				obj['y'+(i+1)] = event.y;
			}
			self.canvas.drawLine(obj);
		}
		
		return SketchTool;
	})();
	
})(jQuery);
