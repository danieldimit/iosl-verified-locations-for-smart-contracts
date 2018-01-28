import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl } from '../config';

import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    Circle,
    Rectangle
} from "react-google-maps";

const OracleMapWithCellTowers = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDd3nVf8mY97Bl1zk9lx6j5kHZDosCxgVA&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
        center: { lat: 52.520007, lng: 13.404954 },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={11}
        defaultCenter={props.center}
    >
        <Rectangle bounds={{east: props.ghPosition.ne.lon, west: props.ghPosition.sw.lon,
            north: props.ghPosition.ne.lat, south: props.ghPosition.sw.lat}}
                   options={{ fillColor: `red`, fillOpacity: 0.3, strokeWeight: 1}}/>
    </GoogleMap>
);




class RentACar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenAddress: "-",
            state: 1,
            progressStep: 1,
            carPosition: { lat: 52.520007, lng: 13.404954 },
            cellCenter: { lat: 52.520007, lng: 13.404954 },
            cellRadius: 0,
            value: '',
            ghPosition: {ne: {lat: 0, lon: 0}, sw: {lat: 0, lon: 0}}
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.createContract = this.createContract.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
        this.setOwnerEthAccount = this.setOwnerEthAccount.bind(this);
        this.createScriptNode = this.createScriptNode.bind(this);
    }

    componentDidMount() {
    }

    onOwnerChange(e) {
        this.setState({chosenAddress: e.target.value});
    }

    createContract() {
        this.setState({progressStep: 3});
        /*
         if (this.refs.carGSMField.value == "" || this.state.chosenAddress == "-") {
         alert ("You have to fill out all fields.");
         } else {
         let url = ethereumBackendUrl + '/owner/' + this.state.chosenAddress + '/create_contract';
         fetch(url, {
         method: 'POST',
         headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         },
         body: JSON.stringify({
         carGSMNumber: this.refs.carGSMField.value
         })
         })
         .then(result=>result.json())
         .then(result=>console.log('teeeeeeeest: ',result));
         }
         */
    }

    renderAllAccountsDropdown(data) {

        if (data == this.props.oracleAddress) {
            return ;
        } else {
            return (
                <option key={data} value={data}>{data}</option>
            );
        }
    }

    handleReturnedMarkers(markers) {
        this.setState({
            activeMarkers: markers
        });
    }



    setOwnerEthAccount() {
        this.setState({progressStep: 2});
    }


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
                <p>The map displays all available cars. Choose one of them and specify a sum to be transfered
                    to the contract. When you click on a car its geofence is displayed on the map together with
                    the deposit needed for the penalty value.
                </p>
                <OracleMapWithCellTowers
                    onMarkerDrag={this.handleMarkerDragged}
                    carPosition={this.state.carPosition}
                    cellCenter={this.state.cellCenter}
                    cellRadius={this.state.cellRadius}
                    ghPosition={this.state.ghPosition}
                />
                <label>
                    Ethereum to be transfered to the contract:
                    <br/>
                    <input type="text" ref="carGSMField"/>
                </label>
                <br/>
                <button onClick={this.createContract}>Rent</button>

            </div>

        );
    }
}

export default (RentACar);
