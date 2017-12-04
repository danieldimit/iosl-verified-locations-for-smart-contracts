import {} from '../actions/index';

import { FETCH_TWEET_STATS } from '../actions/types';
/*
*
 title: "",
 content: "",
 imgs: [],
 thumbnailLoc: "",
 buildingType: "",
 status: "",
 investor: "",
 tga: "",
 year: "",
 _id: ""*/
const INITIAL_STATE = {

    stats: {
        no_profile_img: 0,
        lang_stats: {},
        median_statuses_count: 0,
        no_profile_background: 0,
        imgs: [],
        average_accounts_age: 0,
        no_description: 0,
        edges: 0,
        nodes: 0,
        completeness:0
    }
};

export default function(state, action) {
    if (typeof state === 'undefined') {

        return INITIAL_STATE;
    }

    switch (action.type) {
        case FETCH_TWEET_STATS:
            if(action.payload){
                return {
                    stats: action.payload.data,
                };
            } else {
                return INITIAL_STATE;
            }

        default:
            return state;
    }
}
