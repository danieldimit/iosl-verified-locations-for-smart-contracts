import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl } from '../config';

class Owner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenAddress: "-"
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.createContract = this.createContract.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllAccounts();
    }

    onOwnerChange(e) {
        this.setState({chosenAddress: e.target.value});
    }

    createContract() {
        if (this.refs.carGSMField.value == "" || this.state.chosenAddress == "-") {
            alert ("You have to fill out all fields.");
        } else {
            let url = ethereumBackendUrl + '/owner/' + this.state.chosenAddress + '/create_contract';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    carGSMNumber: this.refs.carGSMField.value
                })
            })
                .then(result=>result.json())
                .then(result=>console.log('teeeeeeeest: ',result));
        }
    }

    renderAllAccountsDropdown(data) {

        if (data == this.props.oracleAddress) {
            return ;
        } else {
            return (
                <option key={data} value={data}>{data}</option>
            );
        }
    }

    render() {

        return (

            <div  className="container-content-page">

                <h1 className="section-header">Owner Control Panel</h1>
                <br/>

                <div>

                    <h2 ref={subtitle => this.subtitle = subtitle}>Choose Account</h2>
                    <p>You would see the contract of the chosen account or if the account doesn't have a contract yet
                        you would be able to create a contract for it.
                    </p>


                    <label>
                        Owner address:
                        <br/>
                        <select style={{float: 'left'}} onChange={this.onOwnerChange} ref="selectionOracle">
                            <option value={null}>-</option>
                            { this.props.accounts.map(this.renderAllAccountsDropdown) }
                        </select>
                    </label>
                    <br/>
                    <label>
                        Car GSM number:
                        <br/>
                        <input type="text" ref="carGSMField"/>
                    </label>
                    <br/>
                    <button onClick={this.createContract}>Create contract</button>
                </div>


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
})(Owner);