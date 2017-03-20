//2016.6.8
(function($) {	
	jQuery.fn.extend({
		gifOn: function($path,$num,options){
			if($path && $path!='' && $num>1){
				var $this=$(this);
				var $now=-1,$timer;
				var count=0;
				var defaults = {type:'png',speed:100,repeat:-1,sprite:false,endStart:false,pause:false};
				var opts = $.extend(defaults,options);
				load_handler();
			}//end if
			
			function load_handler(){
				var loader = new PxLoader();
				if(!opts.sprite) for(var i=0; i<$num; i++) loader.addImage($path+i+'.'+opts.type);				
				else loader.addImage($path);		
				loader.addCompletionListener(function() {
					console.log('gif loaded');
					loader=null;
					if(opts.onLoaded) opts.onLoaded($this);
					init();
				});			
				loader.start();	
			}//end func
			
			function init(){
				if(opts.sprite) $this.css({backgroundImage:'url('+$path+')'});
				$this.on('off',this_off).on('pause',this_pause).on('resume',this_resume).on('goto',this_goto).on('speed',this_speed);
				this_play();
				if(!opts.pause) $timer=setInterval(this_play,opts.speed);
			}//end init
			
			function this_off(e){
				$this.off('off pause resume goto speed');
				clearInterval($timer);
				if(opts.endStart) this_switch(1);
				if(opts.onOff) opts.onOff($this);
			}//end if
			
			function this_pause(e,id){
				id=id!=null?id:$now;
				console.log('pause:'+id)
				this_goto(null,id);
				clearInterval($timer);
			}//end func
			
			function this_resume(e){
				clearInterval($timer);
				$timer=setInterval(this_play,opts.speed);
			}//end func
			
			function this_goto(e,id){
				if(id>=0){
					$now=id;
					this_switch($now);
				}//end if
			}//end func
			
			function this_speed(e,speed){
				opts.speed=speed;
				this_resume();
			}//end func
			
			function this_play(){
				$now++;
				if($now>=$num){
					if(opts.repeat>=0){
						count++;
						if(count<=opts.repeat){
							$now=0;
							this_switch($now);
						}//end if
						else{
							if(opts.onComplete) opts.onComplete($this);
							this_off();
						}//end else
					}//end if
					else{
						$now=0;
						this_switch($now);
					}//end else
				}//end if
				else this_switch($now);
			}//end func
			
			function this_switch(id){
				if(!opts.sprite) $this.attr({src:$path+id+'.'+opts.type});
				else{
					var y=-$this.height()*id;
					$this.css({backgroundPosition:'0px '+ y+'px'})
				}//end else
			}//end func

		},//end fn
		gifPause: function(id) {
			$(this).triggerHandler('pause',[id]);
		},//end fn
		gifResume: function() {
			$(this).triggerHandler('resume');
		},//end fn
		gifGoto: function(id) {
			if(id>=0) $(this).triggerHandler('goto',[id]);
		},//end fn
		gifSpeed: function(speed) {
			if(speed && speed>0) $(this).triggerHandler('speed',[speed]);
		},//end fn
		gifOff: function() {
			$(this).triggerHandler('off');
		}//end fn			
	});//end extend
})(jQuery);//闭包