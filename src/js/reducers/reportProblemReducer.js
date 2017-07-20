import * as types from '../actions/actionTypes';
import initialState from './initialState';
import logger from 'exm-logger';

// todo: create reduce unit tests
export default function reportProblemReducer(state = initialState.reportProblem, action) {
  switch (action.type) {
    case types.FETCH_DEVICE_ID_SUCCESS:
      return { ...state, device: action.response };
    case types.FETCH_REPORT_PROBLEM_SUCCESS:
      return { ...state, reportProblemOptions: action.response };
    default:
      return state
  }
}
