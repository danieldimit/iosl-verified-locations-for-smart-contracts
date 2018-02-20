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
        {props.renderCars(props.availableCars)}
    </GoogleMap>
);




class RentACar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            availableCars: [],
            selectedCar: {},
            markerVisibility: [],
            visible: true
        };
        this.rentCar = this.rentCar.bind(this);
        this.setOwnerEthAccount = this.setOwnerEthAccount.bind(this);
        this.renderCarOnMap = this.renderCarOnMap.bind(this);
        this.renderCar = this.renderCar.bind(this);
        this.fetchAvailableCars = this.fetchAvailableCars.bind(this);
        this.setAvailableCarsToState = this.setAvailableCarsToState.bind(this);
        this.handleClickOnCar = this.handleClickOnCar.bind(this);
        this.setStateOfAvailableCars = this.setStateOfAvailableCars.bind(this);
        this.sortCarsById = this.sortCarsById.bind(this);
        this.removeCarFromAvailableCarsList = this.removeCarFromAvailableCarsList.bind(this);
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

    sortCarsById(carList) {
        let tempCars = Array.apply(null, Array(carList.length)).fill({});

        for (let i = 0; i < carList.length; i++) {
            tempCars[carList[i].id] = carList[i];
        }
        return tempCars;
    }

    setStateOfAvailableCars(flattenedDict, totalNumber) {

        if (flattenedDict.length === totalNumber) {

            let tempMarkerVisib = Array.apply(null, Array(flattenedDict.length)).fill(true);
            flattenedDict = this.sortCarsById(flattenedDict);

            // Set Selected Car
            let selectedCar = flattenedDict[0];

            this.setState({
                selectedCar: selectedCar,
                availableCars: flattenedDict,
                markerVisibility: tempMarkerVisib
            });
        }
    }

    setAvailableCarsToState(availableCars) {
        var flattenedDict = [];
        var idCounter = 0;
        var totalNumber = 0;

        function handleResponse(newCar, result) {
            newCar['carDetails']['position'] = result;
            flattenedDict.push(newCar);
            return flattenedDict;
        }

        // Get complete car number. Can be implemeneted better!
        for (let carsOfOneOwner of availableCars) {
            for (let car of carsOfOneOwner.availableCarContract) {
                totalNumber++;
            }
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
                    .then(result=>this.setStateOfAvailableCars(flattenedDict, totalNumber));

                idCounter++;
            }
        }
        return flattenedDict;
    }

    rentCar() {
        console.log(this.props.renterEthAddress, this.state.selectedCar.owner, this.state.selectedCar.carContractAddress);
        let url = ethereumBackendUrl + '/renter/' + this.props.renterEthAddress + '/'
            + this.state.selectedCar.owner + '/' + this.state.selectedCar.carContractAddress
            + '/rentCar?deposit=' + this.state.selectedCar.carDetails.penaltyValue;
        console.log(url);
        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(result=>result.json())
            .then(result=>this.removeCarFromAvailableCarsList(result))
            .then(res=>this.props.getBalance());
    }

    removeCarFromAvailableCarsList(res) {
        if (res.success === true) {
            let tempVis = this.state.markerVisibility;
            tempVis[this.state.selectedCar.id] = false;

            let tempCars = this.state.availableCars;
            tempCars[this.state.selectedCar.id] = {};

            let temp = false;
            if (this.state.visible == false) {
                temp = true;
            }

            this.setState({
                markerVisibility: tempVis,
                availableCars: tempCars,
                visible: temp
            });
        }
    }

    handleClickOnCar(carId) {
        this.setState({selectedCar: this.state.availableCars[carId]});
    }

    setOwnerEthAccount() {
        this.setState({progressStep: 2, shown: false});
    }

    renderCarOnMap(car) {
        return (
            <div>
                {car.map(this.renderCar)}
            </div>
        );
    }

    renderCar (car) {
        return (
            <div key={Math.floor(Math.random() * 9999999)}>
                {this.state.markerVisibility[car.id]
                    ? <Marker
                        position={car.carDetails.position[0]} draggable={false}
                        onClick={() => this.handleClickOnCar(car.id)}/>
                    : null}
            </div>
        );
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
                        visible={this.state.visible}
                        availableCars={this.state.availableCars}
                        renderCars={this.renderCarOnMap}
                    />
                </div>
                <div className="car-info col-lg-3 col-md-4 col-sm-12 col-xs-12">
                    <h3>Car Information:</h3>
                    <p>
                        <b>Address:</b> {this.state.selectedCar != undefined ? this.state.selectedCar.carContractAddress : null}
                        <br/>
                        <b>Deposit:</b>    {this.state.selectedCar != undefined &&
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
