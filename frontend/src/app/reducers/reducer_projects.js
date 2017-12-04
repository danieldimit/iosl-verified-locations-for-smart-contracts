import {} from "../actions/index";

import {FETCH_PROJECTS} from '../actions/types';

const INITIAL_STATE = {results: []};

export default function (state, action) {

    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    switch (action.type) {
        case FETCH_PROJECTS:
            return {
                results: action.payload.data
            };
        default:
            return state;
    }
}