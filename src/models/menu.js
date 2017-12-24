import { queryMenu } from '../services/menu';

export default {
  namespace: 'menu',

  state: {
    treeList: [],
    selectedKeys: ['-1'],
    currentNode: { name: 'ewerwe', path: 'asdfasd', icon: 'dasfasf' },
  },

  effects: {
    // 页面的改变保存到 model 的 state 中
    *saveNode({ payload }, { put }) {
      const node = {};
      Object.keys(payload).forEach((v) => {
        node[v] = payload[v].value;
      });
      yield put({
        type: 'saveCurrentNode',
        payload: node,
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
