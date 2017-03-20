//2016.4.5
(function($) {	
	$.fn.extend({
		panoOn: function(options) {
			
			var $this=$(this);
			var $end=false;
			var $num=2;
			var $pano,$scene,$hot,$cross,$info,$focus;
			var $load=$this.children('.load');
			var windowWd=$(window).width()*0.5,windowHt=$(window).height();
			var defaults = {distance:75,lockX:false,lockY:false,list:[2,0,4,5,1,3],focus:true};
			var opts = $.extend(defaults,options);
			
			//scene
			var camera,scene=[], renderer=[];
			var target = new THREE.Vector3();
			var lon = 90, lat = 0;
			var lonTar = 90, latTar = 0;
			var phi = 0, theta = 0;
			var fov=opts.distance,fovMax=opts.distance,fovMin=opts.distance-11;
			var touchX,touchY;
			var angLast;
			
			
			//hot
			var hotObj=[];
			var hotBox=[],hotTimer;
			var hitted=false,hitStart=false,hitTimer;
			
			if(options) load_handler();
			
			function load_handler(){
				var loader = new PxLoader();
				for(var i=0; i<opts.image.length; i++) loader.addImage(opts.image[i]);
				
				loader.addCompletionListener(function() {
					console.log('pano images load complete');
					loader=null;
					icom.fadeOut($load,500,function(){
						$load.remove();
					});
					pano_init();
				});			
				loader.start();	
			}//end func	
			
			function pano_init(){
				for(var i=0; i<$num; i++) $('<div class="pano"><div class="scene"></div><div class="hot"></div><div class="cross"></div><div class="info"></div><div class="info"></div><div class="focus"></div></div>').prependTo($this);
				$pano=$this.children();
				$scene=$pano.children('.scene');
				$hot=$pano.children('.hot');
				$cross=$pano.children('.cross');
				$info=$pano.children('.info');
				$focus=$pano.children('.focus').css({width:$pano.width()*2,height:$pano.width()*2,marginLeft:-$pano.width(),marginTop:-$pano.width()});
				$load=$pano.children('.loadAssetBox');
				console.log($focus.length);
				add_pano();
				if(opts.hot && opts.hot.length>0) add_hot();
				else $hot.remove();
				$this.on('off',this_off).on('pause',this_pause).on('resume',this_resume);
				$(window).on('resize',window_resize);
				this_resume();
			}//end func
			
			//------------------------------event
			function this_off(e){
				$end=true;
				$this.off('off pause resume');
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function this_resume(){
				$(window).on('deviceorientation',window_deviceorientation);
				$this.on('touchstart',pano_touchstart );
			}//end func
			
			function this_pause(){
				$(window).off('deviceorientation',window_deviceorientation);
				$this.off('touchstart',pano_touchstart );
			}//end func
			
			//------------------------------resize
			function window_resize(e) {
				windowWd=$(window).width()*0.5,windowHt=$(window).height();
				camera.aspect = windowWd / windowHt;
				camera.updateMatrix();
				camera.updateMatrixWorld();
				camera.updateProjectionMatrix();
				for(var i=0; i<$num; i++) renderer[i].setSize(windowWd, windowHt);
			}//end func
			
			//------------------------------orientation
			function window_deviceorientation(e){
				var ang=[e.originalEvent.alpha,get_gamma(e.originalEvent.gamma)];
				ang[1]=ang[1]<-45?-45:ang[1];
				ang[1]=ang[1]>90?90:ang[1];
				if(angLast) ang[1]= angLast[1]<0 && ang[1]>=90 ?-45:ang[1];
				if(angLast && ( Math.abs(angLast[0]-ang[0])>0.1 || Math.abs(angLast[1]-ang[1])>0.1 ) ){
					if( ang[0]>=0 && angLast[0]<=360 ) lon-=(ang[0]-angLast[0])*2;
					else if( ang[0]<=180 && angLast[0]>180 ) lon-=(ang[0]+(360-angLast[0]))*2;
					else if( ang[0]>=180 && angLast[0]<180 ) lon-=((360-ang[0])+angLast[0])*2;
					lat=ang[1];
				}//end if
				angLast=[ang[0],ang[1]];
			}//end func
			
			function get_gamma(ang){
				if(window.orientation==-90){
					ang=ang<0?ang+180-50:ang-50;
				}//edn if
				else if(window.orientation==90){
					ang=-ang;
					ang=ang<0?ang+180-50:ang-50;
				}//edn if
				return ang;
			}//edn func
			
			//------------------------------touch
			function pano_touchstart(e) {
				e.preventDefault();
				$(this).on( 'touchmove', pano_touchmove ).one( 'touchend', pano_touchend );
				angLast=undefined;
				var touch = e.originalEvent.touches[ 0 ];
				touchX = touch.screenX;
				touchY = touch.screenY;
				$(window).off('deviceorientation',window_deviceorientation);
			}//end func
		
			function pano_touchmove(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				angLast=undefined;
				var touch = e.originalEvent.touches[ 0 ];
				lon -= ( touch.screenX - touchX ) * 0.2;
				lat += ( touch.screenY - touchY ) * 0.2;
				touchX = touch.screenX;
				touchY = touch.screenY;
			}//end func
			
			function pano_touchend(e) {
				e.preventDefault();
				$(this).off( 'touchmove', pano_touchmove );
				$(window).on('deviceorientation',window_deviceorientation);
			}//end func
			
			
			//------------------------------pano
			function add_pano() {
				camera = new THREE.PerspectiveCamera(opts.distance, windowWd / windowHt, 1, 1000);
				var sides = [
		            {
		                url: opts.image[opts.list[0]],
		                position: [-512, 0, 0],
		                rotation: [0, Math.PI / 2, 0]
		            },
		            {
		                url: opts.image[opts.list[1]],
		                position: [512, 0, 0],
		                rotation: [0, -Math.PI / 2, 0]
		            },
		            {
		                url: opts.image[opts.list[2]],
		                position: [0, 512, 0],
		                rotation: [Math.PI / 2, 0, Math.PI]
		            },
		            {
		                url: opts.image[opts.list[3]],
		                position: [0, -512, 0],
		                rotation: [-Math.PI / 2, 0, Math.PI]
		            },
		            {
		                url: opts.image[opts.list[4]],
		                position: [0, 0, 512],
		                rotation: [0, Math.PI, 0]
		            },
		            {
		                url: opts.image[opts.list[5]],
		                position: [0, 0, -512],
		                rotation: [0, 0, 0]
		            }
		        ];
		        for(var i=0; i<$num; i++){
		        	scene[i] = new THREE.Scene();
			        for (var j = 0; j < sides.length; j++) {
			            var side = sides[j];
			            var element = document.createElement( 'img' );
						element.src = side.url;
			            element.width = 1026; // 2 pixels extra to close the gap. 
			            var object = new THREE.CSS3DObject(element);
			            side.position && object.position.fromArray(side.position);
			            side.rotation && object.rotation.fromArray(side.rotation);
			            scene[i].add(object);
			        }//end for
					renderer[i] = new THREE.CSS3DRenderer();
					renderer[i].setSize( windowWd, windowHt );
					renderer[i].render( scene[i], camera );
					$(renderer[i].domElement).appendTo($scene.eq(i));
		        }//end for
				pano_animate();
			}//end init
			
			function pano_animate() {
				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );
				if(!opts.lockX) target.x = Math.sin( phi ) * Math.cos( theta );
				if(!opts.lockY) target.y = Math.cos( phi );
				target.z = Math.sin( phi ) * Math.sin( theta );
				if(opts.focus){
					if(hitStart){
						fov-=0.06;
						fov=fov<fovMin?fovMin:fov;
					}//end if
					else{
						fov+=1;
						fov=fov>fovMax?fovMax:fov;
					}//end else
					camera.fov=fov;
				}//end if
				camera.lookAt( target );
				for(var i=0; i<$num; i++) renderer[i].render( scene[i], camera );
				if(!$end) requestAnimationFrame( pano_animate );
			}//end func
			
			//--------------------------------------------hots
			function add_hot(){
				var r1=512;
				$hot.each(function(){
		            for(var i=0; i<opts.hot.length; i++){
						var o=opts.hot[i];
						var hot=$('<span class="hot"><i></i></span>').appendTo($(this));
			            var pan = o.pan / 180 * Math.PI;
			            var tilt = o.tilt / 180 * Math.PI;
			            var y1 = Math.sin(tilt) * r1;
			            var r2 = Math.cos(tilt) * r1;
			            var x1 = Math.sin(pan) * r2;
			            var z1 = Math.cos(pan) * r2;
			            var pos = new THREE.Vector3(x1, y1, z1);
			            hotObj.push({
							hot:hot,
							id:i,
			                position: pos,
			                rotation: [-tilt, pan, 0],
			                cssPos: {}
			            });
					}//end for	
	            });
	            for( var i=0; i<$num; i++) hotBox[i]=$hot.eq(i).children();
	            console.log('hotBox:'+hotBox[0].length);
				hot_animate();
				hot_hittest();
			}//end func
			
			function hot_hittest(){
				var hitted=false;
				var hitId;
				hotBox[0].each(function(i,n){
					if(imath.hitTest($cross.eq(0),$(n))){
						hitted=true;
						hitId=i;
						return false;
					}//end if
				});
				if(hitted){
					if(!hitStart){
						var info=opts.hot[hitId].label;
						$info.show();
						$info.each(function(i,n){
							$('<p></p>').html(info).appendTo(n);
						});
						if(opts.focus){
							for(var i=0; i<$num; i++) hotBox[i].eq(hitId).siblings().transition({opacity:0.2},500);
							$focus.css({opacity:0}).show().transition({opacity:1},500);
						}//end if
						hitStart=true;
						hitTimer=setTimeout(hit_timer,3000,hitId);
					}//end if
				}//end if
				else{
					if(hitStart){
						if(opts.focus){
							for(var i=0; i<$num; i++) hotBox[i].css({opacity:1});
							$focus.hide();
						}//end if
						hitStart=false;
						clearTimeout(hitTimer);
						$info.hide().empty();
					}//end if
				}//end else
				setTimeout(hot_hittest,50);
			}//end func
			
			function hit_timer(id){
				console.log('hit focus complete');
				$info.each(function(i,n){
					$('<h4></h4>').html('凝视完成').appendTo(n);
				});
			}//end func
			
			function hot_animate(){
				hots_inscreen=[];
				hots_outscreen=[];
				hotObj.forEach(function (o) {
					var hot=o.hot;
					var pos = get_screenXY(o.position);
					if (o.cssPos.x == pos.x && o.cssPos.y == pos.y && o.cssPos.z == pos.z) return false;
					if (o.cssPos.z != pos.z){
						if (pos.z < 0) hot.hide();
						else hot.show();
					}//end if
					hot.css({x:pos.x,y:pos.y});
					o.cssPos = pos;
				});
				if(!$end) requestAnimationFrame( hot_animate );
			}//end func
			
			function get_screenXY(position) {
				var pos = position.clone();
				pos.project(camera);
				var obj = {
					x: (pos.x + 1) * windowWd/2,
					y: (-pos.y + 1) * windowHt/2,
					z: pos.z < 1 ? 1 : -1
				};
//				var sc1 = (windowWd / windowHt) * 0.94;
//				obj.x = obj.x * sc1 + windowWd/2 * (1 - sc1);
//				obj.y = obj.y * sc1 + windowHt/2 * (1 - sc1);
				return obj;
			};//end func
			
		},//end fn
		panoPause: function() {
			$(this).triggerHandler('pause');
		},//end fn
		panoResume: function() {
			$(this).triggerHandler('resume');
		},//end fn
		panoOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闭包