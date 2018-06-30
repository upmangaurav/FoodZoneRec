var mymap = L.map('mapid', {drawControl: true}).setView([36.114647, -115.172813], 12);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGc1ODUiLCJhIjoiY2pmOGU5YmExMXRiazJ4cDR5dXFhMjB4NiJ9.ejyGusnAESNwefV4T6Sh8A'
}).addTo(mymap);
newMarkerGroup = new L.LayerGroup();

mymap.on('click', addMarker);

drawnItems = L.featureGroup();

var heat = L.heatLayer(coordinates, {blur: 5}).addTo(mymap);


var testlist = coordinates

var count = 0;
var latmin = 100;
var lngmin = 100;
var latmax = -100;
var lngmax = -100;

mymap.on(L.Draw.Event.CREATED, function(event) {
    var type = event.layerType;
	var layer = event.layer;
	//get information when user finishes editing a shape on draw tool

	//TODO: this was working
	//drawnItems.addLayer(layer);
	//console.log('draw:created->');

//    {"type":"Feature","properties":{},
//    "geometry":{"type":"Polygon","coordinates":
//        [[[-115.237631,36.14355],[-115.237631,36.14355],[-115.200812,36.141609],[-115.200812,36.141609],[-115.233386,36.102229],[-115.233124,36.102229],[-115.237592,36.14355],[-115.237631,36.14355]]]
//        }}

	var drawngeojson = layer.toGeoJSON();
	coords = drawngeojson["geometry"]["coordinates"][0]


	//find minmax of latlog

	for (var c=0; c<coords.length; c++){
	    if (coords[c][0]< latmin){
	        latmin = coords[c][0];
	    }
	    if (coords[c][0]> latmax){
	        latmax = coords[c][0];
	    }
	    if (coords[c][1]< lngmin){
	        lngmin = coords[c][1];
	    }
	    if (coords[c][1]> lngmax){
	        lngmax = coords[c][1];
	    }
	}

	count = 0;

    for (var t=0; t<testlist.length; t++){
        if(testlist[t][0] > lngmin && testlist[t][0] < lngmax && testlist[t][1] > latmin && testlist[t][1] < latmax){
            count += 1;
        }
    }

    drawnItems.addLayer(layer).bindPopup("Potential same category competitiors : " + count.toString()).addTo(mymap);
});


var drawnPolys = new L.FeatureGroup();
var drawnMarkers = new L.FeatureGroup();
mymap.addLayer(drawnPolys)

var polyLayers = [];
var pinLayers = [];

function addMarker(e){

    var marker = L.marker(e.latlng, {
      draggable: true,
      title: "Resource location",
      alt: "Resource Location",
      riseOnHover: true
    }).addTo(mymap)
    .bindPopup(e.latlng.toString()).openPopup();

  // Update marker on changing it's position
  marker.on("dragend", function(ev) {

    var chagedPos = ev.target.getLatLng();
    this.bindPopup(chagedPos.toString()).openPopup();

  });
  pinLayers.push(marker);
}


var recommended_zips = [];
var recommended_zips2 = [];

for (var z = 0; z < recommended_zip.length; z++){
  if(recommended_zip[z][1] == 9){
    recommended_zips.push(recommended_zip[z]);
  }
  else
    recommended_zips2.push(recommended_zip[z]);
}


// var recommended_zips = ['89109','89119','89102','89103','89117','89118','89052','89123','89014','89146'];
// var recommended_zips2 = ['85251','85281','85260','85308','85032','85016','85254','85282','85226','85224']
var colors = ['#800026','#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FFEDA0','#ffffcc','#ffffcc'];
// colors are get from the small tool: colorbrewer2.org
// multihue sequential

//TODO: The saved area list to be presented onto html
//var selected_area_list = [];
//function selectedAreas(thePolygon,zip){
//    selected_area_list.push();
//}
// push to html
//document.getElementById('output').innerHTML = selected_area_list;


for (var k=0; k<recommended_zips.length;k++){
    var poly= null;
    for (var i=0; i<zip.features.length;i++){
        if (zip.features[i].properties.ZCTA5CE10 === recommended_zips[k]){
            poly = zip.features[i].geometry.coordinates;
        }
    }

    for (var i = 0; i < poly.length; i++) {
        for (var j = 0; j < poly[i].length; j++) {
            var v1 = poly[i][j][0];
            var v2 = poly[i][j][1];
            poly[i][j] = [v2, v1];
        }
        var thePolygon = L.polygon(poly[i],{color: colors[k]}).addTo(mymap);
        //thePolygon.bindPopup(recommended_zips[k]).openPopup()
        thePolygon.bindPopup("ZipCode: " + recommended_zips[k]);
        thePolygon.on('mouseover', function (e) {
            this.openPopup();
        });
        thePolygon.on('mouseout', function (e) {
            this.closePopup();
        });
        polyLayers.push(thePolygon)
        thePolygon.on('click', addMarker);
        //TODO: double click to save the polyinformation
        //thePolygon.on('click', selectedAreas(thePolygon,recommended_zips[k]));
    }
}

for (var k=0; k<recommended_zips2.length;k++){
    var poly= null;
    for (var i=0; i<zip2.features.length;i++){
        if (zip2.features[i].properties.ZCTA5CE10 === recommended_zips2[k]){
            poly2 = zip2.features[i].geometry.coordinates;
        }
    }

    for (var i = 0; i < poly2.length; i++) {
        for (var j = 0; j < poly2[i].length; j++) {
            var v1 = poly2[i][j][0];
            var v2 = poly2[i][j][1];
            poly2[i][j] = [v2, v1];
        }
        var thePolygon2 = L.polygon(poly2[i],{color: colors[k]}).addTo(mymap);
        //thePolygon2.bindPopup(recommended_zips[k]).openPopup()
        thePolygon2.bindPopup("ZipCode: " + recommended_zips2[k]);
        thePolygon2.on('mouseover', function (e) {
            this.openPopup();
        });
        thePolygon2.on('mouseout', function (e) {
            this.closePopup();
        });
        polyLayers.push(thePolygon2)
        thePolygon2.on('click', addMarker);
    }
}

//TODO: heatmap variables
//[
//  {
//  89147: {(115.298, 36.1122), (-115.298, 36.1122)},
//  89139: {(-115.224, 36.0402), (-115.226 36.0553)},
//  89130: {(-115.21, 36.2376), (-115.214, 36.2166)},
//  89146: {(-115.225, 36.1272), (-115.224, 36.1326)}
//  }
//]

//TODO: The way to add a heatmap
//$.getJSON("rodents.geojson",function(data){
//   var locations = data.features.map(function(rat) {
//    var location = rat.geometry.coordinates.reverse();
//    location.push(0.5);
//    return location;
//  });
//
//  var heat = L.heatLayer(locations, { radius: 35 });
//  map.addLayer(heat);
//});



// var heat = L.heatLayer([[36.1122,-115.298], [36.1122,-115.298],
//     [36.0402,-115.224],[36.0553,-115.226],[36.2376,-115.21],
//     [36.2166,-115.214],[36.1272,-115.225], [36.1326,-115.224]],
//     {blur: 5}).addTo(mymap);
//drawnPolys.addLayer(heat)
//drawnPolys.addTo(mymap)



for(layer of polyLayers){
    drawnPolys.addLayer(layer)
}

for(layer of pinLayers){
    drawnMarkers.addLayer(layer)
}

drawnMarkers.bringToFront()
drawnItems.addTo(mymap).bringToFront()


new L.Control.GPlaceAutocomplete({
	callback: function(place){
		var loc = place.geometry.location;
		mymap.setView( [loc.lat(), loc.lng()], 12);
	}
}).addTo(mymap);

