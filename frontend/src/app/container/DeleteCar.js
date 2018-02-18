import React, { Component } from 'react';
import { ethereumBackendUrl } from '../config';


class DeleteCar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCar: "-"
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.deleteCar = this.deleteCar.bind(this);
        this.onSelectedCarChange = this.onSelectedCarChange.bind(this);
    }

    componentWillUpdate() {
        //this.getCarContracts();
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




    /**
     * BUTTON METHODS
     */

    deleteCar() {
        let url = ethereumBackendUrl + '/owner/' + this.props.ownerEthereumAddress + '/' + this.state.selectedCar;
        fetch(url, {
            method: 'delete'
        })  .then(result=>result.json())
            .then(result=>this.props.triggerRender());
    }

    render() {
        return (
            <div id="delete" className="ownerControlPanel">
                <h3>Delete existing car contract</h3>
                <div>
                    Car contract address: &nbsp;
                    <select onChange={this.onSelectedCarChange}>
                        <option value={null}>-</option>
                        { this.props.carAddresses.map(this.renderAllAccountsDropdown) }
                    </select>
                </div>
                <button onClick={this.deleteCar}>Delete car</button>
            </div>
        );
    }
}

export default (DeleteCar);