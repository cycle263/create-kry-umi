import { extend, RequestOptionsInit, ResponseError } from "umi-request";
import { Toast } from "antd-mobile";
import { authentication, getOrgInfo } from './JSBridge';

export class ErResponseError extends Error {
  data: Object;
  response: any;
  request?: any;
  constructor(response: any, text: string, data: Object, request?: Object) {
    super(text || response.statusText);
    this.name = "ResponseError";
    this.data = data;
    this.response = response;
    this.request = request;
  }
}

const authInfo = authentication();
const orgInfo = getOrgInfo();

const kryHeaders = {
  "KryToken": authInfo.krytoken,
  "kry-api-brand-id": orgInfo["brandIdenty"],
  "kry_version_code": authInfo["kry_version_code"],
  "kry-api-timestamp": authInfo["kry_api_timestamp"],
  "kry-api-sign": authInfo["kry_api_sign"],
  "kry-api-shop-id": orgInfo["shopIdenty"],
  "kry-api-device-id": orgInfo["terminalNo"],
};

const HTTP_CODE_MESSAGE: any = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};
// 解决未知异常的重复提示问题
let hasTip = false;
const unknowErrorMsg = "网络请求失败，请稍后再试！";
const isLocal = window.location.hostname === "localhost" || window.location.hostname === '127.0.0.1';

//Global Default Params
const DEFAULT_PARAMS = {
  // brandId: "",
};
//Response Body Code
const RESPONSE_BODY_CODE = {
  success: [0, 1000], // 成功
  unauthorized: [1002, 403], //未授权
  redirect: [401, 1001, 203], //重定向
};
//Response Body Object necessary Key
const RESPONSE_BODY_NECESSARY_KEYS = ["code"];
//请求 设置
export interface RequestSetType {
  mock?: boolean; //是否走mock数据
  isPontAPI?: boolean;  // 是否为pont元数据API
  closeErrorMessageTips?: boolean; //关闭异常自动提示
  [propName: string]: any;
}

//errorHandler
const errorHandler = (error: ResponseError) => {
  if (error.message === "Unexpected end of JSON input") {
    //当response为空
    error.message = "接口Response为空";
  } else if (error.message.match(/Unexpected token (.)+ in JSON at position/)) {
    //当response不为json格式
    error.message = "接口Response数据不为JSON格式";
  } else if (error.message.indexOf("timeout of") > -1) {
    //网络请求超时
    error.message = "网络请求超时，请稍后再试！";
  } else if (error.message.indexOf("Failed to fetch") > -1) {
    //网络请求失败
    error.message = unknowErrorMsg;
  } else if (error.message.indexOf("NetworkError when attempting to fetch resource.") > -1) {
    //FireFox浏览器下，接口需要登录时会刷新页面重新加载，此时正在请求的接口容易抛出此信息，此类错误信息不做提示
    return;
  } else {
    // tslint:disable-next-line: no-console
    console.log(error.message);
  }
  throw error;
};

//创建实例
const request = extend({
  credentials: "include", // 默认请求是否带上cookie
  mode: "cors",
  // timeout: 20000,
  errorHandler, //统一错误处理
});

const handleUrl = (url: string, requestSet?: RequestSetType) => {
  if (
    (__DEV__ && __MOCK__) ||
    (__DEV__ && requestSet && requestSet.mock && isLocal) ||
    url.match(/(http(s)?:)?\/\//)
  ) {
    return url;
  } else {
    return `${__HOST_API__}${url.indexOf('/') === 0 ? url.substr(1) : url}`;
  }
};

//send
const send = (method: string, url: string, params: any, requestSet?: RequestSetType) => {
  return new Promise((resolve: Function, reject: Function) => {
    const data = {
      method,
    };
    //通过method判断使用params还是data
    if (method.toLocaleLowerCase() === "get") {
      data["params"] = params;
    } else {
      data["data"] = params;
    }
    //设置headers
    if (requestSet && requestSet.headers) {
      data["headers"] = requestSet.headers;
    }
    request(handleUrl(url, requestSet), {
      prefix: requestSet && requestSet.isPontAPI && isLocal ? '/pontApi' : '',
      headers: {
        ...kryHeaders,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
      ...data,
    })
      .then((res: any) => {
        resolve && resolve(res);
      })
      .catch((error: any) => {
        if (!(requestSet && requestSet.closeErrorMessageTips)) {
          const isUnknow = error.message === unknowErrorMsg;
          // 服务器重启或者崩溃，提示多次未知异常，限制3秒内提示一次
          if (isUnknow) {
            if (!hasTip) {
              Toast.fail(error.message);
              hasTip = true;
              setTimeout(() => {
                hasTip = false;
              }, 3000);
            }
          } else {
            Toast.fail(error.message);
          }
        }
        reject &&
          reject({
            message: error.message,
            data: error.data || {},
            response: error.response || {},
          });
      });
  });
};

//GET
const get = (url: string, params: any, requestSet?: RequestSetType) => {
  return send("get", url, params, requestSet);
};

//POST
const post = (url: string, params: any, requestSet?: RequestSetType) => {
  return send("post", url, params, requestSet);
};

// Form
const postForm = (url: string, params: any, requestSet?: RequestSetType) => {
  const formData = new FormData();
  if (params) {
    Object.keys(params).forEach((key: any) => {
      formData.append(key, params[key]);
    });
  }
  return send("post", url, formData, {
    // 上传文件不能传content-type,
    headers: {},
    ...requestSet,
  });
};

//请求数据格式化
const formatRequestData = (data: any = {}) => {
  let result = { ...data };
  //兼容current,pageSize 和page,rows
  if (result && result.current && !result.page) {
    //有current 无page
    result.page = result.current;
  }
  if (result && result.page && !result.current) {
    //有page 无current
    result.current = result.page;
  }
  if (result && result.pageSize && !result.rows) {
    //有pageSize 无rows
    result.rows = result.pageSize;
  }
  if (result && result.rows && !result.pageSize) {
    //有rows 无pageSize
    result.pageSize = result.rows;
  }

  return result;
};

//Request Interceptor
request.interceptors.request.use((url: string, options: RequestOptionsInit) => {
  const method = options.method;
  //增加默认请求参数
  if (method === "get") {
    options.params = formatRequestData({ ...DEFAULT_PARAMS, ...(options.params || {}) });
  } else if (method === "post") {
    if (options.data instanceof Array || options.data instanceof FormData) {
      //如果post数据直接使用的Array或者FormData 则不处理
    } else {
      options.data = formatRequestData({ ...DEFAULT_PARAMS, ...(options.data || {}) });
    }
  }
  return {
    url,
    options,
  };
});

//Response Interceptor
const handleResponse = async (response: Response, options: RequestOptionsInit) => {
  const { status, statusText } = response;
  const data = await response.clone().json();
  const code = (data && data.code !== undefined) ? data.code : -1;

  switch (true) {
    case status >= 200 && status < 300 && RESPONSE_BODY_CODE.success.includes(code):
      break;
    case status >= 200 && status < 300 && RESPONSE_BODY_CODE.redirect.includes(code):
      window.location.href = data.data; //Todo 若是内部页面，则应该使用内部路由跳转
      break;
    case status >= 200 && status < 300 && RESPONSE_BODY_CODE.unauthorized.includes(code):
      window.location.href = "/#/unauthorized"; //Todo 若是内部页面，则应该使用内部路由跳转
      break;
    case status >= 200 && status < 300 && !checkReponseBody(data):
      throw new ErResponseError(response, "接口Response数据结构异常", data, request);
    case status < 200 || status >= 300:
      throw new ErResponseError(
        response,
        HTTP_CODE_MESSAGE[status] || statusText || unknowErrorMsg,
        data,
        request,
      );
    default:
      throw new ErResponseError(
        response,
        data.message || statusText || unknowErrorMsg,
        data,
        request,
      );
  }
  return response;
};
request.interceptors.response.use(handleResponse);

//验证接口返回的数据结构
const checkReponseBody = (data: any) => {
  let result = true;
  for (let i = 0; i < RESPONSE_BODY_NECESSARY_KEYS.length; i++) {
    if (data[RESPONSE_BODY_NECESSARY_KEYS[i]] === undefined) {
      result = false;
      break;
    }
  }
  return result;
};

//Update Options Todo 最新版才有此功能
// export const updateOptions = (opt: RequestOptionsInit): void => {
//   request.extendOptions(opt);
// };

export default {
  get,
  post,
  postForm,
};
