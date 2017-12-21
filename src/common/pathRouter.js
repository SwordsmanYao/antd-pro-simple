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
            component: dynamicWrapper(app, [], () => import('../routes/SystemManagement/Menu')),
          },
        ],
      },
    ],
  },
];

