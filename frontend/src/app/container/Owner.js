import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl } from '../config';



const markers = [{info:' Marker1',icon:'image/icon.jpg', label:'A',
    latLng:{lng:2.13815342634916,lat:41.39485570794}},
    {info:' Marker2', label:'B',latLng:{lng:2.13815342634926,lat:41.39485570795}}];




class Owner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenAddress: "-",
            state: 1,
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.createContract = this.createContract.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllAccounts();
        console.log("called");
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

    componentWillUnmount() {
        var id = document.getElementById("initMap");
        document.body.removeChild(id);
        id = document.getElementById("googleMapsScript");
        document.body.removeChild(id);
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

    handleReturnedMarkers(markers) {
        this.setState({
            activeMarkers: markers
        });
    }

    render() {

        return (

            <div  className="container-content-page">

                <h1 className="section-header">Owner Control Panel</h1>
                <br/>

                <div>

                    <div id="step1p1">
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
                        <button>Next</button>
                    </div>

                    <div id="step1p2">
                        <h2 ref={subtitle => this.subtitle = subtitle}>Create Owner Contract</h2>
                        <p>There seems to be no owner contract for the ethereum account you've chosen. Click the create
                            contract button to be able to create car contracts.
                        </p>
                        <button onClick={this.createContract}>Create contract</button>
                    </div>

                    <div id="step2p1">
                        <h2 ref={subtitle => this.subtitle = subtitle}>Manage Cars</h2>
                        <p>Create or delete car contracts that you own.
                        </p>
                        <div className="ownerControlPanel" style={{background: 'orange'}}>
                            <h3>Withdraw money from all car contracts</h3>
                            <button onClick={this.createContract}>Withdraw money</button>
                        </div>
                        <div className="ownerControlPanel" style={{background: 'purple'}}>
                            <h3>Delete existing car contract</h3>
                            <label>
                                Car contract address:
                                <br/>
                                <select style={{float: 'left'}} onChange={this.onOwnerChange} ref="selectionOracle">
                                    <option value={null}>-</option>
                                    <option value={null}>0x122931293129319</option>
                                    { this.props.accounts.map(this.renderAllAccountsDropdown) }
                                </select>
                            </label>
                            <br/>
                            <button onClick={this.createContract}>Delete car</button>
                        </div>
                        <div className="ownerControlPanel" style={{background: 'blue'}}>
                            <h3>Create new car contract</h3>
                            <h4>Geofence</h4>
                            <div id="map"></div>
                            <label>
                                Car GSM number:
                                <br/>
                                <input type="text" ref="carGSMField"/>
                            </label>
                            <br/>
                            <label>
                                Penalty value:
                                <br/>
                                <input type="text" ref="carGSMField"/>
                            </label>
                            <br/>
                            <button onClick={this.createContract}>Create car</button>
                        </div>
                    </div>

                <div id="map"></div>

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