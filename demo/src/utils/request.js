import { $fetch, ApiError } from '@wish/fe-utils';
export default async function (url, params, config) {
  const { method = 'POST', ...otherConfig } = config || {};
  const prefixUrl = '/api1';
  const response = await $fetch(`${prefixUrl}/${url}`, params, {
    method,
    ...otherConfig,
  });
  // 下面自己取data数据
  const { data, msg, message, code } = response || {};
  if (code === 0) {
    // 若请求成功
    return {
      code,
      message: message || msg,
      data,
    };
  }
  throw new ApiError({
    message: message || msg,
    code,
    data,
  });
}
