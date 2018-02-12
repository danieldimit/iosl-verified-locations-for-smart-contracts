import React, { Component } from 'react';
import PolygonDrawMap from './PolygonDrawMap';
import CreateCarInput from './CreateCarInput';
import { ethereumBackendUrl } from '../config';

class CreateAndDeleteCar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carAddresses: [],
            selectedCar: "-"
        };

        // Delete Methods
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.deleteCar = this.deleteCar.bind(this);
        this.getCarContracts = this.getCarContracts.bind(this);
        this.onSelectedCarChange = this.onSelectedCarChange.bind(this);
        this.filterOutEmptyAddresses = this.filterOutEmptyAddresses.bind(this);

        // Create Methods
        this.createCar = this.createCar.bind(this);
    }

    static staticState = {
        carGSMNum: null,
        penaltyValue: 0,
        position: null,
        geofence: []
    };

    componentDidMount() {
        this.getCarContracts();
    }

    /**
     * DROPDOWN MENUS
     */
    onSelectedCarChange(e) {
        this.setState({selectedCar: e.target.value});
    }

    renderAllAccountsDropdown(data) {
        return (
            <option key={data} value={data}>{data}</option>
        );
    }

    filterOutEmptyAddresses(data) {
        var index = data.indexOf("0x0000000000000000000000000000000000000000");
        while(index > -1) {
            data.splice(index, 1);
            index = data.indexOf("0x0000000000000000000000000000000000000000");
        }
        return data;
    }

    getCarContracts() {
        let url = ethereumBackendUrl + '/owner/' + this.props.ownerEthereumAddress + '/getCarContracts';
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.filterOutEmptyAddresses(result.data))
            .then(result=>this.setState({carAddresses: result}));
    }


    /**
     * BUTTON METHODS
     */

    deleteCar() {
        let url = ethereumBackendUrl + '/owner/' + this.props.ownerEthereumAddress + '/' + this.state.selectedCar;
        fetch(url, {
            method: 'delete'
        })  .then(result=>result.json())
            .then(result=>this.getCarContracts());
    }

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
            .then(result=>console.log(result.data.carAddress));
    }

    render() {
        return (
            <div>
                <div id="delete" className="ownerControlPanel">
                    <h3>Delete existing car contract</h3>
                    <label>
                        Car contract address:
                        <br/>
                        <select style={{float: 'left'}} onChange={this.onSelectedCarChange}>
                            <option value={null}>-</option>
                            { this.state.carAddresses.map(this.renderAllAccountsDropdown) }
                        </select>
                    </label>
                    <br/>
                    <button onClick={this.deleteCar}>Delete car</button>
                </div>
                <div id="addnew" className="ownerControlPanel">
                    <h3>Create new car contract</h3>
                    <h4>Geofence</h4>
                    <PolygonDrawMap inputValues={CreateAndDeleteCar.staticState} />
                    <CreateCarInput inputValues={CreateAndDeleteCar.staticState} />
                    <br/>
                    <button onClick={this.createCar}>Create car</button>
                </div>
            </div>
        );
    }
}

export default (CreateAndDeleteCar);