import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';
import OracleMap from '../../container/OracleMap';

class OracleView extends Component {
    render() {
        return (
            <div>
                <Header />
                <OracleMap />
                <Footer />
            </div>
        );
    }
}

export default OracleView;