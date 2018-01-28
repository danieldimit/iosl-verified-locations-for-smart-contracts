import React, { Component } from 'react';
import * as s2 from 's2-geometry';

class PolygonDrawMap extends Component {

    constructor(props) {
        super(props);
        this.createScriptNode = this.createScriptNode.bind(this);
        this.handleChangeGeo = this.handleChangeGeo.bind(this);
        this.handleChangePos = this.handleChangePos.bind(this);
        this.checkIfScripAlreadyInserted = this.checkIfScripAlreadyInserted.bind(this);
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

    checkIfScripAlreadyInserted() {
        var id = document.getElementById("initMap");

        return false;

        if (id != null) {
            return true;
        } else {
            return false;
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

    handleChangeGeo(event) {
        if (this.refs.HiddenField !== null) {
            var input = this.refs.HiddenFieldGeo;
            var regexp = RegExp("endOfArray");

            if (!regexp.test(input.value)) {
                var latlng = input.value.split(/\s/);
                var objLatLng = {lat: latlng[0], lng: latlng[1]};
                console.log(objLatLng);
                this.props.inputValues.geofence.push(objLatLng);
            } else {

            }
        }
    }

    handleChangePos(event) {
        if (this.refs.HiddenField !== null) {
            var input = this.refs.HiddenFieldPos;
            var latlng = input.value.split(/\s/);

            let s2Key = s2.S2.latLngToKey(latlng[0], latlng[1], 16);
            var id = s2.S2.keyToId(s2Key);
            console.log(id);
            this.props.inputValues.position = id;
        }
    }

    render() {
        return (
            <div>
                <div id="map"></div>
                <input id="hidden-search-field-geo" type="text" ref="HiddenFieldGeo"
                       onClick={this.handleChangeGeo.bind(this)}/>
                <input id="hidden-search-field-pos" type="text" ref="HiddenFieldPos"
                       onClick={this.handleChangePos.bind(this)}/>
                {this.checkIfScripAlreadyInserted() ? null : this.createScriptNode()}
            </div>
        );
    }
}

export default (PolygonDrawMap);