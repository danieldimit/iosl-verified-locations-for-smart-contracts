import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

class RenterView extends Component {
    render() {
        return (
            <div>
                <Header />
                <div>Renter</div>
                <Footer />
            </div>
        );
    }
}

export default RenterView;