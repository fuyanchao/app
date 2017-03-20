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
	var imgCanvas,imgLayer;
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
		var combin=$('div.img');//要合成的jquery对象
		html2canvas(combin).then(function(canvas) {
			canvas_send(canvas,image_combine_complete,'loop_test');
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
		console.log('image src:'+src);
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
		imgCanvas=$('<canvas></canvas>').attr({width:imgShell.width(),height:imgShell.height()}).prependTo(imgShell);
		var size=imath.autoSize([wd,ht],[imgShell.width(),imgShell.height()],1);
		imgCanvas.clearCanvas().drawImage({
		  layer: true,
		  source: src,
		  width:size[0],height:size[1],
		  x: imgCanvas.width()/2, y: imgCanvas.height()/2,
		  scale:1,
		  fromCenter: true,
		  touchstart: canvas_touchstart,
		  touchend: canvas_touchend
		});
		imgCanvas.drawLayers();
		imgLayer=imgCanvas.getLayer(0);
		img_addEvent(imgCanvas,imgShell,imgLayer);
	}//end func
	
	function canvas_touchstart(layer){
		console.log(this);
	  	console.log(layer);
	    $(this).animateLayer(0, {
	      scale: 1.5
	    }, 250);
	}//edn func
	
	function canvas_touchend(layer){
		console.log(this);
	  	console.log(layer);
	    $(this).animateLayer(0, {
	      scale: 1
	    }, 250);
	}//edn func
	
	
	//添加图片编辑事件
	function img_addEvent(canvas,shell,obj){
		imgAdd.off().on('touchstart',{obj:obj,canvas:canvas,offset:1},imgScale_touchstart).on('touchend',imgScale_touchend);
		imgSub.off().on('touchstart',{obj:obj,canvas:canvas,offset:-1},imgScale_touchstart).on('touchend',imgScale_touchend);
		imgRotate.off().on('click',{obj:obj,canvas:canvas},img_rotate);
		shell.off().on('pinch',{obj:obj,canvas:canvas},img_pinch).on('pinchmove',{obj:obj,canvas:canvas},img_pinchmove).on('pinchscale',{obj:obj,canvas:canvas},img_pinchscale).on('pinchrotate',{obj:obj,canvas:canvas},img_pinchrotate);
	}//end func
	
	//单指双指触控
	function img_pinchmove(e,xOffset,yOffset){
		var obj=e.data.obj;
   		obj.x+=xOffset;
		obj.y+=yOffset;
   	}//end func
   	
   	function img_pinchscale(e,scaleOffset){
   		var obj=e.data.obj;
   		obj.scale+=scaleOffset*0.5;
   		obj.scale=obj.scale<=imgScaleMin?imgScaleMin:obj.scale;
		obj.scale=obj.scale>=imgScaleMax?imgScaleMax:obj.scale;
   	}//end func
   	
   	function img_pinchrotate(e,rotateOffset){
   		var obj=e.data.obj;
   		obj.rotate+=rotateOffset;
// 		obj.rotate=obj.rotate>360?obj.rotate%360:obj.rotate;
// 		obj.rotate=obj.rotate<-360?-obj.rotate%360:obj.rotate;
   	}//end func
	
	function img_pinch(e){
		var canvas=e.data.canvas;
		canvas.drawLayers();
	}//end func
	
	//图片缩放
	function imgScale_touchstart(e){
		e.preventDefault();
		clearInterval(imgScaleTimer);
		imgScaleTimer=setInterval(imgScale_handler,33,e.data.obj,e.data.canvas,e.data.offset,0.05);
	}//end func
	
	function imgScale_touchend(e){
		e.preventDefault();
		clearInterval(imgScaleTimer);
	}//end func
	
	function imgScale_handler(obj,canvas,offset,speed){
		speed=speed!=null?speed:0.05;
		obj.scale+=speed*offset;
		obj.scale=obj.scale<=imgScaleMin?imgScaleMin:obj.scale;
		obj.scale=obj.scale>=imgScaleMax?imgScaleMax:obj.scale;
		canvas.drawLayers();
	}//end func
	
	//图片旋转
	function img_rotate(e){
		var canvas=e.data.canvas;
		var obj=e.data.obj;
		if(obj.rotate%90!=0) obj.rotate=Math.floor(obj.rotate/90)*90;
		else obj.rotate+=90;
		obj.rotate=obj.rotate>360?obj.rotate%360:obj.rotate;
   		obj.rotate=obj.rotate<-360?-obj.rotate%360:obj.rotate;
		canvas.drawLayers();
	}//end func

});