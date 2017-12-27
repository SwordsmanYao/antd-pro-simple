import { queryMenu, queryMenuList } from '../services/menu';

export default {
  namespace: 'menu',

  state: {
    // 树结构数据
    treeList: [],
    // 当前选中的树节点id
    selectedKeys: ['-1'],
    // 列表数据
    menuList: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 54, // 总数,由接口提供
    },
    // 控制列表是否显示加载中
    loading: true,
    // 当前正在编辑的节点
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
    *fetchTree(_, { call, put }) {
      const response = yield call(queryMenu);
      console.log('fetchTree', response);
      if (response.Code === 200) {
        yield put({
          type: 'saveTreeList',
          payload: response.Data,
        });
      }
    },
    // 这里还需要根据场景修改 payload
    *fetchMenuList({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const selectedKeys = yield select(state => state.selectedKeys);
      const response = yield call(queryMenuList, {
        ...payload,
        id: selectedKeys,
      });
      if (response.Code === 200) {
        yield put({
          type: 'saveMenuList',
          payload: response.Data,
        });
        // current/pageSize 来自页面
        // total 来自接口返回
        yield put({
          type: 'savePigination',
          payload: {
            ...payload,
            total: response.TotalCount,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 页面的改变保存到 model 的 state 中
    *saveNode({ payload }, { put }) {
      // console.log('test', payload);
      yield put({
        type: 'saveCurrentNode',
        payload,
      });
    },
  },
  reducers: {
    saveTreeList(state, action) {
      return {
        ...state,
        treeList: action.payload,
      };
    },
    saveSelectedKeys(state, action) {
      return {
        ...state,
        selectedKeys: action.payload,
      };
    },
    saveMenuList(state, action) {
      return {
        ...state,
        menuList: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
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
  },

};
