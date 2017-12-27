import { query as queryUsers, queryCurrent } from '../services/user';

export default {
  namespace: 'user',

  state: {
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.Code === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.Data,
        });
      }
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
