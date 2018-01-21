/* This contract is solely for testing   */

pragma solidity ^0.4.18;
contract a {
      bytes32 position = "u33aac";
      bytes6 geofence_prefix ="u33";
      //bytes2[] geofence_suffix=[bytes2(0x6800),0x6b00,0x7300,0x7500,0x3700];
      bytes2[] geofence_suffix=[bytes2("h"),"k","s","u"];
      bool leftGeofence = false;
      
    
    /* @param : position
    *
    * when prefix=true
    * Best case: 21903
    * when whole suffix array is checked, prefix=false, suffix=true
    * Worst case: 2109
    * when whole suffix array is not checked prefix = false; suffix=false;
    * Avg case: 2109
    */  
    function checkPositionInGeofenceGeohash_native(bytes32 position) public returns(bool) {
          for(uint i;i<3;i++){
              if(geofence_prefix[i]!=position[i]) // SLOAD
              {
                  leftGeofence = true; //SSTORE
                  break;
              }
          }
         if((leftGeofence)==false){ // SLOAD
                 leftGeofence=true; //SSTORE
              for(uint j; j<geofence_suffix.length;j++){ // SLOAD
                  bytes4 temp = geofence_suffix[j]; 
                  if(bytes1(position[3])==bytes1(temp[0])) // SLOAD
                  {
                      leftGeofence = false; //SSTORE
                      break;
                  }
              }
          }
          return leftGeofence;
    }
    
    /* @param : prefix,suffix,position
    /* reutrns bool
    *
    *
    * when prefix=true
    * Best case: 1047
    * when whole suffix array is checked, prefix=false, suffix=true
    * Worst case: 2254
    * when whole suffix array is not checked prefix = false; suffix=false;
    * Avg case: 1955
    */
    function checkPositionInGeofenceGeohash_1(bytes6 prefix, bytes2[] suffix, bytes32 pos) 
            public returns(bool){
            bool temp = leftGeofence; //SLOAD
            if(prefix[0]!=pos[0] || prefix[1]!=pos[1]||prefix[2]!=pos[2]) //MLOAD
            {
                temp=true; //MSTORE
            }
            //for(uint i;i<3;i++){
             // if(prefix[i]!=pos[i]){ //MLOAD
               //   temp = true; //MSTORE
                 // break;
              //}
          //}
         if((temp)==false){
                 temp=true;
              for(uint j; j<suffix.length;j++){ //MLOAD
                  bytes2 data = suffix[j]; 
                  if(bytes1(pos[3])==bytes1(data[0])) //MLOAD
                  {
                      temp = false; //MSTORE
                      break;
                  }
              }
          }
          //leftGeofence = temp;
          return temp;
    }  
    
    /* @param : position
    *
    * when prefix=true
    * Best case: 35330 
    * when whole suffix array is checked, prefix=false, suffix=true
    * Worst case: 1891 
    * when whole suffix array is not checked prefix = false; suffix=false;
    * Avg case: 1955
    */
    function checkPositionInGeofenceGeohash_2(bytes32 position) public returns(bool) {
          //for(uint i;i<3;i++){
            //  if(geofence_prefix[i]!=position[i]) // SLOAD
              //{
                //  leftGeofence = true; //SSTORE
                 // break;
              //}
          //}
          if(geofence_prefix[0]!=position[0] ||geofence_prefix[1]!=position[1]|| 
            geofence_prefix[1]!=position[1]) // SLOAD
            { 
                leftGeofence=false; //SSTORE
            }
         if((leftGeofence)==false){ // SLOAD
                 leftGeofence=true; //SSTORE
              for(uint j; j<geofence_suffix.length;j++){ // SLOAD
                  bytes4 temp = geofence_suffix[j]; 
                  if(bytes1(position[3])==bytes1(temp[0])) // SLOAD
                  {
                      leftGeofence = false; //SSTORE
                      break;
                  }
              }
          }
          return leftGeofence;
    }
}
    