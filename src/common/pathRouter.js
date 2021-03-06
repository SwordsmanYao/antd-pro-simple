import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

export const getPathRouter = app => [
  {
    component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    path: '/',
    children: [
      {
        path: 'table-list',
        component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
      },
      {
        path: 'system-management',
        children: [
          {
            path: 'menu',
            component: dynamicWrapper(app, ['menu'], () => import('../routes/SystemManagement/Menu')),
          },
          {
            path: 'menuForm',
            component: dynamicWrapper(app, ['menu'], () => import('../routes/SystemManagement/Menu/form')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    layout: 'UserLayout',
    path: '/user',
    children: [
      {
        path: 'user',
        children: [
          {
            path: 'login',
            component: dynamicWrapper(app, ['user'], () => import('../routes/User/Login')),
          },
        ],
      },
    ],
  },
];

