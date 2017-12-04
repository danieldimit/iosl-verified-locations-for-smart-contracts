import axios from 'axios';
import {
    SET_BREADCRUMB_STATE,
    FETCH_PROJECTS,
    FETCH_TWEET_STATS,
    FETCH_CALCED_GRAPHS,
    FETCH_HEROES,
    FETCH_RELEVANT_PROJECTS
} from './types';

import { backendUrl } from '../config';

export function fetchTweetStats(location) {
    let request;
    let id;
    if (typeof window !== 'undefined') {
        let params = new URL(document.location).searchParams;
        if (typeof params !== 'undefined') {
            let id = params.get('id');
            request = axios.get(backendUrl + '/project?id=' + id);
        }
    }

    return {
        type: FETCH_TWEET_STATS,
        payload: request
    };
}


export function fetchHeroes() {
    const request = axios.get(backendUrl + '/heroes');
    return {
        type: FETCH_HEROES,
        payload: request
    };
}

export function fetchCalcedGraphs() {
    const request = axios.get(backendUrl + '/projects');
    return {
        type: FETCH_CALCED_GRAPHS,
        payload: request
    };
}

export function fetchRelevantProjects() {
    const request = axios.get(backendUrl + '/relevant-projects');
    return {
        type: FETCH_RELEVANT_PROJECTS,
        payload: request
    };
}

export function clearKeywordResults() {
    return {
        type: CLEAR_KEYWORD_RESULTS
    }
}

export function setMenuState(step) {
    let tip;
    switch (step) {
        case 1:
            tip =
                'Select the hashtag from the cloud or type in custom one to see the most retweetet Tweets containing keyword';
            break;
        case 2:
            tip = "Select an article to visualize it's diffusion ";
            break;
        case 3:
            tip = 'Engage with the visualization ';
            break;
        default:
            tip =
                'Select the hashtag from the cloud or type in custom one to see the most retweetet Tweets containing keyword';
    }

    return {
        type: SET_BREADCRUMB_STATE,
        progressStep: step,
        progressTip: tip
    };
}
