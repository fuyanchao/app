//平台检测，判断浏览器、操作系统环境
var os=detectOS();
function detectOS() {
	var	userAgent=navigator.userAgent;
	console.log(userAgent);
	var os = {};
	os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
	os.androidICS = os.android && userAgent.match(/(Android)\s4/) ? true : false;
	os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
	os.iphone = !os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
	os.ios = os.ipad || os.iphone;
	os.wp=userAgent.match(/Windows Phone/) || userAgent.match(/IEMobile/) ? true : false;
	os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window);
	if(os.ios) os.iosVer=parseInt(userAgent.match(/OS \d_/)[0].match(/\d/)[0]);
	else os.iosVer=0;
	return os;
}//end func