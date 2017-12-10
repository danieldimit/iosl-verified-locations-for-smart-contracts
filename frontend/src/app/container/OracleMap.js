import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as geohash from 'latlon-geohash';

import { oracleBackendUrl } from '../config';

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
        <Marker position={props.carPosition} draggable={true} onDragEnd={props.onMarkerDrag}/>
        <Rectangle bounds={{east: 14.693115, west: 11.946533, north: 53.296414, south: 51.459141}}
                   options={{ fillColor: `black`, fillOpacity: 0.15, strokeWeight: 5}}/>
        <Rectangle bounds={{east: props.ghPosition.ne.lon, west: props.ghPosition.sw.lon,
                            north: props.ghPosition.ne.lat, south: props.ghPosition.sw.lat}}
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
            ghPosition: {ne: {lat: 0, lon: 0}, se: {lat: 0, lon: 0}}
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
            .then(result=>this.giveToState(result))
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
        let geohashedPos = geohash.encode(cellLat, cellLng, 5);
        this.setState({ cellCenter:{lat: cellLat, lng: cellLng},
                        cellRadius: cellRad,
                        ghPosition: geohash.bounds(geohashedPos)});
    }

    handleMarkerDragged = (e) => {
        this.setState({ carPosition:{lat: e.latLng.lat(), lng: e.latLng.lng()}  })
        let url = oracleBackendUrl + '/getInArea?lon=' + e.latLng.lng() + '&lat=' + e.latLng.lat();

        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result))

        console.log(e.latLng.lat(), " " + e.latLng.lng());
    }


    render() {
        return (
            <div  className="container-content-page">

                <h1 className="section-header">Oracle View</h1>
                <br/>


                <section className="row">
                    <article className="content-block col-lg-6 col-md-6 col-sm-6 col-xs-12">
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

                    <article className="content-block col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
                </section>

                <OracleMapWithCellTowers
                    onMarkerDrag={this.handleMarkerDragged}
                    carPosition={this.state.carPosition}
                    cellCenter={this.state.cellCenter}
                    cellRadius={this.state.cellRadius}
                    ghPosition={this.state.ghPosition}
                />

            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        oracleAddress: store.oracleAddress
    }
}

export default connect(mapStateToProps)(OracleMap);