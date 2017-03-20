//2016.4.6
(function($) {	
	$.fn.extend({
		panoOn: function(options) {	
			if(options){
				var $this=$(this);
				var $end=false;
				
				var hotShell=$this.children('.hot');
				var sceneBox=$this.children('.scene');
				var loadBox=$('aside.loadBox');
				
				var windowWd=$(window).width(),windowHt=$(window).height();
				
				var hotBox,hotObj=[];
				
				var camera, scene, renderer;
				var geometry, material, mesh;
				var target = new THREE.Vector3();
				var lon = 90, lat = 0;
				var lonTar = 90, latTar = 0;
				var phi = 0, theta = 0;
				
				var touchX,touchY;
				
				var angLast;
				
				var defaults = {compass:false,distance:75,lockX:false,lockY:false,list:[2,0,4,5,1,3]};
				var opts = $.extend(defaults,options);
				load_handler();
			}//end if
			
			function load_handler(){
				//载入图
				loadBox.show();
				var loader = new PxLoader();
				for(var i=0; i<opts.image.length; i++) loader.addImage(opts.image[i]);
				
				loader.addCompletionListener(function() {
					console.log('load pano images complete');
					loader=null;
					loadBox.hide();
					init();
				});			
				loader.start();	
			}//end func	
			
			function init(){
				$this.show();
				$this.on('off',this_off).on('pause',this_pause).on('resume',this_resume);
				add_pano();
				if(opts.hot && opts.hot.length>0) add_hot();
			}//end func
			
			function this_off(e){
				$end=true;
				$this.off('off pause resume');
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function this_resume(){
				$this.on('touchstart',pano_touchstart );
				if(opts.compass) $(window).on('deviceorientation',window_deviceorientation);
			}//end func
			
			function this_pause(){
				$this.off('touchstart',pano_touchstart );
				if(opts.compass) $(window).off('deviceorientation',window_deviceorientation);
			}//end func
			
			//------------------------------pano
			function add_pano() {
				camera = new THREE.PerspectiveCamera(opts.distance, windowWd / windowHt, 1, 1000);
		        scene = new THREE.Scene();
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
				for (var i = 0; i < sides.length; i++) {
		            var side = sides[i];
		            var element = document.createElement( 'img' );
					element.src = side.url;
		            element.width = 1026; // 2 pixels extra to close the gap. 
		            var object = new THREE.CSS3DObject(element);
		            object.position.fromArray(side.position);
		            object.rotation.fromArray(side.rotation);
		            scene.add(object);
		        }//end for
				renderer = new THREE.CSS3DRenderer();
				renderer.setSize( windowWd, windowHt );
				$(renderer.domElement).appendTo(sceneBox);
				$(window).on('resize',window_resize);
				this_resume();
				pano_animate();
			}//end init
			
			function window_resize(e) {
				windowWd=$(window).width(),windowHt=$(window).height();
				camera.aspect = windowWd / windowHt;
				camera.updateMatrix();
				camera.updateMatrixWorld();
				camera.updateProjectionMatrix();
				renderer.setSize(windowWd, windowHt);
			}//end func
		
			function pano_touchstart(e) {
				e.preventDefault();
				$(this).on( 'touchmove', pano_touchmove ).one( 'touchend', pano_touchend );
				angLast=undefined;
				var touch = e.originalEvent.touches[ 0 ];
				touchX = touch.screenX;
				touchY = touch.screenY;
				if(opts.onTouchstart) opts.onTouchstart(hotBox);
				if(opts.compass) $(window).off('deviceorientation',window_deviceorientation);
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
				if(opts.onTouchmove) opts.onTouchmove(hotBox);
			}//end func
			
			function pano_touchend(e) {
				e.preventDefault();
				$(this).off( 'touchmove', pano_touchmove );
				if(opts.onTouchend) opts.onTouchend(hotBox);
				if(opts.compass) $(window).on('deviceorientation',window_deviceorientation);
			}//end func
			
			function window_deviceorientation(e){
				var ang=[e.originalEvent.alpha,e.originalEvent.beta<0?0:e.originalEvent.beta];
				if(angLast && ( Math.abs(angLast[0]-ang[0])>0.1 || Math.abs(angLast[1]-ang[1])>0.1 ) ){
					if( ang[0]>=0 && angLast[0]<=360 ) lon-=(ang[0]-angLast[0])*2;
					else if( ang[0]<=180 && angLast[0]>180 ) lon-=(ang[0]+(360-angLast[0]))*2;
					else if( ang[0]>=180 && angLast[0]<180 ) lon-=((360-ang[0])+angLast[0])*2;
					lat+=(ang[1]-angLast[1])*2;
				}//end if
				angLast=[ang[0],ang[1]];
			}//end func
		
			function pano_animate() {
				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );
				if(!opts.lockX) target.x = Math.sin( phi ) * Math.cos( theta );
				if(!opts.lockY) target.y = Math.cos( phi );
				target.z = Math.sin( phi ) * Math.sin( theta );
				camera.lookAt( target );
				renderer.render( scene, camera );
				if(!$end) requestAnimationFrame( pano_animate );
			}//end func
			
			//--------------------------------------------hots
			function add_hot(){
				var r1=512;
				for(var i=0; i<opts.hot.length; i++){
					var o=opts.hot[i];
					var hot=$('<span class="hot"><i></i></span>').appendTo(hotShell).on('touchstart',hot_touchstart);
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
				hotBox=hotShell.children();
				hot_animate();
			}//end func
			
			function hot_touchstart(e){
				$(this).one( 'touchmove', hot_touchmove ).one( 'touchend', hot_touchend );
			}//end func
			
			function hot_touchmove(e){
				e.preventDefault();
				$(this).off( 'touchend' );
			}//end func
			
			function hot_touchend(e){
				$(this).off( 'touchmove' );
				var id=$(this).index('.hot');
				if(opts.onTouchhot) opts.onTouchhot($(this));
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