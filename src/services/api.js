import request from '../utils/request';
import { api } from '../utils/config';


export async function queryRule(params) {
  return request({
    url: `${api}/api/rule`,
    data: params,
  });
}

export async function removeRule(params) {
  return request({
    url: `${api}/api/rule`,
    method: 'POST',
    data: params,
  });
}

export async function addRule(params) {
  return request({
    url: `${api}/api/rule`,
    method: 'POST',
    data: params,
  });
}

// 查询左侧菜单数据
export async function queryMenu() {
  return request({
    url: `${api}/SysManagement/Menu/tree`,
  });
}
