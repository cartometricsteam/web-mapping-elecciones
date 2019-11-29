/****************************************************/
/******************* DEFINICIONES *******************/
/****************************************************/

// Añadir la clave de acceso para conectarte a la API de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FydG9tZXRyaWNzbGFiIiwiYSI6ImNrM2JnanIzMjBsZHQzbW1yM2h2OWxieHMifQ.MCULumHFKyTPrBNEETSBww';

// Definición de variables
var mapasBase = [
	'mapbox://styles/cartometricslab/ck3ievzm21vjz1co00ppc00yy',
	'mapbox://styles/cartometricslab/ck3iff63c1vxz1dndgtipgqg4'
];
var idMapaBaseActual = 0;


/****************************************************/
/*********************** MAIN ***********************/
/****************************************************/

// Crear el mapa
var mapa = new mapboxgl.Map({
  container: 'mapa', // el elemento HTML con id='mapa' es el contenedor del mapa
  style: mapasBase[idMapaBaseActual], // estilo del mapa base inicial
  center: [-3.599, 40.523], // coordenadas [lng, lat] del centro inicial
	zoom: 8, // nivel de zoom inicial
});

// Añadir controles de zoom y rotación
mapa.addControl(new mapboxgl.NavigationControl());

// Añadir buscador geográfico
mapa.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	mapboxgl: mapboxgl,
	collapsed: true,
	language: 'es',
	placeholder: 'Buscar'
}), 'top-right');

// Añadir event listener a botón de cambio de mapa base
var btnMapaBase = document.getElementById('btnMapaBase');
btnMapaBase.addEventListener('click', cambiarMapaBase);

// Cargar popups una vez cargue el mapa
mapa.on('load', function () {
	cargarPopups();
});

/****************************************************/
/******************** FUNCIONES *********************/
/****************************************************/
function cambiarMapaBase() {
	idMapaBaseActual = (idMapaBaseActual + 1) % mapasBase.length;
	mapa.setStyle(mapasBase[idMapaBaseActual]);
}

function cargarPopups() {
	// Añadir Popup al hacer click sobre municipio
	mapa.on('click', 'final-elecciones-abril-1m587r', function (e) {
		var coordinates = e.lngLat;
		var nombreMunicipio = e.features[0].properties.Nombre_de;
		var votosPSOE = e.features[0].properties.PSOE;
		var votosPP = e.features[0].properties.PP;
		var votosPodemos = e.features[0].properties.PODEMOS_IU;
		var votosVox = e.features[0].properties.VOX;
		var votosPacma = e.features[0].properties.PACMA;
		var popupContent = '<h1>' + nombreMunicipio + '</h1><div>PSOE: ' + votosPSOE + '</div><div>PP: ' + votosPP + '</div><div>PODEMOS/IU: ' + votosPodemos + '</div><div>VOX: ' + votosVox + '</div><div>PACMA: ' + votosPacma;
		 
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(popupContent)
			.addTo(mapa);
	});

	// Cambiar el cursor del ratón al pasar por encima / salir de un municipio
	mapa.on('mouseenter', 'final-elecciones-abril-1m587r', function () {
		mapa.getCanvas().style.cursor = 'pointer';
	});

	mapa.on('mouseleave', 'final-elecciones-abril-1m587r', function () {
		mapa.getCanvas().style.cursor = '';
	});

}
/****************************************************/