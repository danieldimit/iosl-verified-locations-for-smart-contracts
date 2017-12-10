import { combineReducers } from 'redux';
import OracleAddressReducer from "./reducer_oracle_address";
import AllAccountsReducer from "./reducer_all_accounts";

const rootReducer = combineReducers({
    oracleAddress: OracleAddressReducer,
    accounts: AllAccountsReducer
});


export default rootReducer;
