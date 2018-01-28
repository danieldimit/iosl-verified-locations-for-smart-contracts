import React, { Component } from 'react';

class CreateCarPolygonCounter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numberOfPolys: 0
        };
    }

    render() {
        return (
            <div>
                Number of Polygons: {this.state.numberOfPolys}
            </div>
        );
    }
}

export default (CreateCarPolygonCounter);