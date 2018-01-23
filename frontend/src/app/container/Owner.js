import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateCar from './CreateCar';
import DeleteCar from './DeleteCar';
import CreateAndDeleteCar from './CreateAndDeleteCar';
import { fetchAllAccounts } from '../actions/index';
import { ethereumBackendUrl } from '../config';


class Owner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ownerEthereumAddress: "-",
            ownerContractAddress: null,
            etherInContract: null,
            carAddresses: [],
            selectedCar: "-",
            state: 1,
            progressStep: 1
        };
        this.renderAllAccountsDropdown = this.renderAllAccountsDropdown.bind(this);
        this.createContract = this.createContract.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
        this.setOwnerEthAccountAndCheckOwnerContract = this.setOwnerEthAccountAndCheckOwnerContract.bind(this);
        this.decideNextStep = this.decideNextStep.bind(this);
        this.withdrawEthereum = this.withdrawEthereum.bind(this);
        this.getEthereumBalanceOfContract = this.getEthereumBalanceOfContract.bind(this);
        this.moveToNextStepAndSaveContractHash = this.moveToNextStepAndSaveContractHash.bind(this);
        this.handleWithdrawMoneyResponse = this.handleWithdrawMoneyResponse.bind(this);
        this.getCarContracts = this.getCarContracts.bind(this);
        this.onSelectedCarChange = this.onSelectedCarChange.bind(this);
        this.triggerRender = this.triggerRender.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllAccounts();
    }

    /**
     * DROPDOWN MENUS
     */

    onOwnerChange(e) {
        this.setState({ownerEthereumAddress: e.target.value});
    }

    onSelectedCarChange(e) {
        this.setState({selectedCar: e.target.value});
    }

    renderAllAccountsDropdown(data) {

        if (data == this.props.oracleAddress) {
            return ;
        } else {
            return (
                <option key={data} value={data}>{data}</option>
            );
        }
    }


    decideNextStep(response) {
        if (response.success == false) {
            this.setState({progressStep: 2});
        } else {
            this.setState({
                progressStep: 3,
                ownerContractAddress: response.data.contractMinedAddress
            })
            this.getEthereumBalanceOfContract();
            this.getCarContracts();
        }
    }

    moveToNextStepAndSaveContractHash(result) {
        this.setState({
            progressStep: 3,
            ownerContractAddress: result.data.contractMinedAddress
        });
    }

    getEthereumBalanceOfContract() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/showBalance';
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.setState({etherInContract: result.data}));
    }

    getCarContracts() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/getCarContracts';
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.setState({carAddresses: result.data}));
    }

    handleWithdrawMoneyResponse(response) {
        if (response == true) {
            this.setState({etherInContract: 0});
        }
    }


    /**
     * BUTTON METHODS
     */

    setOwnerEthAccountAndCheckOwnerContract() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress;
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.decideNextStep(result));
    }

    createContract() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/createOwnerContract';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(result=>result.json())
            .then(result=>this.moveToNextStepAndSaveContractHash(result))
            .then(result=>this.getEthereumBalanceOfContract())
            .then(result=>this.getCarContracts());
    }

    withdrawEthereum() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/withdrawMoney';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(result=>result.json())
            .then(result=>this.handleWithdrawMoneyResponse(result));
    }


    triggerRender() {
        console.log("TRIGGERED");
        this.setState({state: this.state.state + 1});
    }

    render() {
        return (

            <div  className="container-content-page">

                <h1 className="section-header">Owner Control Panel</h1>
                <br/>

                <div>
                    { this.state.progressStep == 1 ?
                        <div>
                            <h2 ref={subtitle => this.subtitle = subtitle}>Choose Account</h2>
                            <p>You would see the contract of the chosen account or if the account doesn't have a contract yet
                                you would be able to create a contract for it.
                            </p>


                            <label>
                                Owner ethereum address:
                                <br/>
                                <select style={{float: 'left'}} onChange={this.onOwnerChange}>
                                    <option value={null}>-</option>
                                    { this.props.accounts.map(this.renderAllAccountsDropdown) }
                                </select>
                            </label>
                            <br/>
                            <button onClick={this.setOwnerEthAccountAndCheckOwnerContract}>Next</button>
                        </div>
                    : null }


                    { this.state.progressStep == 2 ?
                        <div className="step">
                            <h2 ref={subtitle => this.subtitle = subtitle}>Create Owner Contract</h2>
                            <p>There seems to be no owner contract for the ethereum account you've chosen. Click the create
                                contract button to be able to create car contracts.
                            </p>
                            <button onClick={this.createContract}>Create contract</button>
                        </div>
                    : null }


                    { this.state.progressStep == 3 ?
                        <div className="step">

                            <h2 ref={subtitle => this.subtitle = subtitle}>Manage Cars</h2>
                            <p>
                                Owner Ethereum Address: {this.state.ownerEthereumAddress}
                            <br/>
                                Owner Contract Address: {this.state.ownerContractAddress}
                            </p>
                            <p>
                                Create or delete car contracts that you own.
                            </p>
                            <div id="withdraw" className="ownerControlPanel">
                                <h3>Withdraw money from all car contracts</h3>
                                <p>
                                    Ethereum in the owner contract: {this.state.etherInContract}
                                </p>
                                <button onClick={this.withdrawEthereum}>Withdraw money</button>
                            </div>
                            <DeleteCar ownerEthereumAddress={this.state.ownerEthereumAddress} />
                            <CreateCar ownerEthereumAddress={this.state.ownerEthereumAddress}
                                       triggerRender={this.triggerRender}/>
                        </div>
                    : null }

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