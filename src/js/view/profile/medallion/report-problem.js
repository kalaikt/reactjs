/*
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

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import i18n from 'exm-i18n'
import logger from 'exm-logger'

import PageContainer from '../../components/page-container'
import PageHeader from '../../components/page-header'
import PageContent from '../../components/page-content'
import PageFooter from '../../components/page-footer'

import RadioButton from '../../components/radio-button'
import TextInput from '../../components/text-input'
import { fetchReportProblemOptions, getDeviceInfo, sendReportProblem } from '../../../actions/reportProblemActions'

import _CSS from '../../../../css/profile/_common.sass'
import CSS from '../../../../css/profile/medallion/report-a-problem.sass'
import injectRedux from '../../../lib/inject-redux'

class ReportProblem extends React.Component {
  constructor() {
    super(...arguments)

    this.state = {
      other: '',
      reportProblem: '',
      reportProblems: []
    }

    this.onReportNow = this.onReportNow.bind(this)
    this.makeReportProblemUI = this.makeReportProblemUI.bind(this)
    this.handleReportProblemChange = this.handleReportProblemChange.bind(this)
  }

  static defaultProps = {
    onDismiss: function() {}
  }

  render() {
    return(
      <PageContainer
        header={ this.makeHeader() }
        content={ this.makeContent() }
        footer={ this.makeFooter() }
      />
    )
  }

  makeHeader() {
    return(
      <PageHeader icon='arrow-left'
        onBackClick={ this.props.onDismiss }
        title={ i18n.t('report_a_problem') }/>
    )
  }

  componentWillMount() {
    this.props.fetchReportProblemOptions()
    .then(( response ) => {
      this.setState( { reportProblems:( response.problems ? response.problems : [] ) } )
    })
    .catch(( error ) => {
      logger.error( error )
    })
  }

  makeContent() {
    return(
      <PageContent>
        <div className={ CSS.centerLayout }>
          <div className={ _CSS.section }>
            <div className={ _CSS.row }>
                { i18n.t('report_a_problem_txt') }
            </div>
            <div className={ _CSS.row + ' ' + CSS.alignLeft }>
              { this.makeReportProblemUI() }
              <div className={ _CSS.rowSmall }>
                <TextInput
                    label={ i18n.t('specify_other') }
                    name='other'
                    value={ this.state.other }
                    onChange={ this.handleReportProblemChange }
                />
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    )
  }

  makeReportProblemUI() {
    if ( !this.state.reportProblems.length ) {
      return
    }

    return this.state.reportProblems.map( problem => {
      return(
        <div className={ _CSS.rowSmall } key={ problem.id }>
          <RadioButton
            id={ `report-problem-${problem.id}` }
            className={ `circle ${CSS.radioButton}` }
            name='reportProblem'
            value={ problem.name }
            onClick={ this.handleReportProblemChange }
            required />
          <label className={ CSS.label } htmlFor={ `report-problem-${problem.id}` }>
            { problem.name }
          </label>
        </div>
    )})
  }

  handleReportProblemChange( e ) {
    e.stopPropagation()

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onReportNow() {
    if ( !this.state.reportProblem ) {
      logger.warn('Report a problem has not been selected')
      return
    }

    const requestDeviceId = this.props.getDeviceInfo()

    requestDeviceId.then(( response ) => {

      if ( !response.length ) {
        logger.warn('Medallion device information empty')
        return
      }

      const deviceId = response.tags['hardware-id']

      if (!deviceId) {
        logger.warn('Medallion "hardware-id" undefined')
        return
      }

      const selectedProblem = { 'problem-type': this.state.reportProblem, 'other-text': this.state.other }
      const requestReportProblem = this.props.sendReportProblem( selectedProblem, deviceId )

      requestReportProblem.then(() => {
        this.props.router.push('/profile/medallion/report-now')
      }).catch(( error ) => {
        logger.error( error )
      })
    }).catch(( error ) => {
      logger.error( error )
    })
  }

  makeFooter() {
    return(
      <PageFooter onDoneClick={ this.onReportNow } doneButtonText={ i18n.t('report_now') } />
    )
  }
}

function mapStateToProps( state ) {
  return {
    currentUserId: state.session.userId,
  }
}

function mapDispatchToProps( dispatch ) {
  return bindActionCreators({
    fetchReportProblemOptions: fetchReportProblemOptions,
    getDeviceInfo: getDeviceInfo,
    sendReportProblem: sendReportProblem,
  }, dispatch )
}

export default connect( mapStateToProps, mapDispatchToProps )( withRouter( ReportProblem ) )
