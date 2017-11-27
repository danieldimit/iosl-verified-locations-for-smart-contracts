pragma solidity ^0.4.18;

contract LocationFeedOralce {
	address owner; 
	string currPos="";

	event TraceLocation(bytes16 number);
	event Log(string msg);

	function LocationFeedOralce()
	{
		//owner = msg.sender;
		owner = 0x8ead2d9305536ebdde184cea020063d2de3665c7;
	}
	
	/**
	* changes have to done depending on what data oracle will send
	*/

	/*
	* This method will trigger the Oracle service
	*/
	function traceLocation(bytes16 GSMnum) public{
		TraceLocation(GSMnum); 
		Log("Oralce Service started");
	}	

	/*
	* Set and get functions
	*/
	function setPosition(string position) constant public{
	    currPos=position;
	}
	
	function getPosition() constant public returns(string){
	    return currPos;
	}
}

