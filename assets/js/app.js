function initMap() {
  var laboratoriaLima = {lat: -12.1191427, lng: -77.0349046};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: laboratoriaLima,
    // mapTypeControl:false,
    // zoomControl: false,
    // streetViewControl:false
  });
  var markadorLaboratoria = new google.maps.Marker({
    position: laboratoriaLima,
    map: map
  });

  var latitud, longitud, miUbicacion;
  var funcionExito = function(posicion){
    latitud = posicion.coords.latitude;
    longitud= posicion.coords.longitude;

      miUbicacion = new google.maps.Marker({
        position: {lat:latitud, lng:longitud},
        animation: google.maps.Animation.DROP,
        map: map
    });

    map.setZoom(18);
    map.setCenter({lat:latitud, lng:longitud});
  }

  var funcionError = function (error){
    alert("Tenemos un problema con encontrar tu ubicación");
  }

  function buscar(e){
    // e.preventDefault();
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
  }  

  var inputPartida = document.getElementById("partida");
  var inputDestino = document.getElementById("destino");

  new google.maps.places.Autocomplete(inputPartida);
  new google.maps.places.Autocomplete(inputDestino);

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var calculateAndDisplayRoute = function(directionsService, directionsDisplay){
    directionsService.route({
      origin: inputPartida.value,
      destination: inputDestino.value,
      travelMode:"DRIVING"
    }, function(response, status){
      if(status === "OK"){
        var distancia = Number((response.routes[0].legs[0].distance.text.replace("km","")).replace(",","."));
        var tarifa = document.getElementById("tarifa");
        tarifa.classList.remove("hide");
        var costo = distancia*1.75;
        if(costo<4){
          tarifa.innerHTML = "S/.4";
          
        }else{
          tarifa.innerHTML = "S/. " + parseInt(costo);
        }        
        console.log(response.routes[0].legs[0].distance.text);
        directionsDisplay.setDirections(response);
        if(miUbicacion != null){
          miUbicacion.setMap(null);
        }
        
      } else {
        window.alert("No encontramos esa ruta.");
      }
    });    
  }
  
  directionsDisplay.setMap(map);

  var trazarRuta = function(e) {
    // e.preventDefault();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  document.getElementById("trazar-ruta").addEventListener("click", trazarRuta);

  document.getElementById("encuentrame").addEventListener("click", buscar);
}


