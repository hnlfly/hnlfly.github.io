

// var enableKeys = false;
var forwardDir = 0;
var turnDir = 0;

// document.onkeydown = null;



function calculateLength(vec3) {
	return Math.sqrt(Math.pow(vec3.x, 2) + Math.pow(vec3.y, 2) + Math.pow(vec3.z, 2));
}



function calculateDistance(v1, v2) {
	var diff = v1.clone().sub(v2);
	return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2) + Math.pow(diff.z, 2));
}

function calculateCartesian(lat, lon, radius) {
	var phi = (90 -lat) * (Math.PI / 180);
	var theta = (lon + 180) * (Math.PI / 180);
	var x = -((radius) * Math.sin(phi) * Math.cos(theta));
	var z = ((radius) * Math.sin(phi) * Math.sin(theta));
	var y = ((radius) * Math.cos(phi));

	return new THREE.Vector3(x,y,z);
}




function calculatePolar(vec3) {

	var lon = Math.atan2(-vec3.z,vec3.x);
	var xzLen = new THREE.Vector2(-vec3.z,vec3.x).length();
	var lat = Math.atan2(vec3.y,xzLen);

	return new THREE.Vector3(lat, lon).multiplyScalar(180/Math.PI);
}

var gravity = -0.002;
var velocity = 500;
var angularVelocity = 2;

function handleMovement(body, attractor, delta) {

	// Rotation
	var gravityUp = body.position.clone().sub(attractor.position).normalize();
	var gravityDown = attractor.position.clone().sub(body.position).normalize();
	var bodyUp = new THREE.Vector3().copy(body.up).applyQuaternion(body.quaternion);

	var rotateQuaternion = new THREE.Quaternion().setFromUnitVectors(bodyUp, gravityUp);
	var curQuaternion = body.quaternion.multiplyQuaternions(rotateQuaternion, body.quaternion).normalize();

	body.setRotationFromQuaternion(curQuaternion);
	body.rotateOnAxis(new THREE.Vector3(0, 1, 0), turnDir * angularVelocity * delta);


	// Translation
	var localDir = new THREE.Vector3(0, gravity, forwardDir).applyQuaternion(body.quaternion);
  var newPosition = new THREE.Vector3().copy(body.position).add(localDir.multiplyScalar(velocity * delta));

  body.position.set(newPosition.x, newPosition.y, newPosition.z);

	var raycaster = new THREE.Raycaster(body.position, gravityDown);
	var intersect = raycaster.intersectObject(attractor);
	if(intersect) {
		if(intersect[0].distance > 100) {

			gravity = -0.002;
		} else {
			gravity = 0;

		}

		//console.log(intersect);
		intersect[0].face.color.setRGB( Math.random(), Math.random(), Math.random());
		attractor.geometry.colorsNeedUpdate = true;
	}
	// arrow = new THREE.ArrowHelper(gravityDown, body.position, 200);

	// console.log("total distance: " + testDistance);
}



var tolerantDist = Math.sqrt(Math.pow(EARTH_RADIUS, 2) + Math.pow(2000, 2));

function handleCamera(body, camera) {
	camera.lookAt(body.position);

	// Distance between the player and camera
	distance = calculateDistance(body.position, camera.position);
	// camera.target = player.player.position;

	if(distance > tolerantDist) {
		distance = 0;

		var tween = new TWEEN.Tween(camera.position).to({
			x: body.camera.getWorldPosition().x,
			y: body.camera.getWorldPosition().y,
			z: body.camera.getWorldPosition().z
		}).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
			camera.position.set(this.x, this.y, this.z);
			camera.lookAt(body.position);
		}).onComplete(function() {
			// camera.lookAt(player.player.position);
		}).start();

	}

}


function physics(delta) {
  handleMovement(player, earth.mesh, delta);
	handleCamera(player, camera);
}
