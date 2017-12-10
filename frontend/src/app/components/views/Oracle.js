import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchOracle } from '../../actions/index';

import Header from '../Header';
import Footer from '../Footer';
import OracleMap from '../../container/OracleMap';
import ModalOracle from '../../container/ModalOracle';

class OracleView extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.fetchOracle();
    }

    render() {
        return (
            <div>
                <Header />
                {this.props.oracleAddress == null ? <ModalOracle /> : null}
                <OracleMap />
                <Footer />
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
    fetchOracle
})(OracleView);