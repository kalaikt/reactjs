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
import ReportProblemActions from '../../../actions/reportProblemActions'

import _CSS from '../../../../css/profile/_common.sass'
import CSS from '../../../../css/profile/medallion/report-a-problem.sass'

class ReportProblem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      other: '',
      reportProblem: '',
      reportProblems:[]
    };
    
    this.onReportNow = this.onReportNow.bind(this);
    this.reportProblemUI = this.reportProblemUI.bind(this);
  }

  static defaultProps = {
    onDismiss: function () {}
  };

  render () {
    return (
      <PageContainer
        header={ this.header() }
        content={ this.content() }
        footer={ this.footer() }
      />
    );
  }

  header () {
    return (
      <PageHeader icon='arrow-left'
        onBackClick={ this.props.onDismiss }
        title={ i18n.t('report_a_problem') }/>
    );
  }

  componentWillMount() {
    this.props.reportProblemActions.fetchReportProblemOptions()
    .then((response) => {
      this.setState( { reportProblems: ( response.problems ? response.problems : [] ) } );
    }).catch(error => {
      logger.warn(error);
    });
  }

  content () {
    return (
      <PageContent>
        <div className={ CSS.centerLayout }>
          <div className={ _CSS.section }>
            <div className={ _CSS.row }>
                { i18n.t('report_a_problem_txt') }
            </div>
            <div className={ _CSS.row + ' ' + CSS.alignLeft }>
              { this.reportProblemUI() }
              <div className={ _CSS.rowSmall }>
                <TextInput
                    label={ i18n.t('specify_other') }
                    value={ this.state.other }
                    onChange={ this.handleReportProblemChange.bind(this, 'other') }
                />
              </div>
            </div>

          </div>
        </div>
      </PageContent>
    );
  }
  reportProblemUI (){
    if(this.state.reportProblems.length){
      return this.state.reportProblems.map( problem => {
        return (
          <div className={ _CSS.rowSmall } key={ problem.id }>
            <RadioButton
              id={ `report-problem-${problem.id}` }
              className={ `circle ${CSS.radioButton}` }
              name='report_problem'
              value={ problem.name }
              onClick={ this.handleReportProblemChange.bind( this, 'reportProblem' ) }
              required />
            <label className={ CSS.label } htmlFor={ `report-problem-${problem.id}` }>
              { problem.name }
            </label>
          </div>
      )});
    }
    return;
  }
  handleReportProblemChange = ( key, { target } ) => {
    this.setState({
      [key]: target.value,
    })
  }

  onReportNow () {
    if (!this.state.reportProblem) {
      logger.warn('Report a problem has not been selected');
      return;
    } else {
      const requestDeviceId = this.props.reportProblemActions.getDeviceInfo();

      requestDeviceId.then( (response) => {
        if(response){
          const device_id = response.tags['hardware-id'];

          if(device_id){
            const data = { 'problem-type': this.state.reportProblem, 'other-text': this.state.other }
            const requestReportProblem = this.props.reportProblemActions.sendReportProblem( data, device_id );

            requestReportProblem.then( () => {
              this.props.router.push('/profile/medallion/report-now');
            }).catch(error => {
              logger.warn(error);
            });
          }
        }
      }).catch(error => {
        logger.warn(error);
      });
    }
  }

  footer () {
    return (
      <PageFooter onDoneClick={ this.onReportNow } doneButtonText={ i18n.t('report_now') } />
    );
  }
}

function mapStateToProps ( state ) {
  return {
    currentUserId: state.session.userId,
  };
}

function mapDispatchToProps ( dispatch ) {
  return {
    reportProblemActions: bindActionCreators( ReportProblemActions, dispatch )
  };
}

export default connect( mapStateToProps, mapDispatchToProps ) ( withRouter( ReportProblem ) )
