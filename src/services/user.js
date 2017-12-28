import request from '../utils/request';
import { api } from '../utils/config';

// 登录
export async function login(params) {
  return request({
    url: `${api}/Login/SignIn`,
    method: 'POST',
    data: params,
  });
}
