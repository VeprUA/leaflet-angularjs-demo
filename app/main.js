// L.GridLayer.FloorPlan = L.GridLayer.extend({
//     createTile: function(coords) {
//         var tile = document.createElement('img');
//         tile.src = '../src/floor_plans/'+ coords.z +'/'+coords.x+'_'+coords.y+'_'+coords.z+'.png';
//         //tile.style.outline = '1px solid red';
//         return tile;
//     }
// });

// L.gridLayer.floorPlan = function(opt) {
//     return new L.GridLayer.FloorPlan(opt);
// };

// var floorPlan = L.gridLayer.floorPlan();
var SIZE = {
    FLOOR1: {
        STANDARD: {
            WIDTH: 2918,
            HEIGHT: 2088,
            BOUNDS: [[0,0], [2088, 2918]]
        },
        ROTATED: {
            WIDTH: 2088,
            HEIGHT: 2918,
            BOUNDS: [[0,0], [2918, 2088]]
        }
    },
    FLOOR2: {
        STANDARD: {
            WIDTH: 23975,
            HEIGHT: 9524,
            BOUNDS: [[0,0], [9524, 23975]]
        }
    }
   
}

var floorPlan = L.imageOverlay('../src/floor_plans/floor1.png', SIZE.FLOOR1.STANDARD.BOUNDS);
var floorPlan_rotated = L.imageOverlay('../src/floor_plans/floor1_rotated90.png', SIZE.FLOOR1.ROTATED.BOUNDS);
var floorPlan_heavy = L.imageOverlay('../src/floor_plans/floor2.jpeg', SIZE.FLOOR2.STANDARD.BOUNDS);

var map = L.map('map',{
    renderer: L.canvas(),
    crs: L.CRS.Simple,
    layers: [floorPlan],
    minZoom: -5,
    maxZoom: 15
});

map.fitBounds(SIZE.FLOOR1.STANDARD.BOUNDS);
/* Layer groups */
var markersTotal  = 3000;
var markerClusterGroup =  L.markerClusterGroup({
    maxClusterRadius: 120,
    disableClusteringAtZoom: 15
});

// var markerClusterGroup = L.layerGroup([]);

var baseMaps = { 
    "Floor Plan 1": floorPlan,
    "Floor Plan 1 - 90" : floorPlan_rotated,
    "Floor Plan 2" : floorPlan_heavy
};
var overlayMaps = { "Group 3000": markerClusterGroup };


L.control.layers(baseMaps, overlayMaps).addTo(map);

/* Add markers */
function createRandomMarker() {
    var lat = getRandomNumer(SIZE.FLOOR1.STANDARD.HEIGHT);
    var lng = getRandomNumer(SIZE.FLOOR1.STANDARD.WIDTH);
    
    return L.marker([lat, lng]);
    // var latLng = convertPercentToLatLng(getRandomPercentage(), getRandomPercentage());
    // console.log(latLng);
    // return L.marker(latLng);
}

function getRandomNumer(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomPercentage() {
    return Math.floor(Math.random() * 100) / 100;
}

function convertPercentToLatLng(percentX, percentY) {
    var x = SIZE.FLOOR1.STANDARD.WIDTH * percentX;
    var y = SIZE.FLOOR1.STANDARD.HEIGHT * percentY;
    console.log('x,y', x, y, percentX, percentY);
    return map.layerPointToLatLng(x, y);
}
// L.marker(map.layerPointToLatLng(L.point(500,200))).addTo(map);

for(var i = 0; i < markersTotal; i++){
    markerClusterGroup.addLayer(createRandomMarker());
}
// for(var i = 0; i < markersTotal/2; i++){
//     markerClusterGroup2.addLayer(createRandomMarker());
// }

/* Rectangle */
var rect1 = L.polygon([[12,0], [12, 40], [30, 20]]);
rect1.addTo(map);
markerClusterGroup.addTo(map);

map.on('zoom', function(e) {
    console.log(e);
});