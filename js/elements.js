var destination;

EditText = function() {
  THREE.Object3D.call(this);

  this.inputElement = document.createElement('div');
  this.inputElement.classList.add("destination");


    this.addEventListener('added', (function() {
      // console.log('added eventlistener called');
      container.appendChild(this.inputElement);
    }).bind(this));

    this.addEventListener('removed', (function() {
      container.removeChild(this.inputElement);
    }).bind(this));


  // this.inputElement.innerHTML = '<div class="arrow"><input type="text"></div>';

  this.inputElement.innerHTML = '<div id="inputBox" class="ui action input">' +
      '<input id="inputText" type="text" placeholder="Destination">' +
        '<button id="inputButton" class="icon ui icon green inverted basic button">' +
        '<i class="arrow right icon"></i>' +
        '</button>' +
      '</div>';
  // this.inputElement.setAttribute('type', 'text');
  // this.inputElement.setAttribute('value', 'default');

  this.inputElement.style.display = '';
  // this.inputElement.style.left = WINDOW_HEIGHT / 2 + 'px';
  // this.inputElement.style.top = WINDOW_WIDTH / 2 + 'px';



  this.addEventListener('added', (function() {
    // console.log('added eventlistener called');
    container.appendChild(this.inputElement);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.inputElement);
  }).bind(this));


  $(function() {
    // title = new Title();
    // scene.add(timeoutitle);
    // $('#inputText').keypress(function() {
    //   console.log("text entered");
    // });

    $('#inputButton').click(function() {

      // Get rid of the input box from the screen
      $('#inputBox').transition('fade up', 2000);
      var tween = new TWEEN.Tween(camera.position).to({
        x: player.camera.getWorldPosition().x,
        y: player.camera.getWorldPosition().y,
        z: player.camera.getWorldPosition().z
      }, 2000).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
        camera.position.set(this.x, this.y, this.z);
        camera.lookAt(player.position);
      }).start();


      // Enable the controlls for plane movement
      $(document).keydown(function(event) {
        handleOnKeyDown(event);
      });

      $(document).keyup(function(event) {
        handleOnKeyUp(event);
      });


      // Grab the destination string
      destination = $('#inputText').val();

      validPlace(destination, function (valid) {
        if (valid) {
            // Maybe do something special?
            // This happens if the destination is a popular place/city (i.e. Paris, France)
        }
      });
      popup = new PopUpInformationBox(destination);
      scene.add(popup);

      geocodeAddress(geocoder, destination);

      // button = new Button("testButton");
      // scene.add(button);

      backButton = new BackButton();
      scene.add(backButton);


      $('#testButton').click(function() {
        var location = calculatePolar(player.position.clone());
        getWeather(location.x, location.y, function(data) {
          console.log(data.weather[0].id);
          if(data.weather[0].id == 800) {
            console.log("WEATHER IS GOOD");
          } else if(data.weather[0].id < 781 && data.weather[0].id > 500){
            console.log("WEATHER IS BAD");
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
            var tween = new TWEEN.Tween(x).to(x, 1500).onUpdate(function(){
              player.cloud.rotateOnAxis(new THREE.Vector3(0, 1, 0).applyQuaternion(player.cloud.quaternion), x+0.1);
              console.log(x);
            }).onComplete(function() {
              player.cloud.visible = false;

            }).start();
          }
        });
      });

    });
  })

  function validPlace(place, cb) {
    place = place.replace(/ /g, '+');
    var url = `http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20geo.places%20where%20text=%27${place}%27&format=json`;
    $.getJSON(url, function (data) {
      if (data.query.results === "null") return cb(false);
      return cb(true);
    })
  }

  function handleOnKeyDown(event) {
  		// event.preventDefault();

  	if(event.which == 37) {  // Left key
  		turnDir = 1;
    }
  	if(event.which == 38) { // Up key
  		forwardDir = -0.25;
    }
  	if(event.which == 39) { // Right key
  		turnDir = -1;
    }

    // if (event.which == 77) {
    //
    //   marker.rotation.y += Math.PI / 16;
    //   console.log("Y: " +marker.rotation.y);
    // }
    //
    // if (event.which == 78) {
    //
    //   marker.rotation.x += Math.PI / 16;
    //   console.log("X: " + marker.rotation.x);
    // }
    // if(event.which == 40) {
    //   var geom = new THREE.BoxGeometry(50, 50, 50);
    //   var mat = new THREE.MeshBasicMaterial({color: COLORS.red});
    //   var mesh = new THREE.Mesh(geom, mat);
    //   scene.add(mesh);
    //
    //
    //   var cartesian = calculateCartesian(34.34157499999999, 108.93976999999995, EARTH_RADIUS);
    //   mesh.position.set(cartesian.x, cartesian.y, cartesian.z);
    // }
  }

  function handleOnKeyUp(event) {
    if (event.keyCode == 37) {
      turnDir = 0;
    } if(event.keyCode == 38) {
      forwardDir = 0;
    } if(event.keyCode == 39) {
      turnDir = 0;
    }
  }

  function rotateMap(event) {

    if (event.keyCode == 77) {


    }
  }
}

EditText.prototype = Object.create(THREE.Object3D.prototype);
EditText.prototype.constructor = EditText;

Title = function () {
  THREE.Object3D.call(this);

  this.inputElement = document.createElement('div');
  this.inputElement.classList.add("destination");
  this.inputElement.innerHTML = '<h1 id="title"> FLY! </h1>';

  this.inputElement.style.display = '';

  $('#inputButton').click(function() {
    $('#title').transition('fade up', 2000);
  });

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));
}

Title.prototype = Object.create(THREE.Object3D.prototype);
Title.prototype.constructor = Title;

PopUpInformationBox = function (name) {
  THREE.Object3D.call(this);

  this.element = document.createElement('div');
  this.element.classList.add('cuck', 'ui', 'red', 'raised', 'very', 'padded', 'text', 'segment', 'container');
  this.element.innerHTML = `
    <div class="ui grid">
      <div class="eight wide column">
        <center id="cuck">
          <h2><span id="countryName">?&nbsp;</span><img vspace="5" style="height: 1em;" id="imgFlag"></img></h2>
        </center>
      </div>
      <div class="eight wide column">
        <center>
          <img id="weatherIcon"></img>
          <p>Latitude:<span id="lati"></span></p>
          <p>Longitude:<span id="long"></span></p>
        </center>
      </div>
    </div>
  `;

  this.element.style.display = '';

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));
}

PopUpInformationBox.prototype = Object.create(THREE.Object3D.prototype);
PopUpInformationBox.prototype.constructor = PopUpInformationBox;

BackButton = function () {
  THREE.Object3D.call(this);

  this.element = document.createElement('div');
  this.element.classList.add('backButton');

  this.element.innerHTML = `
    <button class="ui icon red inverted basic button" type="button" onClick="window.location.reload();">
      <i class="refresh icon"></i>
    </button>`;
  this.element.style.display = '';

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));
}
BackButton.prototype = Object.create(THREE.Object3D.prototype);
BackButton.prototype.constructor = BackButton;

Button = function(name) {
  THREE.Object3D.call(this);

  this.element = document.createElement('div');
  this.element.classList.add(name);

 this.element.innerHTML = `<button id=${name} class="ui teal basic button massive">Query</button>`;

  this.element.style.display = '';

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));

}

Button.prototype = Object.create(THREE.Object3D.prototype);
Button.prototype.constructor = Button;
