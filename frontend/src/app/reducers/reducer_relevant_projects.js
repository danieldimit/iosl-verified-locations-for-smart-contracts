import {} from '../actions/index';

import { FETCH_RELEVANT_PROJECTS } from '../actions/types';

const INITIAL_STATE = {
    graphs: []
};

export default function(state, action) {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        case FETCH_RELEVANT_PROJECTS:
            return {
                graphs: action.payload.data.map((elem) => elem)
            };
        default:
            return state;
    }
}
