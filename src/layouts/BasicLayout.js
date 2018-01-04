import React from 'react';
import DocumentTitle from 'react-document-title';

import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { Layout, Menu, Icon, Avatar, Dropdown, Spin } from 'antd';

import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';

import classNames from 'classnames';
import { ContainerQuery } from 'react-container-query';

import SiderMenu from '../components/SiderMenu';
import styles from './BasicLayout.less';

const { Header, Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class BasicLayout extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
    // this.props.dispatch({
    //   type: 'global/fetchMenu',
    // });
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout);
  }

  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'user/logout',
      });
    }
  }

  // getPageTitle() {
  //   const { location, getRouteData } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   getRouteData('BasicLayout').forEach((item) => {
  //     if (item.path === pathname) {
  //       title = `${item.name} - Ant Design Pro`;
  //     }
  //   });
  //   return title;
  // }

  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.resizeTimeout = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 600);
  }

  render() {
    const {
      currentUser, collapsed, getRouteData, location, dispatch, navData,
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    console.log('location', location);
    const layout = (
      <Layout>
        {
          // 只有匹配到非根路径才渲染菜单，为了保证默认的 openKeys 值正确
          navData && navData.length > 0 && location.pathname !== '/' &&
          <SiderMenu
            collapsed={collapsed}
            navData={navData}
            location={location}
            dispatch={dispatch}
          />
        }

        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
              {currentUser && currentUser.UserName ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.Logo} />
                    {currentUser.UserName}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {
                getRouteData('BasicLayout').map(item =>
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
              <Redirect exact from="/" to="/system-management/menu" />
            </Switch>
            <GlobalFooter
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2017 蚂蚁金服体验技术部出品
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title="test">
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  navData: state.global.menu,
}))(BasicLayout);
