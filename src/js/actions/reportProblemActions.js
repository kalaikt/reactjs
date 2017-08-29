import * as types from './actionTypes'
import MedallionService from '../data/medallion-service'
import logger from 'exm-logger'

export function sendReportProblem(formData, deviceId) {
  return (dispatch, getState) => {
    return MedallionService.sendReportProblem( formData, deviceId )
      .then((response) => {
        dispatch({type: types.SEND_REPORT_PROBLEM_SUCCESS, response})
      })
      .catch((error) => {
        dispatch({type: types.SEND_REPORT_PROBLEM_FAILURE, error})
      })
  }
}

export function getDeviceInfo() {
  return (dispatch, getState) => {
    const guestId = getState().session.userId

    return MedallionService.getDeviceId( guestId )
      .then((response) => {
        dispatch({type: types.FETCH_DEVICE_ID_SUCCESS, response})
        return response
      })
      .catch((error) => {
        dispatch({type: types.FETCH_DEVICE_ID_FAILURE, error})
        return error
      })
  }
}

export function fetchReportProblemOptions() {
  return (dispatch, getState) => {
    const guestId = getState().session.userId

    return MedallionService.fetchReportProblemOptions( guestId )
      .then((response) => {
        dispatch({type: types.FETCH_REPORT_PROBLEM_SUCCESS, response})
        return response
      })
      .catch((error) => {
        dispatch({type: types.FETCH_REPORT_PROBLEM_FAILURE, error})
        return error
      })
  }
}
