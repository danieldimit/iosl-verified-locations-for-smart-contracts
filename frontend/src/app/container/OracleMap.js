import React, { Component } from 'react';

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
            cellRadius: 0
        };
    }



    componentWillMount() {
        console.log(this.state.carPosition.lat);
        let url = 'http://localhost:4000/getInArea?lon=' + this.state.carPosition.lng + '&lat=' + this.state.carPosition.lat;
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result))
    }

    giveToState = (cellInfo) => {
        let cellLat = parseFloat(cellInfo[7]);
        let cellLng = parseFloat(cellInfo[6]);
        let cellRad = parseInt(cellInfo[8]);
        this.setState({ cellCenter:{lat: cellLat, lng: cellLng}  });
        this.setState({ cellRadius:  cellRad  });
        console.log(cellInfo);
        console.log(cellLat);
        console.log(cellRad);
    }

    handleMarkerDragged = (e) => {
        this.setState({ carPosition:{lat: e.latLng.lat(), lng: e.latLng.lng()}  })
        let url = 'http://localhost:4000/getInArea?lon=' + e.latLng.lng() + '&lat=' + e.latLng.lat();

        fetch(url)
            .then(result=>result.json())
            .then(result=>this.giveToState(result))

        console.log(e.latLng.lat(), " " + e.latLng.lng());
    }


    render() {
        return (
            <div  className="container-content-page">
                <div className="section-content">
                    <h1 className="section-header">Oracle View</h1>
                    <br/>

                    <OracleMapWithCellTowers
                        onMarkerDrag={this.handleMarkerDragged}
                        carPosition={this.state.carPosition}
                        cellCenter={this.state.cellCenter}
                        cellRadius={this.state.cellRadius}
                    />
                </div>
            </div>
        );
    }
}

export default OracleMap;