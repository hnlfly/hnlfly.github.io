


var forwardDir = 0;
var turnDir = 0;

window.onkeydown = function(e) {
	e.preventDefault();
	if(e.keyCode == 37) {
		turnDir = -1;
	} else if(e.keyCode == 38) {
		forwardDir = 1;
	} else if(e.keyCode == 39) {
		turnDir = 1;
	}
}

window.onkeyup = function(e) {
	if(e.keyCode == 37) {
		turnDir = 0;
	} if(e.keyCode == 38) {
		forwardDir = 0;
	} if(e.keyCode == 39) {
		turnDir = 0;
	}
}

function calculateDistance(v1, v2) {
	var diff = v1.clone().sub(v2);
	return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2) + Math.pow(diff.z, 2));
}



var arrow;
var gravity = -0.01;
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
	if(intersect[0].distance > 100) {
		gravity = -0.01;
	} else {
		gravity = 0;
	}
	arrow = new THREE.ArrowHelper(gravityDown, body.position, 200);

	var testDistance = calculateDistance(body.position, attractor.position);
	console.log("total distance: " + testDistance);
}



var tolerantDist = Math.sqrt(Math.pow(EARTH_RADIUS, 2) + Math.pow(2000, 2));

function handleCamera() {
	camera.lookAt(player.player.position);
	difference = player.player.position.clone().sub(camera.position);
	// Distance between the player and camera
	distance = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2) + Math.pow(difference.z, 2));

	// camera.target = player.player.position;

	if(distance > tolerantDist) {
		distance = 0;

		// (function () {
		// 	var qa = camera.quaternion; // src quaternion
		// 	var qb = player.camera.quaternion;
		// 	var qm = new THREE.Quaternion();
		//
		// 	var o = {t: 0};
		// 	new TWEEN.Tween(o).to({t: 1}, 1000).onUpdate(function () {
		// 		THREE.Quaternion.slerp(qa, qb, qm, o.t);
		// 		camera.quaternion.set(qm.x, qm.y, qm.z, qm.w);
		// 		}).start();
		// }).call(this);

		// real camera to placeholder camera
		var tween = new TWEEN.Tween(camera.position).to({
			x: player.camera.getWorldPosition().x,
			y: player.camera.getWorldPosition().y,
			z: player.camera.getWorldPosition().z
		}).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
			camera.position.set(this.x, this.y, this.z);
			camera.lookAt(player.player.position);
		}).onComplete(function() {
			// camera.lookAt(player.player.position);
		}).start();

		// var tween = new TWEEN.Tween(camera.target).to({
		// 	x: player.player.position.x,
		// 	y: player.player.position.y,
		// 	z: player.player.position.z
		// }).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
		//
		// }).onComplete(function() {
		//
		// }).start();


// var tween = new TWEEN.Tween(camera.target).to({
//     x: selectedObject.position.x,
//     y: selectedObject.position.y,
//     z: 0
// }).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
// }).onComplete(function () {
//     camera.lookAt(selectedObject.position);
// }).start();
//
	}

}


function physics(delta) {
  handleMovement(player.player, earth.mesh, delta);
	handleCamera();
}
