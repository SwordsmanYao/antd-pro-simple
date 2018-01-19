import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';

import styles from './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.menus = props.navData;
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  getDefaultCollapsedSubMenus(props) {
    console.log('getDefaultCollapsedSubMenus', props);
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }

  // 获得当前path的数组 eg： pathname:"/system-management/menu" ==> ["system-management", "menu"]
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    console.log(keys);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].path];
    }
    return keys;
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link
                to={{
                  pathname: itemPath,
                  search: `?menuID=${item.id}`,
                }}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }
  handleOpenChange = (openKeys) => {
    console.log('openkeys', openKeys);
    const lastOpenKey = openKeys[openKeys.length - 1];
    // 判断最后展开的是否是第一级菜单
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }
  render() {
    const { collapsed } = this.props;

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={this.onCollapse}
        width={256}
        className={styles.sider}
      >
        <div className={styles.logo}>
          <Link to="/">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/iwWyPinUoseUxIAeElSx.svg" alt="logo" />
            <h1>Ant Design Pro</h1>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={this.getCurrentMenuSelectedKeys()}
          style={{ margin: '16px 0', width: '100%' }}
          onSelect={({ item, key, selectedKeys }) => {
            console.log('onSelect', item, key, selectedKeys);
          }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}
