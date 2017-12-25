import request from '../utils/request';
import { api } from '../utils/config';

export async function queryMenu() {
  return request({
    url: `${api}/SysManagement/Menu/treejson`,
  });
}

export async function queryMenuList(params) {
  return request({
    url: `${api}/SysManagement/Menu/list`,
    data: params,
  });
}
