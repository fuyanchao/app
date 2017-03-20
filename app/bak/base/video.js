//2015.10.23

var ivideo=importVideo();

function importVideo(){
	var video={};
	
	video.add=function(option){
		var vid;
		if(option.src){
			var src=option.src;
			var shell=option.shell||$('body');
			var classname=option.classname;
			var controls=option.controls!=null?option.controls:false;
			if(os.iphone4) controls=true;
			var autoplay=option.autoplay!=null?option.autoplay:true;
			var poster=option.poster;
			var onLoadstart=option.onLoadstart;
			var onLoaded=option.onLoaded;
			var onEnded=option.onEnded;
			var onPlay=option.onPlay;
			var onPause=option.onPause;
			var onTimeupdate=option.onTimeupdate;
			vid=$('<video webkit-playsinline="true" type="video/mp4">').attr({src:src,autoplay:autoplay,controls:controls,poster:poster}).addClass(classname).appendTo(shell);
			if(onLoadstart) vid[0].addEventListener('loadstart',onLoadstart,false);
			if(onLoaded) vid[0].addEventListener('loadeddata',onLoaded,false);
			if(onEnded) vid[0].addEventListener('ended',onEnded,false);
			if(onTimeupdate) vid[0].addEventListener('timeupdate',onTimeupdate,false);
			if(onPlay) vid[0].addEventListener('play',onPlay,false);
			if(onPause) vid[0].addEventListener('pause',onPause,false);
			return vid;
		}//end if
	}//end func
	
	video.on=function(option){
		var btn=option.btn||$('a.btnVideo,#btnVideo');
		var callback={onEnded:option.onEnded};
		if(os.ios) ios_play(btn,callback);
		else btn.on('touchend',callback,pop_play);
	}//end func
	
	function ios_play(btn,callback){
		btn.each(function(i) {
			var vid=$(this).data('vid');
			if(vid && vid!=''){
				var type=$(this).data('type');
				type=type||'youku';
				if(type=='youku') btn_play($(this));
				else if(type=='qq') $(this).on('touchend',{},pop_play);
				else if(type=='mp4') btn_play($(this),callback);
			}//end if
		});
	}//end func

	function btn_play(btn,callback){
		var vid=btn.data('vid');
		if(vid && vid!=''){
			var type=btn.data('type');
			type=type||'youku';
			if(type=='youku') $('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen></iframe>').appendTo(btn);
			else if(type=='qq') $('<iframe src="http://v.qq.com/iframe/player.html?vid='+vid+'&tiny=0&auto=0" frameborder="0" allowfullscreen></iframe>').appendTo(btn);
			else if(type=='mp4'){
				container=$('<video type="video/mp4" controls>').attr({src:vid}).appendTo(btn);
				console.log(container[0]);
				if(callback){
					if(callback.onEnded) container[0].addEventListener('ended',callback.onEnded,false);
				}//end if
			}//end else if
		}//end if
	}//end func
	
	function pop_play(e){
		var callback=e.data;
		var box=$("<aside class='videoBox' id='videoBox'><a class='close'></a></aside>").show().appendTo($('body'));
		var vid=$(this).data('vid');
		if(vid && vid!=''){
			var type=$(this).data('type');
			type=type||'youku';
			var ht=$(window).width()*9/16;
			var top=$(window).height()/2-ht/2;
			if(type=='youku') $('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen></iframe>').css({height:ht,top:top}).prependTo(box);
			else if(type=='qq') $('<iframe src="http://v.qq.com/iframe/player.html?vid='+vid+'&tiny=0&auto=0" frameborder="0" allowfullscreen></iframe>').css({height:ht,top:top}).prependTo(box);
			else if(type=='mp4'){
				var container=$('<video type="video/mp4" controls preload="auto" webkit-playsinline>').attr({src:vid}).css({height:ht,top:top}).prependTo(box);
				var poster=$(this).data('poster');
				if(poster) container.attr({poster:poster});
				container[0].play();
				if(callback){
					if(callback.onEnded) container[0].addEventListener('ended',callback.onEnded,false);
				}//end if
			}//end else
		}//end if
		box.children('a.close').one('touchend',function(e){
			box.remove();
		});
	}//end event
	
	return video;
}//end import
