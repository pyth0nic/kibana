import React from 'react';
import PropTypes from 'prop-types';


export function PanelLinkIcon({ link }) {
  return (
        <button
          className="kuiMicroButton"
          aria-label="Panel Link"
          data-test-subj="dashboardPanelLinkIcon"
          type="reset" 
          onClick={ () => { location.href=link} }>
        <span
          aria-hidden="true"
          className="kuiIcon fa-link" />
        </button>
  );
}

PanelLinkIcon.propTypes = {
  link: PropTypes.string
};
