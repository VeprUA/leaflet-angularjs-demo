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
    maxZoom: 2
});

map.fitBounds(SIZE.FLOOR1.STANDARD.BOUNDS);

/* Layer groups */
var marker50000Group =  L.markerClusterGroup({
    maxClusterRadius: 120,
    //disableClusteringAtZoom: 15
});

var marker3000Group =  L.markerClusterGroup({
    maxClusterRadius: 120,
    //disableClusteringAtZoom: 15
});

var marker1000Group = L.layerGroup([]);
var marker500Group = L.layerGroup([]);
var marker30Group = L.layerGroup([]);
var marker5Group = L.layerGroup([]);
var shapesGroup = L.layerGroup([]);

var baseMaps = { 
    "Floor Plan 1": floorPlan,
    "Floor Plan 1 - 90" : floorPlan_rotated,
    "Floor Plan 2" : floorPlan_heavy
};
var overlayMaps = { 
    "Group 5": marker5Group,
    "Group 30": marker30Group,
    "Group 500": marker500Group,
    "Group 1,000": marker1000Group,
    "Group 3,000": marker3000Group,
    "Group 50,000": marker50000Group,
    "Shapes": shapesGroup
};


L.control.layers(baseMaps, overlayMaps).addTo(map);

/* Add markers */
function createRandomMarker() {
    var lat = getRandomNumer(SIZE.FLOOR1.STANDARD.HEIGHT);
    var lng = getRandomNumer(SIZE.FLOOR1.STANDARD.WIDTH);
    
    return L.marker([lat, lng]);
}

function getRandomNumer(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function convertPercentToLatLng(percentX, percentY) {
    var x = SIZE.FLOOR1.STANDARD.WIDTH * percentX;
    var y = SIZE.FLOOR1.STANDARD.HEIGHT * percentY;

    return map.layerPointToLatLng(x, y);
}

function populateGroup(group, marker_count, width, height) {
    for(var i = 0; i < marker_count; i++){
        group.addLayer(createRandomMarker());
    }
}


populateGroup(marker5Group, 5);
populateGroup(marker30Group, 30);
populateGroup(marker500Group, 500);
populateGroup(marker1000Group, 1000);
populateGroup(marker3000Group, 3000);
populateGroup(marker50000Group, 50000);

//marker5Group.addTo(map);

map.on('zoom', function(e) {
    console.log(e);
});

map.on('baselayerchange', function(e) {
    console.log('event', e);
    console.log('Bounds of selected layer', e.layer.getBounds());
    console.log(map.getSize(), "size");
    console.log(map.getBounds(), "bounds");
});