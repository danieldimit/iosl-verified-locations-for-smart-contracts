import {SET_BREADCRUMB_STATE} from '../actions/types';

const INITIAL_STATE = {
    progressStep: 0,
    progressTip: `
        init
    `
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    console.log('got called', action.type, action.progressStep, action.progressTip)
    switch (action.type) {
        case SET_BREADCRUMB_STATE:
            /*
            let progressStep = action.progressStep?action.progressStep:1;
            let progressTip = action.progressTip?action.progressTip:'waiting';
            */

            return {...state, progressStep: action.progressStep, progressTip: action.progressTip};
    }

    return state
}
