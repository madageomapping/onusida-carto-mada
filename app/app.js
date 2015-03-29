(function () {

	L.Icon.Default.imagePath = './images/leaflet';

	var map = L.map('map', {
		center: [-18.766947, 49],
		zoom: 6,
		minZoom: 4,
		maxZoom: 10
	});

	L.tileLayer('https://{s}.tiles.mapbox.com/v3/{key}/{z}/{x}/{y}.png', {
		key: 'lrqdo.2c2d7d96',
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	
	$.ajax('./testData.json').done( renderMarkers ); 

	var popupTpl = _.template( $('.js-tpl-popup').html() );


	function renderMarkers(data) {
		
		var markerClusters = new L.MarkerClusterGroup({
			showCoverageOnHover: false,
			maxClusterRadius: 40,
			spiderfyDistanceMultiplier: 2
		});

		_.each(data.data, function (markerData) {
	    		
	    	// lon,lat on test data :(
	    	var rawCoordinates = markerData.coordinates.split(',');
	    	var coordinates = [ parseFloat(rawCoordinates[1]),  parseFloat(rawCoordinates[0]),]; 

	    	var marker = new L.Marker(coordinates);
	    	markerClusters.addLayer(marker);

	    	marker.data = markerData;
	    	marker.on('click', onMarkerClick);

	    })
		
		map.addLayer(markerClusters);
	}

	function onMarkerClick(e) {
		var marker = e.target;
        var popupData = marker.data;

        //wrap data in an object to avoid ref errors when rendering template
        var popup = L.popup().setContent( popupTpl( {data: popupData }) );
        marker.bindPopup( popup );
        marker.openPopup();
    }


	$('.js-province a').on('click', function (e) {
		var latlonStr = $(e.currentTarget).data('latlon');
		var latlon = latlonStr.split(',');

		//shift a bit to the west to compensate space taken by right controls
		//TODO : only desktop
		latlon[1] = parseFloat(latlon[1]) + 1;
		map.setView(latlon, 8);
	});

	$('.js-showfilters').on('click', function (e) {
		$('.js-filters').addClass('opened');
	});

	$('.js-closeFilters').on('click', function(e) {
		$('.js-filters').removeClass('opened');
	});

})()