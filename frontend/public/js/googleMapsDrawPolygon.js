function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.520007, lng: 13.404954},
        zoom: 11
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon']
        },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        drawingManager.setOptions({
            drawingMode: null,
            drawingControl: false
        });
        var coordinates = (polygon.getPath().getArray());
        for (let i of coordinates) {
            console.log(i.lat(), ' ', i.lng());
        }
    });
}