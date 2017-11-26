pragma solidity ^0.4.18;

contract CarSharingLocation {

    //////////////////////////// VARIABLES AND CONSTANTS

    address constant owner = 0x51c9dc23fe448520292e7d3395cf71fe1237e442;
    bytes16 constant carGSMNum = "004915902233555";
    uint constant penaltyValue = 10;
    string geofence_prefix = "u33";
    string[] geofence_suffix = ["h", "k","s","u","5","7","e","g","4","6","d","f","1","3","9","c" ];

    string position = "";

    address renter;
    bool availability = true;
    bool leftGeofence = false;

    address constant oracle = 0xa72424327201503c1e81fe320e247c3150fb428d;

    // Money saved in the contract for the owner from penalties
    uint pendingWithdrawals = 0;



    //////////////////////////// MODIFIERS

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier onlyRenter {
        require(msg.sender == renter);
        _;
    }

    modifier onlyOracle {
        require(msg.sender == oracle);
        _;
    }


    //////////////////////////// FUNCTIONS

    /**
     * Function for the renter to rent the car with.
     */
    function rentCar() payable returns (bool) {
        if (availability == true) {
            // Check if the applicant renter can cover the penalty
            if (msg.value == penaltyValue) {
                renter = msg.sender;

                // TODO TRIGGER EVENT for oracle to trace

                availability = false;
                return true;
            }
        }
        return false;
    }

    /**
     * Function for the renter to return the car with.
     */
    function returnCar(bytes12 _curPos) onlyRenter {

        // If the renter didn't leave the Geofence return his money
        if (!leftGeofence) {
            msg.sender.transfer(penaltyValue);
        }
        leftGeofence = false;
        availability = true;

        // Remove the address of the renter
        renter = address(0);
    }

    /**
     * Function called by the oracle to update the position.
     *
     * TODO: Decide the size of hashes we are going to use.
     * I think 5 character hashes are best compromize between security of personal
     * data and accuracy. After that has been decided change curPos to type bytesX
     * where X is the number of characters chosen
     */
    function updatePosition(string curPos) onlyOracle {
        position = curPos;
        checkPositionInGeofence();
    }

    /**
     * Function created for testing the updatePosition
     *
     * Should probably be removed in the future
     * */
    function getPosition() onlyOracle constant returns (string) {
        return position;
    }

    function hasLeftGeofence() onlyOracle constant returns (bool) {
        return leftGeofence;
    }

    /**
     * Mark that the renter left the geofence and add his money to the car owner
     * by saving them in the "pendingWithdrawals".
     *
     * TODO: Maybe merge this function with "checkPositionInGeofence"
     */
    function checkPenalize() {
        if (true) {
            // Add money to the contract
            pendingWithdrawals += penaltyValue;
            leftGeofence = true;
        }
    }

    /**
     * Check if "curPos" hash is within the geofence defined in the "geofence" array
     */
    function checkPositionInGeofence() {
        bytes memory bPrefixFence = bytes(geofence_prefix);
        bytes memory bPosition = bytes(position);

        for(uint i; i<3; i++){
            if(bPrefixFence[i] != bPosition[i]) leftGeofence = true;
        }
        if(!leftGeofence){
            leftGeofence = true;
            for(uint j; j < geofence_suffix.length; j++){
                bytes memory bSuffix = bytes(geofence_suffix[j]);
                if(bPosition[3] == bSuffix[0]) leftGeofence = false;
                /*
                bool equal = true;
                bytes memory bSuffix = bytes(geofence_suffix[j]);
                for(uint k; k < suffix_length; k++ ){
                    if(bPosition[3 + k] != bSuffix[k]) equal = false;
                }
                if(equal) leftGeofence = false;
                */
            }
        }
    }

    /**
     * Used by the car owner to withdraw his money from penalties
     */
    function withdrawPenalties() onlyOwner {
        uint amount = pendingWithdrawals;
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals = 0;
        owner.transfer(amount);
    }
}