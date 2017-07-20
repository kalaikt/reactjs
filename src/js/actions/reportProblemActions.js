import * as types from './actionTypes';
import MedallionService from '../data/medallion-service'
import logger from 'exm-logger'

export default{
  sendReportProblem: function(data, device_id) {
    return (dispatch, getState) => {
      const state = getState();
      const accessToken = state.session.access_token;

      return MedallionService.sendReportProblem(data, device_id, accessToken).then((response) => {
        dispatch({type: types.SEND_REPORT_PROBLEM_SUCCESS, response})
      }, (error) => {
        dispatch({type: types.SEND_REPORT_PROBLEM_FAILURE, error})
      })
    }
  },

  getDeviceInfo: function() {
    return (dispatch, getState) => {
      const state = getState();
      const guestId = state.session.userId;
      const accessToken = state.session.access_token;

      return MedallionService.getDeviceId(guestId, accessToken).then((response) => {
        dispatch({type: types.FETCH_DEVICE_ID_SUCCESS, response})
        return response;
      }, (error) => {
        dispatch({type: types.FETCH_DEVICE_ID_FAILURE, error})
        return error;
      })
    }
  },

  fetchReportProblemOptions: function() {
    return (dispatch, getState) => {
      const state = getState();
      const guestId = state.session.userId;
      const accessToken = state.session.access_token;

      return MedallionService.fetchReportProblemOptions(guestId, accessToken).then((response) => {
        dispatch({type: types.FETCH_REPORT_PROBLEM_SUCCESS, response})
        return response;
      }, (error) => {
        dispatch({type: types.FETCH_REPORT_PROBLEM_FAILURE, error})
        return error;
      })
    }
  }
}
