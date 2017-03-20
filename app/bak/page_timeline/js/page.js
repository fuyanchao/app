$(document).ready(function(e) {
	
	// 框架
	var containerBox=$('article.container');
	var stageBox=containerBox.children('section');
	console.log('stageBox:'+stageBox.length);
	var stageNow=0,stageLast=-1,stageMax=stageBox.length,stageDir=1;
	var stageTimeline=[];
	
	
	loadFunc();
	
	function loadFunc(){
		//载入图
		loadBox.show();
		var loadPer=loadBox.children();
		var loader = new PxLoader();
		loader.addImage('images/common/loading.gif');
		console.log('img:'+$('img').length);
		var img=$('img');
		img.each(function(i) {
			if(i<=Math.floor(img.length*0.25)) loader.addImage($(this).attr('src'));
            else return false;
        });
		
		loader.addProgressListener(function(e) { 
			//loadPer.html(Math.round(e.completedCount/e.totalCount*100)+'%'); 
		}); 
		
		loader.addCompletionListener(function() {
			if(window.console) console.log('load complete');
			loader=null;
			init();
			setTimeout(function(){
				loadBox.remove();
			},1000)
		});			
		loader.start();	
	}//end func	
	
	function init(){
		window_resize();
		stageNow=0;
		stageDir=1;
		addEvent();
		addTimeLine();				
		//测试
		//stageNow=26;
		stageMotion(0.0001);
	}//end init
	
	//自适应
	function window_resize(){
		stageBox.css({height:$(window).height()});	
	}//end window_resize
	
	function addEvent(){
		$(window).on('resize',window_resize);
		//框架滑动控制
		$(document).on('swipeup',document_swipeup).on('swipedown',document_swipedown);
		$(document).one('swipeup',ar_fade);
	}//end func

	function ar_fade(e){
		var arBox=$('#ar');
		TweenLite.to(arBox,0.5,{autoAlpha:0,ease:Linear.easeNone,onComplete:function(){
			arBox.remove();
		}});
	}//end func
	
	//框架滑动控制
	function document_swipedown(e){
		console.log('document_swipedown');
		if(!containerBox.hasClass('moving') && stageNow>0 &&!containerBox.hasClass('lockUp')){
			stageDir=-1;
			stageSwitch();
		}//end if
	}//end func
	
	function document_swipeup(e){
		console.log('document_swipeup');
		if(!containerBox.hasClass('moving') &&  stageNow<stageMax-1 &&!containerBox.hasClass('lockDown')){
			stageDir=1;
			stageSwitch();
		}//end if
	}//end func
	
	function stageSwitch(){
		console.log('stageDir:'+stageDir);
		stageLast=stageNow;
		stageNow+=stageDir;
		stageNow=stageNow<0?0:stageNow;
		stageNow=stageNow>stageMax-1?stageMax-1:stageNow;
		stageMotion();
	}//end func
	
	function stageMotion(speed){
		console.log('stageNow:'+stageNow);
		console.log('stageLast:'+stageLast);
		speed=speed!=null?speed:1.2;
		speed==0?0.0001:speed;
		TweenLite.killTweensOf(containerBox);
		TweenLite.to(containerBox,speed,{y:-stageNow*$(window).height(),ease:Power1.easeInOut,onStart:motionStart,onComplete:motionComplete});
		//motionStart();
		//containerBox.transition({y:-stageNow*$(window).height()}, speed*1000, "in-out",motionComplete);
		//正常播放动画
		stageTimeline[stageNow].restart();
		//向上翻页倒放动画
		//if(stageDir==1) stageTimeline[stageNow].restart();
		//else stageTimeline[stageLast].reverse();
	}//edn func
	
	function motionStart(){
		containerBox.addClass('moving');
	}//edn func
	
	function motionComplete(){
		containerBox.removeClass('moving');
	}//edn func

	//--------------添加时间线动画
	function formFunc(obj,type){//滚动方向及距离计算
		type=type||0;
		var parent=obj.parent();
		if(obj){
			switch(type){
				case 0://top
					return -(obj.position().top+obj.outerHeight());
					break;
				case 1://right
					return parent.outerWidth()-obj.position().left;
					break;
				case 2://bottom
					return parent.outerHeight()-obj.position().top;
					break;
				case 3://left
					return -(obj.position().left+obj.outerWidth());
					break;
			}//end switch
		}//end if
	}//end func
	
	function timelineStart(){
	}//end func
	
	function timelineComplete(){
	}//end func		
	
	function addTimeLine(){
		
		var now=-1;		
		
		/* index */
		now++;
		var stage=stageBox.eq(now);
		stageTimeline[now]= new TimelineLite({paused:true});	
		stageTimeline[now].eventCallback("onStart", timelineStart);
		stageTimeline[now].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().to(stage.children('.slog'), 3, {autoAlpha:1,scale:1,ease:Power1.easeInOut}),0);
		t.add(new TimelineLite().to(stage.children('img.sign'), 1, {alpha:1,ease:Power1.easeInOut}),0);
		stageTimeline[now].add(t);
				
		/* page a */
		now++;
		var stage=stageBox.eq(now);
		stageTimeline[now]= new TimelineLite({paused:true});	
		stageTimeline[now].eventCallback("onStart", timelineStart);
		stageTimeline[now].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from(stage.children('img.p1'), 1.8, {y:formFunc(stage.children('img.p1'),0),ease:Power1.easeInOut}),0);
		t.add(new TimelineLite().from(stage.children('img.p2'), 1.5, {y:formFunc(stage.children('img.p2'),0),ease:Power1.easeInOut}),1);
		t.add(new TimelineLite().from(stage.children('img.p3'), 1.5, {autoAlpha:0,ease:Linear.easeNone}),1.2);
		t.add(new TimelineLite().from(stage.children('h3'), 1.5, {x:formFunc(stage.children('h3'),3),ease:Power1.easeInOut}),1.5);
		t.add(new TimelineLite().from(stage.children('h4'), 1.5, {x:formFunc(stage.children('h4'),1),ease:Power1.easeInOut}),2);
		stageTimeline[now].add(t);
		
		/* page b */
		now++;
		var stage=stageBox.eq(now);
		stageTimeline[now]= new TimelineLite({paused:true});	
		stageTimeline[now].eventCallback("onStart", timelineStart);
		stageTimeline[now].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from(stage.children('img.p1'), 1.5, {y:formFunc(stage.children('img.p1'),2),ease:Power1.easeInOut}),1);
		t.add(new TimelineLite().from(stage.children('img.p2'), 3, {alpha:0,scale:0.75,ease:Power1.easeInOut}),1.5);
		t.add(new TimelineLite().from(stage.children('h3'), 1.5, {x:formFunc(stage.children('h3'),1),ease:Power1.easeInOut}),2.0);
		t.add(new TimelineLite().from(stage.children('h4'), 1.5, {x:formFunc(stage.children('h4'),3),ease:Power1.easeInOut}),2.5);
		stageTimeline[now].add(t);
		
		/* page c */
		now++;
		var stage=stageBox.eq(now);
		stageTimeline[now]= new TimelineLite({paused:true});	
		stageTimeline[now].eventCallback("onStart", timelineStart);
		stageTimeline[now].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from(stage.children('img.p1'), 1.5, {y:formFunc(stage.children('img.p1'),0),ease:Power1.easeInOut}),1);
		t.add(new TimelineLite().from(stage.children('h3'), 1.5, {x:formFunc(stage.children('h3'),3),ease:Power1.easeInOut}),1.5);
		t.add(new TimelineLite().from(stage.children('h4'), 1.5, {x:formFunc(stage.children('h4'),1),ease:Power1.easeInOut}),2.0);
		stageTimeline[now].add(t);
		
		/* end */
		now++;
		var stage=stageBox.eq(now);
		stageTimeline[now]= new TimelineLite({paused:true});	
		stageTimeline[now].eventCallback("onStart", timelineStart);
		stageTimeline[now].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from(stage.children('img.logo'), 3, {autoAlpha:0,scale:0.9,ease:Power1.easeInOut}),0.5);
		stageTimeline[now].add(t);
				
	}//end func
	
});