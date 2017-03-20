//2015.1.12

$(document).ready(function(e) {
	
	//视频
	var videoBtn=$('a.btnVideo,#btnVideo');
	var videoBox=$("<div id='videoBox'><a class='close'></a></div>");
	var videoContent,videoPoser;
	
	init();
	
	function init(){
		if(videoBtn.length>0){//视频播放按钮，ios8的video标签必须占据全屏宽度，旧版小尺寸按钮点击播放方案无效，现在IOS和ANDOID一样作为弹窗播放处理，保持用户体验一致
			if(os.ios) video_ios();
			else{
				videoBox.appendTo($('body'));
				videoBtn.on('click',video_play);
				videoBox.children('a.close').on('click',video_close);
			}//end else
		}//end if
	}//end func
	
	//-------------------视频播放,支持优酷-------------------
	function video_ios(){
		videoBtn.each(function(i) {
            var vid=$(this).data('vid');
			if(vid && vid!=''){
				var type=$(this).data('type');
				type=type||'youku';
				if(type=='youku') var video=$('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen></iframe>').appendTo($(this));
				else{
					var video=$('<video type="video/mp4">').attr({src:vid}).appendTo($(this));
					var poster=$(this).data('poster');
					if(poster) video.attr({poster:poster});
				}//end else
			}//end if
        });
	}//end func
	
	function video_play(e){
		var vid=$(this).data('vid');
		if(vid && vid!=''){
			var type=$(this).data('type');
			type=type||'youku';
			var poser=$(this).data('poser');
			var ht=$(window).width()*9/16;
			videoBox.show();
			if(type=='youku') var video=$('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen isAutoPlay="true"></iframe>').css({height:ht,marginTop:$(window).height()/2-ht/2}).prependTo(videoBox);
			else{
				var video=$('<video type="video/mp4" controls autoplay>').attr({src:vid}).css({height:ht,marginTop:$(window).height()/2-ht/2}).prependTo(videoBox);
				var poster=$(this).data('poster');
				if(poster) video.attr({poster:poster});
				video[0].play();
			}//end else
		}//end if
	}//end event
	
	function video_close(e){
		$(this).siblings().remove();
		videoBox.hide();
	}//end event
	
});//end docuemnt ready