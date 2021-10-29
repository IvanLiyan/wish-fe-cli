import axios from 'axios';

/**
 * @description: 请求接口函数
 * @param: url 接口路径
 *        data 入参对象
 *        method 请求方法（不传则默认get）
 *        contentType 默认为json（可传json、urlencoded、multipart或自定义）
 *        prefixUrl 接口域名前缀默认为api1
 *        options 其他参数
 */
export const request = ({
  url,
  data = {},
  method = 'get',
  contentType = 'json', // json || urlencoded || multipart
  prefixUrl = 'api1',
  options = {},
}) => {
  if (!url) {
    const error = new Error('请传入url');
    return Promise.reject(error);
  }
  const fullUrl = `/${prefixUrl}/${url}`;
  const contentTypes = {
    json: 'application/json; charset=utf-8',
    urlencoded: 'application/x-www-form-urlencoded; charset=utf-8',
    multipart: 'multipart/form-data',
  };
  const defaultOptions = {
    withCredentials: true, // 允许把cookie传递到后台
    headers: {
      Accept: 'application/json',
      'Content-Type': contentTypes.json,
    },
    timeout: 15000,
  };

  // 处理各类型Content-Type
  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      'Content-Type': (options.headers && options.headers['Content-Type']) || contentTypes[contentType],
    },
    method,
  };

  if (method === 'get') {
    newOptions.params = data;
  }

  if (method !== 'get' && method !== 'head') {
    newOptions.data = data;
    if (data instanceof FormData) {
      newOptions.headers = {
        'x-requested-with': 'XMLHttpRequest',
        'cache-control': 'no-cache',
      };
    } else if (newOptions.headers['Content-Type'] === contentTypes.urlencoded) {
      newOptions.data = JSON.stringify(data);
    } else {
      Object.keys(data).forEach(item => {
        if (data[item] === null || data[item] === undefined || data[item] === '') {
          delete data[item];
        }
      });
    }
  }

  axios.interceptors.request.use(request => {
    // 移除起始部分 / 所有请求url走相对路径
    request.url = request.url.replace(/^\//, '');
    return request;
  });

  return axios({ url: fullUrl, ...newOptions })
    .then(response => {
      // 状态码为200时
      const { data } = response;
      // 默认正常 data.code === 0
      return Promise.resolve(data);
    })
    .catch(error => {
      // 状态码非200时
      if (error.response) {
        const { data } = error.response;
        const resCode = data.status || data.code;
        const resMsg = data.message || data.msg || data.errMsg || '服务异常';

        // TODO: 后续修改为toast组件提示message.error(resMsg);
        console.log(resMsg);
        const err = { code: resCode, msg: resMsg };
        return Promise.reject(err);
      } else {
        // TODO: 后续修改为toast组件提示message.error('数据请求超时');
        console.log('数据请求超时');
        return Promise.reject('数据请求超时');
      }
    });
};
