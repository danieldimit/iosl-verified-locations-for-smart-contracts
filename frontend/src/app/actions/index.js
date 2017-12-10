import axios from 'axios';
import {
    FETCH_ORACLE,
    SET_ORACLE,
    FETCH_ALL_ACCOUNTS
} from './types';

import { ethereumBackendUrl } from '../config';


export function fetchOracle() {
    const request = axios.get(ethereumBackendUrl + '/oracle/');
    return {
        type: FETCH_ORACLE,
        payload: request
    };
}

export function setOracle(oracleAddress) {
    const request = axios.put(ethereumBackendUrl + '/oracle/', {oracleAddress: oracleAddress});
    return {
        type: SET_ORACLE,
        oracleAddress: oracleAddress,
        payload: request
    };
}

export function fetchAllAccounts() {
    const request = axios.get(ethereumBackendUrl + '/account/');
    return {
        type: FETCH_ALL_ACCOUNTS,
        payload: request
    };
}
