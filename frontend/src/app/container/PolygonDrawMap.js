import React, { Component } from 'react';

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
            this.props.inputValues.geofence.push(input.value);
        }
    }

    handleChangePos(event) {
        if (this.refs.HiddenField !== null) {
            var input = this.refs.HiddenFieldPos;
            this.props.inputValues.position = input.value;
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