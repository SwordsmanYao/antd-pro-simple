import { queryMenu, queryMenuList, insertMenu, deleteMenu, queryMenuDetail, updateMenu } from '../services/menu';

export default {
  namespace: 'menu',

  state: {
    // 树结构数据
    treeList: [],
    // 当前选中的树节点id
    selectedKeys: ['0'],
    // 列表数据
    menuList: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 20, // 总数,由接口提供
    },
    // 控制列表是否显示加载中
    loading: false,
    // 当前正在编辑的节点
    currentNode: {
      // 属性为对象，包涵错误信息等
      // Name: {
      //   value: 'test',
      // },
    },
    // currentNode 的默认值，用于 clear 时的数据
    defaultNode: {
      IsDisplayed: {
        value: 1,
      },
    },
  },

  effects: {
    *commitMenu({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      console.log('commitMenu', payload);
      let response = null;
      // 当有 id 时为编辑，否则为新建
      if (payload.UniqueID) {
        response = yield call(updateMenu, payload);
      } else {
        response = yield call(insertMenu, payload);
      }

      if (response.Code === 200) {
        console.log('insertMenu', response);
        yield put({
          type: 'fetchMenuList',
          payload: {
            ParentID: payload.ParentID,
          },
        });
        yield put({
          type: 'fetchTree',
        });
      }
      yield put({
        type: 'changeLoading',
        payload: true,
      });
    },
    *deleteMenu({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deleteMenu, payload);
      console.log('deleteMenu', response);
      if (response.Code === 200) {
        // console.log('deleteMenu', response);
        yield put({
          type: 'fetchMenuList',
          payload: {
            ParentID: payload.ParentID,
          },
        });
        yield put({
          type: 'fetchTree',
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchMenuDetail({ payload }, { call, put }) {
      yield put({
        type: 'clearCurrentNode',
      });
      const response = yield call(queryMenuDetail, payload);
      console.log('queryMenuDetail', response);
      if (response.Code === 200) {
        const data = {};
        // 将数据格式化，以适应组件
        const keys = Object.keys(response.Data);
        keys.forEach((item) => {
          data[item] = { value: response.Data[item] };
        });
        yield put({
          type: 'saveCurrentNode',
          payload: data,
        });
      }
    },
    // 查询树的数据
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
    *fetchMenuList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(queryMenuList, {
        ...payload,
      });
      console.log('fetchMenuList', response);
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
        currentNode: state.defaultNode,
      };
    },
  },

};
