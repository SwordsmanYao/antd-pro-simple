import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';


class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  // getPageTitle() {
  //   const { getRouteData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   getRouteData('UserLayout').forEach((item) => {
  //     if (item.path === pathname) {
  //       title = `${item.name} - Ant Design Pro`;
  //     }
  //   });
  //   return title;
  // }
  render() {
    const { getRouteData } = this.props;

    return (
      <DocumentTitle title="登录">
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Ant Design</span>
              </Link>
            </div>
            <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
          </div>
          {
            getRouteData('UserLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
