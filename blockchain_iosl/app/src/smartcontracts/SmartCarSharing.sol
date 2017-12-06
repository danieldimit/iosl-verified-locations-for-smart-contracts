pragma solidity ^0.4.18;

contract CarDetails {
    
      address public owner;
      bytes16 public carGSMNum;
      uint public penaltyValue = 100;
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

      event TraceLocation(bytes16 number);
      
      

      /////////////////////////////////////
      //            Functions 
      /////////////////////////////////////
      
      function CarDetails(bytes16 carGSMNum)  {
        carGSMNum = carGSMNum;
        owner= msg.sender;
        //penaltyValue = 100;
      }
    
      //Check if "curPos" hash is within the geofence defined in the "geofence" array 
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
        
        ///The position and the geofence have to be encoded with the same amount of bits
        //If for example the position is encoded with more bits, it has to be shifted
        //to the same amount of bits that the geofence is encoded with
        //
        bool inside = false;
        for(uint i; i < geofenceInt.length; i++){
            if(positionInt == geofenceInt[i]){
                inside = true;
            }
        }
        leftGeofence = !inside;
    }

      /////////////////////////////////////
      // Functions called by car itself 
      /////////////////////////////////////
    
    
      function isAvailable() public constant returns (bool) {
        return availability;
      }
    
      function hasLeftGeofence() constant returns (bool) {
        return leftGeofence;
      }
    
      function deleteCarDetails() onlyOwner{
        // return the pending money is any 
        
        selfdestruct(owner);
      }
    
      function MonitorCarLocation(bytes16 _carGSMNum){
            // TODO: trigger oracle event
            TraceLocation(_carGSMNum);
            availability=false;
            position ="u33a";
            checkPositionInGeofenceGeohash();
        }
    
   
      /////////////////////////////////////
      // Functions called by the oracle 
      /////////////////////////////////////

      function updatePosition(string curPos) onlyOracle {
            position = curPos;
            checkPositionInGeofenceGeohash();
      }

      function getPosition() constant returns (string) {
          return position;
      }
      
    
}

contract SmartCarSharing{

    struct Renter{
        address renter;
        address rented_car;
        uint moneyForcar; //rent + deposit
    }

    //renter can take multiple cars and there exist multiple renter
    Renter[] renters; 


    address public owner_address;
    uint owner_balance;
    
    address[] cars;
    
    address[] listAvailableCars;
    
    modifier onlyOwner() {
        require(msg.sender == owner_address);
        _;
    }
    
    function SmartCarSharing(bytes16 carGSMNum) {

     // initially the car owner will start with 1 car and later he can increase it
        owner_address = msg.sender;
        address carContract = new CarDetails(carGSMNum);
        cars.push(carContract);
    }
    

    /////////////////////////////////////
    // Functions called by owner
    /////////////////////////////////////

     function addNewCar(bytes16 _carGSMNum) onlyOwner returns (address){
        address carContract = new CarDetails(_carGSMNum);
        cars.push(carContract);
        return carContract;
    }
    
    function deleteCar(address carAddress) onlyOwner{
        var index = cars.length;
        for(uint i = 0; i < cars.length; i++) {
            if(cars[i] == carAddress){
                CarDetails carObj = CarDetails(cars[i]);
                carObj.deleteCarDetails();
                delete cars[i];
                index = i;
            }
        }
    }
    
    function showCars() onlyOwner constant returns(address[]){
        return cars;
    }


    /////////////////////////////////////
    // Functions called by renter
    /////////////////////////////////////
    
    function ListAvailableCars() constant returns (address[]){
            for(uint i = 0; i < cars.length; i++)
            {
                CarDetails carObj = CarDetails(cars[i]);
                if(carObj.isAvailable() == true){
                    listAvailableCars.push(cars[i]);
                }
                else{
                    delete cars[i];
                }
            }
            return listAvailableCars;
    }

    function rentCar(address carAddress) payable returns (bool){
        for(uint i = 0; i < cars.length; i++) {
            CarDetails carObj = CarDetails(cars[i]);
            bool isCarAvailable = carObj.isAvailable();
            if(cars[i] == carAddress && isCarAvailable){
                 renters.push(Renter(msg.sender, carAddress, msg.value));
                 carObj.MonitorCarLocation(carObj.carGSMNum());
                 owner_balance += msg.value;
            }
        }
        
    }

    function returnCar(address renter, address carAddress, bytes12 _curPos) {
        for(uint k = 0; k < cars.length; k++) {
            CarDetails carObj = CarDetails(cars[k]);
            bool leftGeofence = carObj.hasLeftGeofence();
            uint deposit = carObj.penaltyValue();
            if(cars[k] == carAddress && leftGeofence == false)
            {
                //if the renter did not left geofence, return money
                for(uint i=0;i< renters.length; i++){
                    renters[i].renter.send(deposit);
                    owner_balance -= deposit;
                    delete renters[i];
                }
            }
        }
        
    }
    
}