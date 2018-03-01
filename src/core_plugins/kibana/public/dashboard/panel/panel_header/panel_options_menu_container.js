import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { PanelOptionsMenu } from './panel_options_menu';

import {
  deletePanel,
  destroyEmbeddable,
  maximizePanel,
  minimizePanel,
  resetPanelTitle,
  setPanelTitle,
  setPanelLink,
} from '../../actions';

import {
  getEmbeddable,
  getEmbeddableEditUrl,
  getMaximizedPanelId,
  getPanel,
} from '../../selectors';

const mapStateToProps = ({ dashboard }, { panelId }) => {
  const embeddable = getEmbeddable(dashboard, panelId);
  const panel = getPanel(dashboard, panelId);
  const embeddableTitle = embeddable ? embeddable.title : '';
  const embeddableLink = embeddable ? embeddable.link : '';
  return {
    panelTitle: panel.title === undefined ? embeddableTitle : panel.title,
    panelLink: panel.link === undefined ? embeddableLink : panel.link,
    editUrl: embeddable ? getEmbeddableEditUrl(dashboard, panelId) : null,
    isExpanded: getMaximizedPanelId(dashboard) === panelId,
  };
};

/**
 * @param dispatch {Function}
 * @param embeddableFactory {EmbeddableFactory}
 * @param panelId {string}
 */
const mapDispatchToProps = (dispatch, { embeddableFactory, panelId }) => ({
  onDeletePanel: () => {
    dispatch(deletePanel(panelId));
    dispatch(destroyEmbeddable(panelId, embeddableFactory));
  },
  onMaximizePanel: () => dispatch(maximizePanel(panelId)),
  onMinimizePanel: () => dispatch(minimizePanel()),
  onResetPanelTitle: () => dispatch(resetPanelTitle(panelId)),
  onUpdatePanelTitle: (newTitle) => dispatch(setPanelTitle(newTitle, panelId)),
  onUpdatePanelLink: (newLink) => dispatch(setPanelLink(newLink, panelId)),
});

const mergeProps = (stateProps, dispatchProps) => {
  const { isExpanded, editUrl, panelTitle, panelLink } = stateProps;  
  const { onMaximizePanel, onMinimizePanel, ...dispatchers } = dispatchProps;
  const toggleExpandedPanel = () => isExpanded ? onMinimizePanel() : onMaximizePanel();

  return {
    panelTitle,
    panelLink,
    toggleExpandedPanel,
    isExpanded,
    editUrl,
    ...dispatchers,
  };
};

export const PanelOptionsMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(PanelOptionsMenu);

PanelOptionsMenuContainer.propTypes = {
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
