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
    


    //pragma solidity ^0.4.18;
contract test{
    
    //sample Geofence

    mapping(string=>uint) geofenceLoookup;
    //string[] indexes;
    
    //sample oracle positions : u33dhace , u33dhabe
  bytes32[] indexes=[bytes16("u33df"),"u33dhac","u33dl", "u33dgh","u33af","u33ab",
  "u33hac","u33aks"];

  bytes6 prefix="u33";
  bytes16[] suffix=[bytes10("df"),"dhac","dl","dgh","af","ab","hac","aks"];

  event alert(string,bool);

 function test(){
     geofenceLoookup["u33df"]=1;
     geofenceLoookup["u33dhac"]=1;
     geofenceLoookup["u33dl"]=1;
     geofenceLoookup["u33dgh"]=1;
 }

  function CheckIngeofence(bytes20 position, bytes32[] indexes) 
    public constant returns (bool){
      bool out = false;
    //bytes16 memory position = bytes16(pos);
     for(uint i=0;i<indexes.length; i++){ // loop through all the geofences value
      bytes32 hash = indexes[i];
      for(uint j=0;j<hash.length;j++){ // loop through each bytes in an element
        
        //violation condition for prefix
        if((j==0|| j==1|| j==2)&&(position[j]!=hash[j]) ){
          out=true;
          alert("Checking violated in case of prefix", out);
          //console.log(out);
          return out;
          }
        // Check for suffix if prefix is not violated
        else if(j>=3){
            //if the bytes do not match
          if(position[j]!=hash[j]){
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
          if(j<=hash.length-1 && hash[j+1]==0 && hash[j+2]==0){
              break;//end of string and do not check further
          }
        }
        
      } //end inner loop
      if(out==false){
          alert("Did not violate suffix",out);
        break;
        
      }
     } // end outer loop
     alert("Did it leave geofence? ",out);
     //console.log(out);
     return out;
  }

  function bytes32ToString(bytes16 x) constant returns (string) {
          bytes memory bytesString = new bytes(32);
          uint charCount = 0;
          for (uint j = 0; j < 32; j++) {
              byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
              if (char != 0) {
                  bytesString[charCount] = char;
                  charCount++;
              }
          }
          bytes memory bytesStringTrimmed = new bytes(charCount);
          for (j = 0; j < charCount; j++) {
              bytesStringTrimmed[j] = bytesString[j];
          }
          return string(bytesStringTrimmed);
      }

  function CheckIngeofence_1(bytes16 position, bytes6 prefix, bytes16[] suffix) 
      public constant returns (bool out)
      {
          out=false;
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
      }
      
   
}