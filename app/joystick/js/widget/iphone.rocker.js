/**
 * 摇杆控制类
 * x   -1 左   1 右   0 X轴不变化
 * y   -1 上   1 下   0 y轴不变化
 * 
 * options参数
 * moveFlag 摇动对象
 * moveBg 摇杆背景区域
 * delaKeyFunc 摇动过程回调函数 回调参数(xflag,yflag)
 * */
function Rocker(options) {
	var self = this;
	self.init(options);
}

//范围 抽象类
function RockerRect(x, y, width, height) {
	var self = this;
	self.x = x;
	self.y = y;
	self.width = width;
	self.height = height;
}
//计算点是否包含在范围内
RockerRect.prototype.contains = function(x, y) {
	var self = this;
	return self.x <= x && self.x + self.width >= x && self.y <= y && self.y + self.height >= y;
}
//错误描述
Rocker.MSG = {
	"OPTIONS_NONE": "options 参数不存在",	
	"OPTIONS_MOVE_FLAG_NONE": "options.moveFlag 摇杆控制UI参数不存在",
	"OPTIONS_MOVE_BG_NONE": "options.moveBg 摇杆控制背景区域UI参数不存在"
}
Rocker.prototype.init = function(options) {
	var self = this;
	var gameFps = Math.floor(1000/30);
	self.keys = [0,0];
	if (options == undefined || options == null) {
		alert(Rocker.OPTIONS_NONE);
		return;
	}
	if (options.moveFlag == undefined || options.moveFlag == null) {
		alert(Rocker.OPTIONS_MOVE_FLAG_NONE);
		return;
	}
	if (options.moveBg == undefined || options.moveBg == null) {
		alert(Rocker.OPTIONS_MOVE_BG_NONE);
		return;
	}
	self.isMoveing = false;
	
	//摇杆ICON
	self.moveFlag = options.moveFlag;
	//摇杆背景
	self.moveBg = options.moveBg;
	//摇杆背景 起始坐标
	self.moveBgX = self.moveBg.offset().left;
	self.moveBgY = self.moveBg.offset().top;
	
	//帧频
	gameFps = options.gameFps != null ? options.gameFps : gameFps;
	self.delaKeyFunc = options.delaKeyFunc != null ? options.delaKeyFunc : null;
	self.delaKeyTarget = options.delaKeyTarget != null ? options.delaKeyTarget : null;
	
	self.moveFlagGoX = self.moveFlagGoY = 0;
	//摇杆icon 起始坐标（相对于父级的）
	self.moveFlagX = self.moveFlag.position().left;
	self.moveFlagY = self.moveFlag.position().top;
	//中心点宽度
	self.moveFlagWidthHelf = self.moveBg.outerWidth() * 0.5;
	//摇杆icon 移动的距离范围
	self.moveFlagRec = new RockerRect(self.moveFlagX - self.moveBg.width() * 0.5, self.moveFlagY - self.moveBg.height() * 0.5, self.moveBg.width(), self.moveBg.height());
	
	self.checkTime = setInterval(self.checkKey.bind(this),gameFps);
	
	self.moveFlag.on("touchstart", self.startMove.bind(this));
	self.moveFlag.on("touchmove", self.goMove.bind(this));
	self.moveFlag.on("touchend", self.stopMove.bind(this));
}
Rocker.prototype.checkKey = function(){
	var self = this;
	if(!self.isMoveing)return;
	if(self.delaKeyFunc)self.delaKeyFunc(self.keys[0], self.keys[1]);
}
//触摸开始
Rocker.prototype.startMove = function(e) {
	var self = this;
	self.isMoveing = true;
	self.moveFlagGoX = self.moveFlagX;
	self.moveFlagGoY = self.moveFlagY;
}
//触摸结束
Rocker.prototype.stopMove = function(e) {
	var self = this;
	self.isMoveing = false;
	self.keys[0]=self.keys[1]=0;
	self.moveFlag.css({left:self.moveFlagX,top:self.moveFlagY});
}
//触摸中
Rocker.prototype.goMove = function(e) {
	var self = this;
	if (!self.isMoveing) return;

	if(event.touches && event.touches.length>0)
	{
		//检测是否在运动范围以内
		if (self.moveFlagRec.contains(event.touches[0].pageX-self.moveBgX, event.touches[0].pageY-self.moveBgY)) {
			self.moveFlagGoX = event.touches[0].pageX-self.moveBgX;
			self.moveFlagGoY = event.touches[0].pageY-self.moveBgY;
		} 
		else {
			//不再范围里面的坐标 计算一下运动的角度
			var radian = mathRadian(self.moveFlagX, self.moveFlagY, event.touches[0].pageX-self.moveBgX, event.touches[0].pageY-self.moveBgY);
			self.moveFlagGoX = self.moveFlagX + Math.cos(radian) * self.moveFlagWidthHelf;
			self.moveFlagGoY = self.moveFlagY + Math.sin(radian) * self.moveFlagWidthHelf;
		}
		if (self.moveFlagGoX > self.moveFlagX && Math.abs(self.moveFlagGoX - self.moveFlagX) > 10) {
			self.keys[0] = 1;
		} else if (this.moveFlagGoX < self.moveFlagX && Math.abs(self.moveFlagGoX - self.moveFlagX) > 10) {
			self.keys[0] = -1;
		} else {
			self.keys[0] = 0;
		}
	
		if (self.moveFlagGoY > self.moveFlagY && Math.abs(self.moveFlagGoY - self.moveFlagY) > 10) {
			self.keys[1] = 1;
		} else if (self.moveFlagGoY < self.moveFlagY && Math.abs(self.moveFlagGoY - self.moveFlagY) > 10) {
			self.keys[1] = -1;
		} else {
			self.keys[1] = 0;
		}
	
		var leftNum = self.moveFlagGoX;
		var topNum = self.moveFlagGoY;
		self.moveFlag.css({left:leftNum,top:topNum});
//		console.log(self.keys[0]+":"+self.keys[1]);
		
	}
	
}

//计算两点之间的夹角
function mathRadian(startX, startY, endX, endY) {
	var tan = Math.atan2(endY - startY, endX - startX);
	return tan;
}