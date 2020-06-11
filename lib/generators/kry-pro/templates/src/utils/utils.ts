import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const steamroller = (arr: Array<Object> = []) =>
  Array.isArray(arr)
    ? arr.map((item: any) => {
        const temp = { ...item };
        if (item.children && item.children.length) {
          temp.children = steamroller(item.children || []);
        }
        return {
          key: temp.key,
          title: temp.value,
          value: temp.key,
          children: temp.children,
        };
      })
    : [];

interface formatAmountNumberSetType {
  fillZero?: boolean; //是否补齐后面的0
}
export const toFixed = (
  n: string | number,
  length: number = 2,
  fillZero: boolean = false,
): string => {
  const formatN = isNaN(parseFloat(String(n))) ? 0 : parseFloat(String(n));
  const pow = Math.pow(10, length);
  if (fillZero) {
    return (Math.round(formatN * pow) / pow).toFixed(length);
  } else {
    return String(Math.round(formatN * pow) / pow);
  }
};
export const formatAmountNumber = (
  n: string | number = 0,
  length: number = 5,
  set: formatAmountNumberSetType = {},
): string => {
  let str = toFixed(n, length);
  //Todo: 直接通过正则表达式去区分是否含有小数点,火狐浏览器不支持断言

  // if (str.match(/\./)) {
  //   return str.replace(/(?<=\d{1,3})(?=(\d{3})+\.\d+$)/g, ",");
  // } else {
  //   return str.replace(/(?<=\d{1,3})(?=(\d{3})+$)/g, ",");
  // }
  return str;
};

/**
 * 对象数组根据某属性来进行去重
 * @param arr
 * @param attr
 */
export const arrayUnique = (arr: Array<any>, attr: string) => {
  const hash = {};
  return arr.reduce((item, next) => {
    // eslint-disable-next-line no-unused-expressions
    hash[next[attr]] ? "" : (hash[next[attr]] = true && item.push(next));
    return item;
  }, []);
};

/**
 * 递归转换
 * @param param0
 */
export const mapDeep = ({ map = {}, target = {}, childrenKey = "children" }) => {
  Object.keys(map).forEach(key => {
    const val = map[key];
    if (typeof val === "function") {
      val(target[key], target);
    } else {
      // eslint-disable-next-line
      target[val] = target[key];
    }
  });
  if (target[childrenKey]) {
    target[childrenKey].forEach((item: any) => mapDeep({ map, target: item, childrenKey }));
  }
  return target;
};

export const toRound = (numb: any) => {
  const num = parseFloat(numb) * 100000;
  return Math.round(num) / 100000;
};
/** 字符串是否为空 */
export const isEmptyString = (str: any) => str === null || str === undefined || str === "";

/**
 * 验证浮动数
 * @param {} number
 */
export const decimalFormat = ({ value = 0, leftLen = 0, rightLen = 0 }: any) => {
  // eslint-disable-next-line no-useless-escape
  const isNegative = !!String(value).match(/^\-/); //判断是否是负数
  const reg = /[^\d\.]/g;
  let temp = value.toString().replace(reg, "");
  const index = temp.indexOf(".");
  if (index === 0) {
    temp = temp.length > 1 ? temp.substring(1) : "0.";
  } else if (index > 0) {
    const nextIndex = temp.replace(".", "").indexOf(".");
    if (nextIndex > 0) {
      const firstStr = temp.substring(0, index + 1);
      const nextStr = temp.substring(index + 1);
      temp = firstStr + nextStr.replace(/[.]/g, "");
    }
  }

  const indexZero1 = temp.indexOf("0");
  const tempLen = temp.length;
  if (indexZero1 === 0 && tempLen >= 2) {
    const firstNum = temp.substring(0, 1);
    const nextNum = temp.substring(1, 2);
    if (firstNum === nextNum) temp = "0.";
    else if (nextNum !== ".") temp = temp.substring(1);
  }

  const tempCache = temp.split(".");
  if (tempCache.length === 2) {
    temp = `${tempCache[0].substring(0, leftLen)}.`; // 左侧验证
    temp += tempCache[1].substring(0, rightLen); // 右侧验证
  } else {
    temp = tempCache[0].substring(0, leftLen); // 左侧验证
  }
  return isNegative ? "-" + temp : temp;
};
export const getTitle = (type: string, title: string) => {
  const prefix =
    type === "add"
      ? "新增"
      : type === "edit"
      ? "编辑"
      : type === "copy"
      ? "拷贝"
      : type === "view"
      ? "查看"
      : "";
  return `${prefix}${title}`;
};
/**
 * 格式化TreeData
 * @param arr
 */
export const transformTreeData = (arr: Array<any>) => {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => {
    const result = { ...item };
    result.value = item.key;
    result.title = item.value;
    const temp = transformTreeData(item.children);
    result.children = temp;
    return result;
  });
};

/**
 * 生成UUID
 * @param len
 * @param radix
 */
export const genUuid = (len: number, radix?: number | undefined) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i += 1) {
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (i = 0; i < 36; i += 1) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};

// 服务端需要用 asc 和 des 排序，若传进来的orderType是完整的ascend或者descend，需要处理成asc 或 des
export function toOmittedOrderType(orderType: string) {
  const newOrderType = orderType.slice(0, -3);
  return newOrderType;
}
// antd需要用ascend或者descend排序，同理，若传进来的orderType是完整的asc或者desc，需要处理成完整的ascend或者descend
export function toCompletedOrderType(orderType: string) {
  return `${orderType}end`;
}

export function getImgUrl(url: string, width: number, height: number) {
  return `${url}?x-oss-process=image/resize,m_fixed,h_${height},w_${width}`;
}

//科学计数法转换成整成的小数
export function toNonExponential(num: number) {
  const m: any = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return m ? num.toFixed(Math.max(0, (m[1] || "").length - m[2])) : num;
}

export interface printLabelProps {
  skuName: string;
  requirerName: string;  // 收货机构
  receiveName: string;  // 收货人
};

/**
 * 提交打印表单
 * @obj 必填 数据来意
 * @ip 打印机IP地址
 * @charset 字符集编码
 */
export const submitPrintForm = (obj: printLabelProps, ip?: string, charset?: string) => {
  let printIp = ip || window.localStorage.getItem('SUPPLY_SCM2_SIGN_PRINT_LABEL_IP');
  let size = window.localStorage.getItem('SUPPLY_SCM2_SIGN_PRINT_LABEL_SIZE') || '70 50';
  let sizeArr = size.split(' ');
  if (!printIp) {
    console.error('请配置打印机IP地址！');
    return;
  }
  let temp = `TEXT 30,120,"TSS24.BF2",0,1,2,"名称：${obj.skuName}"`, skuStr1, skuStr2;
  if (obj.skuName && obj.skuName.length > 16) {
    skuStr1 = obj.skuName.substr(0, 16);
    skuStr2 = obj.skuName.substr(16);
    temp = `TEXT 30,120,"TSS24.BF2",0,1,2,"名称：${skuStr1 || ''}"
    TEXT 30,175,"TSS24.BF2",0,1,2,"${skuStr2 || ''}"`;
  }
  const str = `SIZE ${sizeArr[0] || 70} mm, ${sizeArr[1] || 50} mm
    SPEED 5
    DENSITY 7
    DIRECTION 1
    REFERENCE 0,0
    OFFSET 0 mm
    SHIFT 0
    CLS
    TEXT 30,30,"TSS24.BF2",0,1,2,"${obj.requirerName || ''}"
    BAR 30,86,480,2
    ${temp || ''}
    TEXT 30,${skuStr1 ? 230 : 180},"TSS24.BF2",0,1,2,"收货人：${obj.receiveName || ''}"
    PRINT 1
    `;
  const iframeName = 'print_labels_iframe';
  const form = document.createElement('form');
  form.method = 'get';
  form.style.display = 'none';
  form.target = iframeName;
  form.acceptCharset = charset || 'GBK';
  const content = document.createElement('textarea');
  content.name = 'content';
  content.innerHTML = str;
  form.appendChild(content);
  const send = document.createElement('input');
  send.type = 'hidden';
  send.name = 'Send';
  send.value = ' Print Test ';
  form.appendChild(send);
  form.action = `http://${printIp}/prt_test.htm`;
  document.body.appendChild(form);
  form.submit();
  // tslint:disable-next-line: no-console
  console.log('Print label: ', obj.requirerName);
  // 删除临时节点
  // form.parentNode && form.parentNode.removeChild(form);
}

/**
 * cnzz页面埋点方法
 */
export function cnzzPageViewTrace() {
  const { pathname, hash } = window.location;
  const contentUrl = (pathname === '/' ? '/scm-ui-delivery/' : pathname) + hash.split('?')[0];
  const refererUrl = '/';
  // tslint:disable-next-line: no-console
  console.log('page view trace info: ', contentUrl);
  // 将该页面的自动PV统计关闭，防止页面的流量被统计双倍
  if (window['_czc']) {
    window['_czc'].push(["_setAutoPageview", false]);
    window['_czc'].push(['_trackPageview', contentUrl, refererUrl]);
  }
};

/**
 * cnzz事件埋点方法
 * @action 事件动作 （必填）
 * @other 其他参数：brandId、userId等 （非必填）
 */
export function cnzzEventTrace(action: string = '', ...other: any) {
  const { pathname, hash } = window.location;
  const contentUrl = (pathname === '/' ? '/scm-ui-delivery/' : pathname) + hash.split('?')[0];
  // tslint:disable-next-line: no-console
  console.log('event trace info: ', contentUrl, action);
  if (window['_czc']) {
    window['_czc'].push(["_trackEvent", contentUrl, action, `${other.join('_')}`]);
  }
}
