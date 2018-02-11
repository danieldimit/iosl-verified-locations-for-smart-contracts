import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl, s2ServerUrl } from '../config';

import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    Circle,
    Rectangle,
    Polygon
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
        {props.availableCars.map(props.renderCars)}
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
            progressStep: 1,
            availableCars: [],
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
        this.fetchAvailableCars = this.fetchAvailableCars.bind(this);
        this.setAvailableCarsToState = this.setAvailableCarsToState.bind(this);
        this.renderCarOnMap = this.renderCarOnMap.bind(this);
    }

    componentDidMount() {
        this.fetchAvailableCars();
    }

    onOwnerChange(e) {
        this.setState({chosenAddress: e.target.value});
    }

    fetchAvailableCars() {
        let url = ethereumBackendUrl + '/renter/getAllAvailableCars';
        fetch(url, {
            method: 'get'
        })  .then(result=>result.json())
            .then(result=>result.success ? this.setAvailableCarsToState(result.data) : null);
    }

    setAvailableCarsToState(availableCars) {
        var flattenedDict = [];
        var idCounter = 0;

        function handleResponse(newCar, result, counter) {
            newCar['carDetails']['position'] = result;
            flattenedDict.push(newCar);

            console.log(flattenedDict);
            return flattenedDict;
        }

        for (let carsOfOneOwner of availableCars) {
            for (let car of carsOfOneOwner.availableCarContract) {
                car['owner'] = carsOfOneOwner.ownerContract;
                car['id'] = idCounter;


                // Convert position from s2 to lat lon
                let url = s2ServerUrl + '/convertS2ToBoundingLatLonPolygon?cellId=' + car['carDetails']['position'];

                fetch(url, {mode: 'cors'})
                    .then(result=>result.json())
                    .then(result=>handleResponse(car, result, idCounter))
                    .then(result=>this.setState({availableCars: flattenedDict}));

                idCounter++;
            }
        }
        return flattenedDict;
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

    renderCarOnMap(car) {
        console.log("RENDER CAR: ", car);
        return (
            <Marker key={car.id} position={car.carDetails.position[0]} draggable={false}/>
        );
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
                <p className="col-sm-12">The map displays all available cars. Choose one of them and specify a sum to be transfered
                    to the contract. When you click on a car its geofence is displayed on the map together with
                    the deposit needed for the penalty value.
                </p>
                <div className="renter-map col-lg-9 col-md-8 col-sm-12 col-xs-12">
                    <OracleMapWithCellTowers
                        onMarkerDrag={this.handleMarkerDragged}
                        carPosition={this.state.carPosition}
                        cellCenter={this.state.cellCenter}
                        cellRadius={this.state.cellRadius}
                        ghPosition={this.state.ghPosition}
                        availableCars={this.state.availableCars}
                        renderCars={this.renderCarOnMap}
                    />
                </div>
                <div className="car-info col-lg-3 col-md-4 col-sm-12 col-xs-12">
                    <h3>Car Information:</h3>
                    <p>
                        Address: 0x012312301230120312312312312
                        <br/>
                        Deposit: 100 Ether
                    </p>
                    <button onClick={this.createContract}>Rent</button>
                </div>

            </div>

        );
    }
}

export default (RentACar);
