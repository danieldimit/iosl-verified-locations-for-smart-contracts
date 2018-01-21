import React, { Component } from 'react';
import PolygonDrawMap from './PolygonDrawMap';
import CreateCarInput from './CreateCarInput';

class CreateCar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ownerEthereumAddress: "-",
            ownerContractAddress: null,
            etherInContract: null,
            carAddresses: [],
            selectedCar: "-",
            state: 1,
            progressStep: 1
        };
    }

    render() {
        return (
            <div id="addnew" className="ownerControlPanel">
                <h3>Create new car contract</h3>
                <h4>Geofence</h4>
                <PolygonDrawMap />
                <CreateCarInput />
                <br/>
                <button onClick={this.createContract}>Create car</button>
            </div>
        );
    }
}

export default (CreateCar);