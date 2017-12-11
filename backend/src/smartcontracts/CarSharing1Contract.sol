pragma solidity ^0.4.18;

contract CarSharingContract {

    //////////////////////////// VARIABLES AND CONSTANTS

    address owner;
    bytes16 carGSMNum;
    uint penaltyValue;
    string geofence_prefix;
    string[] geofence_suffix;
    int128[] geofenceInt;

    int128 positionInt = 0;
    string position = "";

    address renter;
    uint submittedMoney;
    bool availability = true;
    bool leftGeofence = false;

    address constant oracle = 0x8ead2d9305536ebdde184cea020063d2de3665c7;

    // Money saved in the contract for the owner from penalties
    uint pendingWithdrawals = 0;
    
    // Pay per min variables
    uint16 demandedMinutes;
    uint pricePerMinute;
    uint startTime;
    

    
    //////////////////////////// CONSTRUCTOR
    
    // TODO: Add variables in constructor. For testing setting the values staticly is sufficient
    function CarSharingContract(address ownerAddress, bytes16 carGSM) {
        owner = ownerAddress;
        carGSMNum = carGSM;
        penaltyValue = 10;
        pricePerMinute = 1;

        // Geofence setting
        geofence_prefix = "u33";
        geofence_suffix = ["h", "k","s","u","5","7","e","g","4","6","d","f",
        "1","3","9","c"];
    }

    function getOwner() constant returns (address) {
        return owner;
    }

    function getGSM() constant returns (bytes16) {
        return carGSMNum;
    }

    function setOwner(address own) {
        owner = own;
    }

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
    function rentCar(uint16 dMins) payable returns (bool) {
        if (availability == true) {
            /*
             * Check if the applicant renter can cover the penalty and costs
             * for using the car
             */
            if (msg.value == (dMins * pricePerMinute) + penaltyValue) {
                renter = msg.sender;
                submittedMoney = msg.value;

                // TODO TRIGGER EVENT for oracle to trace

                demandedMinutes = dMins;
                startTime = now;
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
        
        // See how much money has to be paid for the journey
        uint spentMoney = ((now - startTime) / 60) * pricePerMinute;
        submittedMoney -= spentMoney;
        pendingWithdrawals += spentMoney;

        // If the renter didn't leave the Geofence return his penalty money too
        if (leftGeofence) {
            submittedMoney -= penaltyValue;
            pendingWithdrawals += penaltyValue;
        }
        
        if (submittedMoney != 0) {
            msg.sender.transfer(submittedMoney);
        }
        
        leftGeofence = false;
        demandedMinutes = 0;
        startTime = 0;
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
        checkPositionInGeofenceGeohash();
    }

    function updatePositionInt(int128 curPos) {
        positionInt = curPos;
        checkPositionInGeofenceIntGeoHash();
    }

    /**
     * Function created for testing the updatePosition
     *
     * Should probably be removed in the future
     * */
    function getPosition() constant returns (string) {
        return position;
    }

    function getPositionInt() constant returns (int128){
        return positionInt;
    }

    function hasLeftGeofence() constant returns (bool) {
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
            // Mark that the renter left the geofence
            leftGeofence = leftGeofence || true;
        }
    }

    /**
     * Check if "curPos" hash is within the geofence defined in the "geofence" array
     */
    function checkPositionInGeofenceGeohash() {
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

    function checkPositionInGeofenceIntGeoHash() {
        /*
        * The position and the geofence have to be encoded with the same amount of bits
        * If for example the position is encoded with more bits, it has to be shifted
        * to the same amount of bits that the geofence is encoded with
        */
        bool inside = false;
        for(uint i; i < geofenceInt.length; i++){
            if(positionInt == geofenceInt[i]){
                inside = true;
            }
        }
        leftGeofence = !inside;
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