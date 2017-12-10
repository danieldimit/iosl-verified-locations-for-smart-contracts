pragma solidity ^0.4.18;


contract carDetails{
    
      address public owner;
      bytes16 carGSMNum;
      uint penaltyValue;
      bool availability = true;
      bool leftGeofence = false;
      string position = "";
      string geofence_prefix= "u33";
      string[] geofence_suffix = ["h", "k","s","u","5","7","e","g","4","6","d","f","1","3","9","c"];
      int128[] geofenceInt= [855152, 855154, 855160, 855162, 855141, 855143, 855149,855151, 855140, 855142, 855148, 855150, 855137, 855139, 855145, 855147];
      int128 positionInt = 0;
      address constant oracle = 0x8ead2d9305536ebdde184cea020063d2de3665c7;
      uint pendingWithdrawals = 0;
      
       modifier onlyOwner() {
        require(msg.sender == owner);
        _;
       }
       
       modifier onlyOracle {
        require(msg.sender == oracle);
        _;
      }
      
      function carDetails(bytes16 carGSMNum)  {
        carGSMNum = carGSMNum;
    }
    
    function deleteCarDetails() onlyOwner{
        // return the pending money is any 
        
        selfdestruct(owner);
    }
    
    function isAvailable() constant returns (bool){
        return availability;
    }
    
    function isLeftGeofence() constant returns (bool){
        return leftGeofence;
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
            // Add money to the contract
            pendingWithdrawals += penaltyValue;
            leftGeofence = true;
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
}

contract carOwner{
    address public owner_address;
    address[] cars;
    
    modifier onlyOwner() {
        require(msg.sender == owner_address);
        _;
    }
    
    function car_Owner() {
        owner_address = msg.sender;
    }
    
     function addNewCar(bytes16 carGSMNum) onlyOwner returns (address){
        carDetails car = new carDetails(carGSMNum);
        cars.push(car);
        return car;
    }
    
    function deleteCar(address carAddress) onlyOwner{
        var index = cars.length;
        for(uint i = 0; i < cars.length; i++) {
            if(cars[i] == carAddress){
                carDetails car = carDetails(cars[i]);
                car.deleteCarDetails();
                delete cars[i];
                index = i;
            }
        }
    }
    
    function withdrawPenalties() onlyOwner {
        // uint amount = pendingWithdrawals;
        // // Remember to zero the pending refund before
        // // sending to prevent re-entrancy attacks
        // pendingWithdrawals = 0;
        // owner.transfer(amount);
    }

    
     function() payable{
        //Ether sink
    }
    
}

contract renter{
    
     address public renter_address;

     modifier onlyRenter {
        require(msg.sender == renter_address);
        _;
    }
    
     function car_Renter() {
        renter_address = msg.sender;
    }
    
    /**
     * Function for the renter to rent the car with.
     */
    function rentCar(address carAddress) payable returns (bool) {
        // if (availability == true) {
        //     // Check if the applicant renter can cover the penalty
        //     if (msg.value == penaltyValue) {
        //         renter = msg.sender;

        //         // TODO TRIGGER EVENT for oracle to trace

        //         availability = false;
        //         return true;
        //     }
        // }
        // return false;
    }

    /**
     * Function for the renter to return the car with.
     */
    function returnCar(address carAddress ,bytes12 _curPos) onlyRenter {

    //     // If the renter didn't leave the Geofence return his money
    //     if (!leftGeofence) {
    //         msg.sender.transfer(penaltyValue);
    //     }
    //     leftGeofence = false;
    //     availability = true;

    //     // Remove the address of the renter
    //     renter = address(0);
    }
    
}
