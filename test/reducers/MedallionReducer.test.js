import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import reportProblemReducer from '../../src/js/reducers/reportProblemReducer';
import * as types from '../../src/js/actions/actionTypes';
import initialState from '../../src/js/reducers/initialState'
chai.use(chaiAsPromised);

function combineInitialState(obj) {
  return Object.assign(initialState.reportProblem, obj)
}

describe('Report a Problem Reducer', () => {
  def('subject', () => reportProblemReducer);

  it('should return the initial state', () => {
    expect($subject(undefined, {})).to.deep.equal(initialState.reportProblem)
  });

  it('handles action FETCH_DEVICE_ID_SUCCESS', () => {
    def('reportProblem', () => { return initialState.reportProblem.device });

    const action = {type: types.FETCH_DEVICE_ID_SUCCESS, response:$reportProblem }
    expect($subject(undefined, action)).to.deep.equal(combineInitialState({device:{}}))
  });

  it('handles action FETCH_REPORT_PROBLEM_SUCCESS', () => {
    def('reportProblemOptions', () => { return initialState.reportProblem.reportProblemOptions });

    const action = {type: types.FETCH_REPORT_PROBLEM_SUCCESS, response:$reportProblemOptions }
    expect($subject(undefined, action)).to.deep.equal(combineInitialState({reportProblemOptions:{}}))
  });
});
