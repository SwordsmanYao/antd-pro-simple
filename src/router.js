import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import cloneDeep from 'lodash/cloneDeep';
import { getPathRouter } from './common/pathRouter';
import { getPlainNode } from './utils/utils';

import styles from './index.less';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function getRouteData(pathRouter, path) {
  if (!pathRouter.some(item => item.layout === path) ||
    !(pathRouter.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = cloneDeep(pathRouter.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
}

function getLayout(pathRouter, path) {
  if (!pathRouter.some(item => item.layout === path) ||
    !(pathRouter.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = pathRouter.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    path: route.path,
  };
}

function RouterConfig({ history, app }) {
  const pathRouter = getPathRouter(app);
  const UserLayout = getLayout(pathRouter, 'UserLayout').component;
  const BasicLayout = getLayout(pathRouter, 'BasicLayout').component;

  const passProps = {
    app,
    getRouteData: (path) => {
      return getRouteData(pathRouter, path);
    },
  };

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => <UserLayout {...props} {...passProps} />} />
          <Route path="/" render={props => <BasicLayout {...props} {...passProps} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
