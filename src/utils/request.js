import axios from 'axios';
import { notification } from 'antd';

axios.defaults.headers.common.Authorization = 'mytoken';

function fetch(options) {
  const { url, data, method = 'GET' } = options;

  switch (method.toUpperCase()) {
    case 'POST':
      return axios.post(url, data);
    case 'PUT':
      return axios.put(url, data);
    case 'PATCH':
      return axios.patch(url, data);
    case 'DELETE':
      return axios.delete(url, { data });
    case 'GET':
    default:
      return axios.get(url, {
        params: data,
      });
  }
}

export default function request(options) {
  return fetch(options)
    .then((response) => {
      if (response.status >= 200 && response.status <= 300) {
        const { data } = response;
        if (data.Code === 101) { // 数据校验失败
          // 暂时放在这里处理，后面要放在校验信息显示上
          // 展示 data.Error.ModelState 里面的校验数据
          // data.Error.ModelState[0].key 字段 data.Error.ModelState[0].value 错误描述
          // notification.error({
          //   message: `Code: ${data.Code}, ${response.url}`,
          //   description: data.statusText,
          // });
        } else if (data.Code !== 200 || !data.Status) {
          notification.error({
            message: `Code: ${data.Code}`,
            description: data.Error.Message,
          });
        }
        return data;
      } else if (options && options.method && options.method.toUpperCase() !== 'GET') {
        notification.error({
          message: `请求错误 ${response.status}: ${response.url}`,
          description: response.statusText,
        });
        return null;
      }
    });
}
