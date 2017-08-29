
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import i18n from 'exm-i18n'
import CSS from '../../../css/profile/medallion.sass'
import _CSS from '../../../css/profile/_common.sass'
import BubbleFormCSS from '../../../css/bubble-form.sass'

import TextLink from '../components/text-link'
import Bubble from '../bubble'
import FindMyMedallion from './medallion/find-my-medallion'
import LostMode from './medallion/lost-mode'
import ReportProblem from './medallion/report-problem'
import ReportNow from './medallion/report-now'

const SUB_PAGE_COMPONENTS = {
  'my-medallion': FindMyMedallion,
  'lost-mode': LostMode,
  'report-problem': ReportProblem,
  'report-now': ReportNow,
}

class Medallion extends React.Component {
  constructor() {
    super(...arguments);

    this.onPageDismiss = this.onPageDismiss.bind(this);
    this.onLostMode = this.onLostMode.bind(this);
  }

  static defaultProps = {
    isOpen: false,
    className: '',
    changeExpandedSize: function() {},
    changeDefaultSize: function() {},
  };

  render() {
    const classNames = this.props.className.split(' ').reduce((classNames, className) => {
      return(classNames +=(' ' +(CSS[className] || className)));
    }, `${CSS.medallion} ${(this.props.isOpen ? 'open' : 'closed')} ${(this.props.isMoving && 'moving')}`);

    const filteredProps = Object.assign({}, this.props);

    return(
      <div>
        {this.page()}
        <Bubble {...filteredProps} className={classNames}
          currentStageName={this.props.isOpen ? 'content' : 'title'}
          stages={this.stages()}
        ></Bubble>
      </div>
    );
  }

  stages() {
    return this._stages = { title: this.title(), content: this.content() };
  }

  onPageDismiss() {
    this.setState({ page: '' });
    this.props.router.push('/profile/medallion');
  }

  page() {
    const subPage = this.props.params.subPage
    const Comp = SUB_PAGE_COMPONENTS[subPage]

    if( !Comp ) {
      return null
    }

    return <Comp onDismiss={ this.onPageDismiss }/>
  }

  title() {
    const className =(
     (BubbleFormCSS.smallTitle) + ' title ' +
     (!this.props.isOpen ? 'visible' : 'hidden')
    );
    return [{
      canBeDocked: false,
      jsx: <h4 className={className}>{i18n.t('medallion')}</h4>,
    }];
  }

  content() {
    const className =(
      CSS.content + ' content ' +
     (this.props.isOpen ? 'visible' : 'hidden')
    );

    return [{
      canBeDocked: true,
      jsx:(
          <div className={BubbleFormCSS.headerNoProgress}>
            {i18n.t('medallion')}
          </div>
      )
    },{
      canBeDocked: false,
      jsx:(
        <div className={className}>
          <div className={_CSS.section}>
            <div className={_CSS.row}>
              <div className={CSS.medallionImage}></div>
              <div className={_CSS.summary}>
                <div className={_CSS.bolderDetail}>
                  Adam Leonards</div>
                {this.medallionSerialNumber()}
                {this.medallionActiveStatus()}
              </div>
            </div>
            <div className={_CSS.row}>
              <TextLink label={i18n.t('report_a_problem')} to='/profile/medallion/report-problem'/>
            </div>
          </div>
          <div className={_CSS.section}>
            <div className={_CSS.sectionHeader}>
              {i18n.t('find_my_medallion')}</div>
            <TextLink label={i18n.t('find_now')} to='/profile/medallion/my-medallion'/>
          </div>
          <div className={_CSS.section}>
            <div className={_CSS.row}>
              <div className={_CSS.button} onClick={ this.onLostMode }>
                {i18n.t('lost_mode')}
              </div>
            </div>
          </div>
        </div>
      )
    }];
  }

  onLostMode() {
    this.props.router.push('/profile/medallion/lost-mode')
  }

  medallionSerialNumber() {
    return(
      <div className={_CSS.italicDetail}>
        SN: 1212121212</div>
    );
  }

  medallionActiveStatus() {
    return(
      <div className={CSS.boldDetail}>
        <div className={CSS.activeImage}></div>
        <div>{i18n.t('active')}</div>
      </div>
    );
  }
}

export default withRouter( Medallion );
