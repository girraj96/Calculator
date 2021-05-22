import { showError } from '../../utils/helperFunctions';
import { setItem } from '../../utils/utils';
import store from '../store';
import types from '../types';
const { dispatch } = store;

export function displayValues(displayValue) {
    dispatch({
        type: types.SIMPLE_CALC,
        payload: displayValue
    })
}

export function finalOutcome(finalOutcome) {
    dispatch({
        type: types.FINAL_OUTCOME,
        payload: finalOutcome
    })
}

export function setInitialState() {
    dispatch({
        type: types.SET_INITIAL_STATE,
    })
}

export function saveEquation(dataSaveAry) {
    setItem("calculationHistory", dataSaveAry).then((res) =>
        dispatch({
            type: types.SAVE_EQUATION,
            payload: dataSaveAry
        })
        ).catch(error =>
            showError(error))
}

export function clearHistory(){
    dispatch({
        type:types.CLEAR_HISTORY
    })
}