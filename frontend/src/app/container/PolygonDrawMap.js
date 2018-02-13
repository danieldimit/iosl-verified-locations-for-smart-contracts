import React, { Component } from 'react';
import * as s2 from 's2-geometry';

import { s2ServerUrl } from '../config';
import CreateCarPolygonCounter from './CreateCarPolygonCounter';

class PolygonDrawMap extends Component {

    constructor(props) {
        super(props);
        this.createScriptNode = this.createScriptNode.bind(this);
        this.handleChangeGeo = this.handleChangeGeo.bind(this);
        this.handleChangePos = this.handleChangePos.bind(this);
        this.checkIfScripAlreadyInserted = this.checkIfScripAlreadyInserted.bind(this);
        this.handleS2ServerInfo = this.handleS2ServerInfo.bind(this);
        this.onS2LevelChange = this.onS2LevelChange.bind(this);
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

    onS2LevelChange(e) {
        this.props.inputValues.s2Level = e.target.value;

        if (this.props.inputValues.geofence.length != 0) {
            console.log("SHOULD BE HERE: ", this.props.inputValues.geofence.length);
            let url = s2ServerUrl + '/convertGeofenceToS2Polygons?maxLevel=' + e.target.value;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({geofence: this.props.inputValues.geofence})})
                .then(result=>result.json())
                .then(res=>this.handleS2ServerInfo(res));
        }
    }

    handleS2ServerInfo(response) {
        // Give the hashes to the global state to be sent to the backend
        this.props.inputValues.s2GFHashes = response.cellIds;

        // Give the lat lon polygons to the google map component to be displayed
        this.refs.HiddenFieldPolygons.value = JSON.stringify(response.geofence);
        var event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);
        var target = $('#hidden-search-field-polygons')[0];
        target.dispatchEvent(event);

        this.refs.polyCounter.setState({
            numberOfPolys: response.cellIds.length
        });
    }

    handleChangeGeo(event) {
        if (this.refs.HiddenField !== null) {
            var input = this.refs.HiddenFieldGeo;
            var regexp = RegExp("endOfArray");

            if (!regexp.test(input.value)) {
                var latlng = input.value.split(/\s/);
                var objLatLng = {lat: latlng[0], lng: latlng[1]};
                this.props.inputValues.geofence.push(objLatLng);
                input.value = "";
            } else {
                console.log(this.props.inputValues.geofence);
                let url = s2ServerUrl + '/convertGeofenceToS2Polygons?maxLevel=' + this.props.inputValues.s2Level;

                fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({geofence: this.props.inputValues.geofence})})
                    .then(result=>result.json())
                    .then(res=>this.handleS2ServerInfo(res));
            }
        }
    }

    handleChangePos(event) {
        if (this.refs.HiddenField !== null) {
            var input = this.refs.HiddenFieldPos;
            var latlng = input.value.split(/\s/);

            let s2Key = s2.S2.latLngToKey(latlng[0], latlng[1], 16);
            var id = s2.S2.keyToId(s2Key);
            this.props.inputValues.position = id;
        }
    }

    render() {
        return (
            <div>
                S2 Level (bigger number = smaller polygons around the edges):
                <br />
                <select defaultValue={15} onChange={this.onS2LevelChange}>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                    <option value={11}>11</option>
                    <option value={12}>12</option>
                    <option value={13}>13</option>
                    <option value={14}>14</option>
                    <option value={15}>15</option>
                    <option value={16}>16</option>
                </select>
                <CreateCarPolygonCounter ref="polyCounter"
                    numberOfPolygons={this.props.inputValues.s2GFHashes.length}/>


                <div id="map"></div>
                <input id="hidden-search-field-geo" className="hidden" type="text" ref="HiddenFieldGeo"
                       onClick={this.handleChangeGeo.bind(this)}/>
                <input id="hidden-search-field-pos" className="hidden" type="text" ref="HiddenFieldPos"
                       onClick={this.handleChangePos.bind(this)}/>
                <input id="hidden-search-field-polygons" className="hidden" type="text" ref="HiddenFieldPolygons"/>
                {this.checkIfScripAlreadyInserted() ? null : this.createScriptNode()}
            </div>
        );
    }
}

export default (PolygonDrawMap);