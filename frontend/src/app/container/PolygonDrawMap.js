import React, { Component } from 'react';

class PolygonDrawMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            geofence: [],
            carPosition: {
                lat: 0,
                lon: 0
            }
        };
        this.createScriptNode = this.createScriptNode.bind(this);
    }

    componentWillUnmount() {
        var id = document.getElementById("initMap");
        if (id != null) {
            document.body.removeChild(id);
        }
        id = document.getElementById("googleMapsScript");
        if (id != null) {
            document.body.removeChild(id);
        }
    }


    /**
     * Append the map script to the bottom of the component
     */
    createScriptNode() {
        const initMapScript = document.createElement("script");
        const script = document.createElement("script");
        initMapScript.src = "/js/googleMapsDrawPolygon.js";
        initMapScript.async = true;
        initMapScript.id = "initMap"
        document.body.appendChild(initMapScript);

        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDd3nVf8mY97Bl1zk9lx6j5kHZDosCxgVA&libraries=drawing&callback=initMap";
        script.async = true;
        script.id = "googleMapsScript";
        document.body.appendChild(script);
    }



    render() {
        return (
            <div>
                <div id="map"></div>
                {this.createScriptNode()}
            </div>
        );
    }
}

export default (PolygonDrawMap);