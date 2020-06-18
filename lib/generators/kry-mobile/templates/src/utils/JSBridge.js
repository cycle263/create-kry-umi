/**
 * 获取当前用户组织机构
 */
const getOrgInfo = () => {
  const org =
    window.kmobile && window.kmobile.getOrgInfo && window.kmobile.getOrgInfo();
  if (org) {
    try {
      if (typeof org === "object") {
        return org;
      }
      return JSON.parse(org);
    } catch (error) {
      console.error(error);
      return {};
    }
    return {};
  }
};
const generateKey = function() {
  var code = 65;
  var offset = 26;
  return (
    "CB_" +
    "xxxxxxxxxxx".replace(/x/gi, function() {
      return String.fromCharCode(code + Math.floor(Math.random() * offset));
    })
  );
};

/*
 * 关闭页面
 */
const closePage = () => {
  window.kmobile.execAction('{"action":"closeWeb"}'); //关闭页面
};

/*
 * 返回首页
 */
const closeApp = function() {
  try {
    getAppName()
      ? window.kmobile && window.kmobile.closeApp && window.kmobile.closeApp()
      : window.kmobile &&
        window.kmobile.execAction &&
        window.kmobile.execAction('{"action":"closeWeb"}');
  } catch (err) {
    console.log(`${err}`);
  }
};
/**
 * 打开扫码功能
 */
const getOpenScan = (cb: Function) => {
  try {
    const methodKey = generateKey();
    // const methodKey = "CB_TEST";
    window[methodKey] = (res: string) => {
      try {
        console.log(res, "code码，native传的");
        cb(res);
      } catch (err) {
        console.error(`${err}获取方法错误`);
      }
    };
    window.kmobile &&
      window.kmobile.openScan &&
      window.kmobile.openScan(methodKey);
  } catch (err) {
    console.warn(`getOpenScan获取当前的${err}`);
  }
};
/**
 * 获取是否是盘点机
 */
const getAppName = () => {
  try {
    return (
      window.kmobile && window.kmobile.getAppName && window.kmobile.getAppName()
    );
  } catch (err) {
    console.warn(`getAppName获取当前的${err}`);
  }
};
/**
 * 关闭扫码功能
 */
const closeScan = () => {
  try {
    window.kmobile && window.kmobile.closeScan && window.kmobile.closeScan();
  } catch (err) {
    console.warn(`closeScan获取当前的${err}`);
  }
};
/**
 * 获取当前用户的登陆信息
 */
const getUserInfo = () => {
  const user =
    window.keruyun.getCurrentLoginInfo && window.keruyun.getCurrentLoginInfo();
  if (user) {
    try {
      if (typeof user === "object") {
        return user;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error(error);
      return {};
    }
  }
  return {};
};
/**
 * 获取统一鉴权
 */
const authentication = () => {
  console.log(">>>> get auth token");
  const info =
    window.kmobile &&
    window.kmobile.getVerifyingInfo &&
    window.kmobile.getVerifyingInfo();
  if (info) {
    try {
      if (typeof info === "object") {
        return info;
      }
      return JSON.parse(info);
    } catch (error) {
      console.error(error);
      return {};
    }
  }
  return {};
};

export default {
  getOpenScan,
  authentication,
  getOrgInfo,
  getUserInfo,
  closeScan,
  getAppName,
  closePage,
  closeApp
};
export {
  authentication,
  getOrgInfo,
  getUserInfo,
  getOpenScan,
  closeScan,
  closeApp,
  closePage,
  getAppName
};
