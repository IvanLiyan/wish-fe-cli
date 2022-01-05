import { $fetch } from "@wish/fe-utils";

export default async function (url, params, config) {
  const { method = "POST", showToast = false, ...otherConfig } = config || {};
  const response = await $fetch(url, params, { method, ...otherConfig });
  // 下面自己取data数据
  const { data, msg, message, code } = response || {};

  if (code === 0) {
    // 若请求成功
    return data;
  }
  throw new Error({
    message: message || msg,
    code,
    data,
  });
}
