pragma solidity ^0.4.18;

contract CarSharingLocation {
    
    //////////////////////////// VARIABLES AND CONSTANTS
    
    address constant owner = 0x51c9dc23fe448520292e7d3395cf71fe1237e442;
    bytes16 constant carGSMNum = "004915902233555";
    uint constant penaltyValue = 10;
    string[] geofence = ["u301185c38uy", "u301185c38uy"];
    
    address renter;
    bool availability = true;
    bool leftGeofence = false;
    
    address constant oracle = 0x69b2b9e53e1105d9d93d8eaeebaa51a97de88c67;
    
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
    function updatePosition(bytes12 curPos) onlyOracle {
        
    }
    
    /**
     * Mark that the renter left the geofence and add his money to the car owner
     * by saving them in the "pendingWithdrawals".
     * 
     * TODO: Maybe merge this function with "checkPositionInGeofence"
     */
    function checkPenalize(bytes12 curPos) {
        if (checkPositionInGeofence(curPos)) {
            // Add money to the contract
            pendingWithdrawals += penaltyValue;
            leftGeofence = true;
        }
    }
    
    /**
     * Check if "curPos" hash is within the geofence defined in the "geofence" array
     */
    function checkPositionInGeofence(bytes12 curPos) returns (bool) {
        // TODO implement the function
        return true;
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