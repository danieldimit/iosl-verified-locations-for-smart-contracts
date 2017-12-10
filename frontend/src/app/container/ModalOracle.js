import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllAccounts, setOracle } from '../actions/index';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
    }
};

class ModalOracle extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: true,
            chosenAddress: 0x0
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.chooseOracle = this.chooseOracle.bind(this);
    }
    componentDidMount() {
        this.props.fetchAllAccounts();
    }


    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    chooseOracle() {
        this.setState({oracleAddress: this.refs.selectionOracle.value});
        this.props.setOracle(this.refs.selectionOracle.value);
        this.setState({modalIsOpen: false});
    }

    renderAllAccountsDropdown(data) {
        return (
            <option key={data} value={data}>{data}</option>
        );
    }

    render() {

        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                className="Modal"
                overlayClassName="Overlay"
                style={customStyles}
                contentLabel="Example Modal"
                shouldCloseOnOverlayClick={false}
            >

                <h2 ref={subtitle => this.subtitle = subtitle}>Choose Oracle</h2>
                <p>No account has been chosen as an Oracle yet. Please choose the address of one account to serve as Oracle:</p>
                <select ref="selectionOracle">
                    { this.props.accounts.map(this.renderAllAccountsDropdown)}
                </select>
                <br/>
                <button style={{float: 'right'}} onClick={this.chooseOracle}>Apply</button>


            </Modal>
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
    fetchAllAccounts,
    setOracle
})(ModalOracle);