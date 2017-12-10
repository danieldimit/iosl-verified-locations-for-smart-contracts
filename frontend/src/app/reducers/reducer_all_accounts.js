import {} from '../actions/index';

import { FETCH_ALL_ACCOUNTS } from '../actions/types';

const INITIAL_STATE = [];

export default function(state, action) {
    if (typeof state === 'undefined') {

        return INITIAL_STATE;
    }

    switch (action.type) {
        case FETCH_ALL_ACCOUNTS:
            if(action.payload){
                return action.payload.data;
            } else {
                return INITIAL_STATE;
            }
        default:
            return state;
    }
}
