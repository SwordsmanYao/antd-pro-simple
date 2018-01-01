import request from '../utils/request';
import { api } from '../utils/config';

// 菜单树
export async function queryMenu() {
  return request({
    url: `${api}/SysManagement/Menu/tree`,
  });
}

export async function insertMenu(params) {
  return request({
    url: `${api}/SysManagement/Menu/Insert`,
    method: 'POST',
    data: params,
  });
}

export async function updateMenu(params) {
  return request({
    url: `${api}/SysManagement/Menu/Update`,
    method: 'POST',
    data: params,
  });
}

export async function deleteMenu(params) {
  return request({
    url: `${api}/SysManagement/Menu/Delete`,
    method: 'POST',
    data: params,
  });
}

// 列表数据
export async function queryMenuList(params) {
  return request({
    url: `${api}/SysManagement/Menu/List`,
    data: params,
  });
}

export async function queryMenuDetail(params) {
  return request({
    url: `${api}/SysManagement/Menu/Detail`,
    data: params,
  });
}
