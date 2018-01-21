import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl } from '../config';

import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    Circle,
    Rectangle
} from "react-google-maps";

const OracleMapWithCellTowers = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDd3nVf8mY97Bl1zk9lx6j5kHZDosCxgVA&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
        center: { lat: 52.520007, lng: 13.404954 },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={11}
        defaultCenter={props.center}
    >
        <Rectangle bounds={{east: props.ghPosition.ne.lon, west: props.ghPosition.sw.lon,
            north: props.ghPosition.ne.lat, south: props.ghPosition.sw.lat}}
                   options={{ fillColor: `red`, fillOpacity: 0.3, strokeWeight: 1}}/>
    </GoogleMap>
);




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
        this.setOwnerEthAccount = this.setOwnerEthAccount.bind(this);
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



    setOwnerEthAccount() {
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

                <h1 className="section-header">Renter Control Panel</h1>
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
                            <button onClick={this.setOwnerEthAccount}>Next</button>
                        </div>
                    : null }


                    { this.state.progressStep == 2 ?
                        <div className="step">
                            <h2 ref={subtitle => this.subtitle = subtitle}>Rent a Car</h2>
                            <p>The map displays all available cars. Choose one of them and specify a sum to be transfered
                                to the contract. When you click on a car its geofence is displayed on the map together with
                                the deposit needed for the penalty value.
                            </p>
                            <OracleMapWithCellTowers
                                onMarkerDrag={this.handleMarkerDragged}
                                carPosition={this.state.carPosition}
                                cellCenter={this.state.cellCenter}
                                cellRadius={this.state.cellRadius}
                                ghPosition={this.state.ghPosition}
                            />
                            <label>
                                Ethereum to be transfered to the contract:
                                <br/>
                                <input type="text" ref="carGSMField"/>
                            </label>
                            <br/>
                            <button onClick={this.createContract}>Create car</button>
                        </div>
                    : null }

                    { this.state.progressStep == 3 ?
                        <div className="step">
                            <h2 ref={subtitle => this.subtitle = subtitle}>Return Car</h2>
                            <p>Click the button to return the car you've rented. This would return your penalty deposit
                                if you haven't left the geofence defined in the contract.
                            </p>
                            <div id="withdraw" className="ownerControlPanel">
                                <h3>Withdraw money from all car contracts</h3>
                                <button onClick={this.createContract}>Return car</button>
                            </div>
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