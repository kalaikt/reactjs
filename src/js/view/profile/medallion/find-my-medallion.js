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

import i18n from 'exm-i18n'

import PageContainer from '../../components/page-container'
import PageHeader from '../../components/page-header'
import PageContent from '../../components/page-content'
import PageFooter from '../../components/page-footer'

import TextLink from '../../components/text-link'

import _CSS from '../../../../css/profile/_common.sass'
import CSS from '../../../../css/profile/medallion.sass'

class FindMyMedallion extends React.Component {
  constructor (props) {
    super(props);
  }

  static defaultProps = {
    onDismiss: function () {}
  };

  render () {
    return (
      <PageContainer
        header={this.header()}
        content={this.content()}
      />
    );
  }

  header () {
    return (
      <PageHeader icon='arrow-left'
        onBackClick={this.props.onDismiss}
        title={i18n.t('find_my_medallion')} />
    );
  }

  content () {
    return (
      <PageContent>
        <div className={CSS.centerLayout}>
          <div className={_CSS.section}>
            <div className={_CSS.row}>
              <div className={CSS.medallionShipMapImage}>

              </div>

              <div className={_CSS.sectionHeader}>
                {i18n.t('medallions_found')}
              </div>
              <div>
                {i18n.t('medallions_found_txt')}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    );
  }

  footer () {
    return (
      <PageFooter onDoneClick={this.props.onDismiss} />
    );
  }
}

export default FindMyMedallion
