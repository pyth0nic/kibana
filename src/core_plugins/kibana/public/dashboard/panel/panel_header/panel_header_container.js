import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PanelHeader } from './panel_header';
import { PanelOptionsMenuContainer } from './panel_options_menu_container';
import { PanelMaximizeIcon } from './panel_maximize_icon';
import { PanelMinimizeIcon } from './panel_minimize_icon';
import { PanelLinkIcon } from './panel_link_icon';
import { DashboardViewMode } from '../../dashboard_view_mode';

import {
  maximizePanel,
  minimizePanel,
} from '../../actions';

import {
  getEmbeddable,
  getPanel,
  getMaximizedPanelId,
  getFullScreenMode,
  getViewMode,
  getHidePanelTitles,
} from '../../selectors';

const mapStateToProps = ({ dashboard }, { panelId }) => {
  const embeddable = getEmbeddable(dashboard, panelId);
  const panel = getPanel(dashboard, panelId);
  const embeddableTitle = embeddable ? embeddable.title : '';
  const embeddableLink = embeddable ? embeddable.link : '';
  return {
    title: panel.title === undefined ? embeddableTitle : panel.title,
    link: panel.link === undefined ? embeddableLink : panel.link,
    isExpanded: getMaximizedPanelId(dashboard) === panelId,
    isViewOnlyMode: getFullScreenMode(dashboard) || getViewMode(dashboard) === DashboardViewMode.VIEW,
    hidePanelTitles: getHidePanelTitles(dashboard),
  };
};

const mapDispatchToProps = (dispatch, { panelId }) => ({
  onMaximizePanel: () => dispatch(maximizePanel(panelId)),
  onMinimizePanel: () => dispatch(minimizePanel()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { isExpanded, isViewOnlyMode, title, link, hidePanelTitles } = stateProps;
  const { onMaximizePanel, onMinimizePanel } = dispatchProps;
  const { panelId, embeddableFactory } = ownProps;
  let actions;
  let nav = link ? <PanelLinkIcon link={link} /> : <div/>;
  if (isViewOnlyMode) {
    actions = (<div>
      {nav}
      {isExpanded ?
      <PanelMinimizeIcon onMinimize={onMinimizePanel} /> :
      <PanelMaximizeIcon onMaximize={onMaximizePanel} />
    }
    </div>);
  } else {
    actions = (
      <div>
      {nav}
      <PanelOptionsMenuContainer
        panelId={panelId}
        embeddableFactory={embeddableFactory}
      />
      </div>
    );
  }

  return {
    title,
    actions,
    isViewOnlyMode,
    hidePanelTitles,
  };
};

export const PanelHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(PanelHeader);

PanelHeaderContainer.propTypes = {
  panelId: PropTypes.string.isRequired,
  /**
   * @type {EmbeddableFactory}
   */
  embeddableFactory: PropTypes.shape({
    destroy: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    addDestroyEmeddable: PropTypes.func.isRequired,
  }).isRequired,
};
