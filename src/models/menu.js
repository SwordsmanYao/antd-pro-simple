import { queryMenu } from '../services/menu';

export default {
  namespace: 'menu',

  state: {
    treeList: [],
    selectedKeys: ['-1'],
    currentNode: {
      // 设置初始值
      // name: {
      //   value: '',
      // },
      // path: {
      //   value: '',
      // },
      // icon: {
      //   value: '',
      // },
    },
  },

  effects: {
    // 页面的改变保存到 model 的 state 中
    *saveNode({ payload }, { put }) {
      // console.log('test', payload);
      yield put({
        type: 'saveCurrentNode',
        payload,
      });
    },
    *fetchTree(_, { call, put }) {
      const response = yield call(queryMenu);
      console.log('fetchTree', response);
      yield put({
        type: 'saveTreeList',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentNode(state, action) {
      return {
        ...state,
        currentNode: {
          ...state.currentNode,
          ...action.payload,
        },
      };
    },
    clearCurrentNode(state) {
      return {
        ...state,
        currentNode: {},
      };
    },
    saveSelectedKeys(state, action) {
      return {
        ...state,
        selectedKeys: action.payload,
      };
    },
    saveTreeList(state, action) {
      return {
        ...state,
        treeList: action.payload,
      };
    },
  },
};
