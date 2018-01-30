import React, { Component } from 'react';
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




class RentedCars extends Component {

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

            <div className="rent-car row">
                <p className="col-sm-12">
                    Click one of the cars on the map. Click the return button in the grey area. This would return your
                    penalty deposit if you haven't left the geofence defined in the contract.
                </p>
                <div className="renter-map col-lg-9 col-md-8 col-sm-12 col-xs-12">
                    <OracleMapWithCellTowers
                        onMarkerDrag={this.handleMarkerDragged}
                        carPosition={this.state.carPosition}
                        cellCenter={this.state.cellCenter}
                        cellRadius={this.state.cellRadius}
                        ghPosition={this.state.ghPosition}
                    />
                </div>
                <div className="car-info col-lg-3 col-md-4 col-sm-12 col-xs-12">
                    <h3>Car Information:</h3>
                    <p>
                        Address: 0x012312301230120312312312312
                        <br/>
                        Deposited: 100 Ether
                    </p>
                    <button onClick={this.createContract}>Return</button>
                </div>

            </div>

        );
    }
}

export default (RentedCars);
