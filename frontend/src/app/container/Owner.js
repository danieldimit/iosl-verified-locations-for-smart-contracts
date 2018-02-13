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
            balance: 0,
            fundsLockedInContract: 0,
            ownerEarnings: null,
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
        this.getEthereumOwnerEarningsInContract = this.getEthereumOwnerEarningsInContract.bind(this);
        this.moveToNextStepAndSaveContractHash = this.moveToNextStepAndSaveContractHash.bind(this);

        this.filterOutEmptyAddresses = this.filterOutEmptyAddresses.bind(this);
        this.handleWithdrawMoneyResponse = this.handleWithdrawMoneyResponse.bind(this);
        this.getCarContracts = this.getCarContracts.bind(this);
        this.onSelectedCarChange = this.onSelectedCarChange.bind(this);
        this.triggerRender = this.triggerRender.bind(this);
        this.fetchAccountBalance = this.fetchAccountBalance.bind(this);
        this.getEthereumLockedInContract = this.getEthereumLockedInContract.bind(this);
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

    fetchAccountBalance() {
        let url = ethereumBackendUrl + '/account/' + this.state.ownerEthereumAddress;

        fetch(url, {
            method: 'get'
        })  .then(result=>result.json())
            .then(result=>result.success ? this.setState({balance: result.data.balance}) : null);

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
            this.getEthereumOwnerEarningsInContract();
            this.triggerRender();
        }
        this.fetchAccountBalance();
    }

    moveToNextStepAndSaveContractHash(result) {
        this.setState({
            progressStep: 3,
            ownerContractAddress: result.data.contractMinedAddress
        });
    }

    getEthereumLockedInContract(ownerEarnings) {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/showFundsLockedInContract';
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.setState({
                ownerEarnings: ownerEarnings,
                fundsLockedInContract: result.data
            }));
    }

    getEthereumOwnerEarningsInContract() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/showEarnings';
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.getEthereumLockedInContract(result.data));
    }

    getCarContracts() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/getCarContracts';
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.setState({carAddresses: result.data}));
    }

    handleWithdrawMoneyResponse(response) {
        if (response == true) {
            this.setState({ownerEarnings: 0});
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
            .then(result=>this.getEthereumOwnerEarningsInContract());
    }

    filterOutEmptyAddresses(data) {
        var index = data.indexOf("0x0000000000000000000000000000000000000000");
        while(index > -1) {
            data.splice(index, 1);
            index = data.indexOf("0x0000000000000000000000000000000000000000");
        }
        return data;
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
            .then(result=>this.handleWithdrawMoneyResponse(result))
            .then(res=>this.getEthereumOwnerEarningsInContract())
            .then(res=>this.fetchAccountBalance());
    }

    triggerRender() {
        let url = ethereumBackendUrl + '/owner/' + this.state.ownerEthereumAddress + '/getCarContracts';
        fetch(url)
            .then(result=>result.json())
            .then(result=>this.filterOutEmptyAddresses(result.data))
            .then(result=>this.setState({carAddresses: result}));
    }

    render() {
        return (

            <div  className="container-content-page">

                <div className="row">
                    <h1 className="header-cols section-header col-md-7">Owner Control Panel</h1>
                    { this.state.progressStep > 1 ?
                        <div className="header-cols col-md-5">
                            <p>
                                Owner Ethereum Address: {this.state.ownerEthereumAddress}
                                <br/>
                                Owner Contract Address: {this.state.ownerContractAddress}
                                <br/>
                                Available Ether: {this.state.balance}
                            </p>
                        </div>
                        : null }
                </div>
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
                                Create or delete car contracts that you own.
                            </p>
                            <div id="withdraw" className="ownerControlPanel">
                                <h3>Withdraw money from all car contracts</h3>
                                <p>
                                    Ethereum earning for owner contract: {this.state.ownerEarnings} Ether
                                    <br/>
                                    Money locked in contract: {this.state.fundsLockedInContract} Ether (cannot be withdrawn yet)
                                </p>
                                <button onClick={this.withdrawEthereum}>Withdraw money</button>
                            </div>
                            <DeleteCar ownerEthereumAddress={this.state.ownerEthereumAddress}
                                       carAddresses={this.state.carAddresses}
                                       triggerRender={this.triggerRender}/>
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