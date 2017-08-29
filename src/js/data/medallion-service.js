/*
Copyright notice:

Xevo Application Library
Copyright © 2017 Xevo Inc.
Patents Pending
All rights reserved.
This file contains confidential and proprietary information of Xevo Inc.
Unauthorized reproduction or distribution of this document is strictly prohibited.
Xevo Inc.
Website: www.xevo.com
Email: info@xevo.com
*/

import Data from './data'
import Cookies from 'js-cookie'
import deviceMockData from './mock/device-id-mock.json'
import reportProblemsMockData from './mock/report-problem-mock.json'

export default class MedallionService extends Data {
  static cachedResponse = {}

  static get url() {
    return `${this.baseUrl('xos-url')}/products/medallions/journeys`
  }

  static fetchOptions(id) {
    if (this.cachedResponse && this.cachedResponse.id == id) {
      return Promise.resolve(this.cachedResponse.res)
    }
    const url = `${this.url}/${id}`
    return this.httpRequest(url, {}, require('!!file!./mock/medallion.json')).then(res => {
      this.cachedResponse = {id, res}
      return Promise.resolve(res)
    })
  }

  static httpApiRequest( url, options, mockData = {} ){
    return this.httpRequest( url, options, mockData )
      .catch(( error ) => {
        const errorMessage = error && error.errorDetail
        const shortError = errorMessage && errorMessage.split(/\r|\n/)[0] || error
        return Promise.reject( shortError )
      })
  }

  static sendReportProblem( formData, deviceId ) {
    return this.httpApiRequest( `${this.baseUrl('xos-url')}/medallions/${deviceId}/problemreport`, {
      method: 'PUT',
      data: formData
    })
  }

  static getDeviceId( guestId ) {
    return this.httpApiRequest( `${this.baseUrl('xos-url')}/users/${guestId}/medallions`, {
      method: 'GET'
    })
  }

  static fetchReportProblemOptions( guestId ) {
    // TODO: Remove this once the service api is implemented
    return Promise.resolve(reportProblemsMockData)

    return this.httpApiRequest( `${this.baseUrl('xos-url')}/medallions/${guestId}/problems`, {
      method: 'GET'
    })
  }

  static fetchMedallionOptions(options={}) {
    const {
      journeyId,
      state = 'FL',
      country = 'US',
    } = options

    const jcsid = `m-${journeyId}::${country}::${state}`
    if (this.cachedResponse && this.cachedResponse[jcsid]) {
      return Promise.resolve(this.cachedResponse[jcsid])
    }

    const url = `${this.url}/${journeyId}?shippingAddressCountry=${country}&shippingAddressState=${state}`
    const requestOptions = {
      mockTag: 'fetchMedallionOptions',
    }
    return this.httpRequest(url, requestOptions, require('!!file!./mock/medallion.json')).then(response => {
      this.cachedResponse = {
        ...this.cachedResponse,
        [jcsid]: response,
      }
      return response
    })
  }

  static fetchAccessoryOptions(options={}) {
    const {
      journeyId,
      state = 'FL',
      country = 'US',
    } = options

    const jcsid = `a-${journeyId}::${country}::${state}`
    if (this.cachedResponse && this.cachedResponse[jcsid]) {
      return Promise.resolve(this.cachedResponse[jcsid])
    }

    const baseUrl = `${this.baseUrl('xos-url')}/products/medallionsaccessories/journeys`
    const url = `${baseUrl}/${journeyId}?shippingAddressCountry=${country}&shippingAddressState=${state}`
    const requestOptions = {
      mockTag: 'fetchAccessoryOptions',
    }
    return this.httpRequest(url, requestOptions, require('!!file!./mock/medallion-accessories.json')).then((response) => {
      this.cachedResponse = {
        ...this.cachedResponse,
        [jcsid]: response,
      }
      return response
    })
  }

  static fetchCountryEligibility(options={}) {
    const {
      journeyId,
    } = options
    const url = `${this.baseUrl('xos-url')}/journeys/${journeyId}/medallion/eligiblecountries`
    const requestOptions = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${Cookies.get('ocean_auth_token')}`,
      },
      shortError: true,
    }
    return this.httpRequest(url, requestOptions, require('!!file!./mock/country-eligibility.json'))
  }
}
