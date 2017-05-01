Earth = function() {
  var geom = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32);
  var mat = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
    color: COLORS.blue,
    transparent: true,
    opacity: 0.6,
    shading: THREE.FlatShading
  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Player = function() {
  this.player = new THREE.Group();
  this.player.position.z = 700;
  this.player.position.y = -500;


  var geom = new THREE.BoxGeometry(100, 100, 100);
  var mat = new THREE.MeshBasicMaterial({color: 0xFFFF00});
  this.mesh = new THREE.Mesh(geom, mat);
  this.player.add(this.mesh);

  // var geom = new THREE.BoxGeometry(50, 50, 50);
  // var mat = new THREE.MeshBasicMaterial({color: COLORS.red});
  this.camera = new THREE.PerspectiveCamera;
  this.camera.position.y = 1300;
  this.camera.position.z = 300;
  this.player.add(this.camera);
}
