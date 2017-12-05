import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

class OwnerView extends Component {
    render() {
        return (
            <div>
                <Header />
                <div>Owner</div>
                <Footer />
            </div>
        );
    }
}

export default OwnerView;