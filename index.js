import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger';
import {thunk} from 'redux-thunk';
import axios from 'axios';

//action variables
const accIncrement = 'account/increment';
const accDecrement = 'account/decrement';
const accIncrementByAmt = 'account/incrementByAmount';
const accDecremnetByAmt = 'account/decremnetByAmount';
const userAccFullfilled = 'account/userAccountFullfilled';
const userAccPending = 'account/userAccountPending';
const userAccRejected = 'account/userAccountRejected';

const store = createStore(accountReducer, applyMiddleware(logger.default, thunk));

function accountReducer(state={amount: 1}, action){
    switch(action.type){
        case accIncrement:
            return {amount: state.amount + 1};
        case accDecrement:
            return {amount: state.amount - 1};
        case accIncrementByAmt:
            return {amount: state.amount + action.payload}
        case accDecremnetByAmt:
            return {amount: state.amount - action.payload}
        case userAccPending:
            return {...state, pending: true}
        case userAccFullfilled:
            return {amount: action.payload, pending: false}
        case userAccRejected:
            return {...state, error: action.error, pending: false}
        default:
            return state;
    }
}


// console.log(store.getState())


//action creators
function getUserAccount(id){
    return async(dispatch, getState) => {
        try{
            dispatch(getUserAccountPending());
            const {data} = await axios.get(`http://localhost:8081/account/${id}`);
            dispatch(getUserAccountFulfilled(data.amount));
        }catch(error){
            dispatch(getUserAccountRejected(error.message));
        }
    }
}

function getUserAccountFulfilled(val){
    return {type: userAccFullfilled, payload: val}
}

function getUserAccountPending(){
    return {type: userAccPending}
}

function getUserAccountRejected(error){
    return {type: userAccRejected, error}
}


function accInc(){
    return {type: accIncrement}
}

function accDec(){
    return {type: accDecrement}
}

function accIncByAmt(val){
    return {type: accIncrementByAmt, payload: val}
}

function accDecByAmt(val){
    return {type: accDecremnetByAmt, payload: val}
}


setTimeout(() => {
    store.dispatch(getUserAccount(1))
})