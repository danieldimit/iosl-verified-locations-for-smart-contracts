import React, { Component } from 'react';
import PolygonDrawMap from './PolygonDrawMap';
import CreateCarInput from './CreateCarInput';
import { ethereumBackendUrl } from '../config';

class CreateCar extends Component {

    constructor(props) {
        super(props);
        this.createCar = this.createCar.bind(this);
        this.strToIntArr = this.strToIntArr.bind(this);
    }

    static staticState = {
        carGSMNum: "",
        penaltyValue: "",
        position: 5163466995026362368,
        geofence: [],
        s2GFPolygons: [],
        s2GFHashes: [],
        s2Level: 15
    };

    componentDidMount() {
        CreateCar.staticState = {
            carGSMNum: "",
            penaltyValue: "",
            position: 5163466995026362368,
            geofence: [],
            s2GFPolygons: [],
            s2GFHashes: [],
            s2Level: 15
        };
        console.log("AAAAAAAAAA ", CreateCar.staticState);
    }

    strToIntArr(geofence) {
        var newGeo = [];
        for (let a of geofence) {
            newGeo.push(parseInt(a));
        }
        console.log(newGeo);
        return newGeo;
    }

    createCar() {
        var carObject = {
            carGSMNum: CreateCar.staticState.carGSMNum,
            penaltyValue: CreateCar.staticState.penaltyValue,
            position: parseInt(CreateCar.staticState.position),
            geofence: this.strToIntArr(CreateCar.staticState.s2GFHashes)
        }

        let url = ethereumBackendUrl + '/owner/' + this.props.ownerEthereumAddress + '/createCarContract';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carObject)
        })
            .then(result=>result.json())
            .then(result=>this.props.triggerRender());

        CreateCar.staticState = {
            carGSMNum: "",
            penaltyValue: "",
            position: 5163466995026362368,
            geofence: [],
            s2GFPolygons: [],
            s2GFHashes: [],
            s2Level: CreateCar.staticState.s2Level
        };
    }

    render() {
        return (
            <div id="addnew" className="ownerControlPanel">
                <h3>Create new car contract</h3>
                <h4>Geofence</h4>
                <PolygonDrawMap inputValues={CreateCar.staticState} />
                <CreateCarInput inputValues={CreateCar.staticState} />
                <br/>
                <button onClick={this.createCar}>Create car</button>
            </div>
        );
    }
}

export default (CreateCar);