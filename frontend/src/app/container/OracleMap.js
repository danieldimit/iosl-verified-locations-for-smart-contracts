import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as s2 from 's2-geometry';
import { fetchAllAccounts } from '../actions/index';

import { oracleBackendUrl, ethereumBackendUrl, s2ServerUrl } from '../config';

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
        <Marker position={props.carPosition} draggable={true} onDragEnd={props.onMarkerDrag}/>
        <Rectangle bounds={{east: 14.693115, west: 11.946533, north: 53.296414, south: 51.459141}}
                   options={{ fillColor: `black`, fillOpacity: 0.15, strokeWeight: 5}}/>
        <Polygon paths={props.s2Polygon}
                   options={{ fillColor: `red`, fillOpacity: 0.3, strokeWeight: 1}}/>
        <Circle center={props.cellCenter}
                options={{ fillColor: `purple`, strokeOpacity: 0.7, strokeWeight: 1}}
                radius={props.cellRadius}/>
        <Circle center={props.cellCenter}
                options={{ fillColor: `black`, strokeOpacity: 1.0, strokeWeight: 1}}
                radius={10}/>
    </GoogleMap>
);

class OracleMap extends Component {


    constructor(props) {
        super(props);
        this.state = {
            carPosition: { lat: 40.6, lng: 16.7 },
            cellCenter: { lat: 40.6, lng: 16.7 },
            cellRadius: 0,
            value: '',
            s2Polygon: [],
            rentedCars: [],
            selectedCar: null
        };

        this.giveToState = this.giveToState.bind(this);
        this.handleMarkerDragged = this.handleMarkerDragged.bind(this);
        this.fetchRentedCars = this.fetchRentedCars.bind(this);
        this.flattenRentedCarsList = this.flattenRentedCarsList.bind(this);
        this.setStateOfRentedCars = this.setStateOfRentedCars.bind(this);
        this.onSelectedCarChange = this.onSelectedCarChange.bind(this);
    }

    componentDidMount() {
        let url = oracleBackendUrl + '/getInArea?lon=' + this.state.carPosition.lng + '&lat=' + this.state.carPosition.lat;
        console.log(url);
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result, false));
        this.fetchRentedCars();
    }

    fetchRentedCars() {
        let url = ethereumBackendUrl + '/oracle/getRentedCarsContracts';
        fetch(url, {
            method: 'get'
        })  .then(result=>result.json())
            .then(result=>result.success ? this.flattenRentedCarsList(result.data) : null);
    }

    setStateOfRentedCars(flattenedDict, totalNumber) {

        if (flattenedDict.length === totalNumber) {
            console.log("WOOOW: ", flattenedDict.length, " ", totalNumber);
            this.setState({rentedCars: flattenedDict});
        }
    }

    flattenRentedCarsList(rentedCars) {
        var flattenedDict = [];
        var idCounter = 0;
        var totalNumber = 0;

        function handleResponse(newCar, result) {

            newCar['carDetails']['position'] = result;
            flattenedDict.push(newCar);

            console.log(flattenedDict);
            return flattenedDict;
        }

        // Get complete car number. Can be implemeneted better!
        for (let carsOfOneOwner of rentedCars) {
            for (let car of carsOfOneOwner.availableCarContract) {
                totalNumber++;
            }
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
                    .then(result=>this.setStateOfRentedCars(flattenedDict, totalNumber));

                if (car.id == 0) {
                    this.setState({selectedCar: car});
                }
                idCounter++;
            }
        }
        return flattenedDict;
    }

    onSelectedCarChange(e) {
        console.log("Selected Car: ", this.state.rentedCars[e.target.value]);

        let selectedCar = this.state.rentedCars[e.target.value];

        let url = oracleBackendUrl + '/getInArea?lon=' + selectedCar.carDetails.position[0].lng
            + '&lat=' + selectedCar.carDetails.position[0].lat;

        this.setState({
            selectedCar: selectedCar,
            carPosition: selectedCar.carDetails.position[0]
        });

        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result, false));
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    giveToState = (cellInfo, sendPosToBackend) => {
        let cellLat = parseFloat(cellInfo[7]);
        let cellLng = parseFloat(cellInfo[6]);
        let cellRad = parseInt(cellInfo[8]);

        let s2Key = s2.S2.latLngToKey(cellLat, cellLng, 16);
        var id = s2.S2.keyToId(s2Key);


        let url = s2ServerUrl + '/convertS2ToBoundingLatLonPolygon?cellId=' + id.toString();

        fetch(url, {mode: 'cors'})
            .then(result=>result.json())
            .then(result=>this.setState({ cellCenter:{lat: cellLat, lng: cellLng},
                                            cellRadius: cellRad,
                                            s2Polygon: result}));

        if (this.state.selectedCar != null && sendPosToBackend) {

            console.log("ID IS ", id);
            console.log("ID PARSE TO INT ", parseInt(id));
            console.log("With geofence: ", this.state.selectedCar.carDetails.geofence);

            let urlEthereum = ethereumBackendUrl + '/oracle/updatePosition?carContractAddress='
                + this.state.selectedCar.carContractAddress
                + "&geohashPosition=" + id;

            fetch(urlEthereum, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(result=>result.json())
                .then(result=>console.log("Backend answer: ", result));
        }
    }

    handleMarkerDragged = (e) => {
        this.setState({ carPosition:{lat: e.latLng.lat(), lng: e.latLng.lng()}  })
        let url = oracleBackendUrl + '/getInArea?lon=' + e.latLng.lng() + '&lat=' + e.latLng.lat();

        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result, true));

        console.log(e.latLng.lat(), " " + e.latLng.lng());
    }

    renderAllAccountsDropdown(data) {
        return (
            <option key={data.id} value={data.id}>{data.carContractAddress}</option>
        );
    }

    render() {
        return (
            <div  className="container-content-page">

                <div className="row">
                    <h1 className="header-cols section-header col-md-6 col-sm-7 col-xs-12">Oracle Control Panel</h1>
                    <div className="header-cols col-md-6 col-sm-5 col-xs-12">
                        <p>
                            <b>Oracle address:</b>
                            <br/>
                            {String(this.props.oracleAddress)}
                        </p>
                    </div>
                </div>
                <br/>

                <section className="row">
                    <article className="content-block col-lg-8 col-md-7 col-sm-12 col-xs-12">
                        <h2>Simulate car movement</h2>
                        <p>
                            Choose one of the rented cars from the dropdown menu. Then drag the marker across the map.
                            Each time the marker gets released the position is submitted to the backend. For visualization
                            purposes the nearest cell tower and its range is shown (the very small black circle is the
                            cell tower and the big purple circle is the range of the tower). The red square is the hashed
                            position of the car. This hashed position gets submitted to the backend.
                        </p>
                    </article>
                    <article className="content-block col-lg-4 col-md-5 col-sm-12 col-xs-12">
                        <h2>Car address</h2>

                        <select onChange={this.onSelectedCarChange} ref="selectionOracle">
                            <option value={null}>-</option>
                            { this.state.rentedCars.map(this.renderAllAccountsDropdown) }
                        </select>
                    </article>
                </section>

                <OracleMapWithCellTowers
                    onMarkerDrag={this.handleMarkerDragged}
                    carPosition={this.state.carPosition}
                    cellCenter={this.state.cellCenter}
                    cellRadius={this.state.cellRadius}
                    ghPosition={this.state.ghPosition}
                    s2Polygon={this.state.s2Polygon}
                />

            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        oracleAddress: store.oracleAddress,
        accounts: store.accounts
    }
}

export default connect(mapStateToProps, {
    fetchAllAccounts
})(OracleMap);