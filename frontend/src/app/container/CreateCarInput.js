import React, { Component } from 'react';

class CreateCarInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carGSMNum: null,
            penaltyValue: 0
        };
        this.handleChangeInGSM = this.handleChangeInGSM.bind(this);
        this.handleChangeInPenalty = this.handleChangeInPenalty.bind(this);
    }


    /**
     * INPUT FIELD METHODS
     */
    handleChangeInGSM(e) {
        this.setState({carGSMNum: e.target.value});
        this.props.inputValues.carGSMNum = e.target.value;
    }

    handleChangeInPenalty(e) {
        this.setState({penalty: e.target.value});
        this.props.inputValues.penalty = e.target.value;
    }

    render() {
        return (
            <div>
                <label>
                    Car GSM number:
                    <br/>
                    <input type="text" onChange={this.handleChangeInGSM} ref="carGSMField"/>
                </label>
                <br/>
                <label>
                    Penalty value:
                    <br/>
                    <input type="text" onChange={this.handleChangeInPenalty} ref="penalty"/>
                </label>
            </div>
        );
    }
}

export default (CreateCarInput);