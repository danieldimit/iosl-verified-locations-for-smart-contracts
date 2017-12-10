import { FETCH_ORACLE, SET_ORACLE } from '../actions/types';

const INITIAL_STATE = {
    oracleAddress: null
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    console.log('got called', action.type, action.oracleAddress);
    switch (action.type) {
        case FETCH_ORACLE:
            if(action.payload){
                return action.payload.data;
            } else {
                return INITIAL_STATE;
            }
            break;
        case SET_ORACLE:
            if(action.payload){
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>. ", action.oracleAddress);
                return action.oracleAddress;
            }
        default:
            return state;
    }

    return state
}
