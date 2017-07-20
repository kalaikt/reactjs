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

import i18n from 'exm-i18n'

import PageContainer from '../../components/page-container'
import PageHeader from '../../components/page-header'
import PageContent from '../../components/page-content'
import PageFooter from '../../components/page-footer'

import TextLink from '../../components/text-link'
import medallionImage from './../../../../img/medallion3.png'

import _CSS from '../../../../css/profile/_common.sass'
import CSS from '../../../../css/profile/medallion.sass'

class ReportNow extends React.Component {
  constructor (props) {
    super(props);
  }

  static defaultProps = {
    onDismiss: function () {}
  };

  render () {
    return (
      <PageContainer
        header={ this.header() }
        content={ this.content() }
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

  content () {
    return (
      <PageContent>
        <div className={ CSS.centerLayout }>
          <div className={ _CSS.section }>
            <div className={ _CSS.row }>
              <div >
                <img className={ CSS.medallion } src={ medallionImage }/>
              </div>
              <div className={_CSS.sectionHeader}>
                { i18n.t('not_registering_my_location') }
              </div>
              <div>
                { i18n.t('report_now_txt') }
              </div>
            </div>
            <div className={ _CSS.row }>
              <TextLink label={ i18n.t('get_assistance') }/>
            </div>
          </div>
        </div>
      </PageContent>
    );
  }
}

export default ReportNow
