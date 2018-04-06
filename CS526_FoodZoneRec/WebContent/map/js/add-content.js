var mymap = L.map('mapid', {drawControl: true}).setView([36.114647, -115.172813], 12);



L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGc1ODUiLCJhIjoiY2pmOGU5YmExMXRiazJ4cDR5dXFhMjB4NiJ9.ejyGusnAESNwefV4T6Sh8A'
}).addTo(mymap);

//var recommended_zips = ['89109','89119','89102','89103','89117','89118','89052','89123','89014','89146'];
//var recommended_zips2 = ['85251','85281','85260','85308','85032','85016','85254','85282','85226','85224']
var recommended_zips = ['89109','89119','89102','89103','89146'];
var recommended_zips2 = ['85251','85281','85260','85308','85224']
var colors = ['#800026','#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FFEDA0','#ffffcc','#ffffcc'];
// colors are get from the small tool: colorbrewer2.org
// multihue sequential

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
        thePolygon.bindPopup(recommended_zips[k])
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
        thePolygon2.bindPopup(recommended_zips[k])
    }
}


new L.Control.GPlaceAutocomplete({
	callback: function(place){
		var loc = place.geometry.location;
		mymap.setView( [loc.lat(), loc.lng()], 12);
	}
}).addTo(mymap);

/*
var poly= null;
for (var i=0; i<zip.features.length;i++){
    if (zip.features[i].properties.ZCTA5CE10 === '89032'){
        poly = zip.features[i].geometry.coordinates;
    }
}



for (var i = 0; i < poly.length; i++) {
    for (var j = 0; j < poly[i].length; j++) {
        var v1 = poly[i][j][0];
        var v2 = poly[i][j][1];
        poly[i][j] = [v2, v1];
    }
}
//marker.bindPopup("<b>Start your business in Las Vegas!</b><br> Select your preference and begin to explore.").openPopup();
//polygon.bindPopup("Recommended Area #1.").openPopup();
//var polygon = L.polygon(poly).addTo(mymap);
for (var i = 0; i < poly.length; i++) {
    var polygon = L.polygon(poly[i]).addTo(mymap);
}
*/



//circle.bindPopup("I am a circle.");

/*
var jsonFeatures = [];
data.forEach(function(point){
    var lat = point.latitud;
    var lon = point.longtitude;

    var feature = {type: 'Feature',
        properties: point,
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        }
    };
    jsonFeatures.push(feature);
});

var geoJson = {type: 'FeatureCollection', features: jsonFeatures};

*/

//Use jquery Ajax to load data and then add it.

/*var district_boundary = new L.geoJson();
district_boundary.addTo(mymap);
$.ajax({
dataType: "json",
url:"nv_nevada_zip_codes_geo.min.json",
success: function(data) {
    $(data.features).each(function(key,data) {
        district_boundary.addData(data);
    });
}
}).error(function() {});
*/


