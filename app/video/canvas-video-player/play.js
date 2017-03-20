
	var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') >= 0;
	// var sound = document.createElement('audio');
	var ld=vd=0;
	// sound.src = 'media/sound.mp3';
	
	if (isIphone) {
	    var canvasVideo = new CanvasVideoPlayer({
			videoSelector: '.js-video',
			canvasSelector: '.js-canvas',
			hideVideo: true,
			audio: true,
		});
	}else {
		vd = 1;
	    $('canvas').hide();
	    $('.video').remove();
	    $('.video-responsive').append('<video src="media/final.mp4" id="video" width="0" height="0" style="background:transparent;"></video>')

		$('#video').get(0).load();
		// $('#video').get(0).play();
		$('#video').get(0).addEventListener('canplaythrough',function(){
			
	    })

	    $('#video').on('ended',function(){
	    	showBtn();
	    	$('#video').remove();
	    })

	}
	
	$('document').one('touchend',function(e){
		if(canvasVideo){
			canvasVideo.play();
		}else{
			$('#video').width(640).height(1040).get(0).play();
		}
	})