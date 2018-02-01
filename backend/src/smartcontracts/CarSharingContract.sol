pragma solidity ^0.4.18;

contract CarDetails {
    
      address public owner;
      bytes16 public carGSMNum;
      //uint public penaltyValue = 100;
      uint public penaltyValue;
      bool availability = true;
      bool leftGeofence = false;
      //string position = "";
      //string geofence_prefix= "u33";
      //string geofence_prefix;
      //string[] geofence_suffix = ["h", "k","s","u","5","7","e","g","4","6","d","f","1","3","9","c"];
      //int128[] geofenceInt= [855152, 855154, 855160, 855162, 855141, 855143, 855149,855151, 855140, 855142, 855148, 855150, 855137, 855139, 855145, 855147];
      //int128 positionInt = 0;
      //address constant oracle = 0x8ead2d9305536ebdde184cea020063d2de3665c7;
      address oracle;
      uint pendingWithdrawals = 0;
      
      bytes16 position;
      bytes6 geofence_prefix;
      bytes16[] geofence_suffix;
      
      modifier onlyOwner() {
        require(msg.sender == owner);
        _;
      }
       
      modifier onlyOracle {
        require(msg.sender == oracle);
        _;
      }

      //event TraceLocation(bytes16 number);
      event CarRenterSatus(address renter, address car , bool status);

      /////////////////////////////////////
      //            Functions 
      /////////////////////////////////////
      
      function CarDetails(bytes16 _carGSMNum, uint _penaltyValue, bytes16 _position, bytes6 _geofencePrefix, bytes16[] _geofenceSuffix)  {
        carGSMNum = _carGSMNum;
        owner= msg.sender;
        penaltyValue = _penaltyValue;
        position = _position;
        geofence_prefix =_geofencePrefix;
      }
      
    
      //Check if "curPos" hash is within the geofence defined in the "geofence" array 
      //function checkPositionInGeofenceGeohash() {
          //bytes memory bPrefixFence = bytes(geofence_prefix);
          //bytes memory bPosition = bytes(position);
          //for(uint i; i<3; i++){
              
        //      if(bPrefixFence[i] != bPosition[i]) leftGeofence = true;
             
          //}
            //  if(!leftGeofence){
              //  leftGeofence = true;
                //for(uint j; j < geofence_suffix.length; j++){
                 //   bytes memory bSuffix = bytes(geofence_suffix[j]);
                  //  if(bPosition[3] == bSuffix[0]) leftGeofence = false;
                
                /*
                bool equal = true;
                bytes memory bSuffix = bytes(geofence_suffix[j]);
                for(uint k; k < suffix_length; k++ ){
                    if(bPosition[3 + k] != bSuffix[k]) equal = false;
                }
                if(equal) leftGeofence = false;
                */
                    
            //    }
                  
              //} 
              
        ///for(uint i;i<3;i++){
             // if(geofence_prefix[i]!=position[i]){
                  ///leftGeofence = true;
                 // break;
             // }
         // }
         // if(leftGeofence==false){
               //  leftGeofence=true;
            //  for(uint j; j<geofence_suffix.length;j++){
                //  bytes4 temp = geofence_suffix[j];
                //  if(bytes1(position[3])==bytes1(temp[0]))
                 // {
                  //    leftGeofence = false;
                 //     break;
                 // }
            //  }
        //  }
      //  }
     // function checkPositionInGeofenceIntGeoHash() {
        
        ///The position and the geofence have to be encoded with the same amount of bits
        //If for example the position is encoded with more bits, it has to be shifted
        //to the same amount of bits that the geofence is encoded with
        //
       // bool inside = false;
       // for(uint i; i < geofenceInt.length; i++){
       //     if(positionInt == geofenceInt[i]){
       //         inside = true;
       //     }
       // }
       // leftGeofence = !inside;
     // }
     
        function CheckPositionInGeofence(bytes16 position, bytes6 prefix, bytes16[] suffix) 
      public constant returns (bool)
      {   
          bool out = leftGeofence;
          
          //violation condition for prefix
            if(position[0]!=prefix[0] || position[1]!=prefix[1] || position[2]!=prefix[2]){
                out=true;
          }
          else if(out==false)
          {
              for(uint i = 0; i<suffix.length;i++){
                  bytes16 hash = suffix[i];
                  for(uint j=0;j<hash.length;j++){
                      //if the bytes do not match
                      if(position[j+3]!=hash[j]){
                out=true;
                // do not need to check for the current geofence value
                //move to the next suffix
                break; 
                  }
              //if they match
              else{
                  out=false;
                  //continue; // keep checking the next character
              }
                //since the geofences suffix may be of variable length
              // stop checking if two consecutive positions are 0
              if(hash[j+1]==0 && hash[j+2]==0){
                  break;//end of string and do not check further
              }
          
                  }
                      if(out==false){
                          break;
                   }
              }
          }
          leftGeofence=out;
          return leftGeofence;
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

      function SetCarStatus(address renter,bool status){
            //TraceLocation(_carGSMNum);
            CarRenterSatus(renter, address(this),status);
            availability=status;
      }
    
      function setOracleAddress(address _oracle) onlyOwner{
          oracle=_oracle;
      }

      function GetCarDetails() onlyOwner public constant returns(uint _penaltyValue,bytes16 _carGSMNum, 
     bytes16 _position, bytes16[] _geofenceSuffix) {
          _penaltyValue = penaltyValue;
          _carGSMNum = carGSMNum;
          _position = position;
          _geofenceSuffix=geofence_suffix;
      }
      
      /////////////////////////////////////
      // Functions called by the oracle 
      /////////////////////////////////////

      function updatePosition(bytes16 curPos) onlyOracle {
            position = curPos;
           // checkPositionInGeofenceGeohash();
           CheckPositionInGeofence(curPos,geofence_prefix,geofence_suffix);
      }

      function getPosition() constant returns (bytes32) {
          return position;
      }
      
}

contract Owner {

    /* for simplicity following assumptions have been taken:
    * 1. Renter can rent only one car
    * 2. Owner can have multiple renters.
    *
    */
    struct Renter{
        address renter;
        address rented_car;
        uint moneyForcar; //rent + deposit
    }
    
    Renter[] renters; 


    address public owner_address;
    uint owner_balance;
    
    address[] cars;
    
    address[] listAvailableCars;
     address[] RentedCars;
    
    modifier onlyOwner() {
        require(msg.sender == owner_address);
        _;
    }
    
    function Owner(bytes16 carGSMNum) {
        owner_address = msg.sender;
    }
    

    /////////////////////////////////////
    // Functions called by owner
    /////////////////////////////////////

     function addNewCar(bytes16 _carGSMNum, uint _penaltyValue, bytes16 _position, bytes6 _geofencePrefix, bytes16[] _geofenceSuffix) onlyOwner returns (address){
        address carContract = new CarDetails(_carGSMNum, _penaltyValue, _position, _geofencePrefix, _geofenceSuffix);
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

    function showBalance() onlyOwner constant returns(uint){
        return owner_balance;
    }

    function showRenters() onlyOwner constant returns(Renter[]){
        return renters;
    }
    
    function GetCarDetails(address carAddress) public constant returns(uint _penaltyValue,bytes16 _carGSMNum, 
      bytes16 _position, bytes16[] _geofenceSuffix){
        CarDetails carObj = CarDetails(carAddress);
        (_penaltyValue,_carGSMNum, _position, )=carObj.GetCarDetails();
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

    function showCarDetail(address carAddress) constant returns (bool){
      bool success =false;
            for(uint i = 0; i < cars.length; i++)
            {
                CarDetails carObj = CarDetails(cars[i]);
                 bool isCarAvailable = carObj.isAvailable();
                if(cars[i] == carAddress && isCarAvailable){
                    success = true;
                }
            }
       return success;
    }


       function AlreadyRentedCars() constant returns (address[]){
            for(uint i = 0; i < cars.length; i++)
            {
                CarDetails carObj = CarDetails(cars[i]);
                if(carObj.isAvailable() == false){
                    RentedCars.push(cars[i]);
                }
                else{
                    delete cars[i];
                }
            }
            return RentedCars;
    }
    
    function rentCar(address carAddress) payable returns (bool){
        bool success= false;
        for(uint i = 0; i < cars.length; i++) {
            CarDetails carObj = CarDetails(cars[i]);
            bool isCarAvailable = carObj.isAvailable();
            if(cars[i] == carAddress && isCarAvailable){
                 renters.push(Renter(msg.sender, carAddress, msg.value));
                 carObj.SetCarStatus(msg.sender,false);
                 owner_balance += msg.value;
                 success= true;
            }
        }
        return success;
    }

    function returnCar(address carAddress) returns (bool){
      /*  for(uint k = 0; k < cars.length; k++) {
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
        }*/

        bool success= false;
        for(uint i=0;i<renters.length; i++){
          // checks for valid renter and car address
          if(renters[i].renter == msg.sender && renters[i].rented_car==carAddress){ 
              CarDetails carObj = CarDetails(carAddress);
              bool leftGeofence = carObj.hasLeftGeofence();
              uint deposit = carObj.penaltyValue();
              if(leftGeofence == false){
                    renters[i].renter.send(deposit); // send returns false on failure
                    owner_balance -= deposit;
                    //delete renters[i];
              }
              delete renters[i];
              carObj.SetCarStatus(msg.sender,true);
              success= true;
          }
        }
        return success;
    }
    
}

