import { request } from '@utils/request';

// get请求带参数
export default {
  getList(data) {
    return request({
      url: 'test-list',
      data,
    });
  },
  getObject(data) {
    return request({
      url: 'test-object',
      data,
      method: 'post',
    });
  },
  // getObject(data) {
  //   return request({
  //     url: 'test-object',
  //     data,
  //     method: 'post',
  //     contentType: 'urlencoded',
  //   });
  // },
};
