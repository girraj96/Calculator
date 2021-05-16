import types from "../types";
const initialState = {
    displayValue: "0",
    finalOutcome: null,
}
export default function counterReducer(state = initialState, action) {

    switch (action.type) {
        case types.SIMPLE_CALC:
            const displayValue = action.payload;
            return { ...state, displayValue }
        case types.FINAL_OUTCOME:
            const finalOutcome = action.payload;
            return { ...state, finalOutcome }
        case types.SET_INITIAL_STATE:
            return {...initialState}
        default:
            return { ...state }

    }

}