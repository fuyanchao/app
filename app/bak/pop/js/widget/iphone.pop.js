//2015.11.16
(function($) {	
	$.fn.extend({
		popOn: function(options) {	
			var $this=$(this);
			var $parent;
			var defaults = {fade:250,wrap:true,closeBtn:$this.find('a.close'),closeType:'button',closeEvent:'touchend'};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){
				if(opts.wrap){
					if(!$this.parent().hasClass('popBox')) $this.wrap("<div class='popBox'></div>");
					$parent=$this.parent();
				}//end if
				$this.show();
				if(opts.onOpen) opts.onOpen($this);
				if(opts.fade>0){
					if(opts.wrap) $parent.css({opacity:0}).transition({opacity:1},opts.fade);
					$this.css({opacity:0}).transition({opacity:1},opts.fade);
				}//end if
				if(opts.wrap){
					this_resize();
					$(document).on('touchmove',this_noscroll);
				}//end if
				$this.on('off',this_off);
				if(opts.closeType=='button' && opts.closeBtn.length>0) opts.closeBtn.one(opts.closeEvent,this_off); 
				else if(opts.closeType=='full') $this.one(opts.closeEvent,this_off);
			}//end func
			
			function this_off(e){
				$this.off('close');
				if(opts.closeType=='button' && opts.closeBtn.length>0) opts.closeBtn.off(opts.closeEvent,this_off); 
				else if(opts.closeType=='full') $this.off(opts.closeEvent,this_off);
				if(opts.fade>0){
					if(opts.wrap) $parent.transition({opacity:0},Math.round(opts.fade/2));
					$this.transition({opacity:0},Math.round(opts.fade/2),this_close);
				}//end if
				else this_close();
			}//end func
			
			function this_close(){
				$this.hide();
				if(opts.wrap){
					$this.unwrap();
					$(document).off('touchmove',this_noscroll);
				}//end if
				if(opts.onClose) opts.onClose($this);
			}//edn func
			
			function this_resize(e){
				$this.css({left:$(window).width()/2-$this.outerWidth()/2});
				if(opts.top) $this.css({top:opts.top});
				else $this.css({top:$(window).height()/2-$this.outerHeight()/2});
			}//end func
			
			function this_noscroll(e){
				e.preventDefault();
			}//end func
			
		},//end fn
		popOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包