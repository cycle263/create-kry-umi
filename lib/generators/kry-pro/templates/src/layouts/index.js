import React from 'react';
import styles from './index.css';
<% if (reactFeatures.includes('locale')) { %>import { IntlProvider } from 'react-intl';<% } -%>

const BasicLayout = props => {
  return (
    <% if (reactFeatures.includes('locale')) { %><IntlProvider locale="en"><% } -%>
      <div className={styles.normal}>
        {props.children}
      </div>
    <% if (reactFeatures.includes('locale')) { %></IntlProvider><% } -%>
  );
};

export default BasicLayout;
