pragma solidity ^0.4.18;


contract CarDetails {

    address public owner;

    string public carGSMNum;
    //uint public penaltyValue = 100;
    uint public penaltyValue;

    bool availability = true;

    bool leftGeofence = false;
    address oracle;

    uint pendingWithdrawals = 0;

    uint64 position;

    byte geofence_prefix;

    uint64[] geofence_suffix;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyOracle {
        require(msg.sender == oracle);
        _;
    }

    //event TraceLocation(bytes16 number);
    event CarRenterSatus(address renter, address car, bool status);

    /////////////////////////////////////
    //            Functions
    /////////////////////////////////////

    function CarDetails(string _carGSMNum, uint _penaltyValue, uint64 _position, byte _geofencePrefix, uint64[] _geofenceSuffix, address _oracle)  {
        carGSMNum = _carGSMNum;
        owner = msg.sender;
        penaltyValue = _penaltyValue;
        position = _position;
        geofence_prefix = _geofencePrefix;
        geofence_suffix = _geofenceSuffix;
        oracle = _oracle;
    }

    function checkPositionInGeofence(uint64 position, byte prefix, uint64[] suffix)
    public constant returns (bool)
    {
        bool out = leftGeofence;

        if (out == false)
        {
            for (uint i = 0; i < suffix.length; i++) {
                uint64 hash = suffix[i];
                out = true;
                if( (position / 10 ** 16) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 15) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 14) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 13) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 12) == hash ){
                    out = false;
                    break;
                }
                else if((position / 10 ** 11) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 10) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 9) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 8) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 7) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 6) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 5) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 4) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 3) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 2) == hash ){
                    out = false;
                    break;
                }
                else if( (position / 10 ** 1) == hash ){
                    out = false;
                    break;
                }
                if(hash == position){
                    out = false;
                    break;
                }
            }
        }
        leftGeofence = out;
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

    function deleteCarDetails() onlyOwner {
        // return the pending money is any

        selfdestruct(owner);
    }

    function SetCarStatus(address renter, bool status, bool leftGeo){
        //TraceLocation(_carGSMNum);
        CarRenterSatus(renter, address(this), status);
        availability = status;
        leftGeofence = leftGeo;
    }

    // function setOracleAddress(address _oracle) onlyOwner{
    //     oracle=_oracle;
    // }

    //  all address can create oracle onlyOwner removed
    //function setOracleAddress(address _oracle){
    //    oracle = _oracle;
    //}


    function GetCarDetails() onlyOwner public constant returns (uint _penaltyValue, string _carGSMNum,
    uint64 _position, byte _geofencePrefix, uint64[] _geofenceSuffix) {
        _penaltyValue = penaltyValue;
        _carGSMNum = carGSMNum;
        _position = position;
        _geofenceSuffix = geofence_suffix;
        _geofencePrefix = geofence_prefix;
    }

    /////////////////////////////////////
    // Functions called by the oracle
    /////////////////////////////////////

    function updatePosition(uint64 curPos) onlyOracle returns (bool) {
        position = curPos;
        // checkPositionInGeofenceGeohash();
        bool out = checkPositionInGeofence(curPos, geofence_prefix, geofence_suffix);
        return out;
    }

    function getPosition() constant returns (uint64) {
        return position;
    }

}


contract Owner {

    /* for simplicity following assumptions have been taken:
    * 1. Renter can rent only one car
    * 2. Owner can have multiple renters.
    *
    */
    struct RenterInfo {
    //address renter;
    address rented_car;
    uint moneyForcar; //rent + deposit
    }

    mapping (address => RenterInfo) renters;

    address[] public renterAddress;
    //Renter[] renters;


    address public owner_address;

    uint ownerEarnings;
    uint fundsLockedInContract;

    address[] cars;

    address[] listAvailableCars;
    address[] listRentedCars;

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

    function addNewCar(string _carGSMNum, uint _penaltyValue, uint64 _position, byte _geofencePrefix, uint64[] _geofenceSuffix, address oracle) onlyOwner returns (address){
        address carContract = new CarDetails(_carGSMNum, _penaltyValue, _position, _geofencePrefix, _geofenceSuffix, oracle);
        cars.push(carContract);
        listRentedCars.push(0x0);
        listAvailableCars.push(carContract);
        return carContract;
    }

    function deleteCar(address carAddress) onlyOwner {
        bool available = false;

        for (uint i = 0; i < cars.length; i++) {
            if (cars[i] == carAddress) {
                CarDetails carObj = CarDetails(cars[i]);
                available = carObj.isAvailable();
                carObj.deleteCarDetails();
                cars[i] = cars[cars.length - 1];
                delete cars[cars.length - 1];
                cars.length--;
                break;
            }
        }

        bool aDeleted = false;
        bool rDeleted = false;

        if (available) {
            for (uint j = 0; j < listAvailableCars.length; j++) {
                if (listAvailableCars[j] == carAddress) {
                    listAvailableCars[j] = listAvailableCars[listAvailableCars.length - 1];
                    delete listAvailableCars[listAvailableCars.length - 1];
                    listAvailableCars.length--;
                    aDeleted = true;
                    if (rDeleted) {
                        break;
                    }
                }

                if (listRentedCars[j] == 0x0) {
                    listRentedCars[j] = listRentedCars[listRentedCars.length - 1];
                    delete listRentedCars[listRentedCars.length - 1];
                    listRentedCars.length--;
                    rDeleted = true;
                    if (aDeleted) {
                        break;
                    }
                }
            }
        } else {
            for (uint m = 0; m < listAvailableCars.length; m++) {
                if (listAvailableCars[m] == 0x0) {
                    listAvailableCars[m] = listAvailableCars[listAvailableCars.length - 1];
                    delete listAvailableCars[listAvailableCars.length - 1];
                    listAvailableCars.length--;
                    aDeleted = true;
                    if (rDeleted) {
                        break;
                    }
                }

                if (listRentedCars[m] == carAddress) {
                    listRentedCars[m] = listRentedCars[listRentedCars.length - 1];
                    delete listRentedCars[listRentedCars.length - 1];
                    listRentedCars.length--;
                    rDeleted = true;
                    if (aDeleted) {
                        break;
                    }
                }
            }
        }
    }

    function showCars() onlyOwner constant returns (address[]) {
        return cars;
    }

    function showEarnings() onlyOwner constant returns (uint) {
        return ownerEarnings;
    }

    function showFundsLockedInContract() onlyOwner constant returns (uint) {
        return fundsLockedInContract;
    }

    function showRenters() onlyOwner constant returns (address[]) {
        return renterAddress;
    }

    function getRenterInfo(address _renterAddress) view public returns (address, uint) {
        return (renters[_renterAddress].rented_car, renters[_renterAddress].moneyForcar);
    }


    /////////////////////////////////////
    // Functions called by renter
    /////////////////////////////////////

    function getAvailableCars() constant returns (address[]) {
        return listAvailableCars;
    }

    function getRentedCars() constant returns (address[]) {
        return listRentedCars;
    }

    function alreadyRentedCarByUser(address renterAdr) constant returns (address) {
        var renter = renters[renterAdr];
        return renter.rented_car;
    }

    function insertInAvailableList(address carAdr) constant {
        bool laRdy = false;
        bool lrRdy = false;

        for (uint i = 0; i < listAvailableCars.length; i++) {
            if (!laRdy && listAvailableCars[i] == 0x0) {
                listAvailableCars[i] = carAdr;
                laRdy = true;
                if (lrRdy) {
                    break;
                }
            }

            if (!lrRdy && listRentedCars[i] == carAdr) {
                listRentedCars[i] = 0x0;
                lrRdy = true;
                if (laRdy) {
                    break;
                }
            }
        }
    }

    function insertInRentedList(address carAdr) constant {
        bool laRdy = false;
        bool lrRdy = false;

        for (uint i = 0; i < listAvailableCars.length; i++) {
            if (!laRdy && listAvailableCars[i] == carAdr) {
                listAvailableCars[i] = 0x0;
                laRdy = true;
                if (lrRdy) {
                    break;
                }
            }

            if (!lrRdy && listRentedCars[i] == 0x0) {
                listRentedCars[i] = carAdr;
                lrRdy = true;
                if (laRdy) {
                    break;
                }
            }
        }
    }

    function withdrawEarnings() public onlyOwner {
        uint amount = ownerEarnings;
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        ownerEarnings = 0;
        msg.sender.transfer(amount);
    }

    function rentCar(address carAddress) payable returns (bool){
        bool success = false;
        CarDetails carObj = CarDetails(carAddress);
        bool isCarAvailable = carObj.isAvailable();

        insertInRentedList(carAddress);

        if (isCarAvailable) {
            var renter = renters[msg.sender];
            renter.rented_car = carAddress;
            renter.moneyForcar = msg.value;
            renterAddress.push(msg.sender);
            carObj.SetCarStatus(msg.sender, false, false);
            fundsLockedInContract += msg.value;
            success = true;
        }

        return success;
    }

    function returnCar(address carAddress) returns (bool){

        bool success = false;
        var renter = renters[msg.sender];
        if (renter.rented_car == carAddress) {
            CarDetails carObj = CarDetails(carAddress);
            bool leftGeofence = carObj.hasLeftGeofence();
            uint deposit = carObj.penaltyValue();
            fundsLockedInContract -= deposit;

            if (leftGeofence == false) {
                msg.sender.transfer(deposit);
            } else {
                ownerEarnings += deposit;
            }

            delete renters[msg.sender];
            carObj.SetCarStatus(msg.sender, true, false);
            success = true;
        }


        for (uint i = 0; i < renterAddress.length; i++) {
            if (renterAddress[i] == msg.sender) {
                delete renterAddress[i];
            }
        }

        insertInAvailableList(carAddress);

        return success;
    }
}