//2016.1.14
(function($) {
	
	$.fn.gif = function(path,num,options) {
		
		var $this;
		var $defaults = {type:'png',speed:100,repeat:-1,sprite:false,endStart:false};
		var $opts;
		var $path,$num,$now,$count,$timer;
		console.log(this)
		
		if(path && path!='' && num>1){
			$this=this;
			$path=path;
			$num=num;
			$now=0;
			$count=0;
			$opts = $.extend($defaults,options);
			console.log($opts)
			load_handler();
		}//end if
		
		function load_handler(){
			var loader = new PxLoader();
			if(!$opts.sprite) for(var i=1; i<=$num; i++) loader.addImage($path+i+'.'+$opts.type);				
			else loader.addImage($path);		
			loader.addCompletionListener(function() {
				console.log('gif loaded');
				loader=null;
				if($opts.onLoaded) $opts.onLoaded($this);
				this_init();
			});			
			loader.start();	
		}//end func
		
		function this_init(){
			if($opts.sprite) $this.css({backgroundImage:'url('+$path+')'});
			this_play();
			$timer=setInterval(this_play,$opts.speed);
		}//end func
		
		function this_off(){
			clearInterval($timer);
			if($opts.endStart) this_switch(1);
			if($opts.onOff) $opts.onOff($this);
		}//end func
		
		function this_pause(id){
			this_goto(id);
			clearInterval($timer);
		}//end func
		
		function this_resume(){
			clearInterval($timer);
			$timer=setInterval(this_play,$opts.speed);
		}//end func
		
		function this_goto(id){
			if(id && id>0){
				$now=id;
				this_switch($now);
			}//end if
		}//end func
		
		function this_speed(speed){
			$opts.speed=speed;
			this_resume();
		}//end func
		
		function this_play(){
			$now++;
			if($now>$num){
				if($opts.repeat>=0){
					$count++;
					if($count<=$opts.repeat){
						$now=1;
						this_switch($now);
					}//end if
					else{
						if($opts.onComplete) $opts.onComplete($this);
						this_off();
					}//end else
				}//end if
				else{
					$now=1;
					this_switch($now);
				}//end else
			}//end if
			else this_switch($now);
		}//end func
		
		function this_switch(id){
			if(!$opts.sprite){
				var src=$path+id+'.'+$opts.type;
				$this.attr({src:src});
			}//end if
			else{
				var y=-$this.height()*(id-1);
				$this.css({backgroundPosition:'0px '+ y+'px'})
			}//end else
		}//end func
		
		return this;
		
	};
	
//	$.fn.gif.pause = function(id) {    
//		if(id>0 && id<=$num) this_pause(id);
//	};
//	
//	$.fn.gif.resume = function(){
//		this_resume();
//	}//end func
//	
//	$.fn.gif.goto = function(id) {    
//		if(id>0 && id<=$num)  this_goto(id);
//	};
	
	$.fn.gif.speed = function(speed) {   
		console.log(this)
	};
	
//	$.fn.gif.off = function() {    
//		this_off();
//	};
	
})(jQuery);   
