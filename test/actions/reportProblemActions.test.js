import chai from 'chai'
import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import reportProblemActions from '../../src/js/actions/reportProblemActions'
import MedallionService from '../../src/js/data/medallion-service'
import * as types from '../../src/js/actions/actionTypes'
import initialState from '../../src/js/reducers/initialState'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

let deviceMockData = require('../../src/js/data/mock/device-id-mock.json');
let optionsMockData = require('../../src/js/data/mock/report-problem-mock.json');

describe('Report a Problem  actions', () => {
  const store = mockStore(initialState)

  afterEach(() => {
    store.clearActions()
  })

  it('dispatches FETCH_DEVICE_ID_SUCCESS after calling getDeviceInfo', () => {

    const expectedAction = [{ type: types.FETCH_DEVICE_ID_SUCCESS, response: {} }]
    const stub = sinon.stub(MedallionService, 'getDeviceId').resolves({})

    // TODO: Fetching device informaiton

    return store.dispatch(reportProblemActions.getDeviceInfo()).then(() => {
      expect(stub).to.be.called
      expect(store.getActions()).to.deep.equal(expectedAction)
      MedallionService.getDeviceId.restore()
    })
  })

  it('dispatches FETCH_REPORT_PROBLEM_SUCCESS after calling fetchReportProblemOptions', () => {

    const expectedAction = [{ type: types.FETCH_REPORT_PROBLEM_SUCCESS, response: {} }]
    const stub = sinon.stub(MedallionService, 'fetchReportProblemOptions').resolves({})

    // TODO: Fetch report problem user options

    return store.dispatch(reportProblemActions.fetchReportProblemOptions()).then(() => {
      expect(stub).to.be.called
      expect(store.getActions()).to.deep.equal(expectedAction)
      MedallionService.fetchReportProblemOptions.restore()
    })
  })
})
