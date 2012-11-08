var VIEW = {};
VIEW.BoxWave = function (){
	// ---- PRIVATE VARS ---- //
	var boxes = [];
	var iteration = 0;
	//scene size, not sure why -4 keeps the browser from adding scrollbars
	var WIDTH = window.innerWidth,
		HEIGHT = window.innerHeight - 4;

	//Camera Params
	var aspect = WIDTH / HEIGHT

	var renderer;
	var scene;
	var camera;
	var projector;
	var mouse2d = new THREE.Vector3(0,0,1);
	var self = this;

	// ---- PUBLIC VARS ---- //
	//this.domElement


	// ---- CONSTRUCTOR ---- //
	initScene();
	setupLights();
	
	//Create Grid
	 var grid = UTILS.createGrid(CONST.GRID_SIZE, CONST.GRID_SUBDIVS, CONST.GRID_COLOR, CONST.GRID_OPACITY);
	 scene.add(grid.object3D);

	setupBoxes();
	setupInteraction();

	// ---- PRIVATE FUNCTIONS ---- //
	function initScene(){
		//create renderer, camera and scene
		renderer = new THREE.WebGLRenderer();
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(CONST.CAMERA_VIEW_ANGLE, aspect, CONST.CAMERA_NEAR_CLIP, CONST.CAMERA_FAR_CLIP);

		camera.position.x = 800;
		camera.position.y = 400;
		camera.position.z = 800;

		scene.add(camera);
		camera.lookAt(scene.position);
		renderer.setSize(WIDTH, HEIGHT);

		self.domElement = renderer.domElement;

		projector = new THREE.Projector();
	};

	function setupLights(){
		var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
		scene.add( ambientLight );

		var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
		directionalLight.position.x = -0.2;
		directionalLight.position.y = 0.24;
		directionalLight.position.z = -0.95;
		directionalLight.position.normalize();
		scene.add( directionalLight );

		var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
		directionalLight.position.x = -0.5;
		directionalLight.position.y = -0.5;
		directionalLight.position.z = 0.7;
		directionalLight.position.normalize();
		scene.add( directionalLight );
	};

	function setupBoxes(){
		//create boxes
		var cellCount = CONST.GRID_SUBDIVS * CONST.GRID_SUBDIVS;
		var gridHalfSize = grid.attr.halfSize;
		var cellSize = grid.attr.cellSize;
		var cellHalfSize = cellSize * 0.5;
		var geometry = new THREE.CubeGeometry(cellSize, cellSize, cellSize);
		geometry.computeBoundingBox();

		for(var i = 0; i < cellCount; i++)
		{
			var row = i%CONST.GRID_SUBDIVS;
			var column = Math.floor(i/CONST.GRID_SUBDIVS);
			var material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
			var box = new THREE.Mesh(geometry, material);

			box.position.x = ((row * cellSize) + cellHalfSize) - gridHalfSize;
			box.position.y = UTILS.measureHeight(box) * 0.5;
			box.position.z = ((column * cellSize) + cellHalfSize) - gridHalfSize;

			scene.add(box);
			boxes.push(box);
		}
	};

	function setupInteraction(){
		self.domElement.addEventListener('mousemove', onDocumentMouseMove);
	};

	function onDocumentMouseMove(e) {
		event.preventDefault();

		//store the current mouse position where 0,0 is the center of the scene
		mouse2d.x = (e.clientX / WIDTH) * 2 - 1;
		mouse2d.y = -(e.clientY / HEIGHT) * 2 + 1;
		//mouse2d.z = 1;

		//console.log(mouse2d.x + ", " + mouse2d.y);
	};

	function updateGrid(){
		var scale = CONST.PERLIN_SCALE;
		var boxCount = boxes.length;
		var subDivs = CONST.GRID_SUBDIVS;
		//increment the iteration to progress the perlin noise
		iteration += 0.1;

		//Apply the perlin noise to the grid of boxes
		for(var i = 0; i < boxCount; i ++)
		{
			var row = (i % subDivs);
			var column = Math.floor(i/subDivs);
			
			var pVal = PerlinNoise.noise((row/subDivs) * scale, (column/subDivs) * scale, iteration/subDivs);
			//the higher the perlin value the darker the colour
			boxes[i].material.color.setRGB(1-pVal, 1-pVal, 1-pVal);
			
			//the higher the perlin value the taller the box
			boxes[i].scale.y = (pVal * 2);
			boxes[i].position.y = UTILS.measureHeight(boxes[i]) * 0.5;
		}
	}

	function updateInteraction(){		
		var vector = mouse2d.clone();
		projector.unprojectVector(vector, camera);
		var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

		var collisions = ray.intersectObjects(boxes);
		var length = collisions.length;

		//show intersected boxes
		if(length > 0)
		{
			collisions[ 0 ].object.material.color.setHex( 0x00FF00 );
			for(var i=1; i<collisions.length; i++)
			{
				collisions[ i ].object.material.color.setHex( 0xFFFF00 );
			}
		}
		

		$("#hud").html("Mouse Collisions: " + collisions.length);
	}


	// ---- PUBLIC FUNCTIONS ---- //
	this.update = function (time){
		updateGrid();
		updateInteraction();

		//render the scene
		renderer.render(scene, camera);
	};

	this.destroy = function () {
		delete this.domElement;
	};
};