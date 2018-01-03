import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { imgMap,convertResponseData } from './mock/utils';
import { delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'POST /Login/SignIn': convertResponseData({
    Logo: '',
    Token: '279600085CE0799E5905FE156A52315ECEDEC7B3C59228DC70E5C1EC07E4D31698748F9EEA93AF56CB4F876BC91DA0293620E66A2E76DE816709E07BCF0CC048C41758A487A3ECFF4933E9A1890D2E2B3F9CBFA5A2CC35DDA25B433EDD95AF67BE69A261121A95440727852837739A11',
    UserName: '超级管理员',
  }),
  'GET /api/rule': getRule,
  'POST /api/rule': convertResponseData({
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  }),
  'GET /SysManagement/Menu/tree': convertResponseData([
    {
      id: 245345,
      name: '系统管理',
      icon: 'dashboard',
      path: 'system-management',
      children: [
        {
          id: 131245,
          name: '菜单管理',
          path: 'menu',
        },
        {
          id: 25345,
          name: 'Form',
          path: 'menuForm',
        }
      ],
    },
    {
      id: 234234,
      name: 'Dashboard',
      icon: 'dashboard',
      path: 'table-list',
    },
  ]),
  'GET /SysManagement/Menu/list': convertResponseData([
    {
      id: 234234,
      name: 'Dashboard',
      icon: 'dashboard',
      path: 'table-list',
    },
    {
      id: 143345,
      name: '系统管理',
      icon: 'dashboard',
      path: 'system-management',
    },
    {
      id: 23445,
      name: '系统管理',
      icon: 'dashboard',
      path: 'system-management',
    },
    {
      id: 24356,
      name: '系统管理',
      icon: 'dashboard',
      path: 'system-management',
    },
  ],),
  // mockjs 使用
  // 'GET /api/tags': mockjs.mock({
  //   'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  // }),
};

export default noProxy ? {} : delay(proxy, 1000);
