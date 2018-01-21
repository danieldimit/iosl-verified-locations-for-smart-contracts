import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateCar from './CreateCar';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl } from '../config';


class DeleteCar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carAddresses: [],
            selectedCar: "-"
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.deleteCar = this.deleteCar.bind(this);
        this.getCarContracts = this.getCarContracts.bind(this);
        this.onSelectedCarChange = this.onSelectedCarChange.bind(this);
        this.filterOutEmptyAddresses = this.filterOutEmptyAddresses.bind(this);
    }

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



    render() {
        return (
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
        );
    }
}

export default (DeleteCar);