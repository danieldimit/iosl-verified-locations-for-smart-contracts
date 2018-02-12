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
    Marker
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
    </GoogleMap>
);




class RentACar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            availableCars: [],
            selectedCar: {}
        };
        this.rentCar = this.rentCar.bind(this);
        this.setOwnerEthAccount = this.setOwnerEthAccount.bind(this);
        this.createScriptNode = this.createScriptNode.bind(this);
        this.fetchAvailableCars = this.fetchAvailableCars.bind(this);
        this.setAvailableCarsToState = this.setAvailableCarsToState.bind(this);
        this.renderCarOnMap = this.renderCarOnMap.bind(this);
        this.handleClickOnCar = this.handleClickOnCar.bind(this);
    }

    componentDidMount() {
        this.fetchAvailableCars();
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

        function handleResponse(newCar, result) {

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
                    .then(result=>handleResponse(car, result))
                    .then(result=>this.setState({availableCars: flattenedDict}));

                if (car.id == 0) {
                    this.setState({selectedCar: car});
                }
                idCounter++;
            }
        }
        return flattenedDict;
    }

    rentCar() {
        console.log(this.props.renterEthAddress, this.state.selectedCar.owner, this.state.selectedCar.carContractAddress);
        let url = ethereumBackendUrl + '/renter/' + this.props.renterEthAddress + '/'
            + this.state.selectedCar.owner + '/' + this.state.selectedCar.carContractAddress + '/rentCar';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(result=>result.json())
            .then(result=>console.log("Renting ", this.state.selectedCar.carContractAddress, ' ', result));
    }

    handleClickOnCar(carId) {
        this.setState({selectedCar: this.state.availableCars[carId]});
        console.log("clicker", carId);
    }

    renderCarOnMap(car) {
        console.log("RENDER CAR: ", car);
        return (
            <Marker key={car.id} options={{ fillColor: `orange`, fillOpacity: 0.3, strokeWeight: 1}} position={car.carDetails.position[0]} draggable={false}
                    onClick={() => this.handleClickOnCar(car.id)}/>
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
                        availableCars={this.state.availableCars}
                        renderCars={this.renderCarOnMap}
                    />
                </div>
                <div className="car-info col-lg-3 col-md-4 col-sm-12 col-xs-12">
                    <h3>Car Information:</h3>
                    <p>
                        Address: {this.state.selectedCar != undefined ? this.state.selectedCar.carContractAddress : null}
                        <br/>
                        Deposit:    {this.state.selectedCar != undefined &&
                                    this.state.selectedCar.carDetails != undefined
                                    ? this.state.selectedCar.carDetails.penaltyValue : null} Ether
                    </p>
                    <button onClick={this.rentCar}>Rent</button>
                </div>

            </div>

        );
    }
}

export default (RentACar);
