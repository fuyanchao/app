function testInit(dom,camera,target){
	
	var _dom = dom;
	var _target = target;
	var _oldTarget = _target.clone();
	
	var meshList = [];
	
	
	dom.each(function(){
		var _this = $(this);
		var container, scene, renderer, controls, clock;
		
		//var camera = new THREE.PerspectiveCamera(45, _this.width() / _this.height(), 1, 1100);
        //camera.position.set(0,0,5);
        //camera.lookAt(new THREE.Vector3(0,0,0));
		
		var oldVec3 = new THREE.Vector3();
		var guoMesh;
		
		var render=function(){
			
            if (controls) controls.update();
			var len = meshList.length;
			if(len>0){
				for(var i = 0; i < len; i++){
					var obj = meshList[i];
					var mesh = obj.mesh;
					mesh.position.x = (_target.x + _oldTarget.x) * 0.7 + obj.vec3.x;
					mesh.position.y = (_target.y + _oldTarget.y) * 0.7 + obj.vec3.y;
					mesh.position.z = (_target.z + _oldTarget.z) + obj.vec3.z;	

					mesh.rotation.y += 0.01;					
				}
			}
            renderer.render( scene, camera );
        };

		
		var animate = function(){

            window.requestAnimationFrame( animate );
            render();
        };
		
		var get_screenXY = function(position) {
			var pos = position.clone();
			pos.project(camera);
			var obj = {
				x: (pos.x + 1) * _this.width(),
				y: (-pos.y + 1) * _this.height(),
				z: pos.z
			};
			var sc1 = (_this.width() / _this.height()) * 0.7;
			obj.x = obj.x * sc1 + _this.width()/2 * (1 - sc1);
			obj.y = obj.y * sc1 + _this.height()/2 * (1 - sc1);
			return obj;
		};//end func
		

		scene = new THREE.Scene();
		
		renderer = new THREE.WebGLRenderer( {antialias:true,alpha:true} );
		renderer.setPixelRatio( window.devicePixelRatio );
		//renderer.setClearColor(0xff6600, 1);
		renderer.setSize(_this.width(), _this.height());
		_this.append(renderer.domElement);
		
		
		
        //controls = new THREE.OrbitControls(camera);
		
		
		var ambient = new THREE.AmbientLight( 0xcccccc );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0x666666 );
        directionalLight.position.set( 0, 0, -100 );
        scene.add( directionalLight );

        scene.add(new THREE.AmbientLight(0x666666));
		var pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(10, 6, 10);
		scene.add(pointLight);
		
		var loader = new THREE.OBJMTLLoader();
		var onProgress = function (xhr) {
			if (xhr.lengthComputable) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log(Math.round(percentComplete, 2) + '% downloaded');
				//loading.innerHTML = Math.round(percentComplete, 2) + '% downloaded';
			}
		};

		var onError = function (xhr) {
		};

		THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

		loader.load('asserts/obj/guo/hg_low_v03.obj', 'asserts/obj/guo/hg_low_v03.mtl', function (object) {
			$(".loadAssetBox").hide();
			var i,len = hotList.length;
			var o;
			for(i = 0; i < len; i++){
				var mesh = object.clone();
				var obj = {};
				o = hotList[i];
				mesh.scale.set(0.5,0.5,0.5);
				mesh.position.set(o.vx,o.vy,o.vz);
				obj.mesh = mesh;
				obj.vec3 = mesh.position.clone();
				meshList.push(obj);
				scene.add(mesh);
			}
			
			// guoMesh = object;
			// guoMesh.position.x = 0; 
			// guoMesh.position.y = 0;
			// guoMesh.position.z = -5;
			// scene.add(guoMesh);
			

		}, onProgress, onError);
		
		
		animate();
		
		
		
		
	});
	
	console.log(_dom.width());
	
}