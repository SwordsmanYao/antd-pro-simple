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
      if (response.status === 200) {
        return response.data;
      } else if (options && options.method && options.method.toUpperCase() !== 'GET') {
        notification.error({
          message: `请求错误 ${response.status}: ${response.url}`,
          description: response.statusText,
        });
        return null;
      }
    });
}
