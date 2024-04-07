import {createStore, applyMiddleware, combineReducers} from 'redux'
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


const userBonusInc = 'bonus/increment';
const userBonusDec = 'bonus/decrement';
const userBonusPending = 'bonus/userBonusPending';
const userBonusFullfilled = 'bonus/userBonusFullfilled';
const userBonusRejected = 'bonus/userBonusRejected';

const store = createStore(combineReducers({
    account: accountReducer,
    bonus: bonusReducer
}) , applyMiddleware(logger.default, thunk));

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


//bonus


function bonusReducer(state={points: 0}, action) {
    switch(action.type){
        case userBonusInc:
            return {points: state.points + 1}
        case userBonusDec:
            return {points: state.points - 1}
        case userBonusPending:
            return {...state, pending: true}
        case userBonusFullfilled:
            return {points: action.payload, pending: false}
        case userBonusRejected:
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


function bonInc() {
    return {type: userBonusInc}
}

function bonDec(){
    return {type: userBonusDec}
}

function getUserBonus(id){
    return async (dispatch, getState) => {
        try{
            dispatch(getUserBonusPending());
            const {data} = await axios.get(`http://localhost:8081/bonus/${id}`);
            dispatch(getUserBonusFulfilled(data.points));
        }catch(error){
            dispatch(getUserBonusRejected(error.message));
        }
    }
}

function getUserBonusFulfilled(points){
    return {type: userBonusFullfilled, payload: points}
}

function getUserBonusRejected(error){
    return {type: userBonusRejected, error}
}


function getUserBonusPending(){
    return {type: userBonusPending}
}

setTimeout(() => {
    store.dispatch(getUserBonus(1))
})