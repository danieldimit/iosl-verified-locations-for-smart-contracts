import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RentACar from './RentACar';
import RentedCars from './RentedCars';
import { fetchAllAccounts } from '../actions/index';

import { ethereumBackendUrl } from '../config';

class Renter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenAddress: "-",
            balance: 0,
            state: 1,
            progressStep: 1,
            carPosition: { lat: 52.520007, lng: 13.404954 },
            cellCenter: { lat: 52.520007, lng: 13.404954 },
            cellRadius: 0,
            value: '',
            ghPosition: {ne: {lat: 0, lon: 0}, sw: {lat: 0, lon: 0}}
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
        this.setRenterEthAccount = this.setRenterEthAccount.bind(this);
        this.createScriptNode = this.createScriptNode.bind(this);
        this.fetchAccountBalance = this.fetchAccountBalance.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllAccounts();
    }

    onOwnerChange(e) {
        this.setState({chosenAddress: e.target.value});
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

    setRenterEthAccount() {
        this.setState({progressStep: 2});
        this.fetchAccountBalance();
    }

    fetchAccountBalance() {
        let url = ethereumBackendUrl + '/account/' + this.state.chosenAddress;

        fetch(url, {
            method: 'get'
        })  .then(result=>result.json())
            .then(result=>result.success ? this.setState({balance: result.data.balance}) : null);

    }


    createScriptNode() {
        const initMapScript = document.createElement("script");
        const script = document.createElement("script");
        initMapScript.src = "/js/googleMapsDrawPolygon.js";
        initMapScript.async = true;
        initMapScript.id = "initMap"
        document.body.appendChild(initMapScript);

        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDd3nVf8mY97Bl1zk9lx6j5kHZDosCxgVA&libraries=drawing&callback=initMap";
        script.async = true;
        script.id = "googleMapsScript";
        document.body.appendChild(script);
    }

    render() {
        return (

            <div  className="container-content-page">

                <div className="row">
                    <h1 className="header-cols section-header col-md-7">Renter Control Panel</h1>
                    { this.state.progressStep == 2 ?
                        <div className="header-cols col-md-5">
                            <p>
                                <b>Account:</b> {this.state.chosenAddress}
                                <br/>
                                <b>Available Ether:</b> {this.state.balance}
                            </p>
                        </div>
                    : null }
                </div>
                <br/>

                <div>
                    { this.state.progressStep == 1 ?
                        <div>
                            <h2 ref={subtitle => this.subtitle = subtitle}>Choose Account</h2>
                            <p>Choose the account from which you want to be logged in as a renter.
                            </p>


                            <label>
                                Renter ethereum address:
                                <br/>
                                <select style={{float: 'left'}} onChange={this.onOwnerChange} ref="selectionOracle">
                                    <option value={null}>-</option>
                                    { this.props.accounts.map(this.renderAllAccountsDropdown) }
                                </select>
                            </label>
                            <br/>
                            <button onClick={this.setRenterEthAccount}>Next</button>
                        </div>
                    : null }


                    { this.state.progressStep == 2 ?

                        <div className="step">
                            <Tabs>
                                <TabList>
                                    <Tab>Rent a car</Tab>
                                    <Tab>Return rented car</Tab>
                                </TabList>

                                <TabPanel>
                                    <RentACar renterEthAddress={this.state.chosenAddress}
                                              getBalance={this.fetchAccountBalance}/>
                                </TabPanel>
                                <TabPanel>
                                    <RentedCars renterEthAddress={this.state.chosenAddress}
                                                getBalance={this.fetchAccountBalance}/>
                                </TabPanel>
                            </Tabs>

                        </div>
                    : null }
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
})(Renter);