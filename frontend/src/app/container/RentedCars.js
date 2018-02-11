import React, { Component } from 'react';
import { ethereumBackendUrl, s2ServerUrl } from '../config';

import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";

const ReturnCarMap = compose(
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
        {props.rentedCars.map(props.renderCars)}
    </GoogleMap>
);




class RentedCars extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rentedCars: [],
            selectedCar: {}
        };
        this.setOwnerEthAccount = this.setOwnerEthAccount.bind(this);
        this.createScriptNode = this.createScriptNode.bind(this);
        this.returnCar = this.returnCar.bind(this);
        this.fetchRentedCars = this.fetchRentedCars.bind(this);
        this.setRentedCarsToState = this.setRentedCarsToState.bind(this);
        this.renderCarOnMap = this.renderCarOnMap.bind(this);
        this.handleClickOnCar = this.handleClickOnCar.bind(this);
        this.returnCarAndRerender = this.returnCarAndRerender.bind(this);
    }

    componentDidMount() {
        this.fetchRentedCars();
    }

    fetchRentedCars() {
        let url = ethereumBackendUrl + '/renter/' + this.props.renterEthAddress + '/getRentedCars';
        fetch(url, {
            method: 'get'
        })  .then(result=>result.json())
            .then(result=>result.success ? this.setRentedCarsToState(result.data) : null);
    }

    setRentedCarsToState(rentedCars) {
        var flattenedDict = [];
        var idCounter = 0;

        function handleResponse(newCar, result) {

            newCar['carDetails']['position'] = result;
            flattenedDict.push(newCar);

            console.log(flattenedDict);
            return flattenedDict;
        }

        for (let carsOfOneOwner of rentedCars) {
            for (let car of carsOfOneOwner.availableCarContract) {
                car['owner'] = carsOfOneOwner.ownerContract;
                car['id'] = idCounter;


                // Convert position from s2 to lat lon
                let url = s2ServerUrl + '/convertS2ToBoundingLatLonPolygon?cellId=' + car['carDetails']['position'];

                fetch(url, {mode: 'cors'})
                    .then(result=>result.json())
                    .then(result=>handleResponse(car, result))
                    .then(result=>this.setState({rentedCars: flattenedDict}));

                if (car.id == 0) {
                    this.setState({selectedCar: car});
                }
                idCounter++;
            }
        }
        return flattenedDict;
    }

    handleClickOnCar(carId) {
        this.setState({selectedCar: this.state.rentedCars[carId]});
        console.log("clicker", carId);
    }

    renderCarOnMap(car) {
        console.log("RENDER CAR: ", car);
        return (
            <Marker key={car.id}
                    position={car.carDetails.position[0]} draggable={false}
                    onClick={() => this.handleClickOnCar(car.id)}/>
        );
    }

    returnCar() {
        console.log(this.props.renterEthAddress, this.state.selectedCar.owner, this.state.selectedCar.carContractAddress);
        let url = ethereumBackendUrl + '/renter/' + this.props.renterEthAddress + '/'
            + this.state.selectedCar.owner + '/' + this.state.selectedCar.carContractAddress + '/returnCar';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(result=>result.json())
            .then(result=>this.returnCarAndRerender(result));
    }

    returnCarAndRerender(result) {
        if (result.success == true) {
            let newCarsList = this.state.rentedCars;

            // Delete car with the given id
            newCarsList.splice(this.state.selectedCar.id, 1);

            // Renumber the entries to be able to do it again
            for (var i = 0; i < newCarsList.length; i++) {
                newCarsList[i].id = i;
            }

            this.setState({rentedCars: newCarsList});

            console.log("Returning ", this.state.selectedCar.carContractAddress, ' ', newCarsList);
        }
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
                    <ReturnCarMap
                        rentedCars={this.state.rentedCars}
                        renderCars={this.renderCarOnMap}
                    />
                </div>
                <div className="car-info col-lg-3 col-md-4 col-sm-12 col-xs-12">
                    <h3>Car Information:</h3>
                    <p>
                        Address: {this.state.selectedCar != undefined ? this.state.selectedCar.carContractAddress : null}
                        <br/>
                        Deposited:      {this.state.selectedCar != undefined &&
                                        this.state.selectedCar.carDetails != undefined
                                        ? this.state.selectedCar.carDetails.penaltyValue : null} Ether
                    </p>
                    <button onClick={this.returnCar}>Return</button>
                </div>

            </div>

        );
    }
}

export default (RentedCars);
