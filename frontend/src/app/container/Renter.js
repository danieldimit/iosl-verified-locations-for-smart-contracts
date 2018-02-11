import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RentACar from './RentACar';
import RentedCars from './RentedCars';
import { fetchAllAccounts } from '../actions/index';


class Renter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenAddress: "-",
            state: 1,
            progressStep: 1,
            carPosition: { lat: 52.520007, lng: 13.404954 },
            cellCenter: { lat: 52.520007, lng: 13.404954 },
            cellRadius: 0,
            value: '',
            ghPosition: {ne: {lat: 0, lon: 0}, sw: {lat: 0, lon: 0}}
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.createContract = this.createContract.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
        this.setRenterEthAccount = this.setRenterEthAccount.bind(this);
        this.createScriptNode = this.createScriptNode.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllAccounts();
    }

    onOwnerChange(e) {
        this.setState({chosenAddress: e.target.value});
    }

    createContract() {
        this.setState({progressStep: 3});
        /*
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
        */
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

    handleReturnedMarkers(markers) {
        this.setState({
            activeMarkers: markers
        });
    }



    setRenterEthAccount() {
        this.setState({progressStep: 2});
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
                                Account: {this.state.chosenAddress}
                                <br/>
                                Available Ether: 41223
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
                                    <RentACar renterEthAddress={this.state.chosenAddress} />
                                </TabPanel>
                                <TabPanel>
                                    <RentedCars renterEthAddress={this.state.chosenAddress} />
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