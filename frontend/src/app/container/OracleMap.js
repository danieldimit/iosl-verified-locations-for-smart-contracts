import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as s2 from 's2-geometry';
import { fetchAllAccounts } from '../actions/index';

import { oracleBackendUrl, s2ServerUrl } from '../config';

import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    Circle,
    Rectangle,
    Polygon
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
        <Marker position={props.carPosition} draggable={true} onDragEnd={props.onMarkerDrag}/>
        <Rectangle bounds={{east: 14.693115, west: 11.946533, north: 53.296414, south: 51.459141}}
                   options={{ fillColor: `black`, fillOpacity: 0.15, strokeWeight: 5}}/>
        <Polygon paths={props.s2Polygon}
                   options={{ fillColor: `red`, fillOpacity: 0.3, strokeWeight: 1}}/>
        <Circle center={props.cellCenter}
                options={{ fillColor: `purple`, strokeOpacity: 0.7, strokeWeight: 1}}
                radius={props.cellRadius}/>
        <Circle center={props.cellCenter}
                options={{ fillColor: `black`, strokeOpacity: 1.0, strokeWeight: 1}}
                radius={10}/>
    </GoogleMap>
);

class OracleMap extends Component {


    constructor(props) {
        super(props);
        this.state = {
            carPosition: { lat: 52.520007, lng: 13.404954 },
            cellCenter: { lat: 52.520007, lng: 13.404954 },
            cellRadius: 0,
            value: '',
            s2Polygon: []
        };

        this.giveToState = this.giveToState.bind(this);
        this.handleMarkerDragged = this.handleMarkerDragged.bind(this);
    }

    componentDidMount() {
        console.log(this.state.carPosition.lat);
        let url = oracleBackendUrl + '/getInArea?lon=' + this.state.carPosition.lng + '&lat=' + this.state.carPosition.lat;
        console.log(url);
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result));
        this.props.fetchAllAccounts();
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    giveToState = (cellInfo) => {
        let cellLat = parseFloat(cellInfo[7]);
        let cellLng = parseFloat(cellInfo[6]);
        let cellRad = parseInt(cellInfo[8]);

        let s2Key = s2.S2.latLngToKey(cellLat, cellLng, 12);
        var id = s2.S2.keyToId(s2Key);

        let url = s2ServerUrl + '/convertS2ToBoundingLatLonPolygon?cellId=' + id.toString();

        fetch(url, {mode: 'cors'})
            .then(result=>result.json())
            .then(result=>this.setState({ cellCenter:{lat: cellLat, lng: cellLng},
                                            cellRadius: cellRad,
                                            s2Polygon: result}));
    }

    handleMarkerDragged = (e) => {
        this.setState({ carPosition:{lat: e.latLng.lat(), lng: e.latLng.lng()}  })
        let url = oracleBackendUrl + '/getInArea?lon=' + e.latLng.lng() + '&lat=' + e.latLng.lat();

        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result));

        console.log(e.latLng.lat(), " " + e.latLng.lng());
    }

    renderAllAccountsDropdown(data) {
        return (
            <option key={data} value={data}>{data}</option>
        );
    }

    render() {
        return (
            <div  className="container-content-page">
                <h1 className="section-header">Oracle Control Panel</h1>
                <br/>

                <section className="row">
                    <article className="content-block col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <h2>Oracle information</h2>
                        <p>Oracle address:&nbsp;
                            {String(this.props.oracleAddress)}
                        </p>
                    </article>

                    <article className="content-block col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <h2>Car address</h2>

                        <select onChange={this.onOwnerChange} ref="selectionOracle">
                            <option value={null}>-</option>
                            { this.props.accounts.map(this.renderAllAccountsDropdown) }
                        </select>
                    </article>
                </section>

                <OracleMapWithCellTowers
                    onMarkerDrag={this.handleMarkerDragged}
                    carPosition={this.state.carPosition}
                    cellCenter={this.state.cellCenter}
                    cellRadius={this.state.cellRadius}
                    ghPosition={this.state.ghPosition}
                    s2Polygon={this.state.s2Polygon}
                />

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
})(OracleMap);




/*
 <article className="content-block col-lg-6 col-md-6 col-sm-12 col-xs-12">
 <h4>Oracle policy</h4>
 <form onSubmit={this.handleSubmit}>
 Submit location to the smart contract in the block chain:
 <label className="oracle-policy-opt">
 <input type="radio" name="gender" value="asd1" onChange={this.handleChange}/>
 every
 <input type="text"></input>
 minutes
 </label>
 <label className="oracle-policy-opt">
 <input type="radio" name="gender" value="asd" onChange={this.handleChange}/>
 if the car enters another "hash"-square
 </label>
 <label className="oracle-policy-opt">
 <input type="radio" name="gender" value="asd" onChange={this.handleChange}/>
 if the car leaves the Geofence
 </label>
 <input type="submit" value="Submit" />
 </form>
 </article>
 */