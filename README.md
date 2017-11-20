# Verified Locations for Smart Contracts

Verified locations for smart contracts is a proof-of-concept project.

## Installation and setup of the smart contract testing environment

To deploy the contract on a test network do the following:

1. Make sure you have NodeJS and NPM. Check if you do by running:
```
node -v
npm -v
```
Install them if you don't have them on your machine.

2. Then run the following in the command line to install testrpc:

```
npm install -g ethereumjs-testrpc
```
After it's finished the following to start the testrpc:
```
testrpc
```
This provides you with 10 different accounts and private keys, along with a local server that runs a dummy local ethereum network at localhost:8545.

3. Open the [Remix IDE](http://remix.ethereum.org/) and click the "Run" tab on the top right side. Then set the value for the "Environment" property to "Web3 Provider". Then click "Yes" on the first and on the next dialog add http://localhost:8545 as Web3 Provider Endpoint.

4. Add the CarSharingContract.sol to the workspace by clicking the upload icon on the top left corner.
