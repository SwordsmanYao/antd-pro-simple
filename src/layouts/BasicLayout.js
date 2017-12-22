import React from 'react';
import DocumentTitle from 'react-document-title';

import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin } from 'antd';

import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';

import moment from 'moment';
import groupBy from 'lodash/groupBy';
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
      type: 'global/fetchMenu',
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout);
  }

  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
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
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

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
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  render() {
    // 这个是由接口返回
    // const navData = [
    //   {
    //     name: 'Dashboard',
    //     icon: 'dashboard',
    //     path: 'table-list',
    //   },
    //   {
    //     name: '系统管理',
    //     icon: 'dashboard',
    //     path: 'system-management',
    //     children: [
    //       {
    //         name: '菜单管理',
    //         path: 'menu',
    //       },
    //     ],
    //   },
    // ];
    const {
      currentUser, collapsed, fetchingNotices, getRouteData, location, dispatch, navData,
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();

    const layout = (
      <Layout>
        <SiderMenu
          collapsed={collapsed}
          navData={navData}
          location={location}
          dispatch={dispatch}
        />
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
              <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              />
              <NoticeIcon
                className={styles.action}
                count={currentUser.notifyCount}
                onItemClick={(item, tabProps) => {
                  console.log(item, tabProps); // eslint-disable-line
                }}
                onClear={this.handleNoticeClear}
                onPopupVisibleChange={this.handleNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
              >
                <NoticeIcon.Tab
                  list={noticeData['通知']}
                  title="通知"
                  emptyText="你已查看所有通知"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['消息']}
                  title="消息"
                  emptyText="您已读完所有消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['待办']}
                  title="待办"
                  emptyText="你已完成所有待办"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                />
              </NoticeIcon>
              {currentUser.name ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                    {currentUser.name}
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
              <Redirect exact from="/" to="/table-list" />
            </Switch>
            <GlobalFooter
              // links={[{
              //   title: 'Pro 首页',
              //   href: 'http://pro.ant.design',
              //   blankTarget: true,
              // }, {
              //   title: 'GitHub',
              //   href: 'https://github.com/ant-design/ant-design-pro',
              //   blankTarget: true,
              // }, {
              //   title: 'Ant Design',
              //   href: 'http://ant.design',
              //   blankTarget: true,
              // }]}
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
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  navData: state.global.menu,
}))(BasicLayout);
