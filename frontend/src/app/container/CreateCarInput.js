import React, { Component } from 'react';

class CreateCarInput extends Component {

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
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * INPUT FIELD METHODS
     */
    handleChange(e) {
        this.setState({carGSM: e.target.value});
    }

    render() {
        return (
            <div>
                <label>
                    Car GSM number:
                    <br/>
                    <input type="text" onChange={this.handleChange} ref="carGSMField"/>
                </label>
                <br/>
                <label>
                    Penalty value:
                    <br/>
                    <input type="text" ref="penalty"/>
                </label>
            </div>
        );
    }
}

export default (CreateCarInput);