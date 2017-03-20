//2016.5.16

$(document).ready(function(e) {
	
	var loadBox=$('aside.loadBox');
	
	//camera
	var cameraBox=$('div.camera');
	var imgShell=$('div.shell');
	var imgPanel=$('div.panel');
	var imgAdd=imgPanel.children('a.btnAdd');
	var imgSub=imgPanel.children('a.btnSub');
	var imgRotate=imgPanel.children('a.btnRotate');
	var btnSubmit=$('a.btnSubmit');
	var btnCamera=$('a.btnCamera');
	var imgLayer,imgChild;
	var imgScaleMin=0.1,imgScaleMax=5,imgScaleTimer;
    var fileBox,fileInput;
	
	
	icom.screenTo169(true);//article标签高度适配，把iphone4拉伸至iphone5，默认值true
	
	init();
	
	function init(){
		fileBox=$('<div id="fileBox"><input type="file" capture="camera" accept="image/*" name="fileInput"/></div>').appendTo($('body'));
		fileInput=fileBox.children();
		fileInput.on('change',file_select);
		btnCamera.on('touchend',btnCamera_click);
		btnSubmit.on('touchend',btnSubmit_click);
	}//end func
	
	//---------------------------------------------------拍照事件
	
	//图片确定按钮，图片编辑步骤控制
	function btnSubmit_click(e){
		html2canvas(imgShell).then(function(canvas) {
			var base64=canvas.toDataURL();
			image_base64_complete(base64);
		});
	}//end func
	
	function image_base64_complete(base64){
		var parent=imgShell.parent();
		var temp=$('<img>').addClass('temp').attr({src:base64}).appendTo(parent);//把合成好的图像临时插入
		temp.on('load',function(e){
			imgShell.hide();
			var combin=$('div.camera');//要合成的jquery对象
			html2canvas(combin).then(function(canvas) {
				canvas_send(canvas,image_combine_complete,'loop_test');
			});
		});
	}//end func
	
	function canvas_send(canvas,callback,secretkey,type){
		type=type||'jpg';
		loadBox.show();
		if(type=='png') var data=canvas.toDataURL().split(",")[1];
		else var data=canvas.toDataURL('image/jpeg', 0.8).split(",")[1];
		base64_send(data,callback,secretkey);
	}//end func
	
	function base64_send(data,callback,secretkey){
		loadBox.show();
		$.post('http://upload.be-xx.com/upload', { data: data, key: secretkey }, function (resp) {
			callback(resp);
        })
	}//end func
	
	function image_combine_complete(src){
		loadBox.hide();
		imgShell.show();
		imgShell.siblings('img.temp').remove();
		var combin=$('.combin').show();
		$('<img>').attr({src:src}).appendTo(combin);
		console.log(src);
	}//end func
	
	//拍照按钮
	function btnCamera_click(e){
		fileInput.click();
	}//end func
	
	//拍照或打开本地图片
	function file_select(e) {
        var file = this.files[0];
        if (file) {
			loadBox.show();
			ireader.read({ file: file, callback: function (resp,wd,ht) {
                if (resp) img_creat(resp,wd,ht);
                else loadBox.hide();
            }});
        }//end if
      }//end select
	
	//复制图片至canvas
	function img_creat(src,wd,ht){	
		loadBox.hide();
		imgPanel.show();
		btnSubmit.show();
		imgShell.empty();
		imgLayer=$('<span></span>').appendTo(imgShell);
		var size=imath.autoSize([wd,ht],[imgShell.width(),imgShell.height()]);
		var x=(imgShell.width()-size[0])/2;
		var y=(imgShell.height()-size[1])/2;
		imgChild=$('<img/>').attr({src:src}).appendTo(imgLayer);
		imgLayer.css({width:size[0],height:size[1],left:x,top:y}).data({x:x,y:y,scale:1,rotate:0,child:imgChild});
		img_addEvent(imgShell,imgLayer);
	}//end func
	
	//添加图片编辑事件
	function img_addEvent(shell,obj){
		imgAdd.off().on('touchstart',{obj:obj,offset:1},imgScale_touchstart).on('touchend',imgScale_touchend);
		imgSub.off().on('touchstart',{obj:obj,offset:-1},imgScale_touchstart).on('touchend',imgScale_touchend);
		imgRotate.off().on('click',{obj:obj},img_rotate);
		shell.off().on('pinchmove',{obj:obj},img_pinchmove).on('pinchscale',{obj:obj},img_pinchscale).on('pinchrotate',{obj:obj},img_pinchrotate);
	}//end func
	
	//单指双指触控
	function img_pinchmove(e,xOffset,yOffset){
		var obj=e.data.obj;
		var data=obj.data();
		data.x+=xOffset;
   		data.y+=yOffset;
   		obj.css({left:data.x,top:data.y});
   	}//end func
   	
   	function img_pinchscale(e,scaleOffset){
   		var obj=e.data.obj;
   		var data=obj.data();
   		data.scale+=scaleOffset*(os.ios?1:0.5);
   		data.scale=data.scale<imgScaleMin?imgScaleMin:data.scale;
   		data.scale=data.scale>imgScaleMax?imgScaleMax:data.scale;
   		data.child.css({scale:data.scale});
   	}//end func
   	
   	function img_pinchrotate(e,rotateOffset){
   		var obj=e.data.obj;
   		var data=obj.data();
   		data.rotate+=rotateOffset;
   		data.rotate=data.rotate>360?data.rotate%360:data.rotate;
   		data.rotate=data.rotate<-360?-data.rotate%360:data.rotate;
   		data.child.css({rotate:data.rotate});
   	}//end func
	
	//图片缩放
	function imgScale_touchstart(e){
		e.preventDefault();
		clearInterval(imgScaleTimer);
		imgScaleTimer=setInterval(imgScale_handler,33,e.data.obj,e.data.offset,os.ios?0.05:0.01);
	}//end func
	
	function imgScale_touchend(e){
		e.preventDefault();
		clearInterval(imgScaleTimer);
	}//end func
	
	function imgScale_handler(obj,offset,speed){
		speed=speed!=null?speed:0.05;
		var data=obj.data();
		data.scale+=speed*offset;
		data.scale=data.scale<=imgScaleMin?imgScaleMin:data.scale;
		data.scale=data.scale>=imgScaleMax?imgScaleMax:data.scale;
		data.child.css({scale:data.scale});
	}//end func
	
	//图片旋转
	function img_rotate(e){
		var obj=e.data.obj;
		var data=obj.data();
		if(data.rotate%90!=0) data.rotate=Math.floor(data.rotate/90)*90;
		else data.rotate+=90;
		data.rotate=data.rotate>360?data.rotate%360:data.rotate;
   		data.rotate=data.rotate<-360?-data.rotate%360:data.rotate;
		data.child.css({rotate:data.rotate});
	}//end func

});