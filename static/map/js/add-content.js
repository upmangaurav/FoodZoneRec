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
//mymap.addControl(new L.Control.Draw({
//	edit: {
//		featureGroup: drawnItems,
//	},
//	draw: {
//		polygon : {
//			showArea:true
//		}
//	}
//}));

mymap.on(L.Draw.Event.CREATED, function(event) {
	var layer = event.layer;
	drawnItems.addLayer(layer);
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
  pinLayers.push(marker)
}


var recommended_zips = ['89109', '85251', '85281', '85260', '89119', '89102', '89103', '85308', '85032', '85016', '89117']
// , '85254', '89118', '89123', '85282', '89052', '89014', '89146', '89101', '85226', '89147', '85224', '85018', '89104', '28277', '85225', '89121', '85210', '89128', '85258', '53703', '85255', '85027', '61820', '85004', '85234', '89074', '28202', '85206', '85201', '85204', '85283', '85202', '15222', '89148', '85233', '', '28203', '85374', '85284', '89113', '85295', '85296', '89130', '85382', '85022', '28205', '85301', '85020', '28078', '89139', '89120', '53704', '28105', '85044', '44113', '15237', '85034', '28027', '85014', '89108', '89015', '44107', '53719', '85257', '89135', '89149', '28273', '89169', '85345', '85338', '85286', '28217', '85013', '89145', '28262', '89106', '85205', '28209', '85008', '70173', '89030', '89032', '44060', '85048', '85021', '28031', '85051', '85250', '89183', '85029', '89012', '44122', '85253', '28211', '15203', '85209', '85248', '89129', '85003', '15213', '85050', '44124', '89107', '85331', '85012', '85028', '85381', '15146', '85297', '85040', '85015', '44070', '85203', '85053', '85006', '44145', '44130', '28269', '28208', '53562', '28204', '28210', '44114', '89031', '85323', '85023', '89131', '89011', '15205', '15217', '85268', '85215', '53711', '28134', '44118']
var recommended_zips2 = ['85251','85281','85260','85308','85032','85016','85254','85282','85226','85224']
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
        //thePolygon.bindPopup(recommended_zips[k]).openPopup()
        thePolygon.bindPopup("RecZip:" + recommended_zips[k]);
        thePolygon.on('mouseover', function (e) {
            this.openPopup();
        });
        thePolygon.on('mouseout', function (e) {
            this.closePopup();
        });
        polyLayers.push(thePolygon)
        thePolygon.on('click', addMarker);
    }
}

//for (var k=0; k<recommended_zips2.length;k++){
//    var poly= null;
//    for (var i=0; i<zip2.features.length;i++){
//        if (zip2.features[i].properties.ZCTA5CE10 === recommended_zips2[k]){
//            poly2 = zip2.features[i].geometry.coordinates;
//        }
//    }
//
//    for (var i = 0; i < poly2.length; i++) {
//        for (var j = 0; j < poly2[i].length; j++) {
//            var v1 = poly2[i][j][0];
//            var v2 = poly2[i][j][1];
//            poly2[i][j] = [v2, v1];
//        }
//        var thePolygon2 = L.polygon(poly2[i],{color: colors[k]}).addTo(mymap);
//        //thePolygon2.bindPopup(recommended_zips[k]).openPopup()
//        thePolygon2.bindPopup("RecZip:" + recommended_zips2[k]);
//        thePolygon2.on('mouseover', function (e) {
//            this.openPopup();
//        });
//        thePolygon2.on('mouseout', function (e) {
//            this.closePopup();
//        });
//        polyLayers.push(thePolygon2)
//        thePolygon2.on('click', addMarker);
//    }
//}

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


