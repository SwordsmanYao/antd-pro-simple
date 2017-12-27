import request from '../utils/request';
import { api } from '../utils/config';

export async function queryCurrent() {
  return request({
    url: `${api}/api/currentUser`,
  });
}
