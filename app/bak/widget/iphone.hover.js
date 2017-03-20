//2015.4.20
(function($) {	
	$.fn.extend({
		hoverOn: function() {	
			var _this=$(this);
			init();
			function init(){
				_this.on('off',this_off).on('touchstart',this_touchstart).on('touchend',this_touchend);
			}//end func	
			function this_off(e){
				_this.off('off').off('touchstart',this_touchstart).off('touchend',this_touchend);
			}//end func
			function this_touchstart(e){
				$(this).addClass('active');
			}//end func
			function this_touchend(e){
				$(this).removeClass('active');
			}//end func
		},//end fn
		hoverOff: function() {
			$(this).trigger('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包