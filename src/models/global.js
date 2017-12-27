import { queryMenu } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    menu: [],
  },

  effects: {
    *fetchMenu(_, { call, put }) {
      const data = yield call(queryMenu);
      console.log('fetchMenu', data);
      if (data.Code === 200) {
        yield put({
          type: 'saveMenu',
          payload: data.Data,
        });
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveMenu(state, { payload }) {
      return {
        ...state,
        menu: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
