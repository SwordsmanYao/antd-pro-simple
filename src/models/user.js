import { routerRedux } from 'dva/router';
import { login } from '../services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: null, // 当前登录用户的信息
    submitting: false, // 登录是否正在提交
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const response = yield call(login, payload);
      console.log('login', response);
      if (response.Code === 200) {
        const user = response.Data;

        // token 单独存储，每次请求都会更新 token
        localStorage.setItem('token', user.Token);
        delete user.Token;

        // 将用户信息保存到localstorage里面
        localStorage.setItem('currentUser', JSON.stringify(user));

        yield put({
          type: 'saveCurrentUser',
          payload: user,
        });

        yield put({
          type: 'changeSubmitting',
          payload: false,
        });

        yield put(routerRedux.push('/'));
      } else {
        // 设置错误信息

        yield put({
          type: 'changeSubmitting',
          payload: false,
        });
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: null,
      });

      // 清空 localstorage 的 user 信息和 token
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');

      yield put(routerRedux.push('/user/login'));
    },
    *fetchCurrent(_, { put }) {
      // 这里要改为从localstorage里面查询,查询不到跳转登录页
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user !== null) {
        yield put({
          type: 'saveCurrentUser',
          payload: user,
        });
      } else {
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeSubmitting(state, action) {
      return {
        ...state,
        submitting: action.payload,
      };
    },
  },
};
