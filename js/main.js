window.addEventListener('load', init, false);

function init() {
    createScene();
    createLights();
    createEarth();
    createPlayer();
    //createLand();
}

// var HEIGHT, WIDTH;
var scene, camera, controls, renderer, container, renderingLoop, physicsLoop;

function createScene() {
    // HEIGHT = window.innerHeight;
    // WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(COLORS.fog, 100, 950);

    var aspectRatio = WINDOW_WIDTH / WINDOW_HEIGHT;
    var fieldOfView = 60;
    var nearPlane = 10;
    var farPlane = 10000;

    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.x = 0;
    camera.position.y = 2000;
    camera.position.z = 300;
    camera.lookAt(0, 100, 1);
    // camera.position.z = 700;
    // camera.position.y = -500;
    // camera.position.x = 100;
    // camera.lookAt(new THREE.Vector3(0, 0, 1));

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    // renderer.shadowMap.enabled = true;


    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    // renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    renderer.autoClear = false;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);


    renderingLoop = new THREEx.RenderingLoop();
    renderingLoop.add(loop);
    renderingLoop.start();

    physicsLoop = new THREEx.PhysicsLoop(60);
    physicsLoop.add(physics);
    physicsLoop.start();

    var editText = new EditText();
    scene.add(editText);

    var input = document.getElementById('inputText');
    var autocomplete = new google.maps.places.Autocomplete(input);

    window.addEventListener('resize', handleWindowResize, false);

}

function handleWindowResize() {
    WINDOW_HEIGHT = window.innerHeight;
    WINDOW_WIDTH = window.innerWidth;

    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);

    camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
    camera.updateProjectionMatrix();
}


var hemisphereLight;

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
    hemisphereLight.position.set(0, 0, -700);
    scene.add(hemisphereLight);

    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.45);
    hemisphereLight.position.set(700, 0, 1000);
    scene.add(hemisphereLight);

    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
    hemisphereLight.position.set(0, 700, 0);
    scene.add(hemisphereLight);



    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    // light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
    // light.position.set( 0, 1500, 1000 );
    // light.target.position.set( 0, 0, 0 );
    // light.castShadow = true;
    // light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
    // light.shadow.bias = 0.0001;

    //   var light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
    // light.position.set(1000,1000,1000);
    //   scene.add( light );
    //
    //   var ambient = new THREE.AmbientLight( 0x444444 );
    // 				scene.add( ambient );
}


function loop() {
    TWEEN.update();
    renderer.render(scene, camera);
}

var earth;

function createEarth() {
    earth = new Earth();
    scene.add(earth.mesh);
}

var player;

function createPlayer() {
    player = new Player();
    scene.add(player);
}

// function createLand() {
//
//     let loader = new THREE.JSONLoader();
//     let name = 'models/earth13.json';
//     loader.load(name, function(geometry, materials) {
//         var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
//
//         mesh.vertexColors = THREE.FaceColors;
//         mesh.color = COLORS.blue;
//         mesh.position.x = 0;
//         mesh.position.y = 0;
//         mesh.position.z = 0;
//
//         var scale = 120;
//         mesh.scale.set(scale, scale, scale);
//         mesh.rotation.x = 0;
//         mesh.rotation.y = 0;
//         scene.add(mesh);
//     })
//
//     // loader = new THREE.JSONLoader();
//     // name = 'models/blueearth2.json';
//     // loader.load(name, function(geometry, materials) {
//     //     var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
//     //     mesh.position.x = 0;
//     //     mesh.position.y = 0;
//     //     mesh.position.z = 0;
//     //
//     //     var scale = 120;
//     //     mesh.scale.set(scale, scale, scale);
//     //     mesh.rotation.x = spin;
//     //     mesh.rotation.y = 0;
//     //     scene.add(mesh);
//     //
//     //     //console.log(mesh.position.x)
//     //     //objects.push(mesh);
//     // })
// }

var geocoder;

function initMap() {
    geocoder = new google.maps.Geocoder();
}


function geocodeAddress(geocoder, address) {
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status === 'OK') {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            putMarker(lat, lng);
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
}

var marker;

function putMarker(lat, lng) {

    THREE.Group.call(this);
    this.position.y = 1200;
    // var geom = new THREE.BoxGeometry(50, 50, 50);
    // var mat = new THREE.MeshBasicMaterial({color: COLORS.blue});
    // var mesh = new THREE.Mesh(geom, mat);
    // scene.add(mesh);
    var geom = new THREE.ConeGeometry(15, 100, 24);
    var mat = new THREE.MeshBasicMaterial({
        color: COLORS.blue
    });
    var mesh = new THREE.Mesh(geom, mat);

    var cartesian = calculateCartesian(lat, lng, EARTH_RADIUS).multiplyScalar(1.2);
    mesh.position.set(cartesian.x, cartesian.y + 200, cartesian.z);
    // mesh.rotation.x = 27.5;
    // mesh.rotation.y = 10.8;

    // Rotation
    var gravityUp = earth.mesh.position.clone().sub(mesh.position).normalize();
    // var gravityDown = attractor.position.clone().sub(body.position).normalize();
    var bodyUp = new THREE.Vector3().copy(mesh.up).applyQuaternion(mesh.quaternion);

    var rotateQuaternion = new THREE.Quaternion().setFromUnitVectors(bodyUp, gravityUp);
    var curQuaternion = mesh.quaternion.multiplyQuaternions(rotateQuaternion, mesh.quaternion).normalize();

    mesh.setRotationFromQuaternion(curQuaternion);
    //console.log(curQuaternion);

    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();
    scene.add(mesh);
}

function getWeather(lat, lon, cb) {
    var secure_api_key = "65a0b9437917c8a3ac9149562da7fb67";
    $.getJSON(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${secure_api_key}`, function(data) {
        cb(data);
    });
}

function getColor(lat, long, cb) {
$.ajax({
 type: "POST",
 url : "http://elfin.io",
 data: {
   lat: lat,
   lon: long
 },
 success: function (data) {
     //console.log(data);
   cb(data);
 }
 });
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

setInterval(function() {
    var location = calculatePolar(player.position.clone());
    $.getJSON(`http://ws.geonames.org/countryCodeJSON?lat=${location.x}&lng=${location.y}&username=demo`, function(data) {
        if (!data.countryName) {
            $('#cuck').hide()
            return;
        }
        $('#imgFlag').attr('src', `http://www.geognos.com/api/en/countries/flag/${data.countryCode}.png`)
        $('#countryName').text(data.countryName);
        $('#cuck').show();
    });
    getWeather(location.x, location.y, function(data) {
        $('#weatherDesc').text(toTitleCase(data.weather[0].description));
        $('#weatherIcon').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
        if(data.weather[0].id == 800) {
            //console.log("WEATHER IS GOOD");
            player.sun.visible = true;
            var random = 2;
            var x = 0;
            var tween = new TWEEN.Tween(x).to(x, 1500).onUpdate(function(){
              player.sun.rotateOnAxis(new THREE.Vector3(0, 1, 0).applyQuaternion(player.sun.quaternion), x+0.1);
            }).onComplete(function() {
              player.sun.visible = false;

            }).start();
} else if (data.weather[0].id < 781 && data.weather[0].id > 500) {
            //console.log("WEATHER IS BAD");
            var random = player.rotation.z * 1.3;
            var tween = new TWEEN.Tween(player.rotation).to({
                z: player.rotation.z * 1.3
            }, 500).easing(TWEEN.Easing.Linear.None).onComplete(function() {
                tween = new TWEEN.Tween(player.rotation).to({
                    z: player.rotation.z * 0.5
                }).start();

            }).start();
        } else {
            player.cloud.visible = true;
            var random = 2;
            var x = 0;
            var tween = new TWEEN.Tween(x).to(x, 1500).onUpdate(function() {
                player.cloud.rotateOnAxis(new THREE.Vector3(0, 1, 0).applyQuaternion(player.cloud.quaternion), x + 0.1);
                //console.log(x);
            }).onComplete(function() {
                player.cloud.visible = false;
            }).start();
        }

    });
    $('#lati').text(location.x.toFixed(2));
    $('#long').text(location.y.toFixed(2));


    getColor(location.x, location.y, function(data) {

        var geometry = new THREE.SphereGeometry(10, 32, 32);
        var material = new THREE.MeshBasicMaterial({
            color: rgbToHex(data[0], data[1], data[2])
        })
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = player.position.x;
        sphere.position.y = player.position.y - 100;
        sphere.position.z = player.position.z;
        //console.log(player.position.y);
        spheres.push(sphere);
        scene.add(sphere);
    });

    if (del) {

        scene.remove(spheres.shift(sphere));
        del = !del;
    }
    else {

        del = !del;
    }
}, 1000);

var spheres = [];
var del = true;
function componentToHex(c) {
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
