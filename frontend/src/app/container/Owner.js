import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl } from '../config';

class Owner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenAddress: 0x0
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.createContract = this.createContract.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllAccounts();
    }

    onOwnerChange(e) {
        console.log(e.target.value);
        this.setState({chosenAddress: e.target.value});
    }

    createContract() {
        let url = ethereumBackendUrl + '/owner/' + this.state.chosenAddress + '/create_contract';

        fetch(url)
            .then(result=>result.json())
            .then(result=>console.log('teeeeeeeest: ',result))
    }

    renderAllAccountsDropdown(data) {
        return (
            <option key={data} value={data}>{data}</option>
        );
    }

    render() {

        return (

            <div  className="container-content-page">

                <h1 className="section-header">Owner Control Panel</h1>
                <br/>

                <div>

                    <h2 ref={subtitle => this.subtitle = subtitle}>Choose Account</h2>
                    <p>You would see the contract of the chosen account or if the account doesn't have a contract yet
                        you would be able to create a contract for it.
                    </p>
                    <select style={{float: 'left'}} onChange={this.onOwnerChange} ref="selectionOracle">
                        <option value={null}>-</option>
                        { this.props.accounts.map(this.renderAllAccountsDropdown)}
                    </select>
                    <br/>
                    <button onClick={this.createContract}>Create contract</button>

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
})(Owner);