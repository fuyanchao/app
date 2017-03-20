$(document).ready(function(e) {
	
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	
	var windowWd=$(window).width(),windowHt=$(window).height();
	console.log('window size:'+windowWd+'/'+windowHt);
	var windowRatio=windowWd/320;
	
	//game
	var gameBox=$('article.game');
	var gameLevel=1,gameLevelMax=3;
	var gameBox=$('article.game')
	var gameScore=0,gameScoreMax=300,gameCount=0,gameNow=0,gameLength;
	var gameFps=30;
	var gameInter=Math.floor(1000/gameFps);
	var gamePaused=false;
	var gameSpSpace=2,gameSpOrg=7,gameSp=gameSpOrg;
	
	//player
	var playerBox=$('#playerBox');
	var playerHot=playerBox.children('i');
	var playerLight=playerBox.children('b'),playerLightTimer;
	var playerPos=[],playerX=0,playerY=0,playerTimer,playerEase=5;
	var playerWdLeft=windowWd-playerHot.width();	
	
	//obj
	var objShell=gameBox.children('.obj');
	var objBox,objHot,objWind;
	var objNow=0,objSpace=750,objBurst=2,objType=15,objCreatTimer,objTimer;
	var objPrev=0,objMax;
	var objColNow=0,objColMax=6;
	var objPos=0;
	
	//result
	var resShell=gameBox.children('.res');
	
	//panel
	var panelBox=$('.panelbar');
	
	//score
	var scorePanel=panelBox.children('.score');
	var scoreNum=scorePanel.children('span').children();
	
	
	//speedup
	var speedupBox=gameBox.children('.speedup');
	var speedupTxt=speedupBox.children('.txt');
	
	//time
	var timeSt,timeNow,timeMax=60*1000,timeLevel=Math.floor(timeMax/gameLevelMax),timeTimer;
	var timePanel=panelBox.children('.time');
	var timeBar=timePanel.children('.bar');
	var timeBarBg=timeBar.children('i');
	var timeBarHand=timeBar.children('b');
	var timeNum=timePanel.children('.num').children();
	
	//sign
	var signBox=gameBox.children('.sign');
	var signTxt=signBox.children('span');
	var signTimer;
	
	//counter
	var countBox=gameBox.children('.count');
	var countTxt=countBox.children('h3');
	var countTimer;
	
	iorient.init();//屏幕翻转锁定，默认锁定竖屏，横屏提示
	icom.screenTo169(false,false);//把article标签拉伸至iphone5的高宽比例
	
	game_init();

	//----------------------------------------------game----------------------------------------------
	
	function game_init(){
		gameScore=0;
		gameLevel=1;
		gameSp=game_speed();
		objPos=0;
		objPrev=0;
		objNow=0;
		taskAnsw=[-1,-1];
		playerPos=[windowWd/2-playerBox.width()/2,windowHt-playerBox.height()];
		playerX=playerPos[0];
		playerY=playerPos[1];
		playerBox.css({x:playerX,y:playerY});
		gameBox.on("touchstart",game_touchstart).on("touchmove",game_touchmove);
		playerTimer=setInterval(playerTimerFunc,gameInter);
		count_timer();
	}//edn func
	
	function game_pause(){
		clearTimeout(objCreatTimer);
		clearInterval(objTimer);
		clearInterval(playerTimer);
		clearInterval(timeTimer);
		gameBox.off();
	}//edn func	
	
	function game_resume(){	
		game_pause();
		obj_creat();
		objTimer=setInterval(obj_timer,gameInter);
		playerTimer=setInterval(playerTimerFunc,gameInter);
		timeTimer=setInterval(time_Timer,gameInter);
		gameBox.on("touchstart",game_touchstart).on("touchmove",game_touchmove);
	}//edn func
	
	function game_speed(){
		var speed=(gameSpOrg+(gameLevel-1)*gameSpSpace)*windowRatio;
		console.log('speed:'+speed);
		return speed;
	}//end func
	
	
	//---------------counter
	function count_timer(t){
		t=t||4;
		t--;
		if(t>0){
			countBox.show();
			countTxt.html(t);
			countTimer=setTimeout(count_timer,1000,t);
		}//end if
		else{
			timeSt=new Date().getTime();
			countBox.hide();
			game_resume();
		}//end else
	}//end func
	
	//---------------player
	
	function game_touchstart(e){
		e.preventDefault();
		playerPos[0]=event.touches[0].clientX;
	}//end func
	function game_touchmove(e){
		e.preventDefault();
		playerPos[0]=event.changedTouches[0].clientX;
	}//end func
	
	function playerTimerFunc(){		
		playerX=imath.ease(playerX,playerPos[0],playerEase);
		playerX=playerX<0?0:playerX;
		playerX=playerX>playerWdLeft?playerWdLeft:playerX;
		playerBox.css({x:playerX,y:playerY});
	}//end func
	
	//----------------obj
	function obj_creat(){
		var type=imath.randomRange(1,objType);
		var obj=$('<span><i></i><b></b></span>').addClass('style'+type).appendTo(objShell).on('touchstart',function(e){e.preventDefault();});
		$('<img>').attr({src:'images/game/obj'+type+'.png'}).appendTo(obj);
		var col=imath.randomRange(1,objColMax);
		var x=windowWd/objColMax*col;
		var y=-objPos;
		obj.data({type:type}).css({x:x,y:y});
		obj_get();
		objNow++;
		if(objNow%objBurst==0) var delay=Math.floor(objSpace/objBurst);
		else var delay=objSpace;
		objCreatTimer=setTimeout(obj_creat,objSpace);
	}//end func
	
	function obj_get(){
		objBox=objShell.children();
		objHot=objBox.children('i');
		objWind=objBox.children('b');
		objMax=objBox.length;
		//console.log('objMax:'+objMax);
	}//end func
	
	function obj_timer(){
		objPos+=gameSp;
		objShell.css({y:objPos});
		objPrev=0;
		for(var i=0; i<objMax; i++){
			var obj=objBox.eq(i);
			var x=obj.offset().left;
			var y=obj.offset().top;
			if(y>=windowHt){
				obj.remove();
				obj_get(); 
				objPrev=i+1;
				break;
			}//end if
		}//end for
		for(var i=objPrev; i<objMax; i++){
			var obj=objBox.eq(i);
			var hot=objHot.eq(i);
			if(!obj.hasClass('hitted') && imath.hitTest(playerHot,hot)){
				var x=obj.offset().left;
				var y=obj.offset().top;
				var wind=objWind.eq(i);
				obj.addClass('hitted').transition({opacity:0,scale:0.5},250);
				wind.hide();
				icom.fadeIn(playerLight,100,function(){icom.fadeOut(playerLight,100);});
				var type=parseInt(obj.data('type'));
				if(type!=0){
					var _score=Math.pow(10,gameLevel);
					icon_add(x,y,"icon",'+'+_score);
					score_add(_score);
					res_add(x,y,type);
				}//end if
				else icon_add(x,y,"icon icon_fall",'x');
				break;
			}//end if
		}//end  for
	}//end func
	
	function res_add(x,y,type){
		taskMoving=true;
		var res=$('<span></span>').css({x:x,y:y}).appendTo(resShell);	
		$('<img>').attr({src:'images/game/obj'+type+'.png'}).appendTo(res).on('touchstart',function(e){e.preventDefault();});
		res.transition({x:scorePanel.offset().left-res.width()*0.35,y:scorePanel.offset().top-res.height()*0.5,scale:0.5},500,function(){
			$(this).transition({opacity:0},250,function(){
				$(this).remove();
			});
		});
	}//end func
	
	function icon_add(x,y,type,html,opacity,delay){
		x=x||0;
		y=y||0;
		html=html||'';
		opacity=opacity!=null?opacity:1;
		delay=delay||0;
		setTimeout(function(){
			var icon=$('<div class="'+type+'"></div>').html(html).css({x:x,y:y,opacity:opacity}).appendTo(gameBox).transition({y:'-='+windowHt*0.1},500,function(){
				$(this).remove();
			});
		},delay);
	}//end func
	
	//----------score
	function score_add(score){
		gameScore+=score;
		scoreNum.html(gameScore);
	}//end func
	
	//----------------time
	function time_Timer(){
		timeNow=new Date().getTime()-timeSt;
		timeBarBg.css({width:timeNow/timeMax*(timeBar.width()-timeBarHand.width())+timeBarHand.width()/2});
		timeBarHand.css({x:timeNow/timeMax*(timeBar.width()-timeBarHand.width())});
		timeNum.html(get_second(timeNow));
		if( (Math.floor(timeNow/timeLevel)==1 && gameLevel==1) || (Math.floor(timeNow/timeLevel)==2 && gameLevel==2) ) speed_up();
		else if(timeNow>timeMax){
			game_pause();
			timeNum.html("60s");
			if(gameScore>=gameScoreMax) icom.alert('游戏胜利！<br/>得分：'+gameScore,function(){location.reload();});
			else icom.alert('游戏失败！<br/>得分：'+gameScore,function(){location.reload();});
		}//end if
	}//end func
	
	function speed_up(){
		gameLevel++;
		console.log('gameLevel:'+gameLevel);
		gameSp=game_speed();
		objSpace*=0.75;
		speedupTxt.html(gameLevel==2?'第二关':'第三关');
		//game_pause();
		speedupBox.css({y:windowHt}).show().transition({y:windowHt*0.4},500,'in-out',function(){
			setTimeout(function(){
				//game_resume();
				speedupBox.transition({y:-speedupBox.outerWidth()},250,'in-out',function(){
					$(this).hide();
				});
			},500);
		});
	}//end func
	
	//转换毫秒到两位小数字符串
	function get_second(t){
		var sec=Math.floor(t/1000);
		//if(sec<10) sec="0"+sec;
		//else sec=String(sec);
		//var mil=String(t%1000);
		//mil=mil.substr(0, 2);
		//if(mil<10) mil="0"+mil;
		//return sec+"''"+mil;
		return sec+"s";
	}//end func 
});