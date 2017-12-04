import {} from '../actions/index';

import { FETCH_CALCED_GRAPHS } from '../actions/types';

const INITIAL_STATE = {
    graphs: []
};

export default function(state, action) {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        case FETCH_CALCED_GRAPHS:
            return {
                graphs: action.payload.data.map((elem) => elem)
            };
        default:
            return state;
    }
}
