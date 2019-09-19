import React from 'react';
import styles from './index.css';
import { IntlProvider } from 'react-intl';

const BasicLayout = props => {
  return (
    <IntlProvider locale="en">
      <div className={styles.normal}>
        {props.children}
      </div>
    </IntlProvider>
  );
};

export default BasicLayout;
