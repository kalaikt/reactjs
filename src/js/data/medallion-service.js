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
import logger from 'exm-logger'

export default class MedallionService extends Data {
  static get url() {
    return `${this.baseUrl('xos-url')}/products/medallions/journeys`
  }

  static get xosUrl() {
    return this.baseUrl('xos-url')
  }

  static fetchOptions(id) {
    if (this.cachedResponse && this.cachedResponse.id == id) {
      return Promise.resolve(this.cachedResponse.res)
    }
    const url = `${this.url}/${id}`
    const requestOptions = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${Cookies.get('ocean_auth_token')}`,
      },
      //forceMock: true,
      shortError: true,
    }
    return this.handleFetch(url, requestOptions, require('!!file!./mock/medallion.json')).then(res => {
      this.cachedResponse = {id, res};
      return Promise.resolve(res);
    })
  }

  static httpApiRequest( url, headers, mockData = {} ){
    return this.httpRequest( url, headers, mockData )
        .then( response => {
            return Promise.resolve( response );
        })
        .catch( error => {
            const errorMessage = error && error.errorDetail
            const shortError = errorMessage && errorMessage.split(/\r|\n/)[0] || error
            return Promise.reject( shortError )
        });
  }

  static sendReportProblem( data = {}, device_id, accessToken ) {
      const url = `${this.baseUrl('xos-url')}/medallions/${device_id}/problemreport`;
      const headers = {
          method: 'PUT',
          Authorization: `Basic ${accessToken}`,
          data: data,
      };

      return this.httpApiRequest( url, headers );
  }

  static getDeviceId( guestId, accessToken ) {
      const url = `${this.baseUrl('xos-url')}/users/${guestId}/medallions`
      const headers = {
          method: 'GET',
          Authorization: `Basic ${accessToken}`,
          forceMock: true,
      }

      return this.httpApiRequest( url, headers, require('!!file!./mock/device-id-mock.json') );
  }

  static fetchReportProblemOptions( guestId , accessToken ) {
      const url = `${this.baseUrl('xos-url')}/medallions/${guestId}/problems`
      const headers = {
          method: 'GET',
          Authorization: `Basic ${accessToken}`,
          forceMock: true,
      }

      return this.httpApiRequest( url, headers, require('!!file!./mock/report-problem-mock.json') );
  }

  static fetchMedallionOptions(options={}) {
    const {
      journeyId,
      state,
      country
    } = options

    const url = `${this.url}/${journeyId}?shippingAddressCountry=${country}&shippingAddressState=${state}`
    const requestOptions = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${Cookies.get('ocean_auth_token')}`,
      },
      shortError: true,
      mockTag: 'fetchMedallionOptions',
    }
    return this.handleFetch(url, requestOptions, require('!!file!./mock/medallion.json')).then(response => {
      return response
    })
  }
}
