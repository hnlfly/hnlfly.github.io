window.addEventListener('load', init, false);

var colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
  fog:0xF7D9AA
};

function init() {
  createScene();

  createLights();

  // createPlane();
  createSea();
  // createSky();

}

var HEIGHT, WIDTH;

var scene, camera, renderer, container, renderingLoop;

var ballMesh;
function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(colors.fog, 100, 950);

  var aspectRatio = WIDTH / HEIGHT;
  var fieldOfView = 60;
  var nearPlane = 1;
  var farPlane = 10000;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

	var boxGeom = new THREE.BoxGeometry(100, 100, 100);
	var boxMat = new THREE.MeshBasicMaterial({color: 0xFFFF00});
	boxMesh = new THREE.Mesh(boxGeom, boxMat);
	boxMesh.position.y = 100;
	scene.add(boxMesh);

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	renderingLoop = new THREEx.RenderingLoop();
	renderingLoop.add(loop);
	renderingLoop.start();

	var physicsLoop = new THREEx.PhysicsLoop(60);
	physicsLoop.add(physics);
	physicsLoop.start();
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updatePorjectionMatrix();
}


var hemisphereLight, shadowLight;

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xAAAAAA, 0x000000, 0.9);

  shadowLight = new THREE.DirectionalLight(0xFFFFFF, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}


function loop() {
  sea.mesh.rotation.z += 0.005;
  renderer.render(scene, camera);
}

function attract(body, attractor) {
	var gravityUp = body.position.clone().sub(attractor.position).normalize();
	var bodyUp = new THREE.Vector3().copy(body.up).applyQuaternion(body.quaternion);

	var rotateQuaternion = new THREE.Quaternion().setFromUnitVectors(bodyUp, gravityUp);
	var curQuaternion = boxMesh.quaternion.multiplyQuaternions(rotateQuaternion, boxMesh.quaternion).normalize();

	body.setRotationFromQuaternion(curQuaternion);

}


function physics(delta) {
	var horizontalAxis, verticalAxis;
	document.onkeydown = function(e) {
		switch (e.keyCode) {
			// Left arrow
			case 37:
				horizontalAxis = -1;
			// Up
			case 38:
				verticalAxis = 1;
			// Right
			case 39:
				horizontalAxis = 1;
			// Down
			case 40:
				verticalAxis = -1;
		}

		var speed = 500;
		var localDirection = new THREE.Vector3(horizontalAxis? horizontalAxis : 0, 0, verticalAxis? verticalAxis : 0).applyQuaternion(boxMesh.quaternion);

		var newPosition = boxMesh.position.clone().add(localDirection.multiplyScalar(speed * delta));
		boxMesh.position.set(newPosition.x, newPosition.y, newPosition.z);

		attract(boxMesh, sea.mesh);

		horizontalAxis = 0;
		verticalAxis = 0;
	}
}


var sea;

function createSea() {
  sea = new Sea();
  sea.mesh.position.y = -600;

  scene.add(sea.mesh);
}
