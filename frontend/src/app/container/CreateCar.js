import React, { Component } from 'react';
import PolygonDrawMap from './PolygonDrawMap';
import CreateCarInput from './CreateCarInput';
import { ethereumBackendUrl } from '../config';

class CreateCar extends Component {

    constructor(props) {
        super(props);
        this.createCar = this.createCar.bind(this);
    }

    static staticState = {
        carGSMNum: null,
        penaltyValue: 0,
        position: 5163466995026362368,
        geofence: [],
        s2GFPolygons: [],
        s2GFHashes: []
    };

    createCar() {
        console.log(CreateCar.staticState);

        let url = ethereumBackendUrl + '/owner/' + this.props.ownerEthereumAddress + '/createCarContract';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(CreateCar.staticState)
        })
            .then(result=>result.json())
            .then(result=>this.props.triggerRender());

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