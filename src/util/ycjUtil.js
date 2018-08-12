import format from './format';
import logger from './logger';
import storage from '../plugins/base/storage';

let indexCodes = null;

/**
 * 判断是否是指数代码
 * @param code - 股票代码
 * @returns {boolean} - 返回true / false
 */
const isIndex = (code) => {
  let result = false;
  if (!indexCodes) {
    indexCodes = storage.application.read('indexs');
  }
  if (!indexCodes) {
    return false;
  }
  const indexCodesLength = indexCodes.length;
  for (let i = 0; i < indexCodesLength; i += 1) {
    const itemCode = indexCodes[i][0];
    if (itemCode === code) {
      result = true;
      break;
    }
  }
  return result;
};

/**
 * 判断是否是交易时间 只针对行情
 * @return {boolean}
 */
const isOpening = () => {
  const week = new Date().getDay();
  const now = format.date(new Date(), 'hh:mm:ss');

  const isInDeal = (now > '09:29:59' && now < '11:30:01') ||
    (now > '13:00:00' && now < '15:00:01');

  return week !== 0 && week !== 6 && isInDeal;
};

/**
 * 判断是否是收盘
 * @return {boolean}
 */
const isEnd = () => {
  const week = new Date().getDay();
  const now = format.date(new Date(), 'hh:mm:ss');

  const isInDeal = now > '15:00:00';

  return week === 0 || week === 6 || isInDeal;
};

/**
 * 检查股票代码是否合法 (foxxcode 格式)
 * @return {boolean}
 */
const checkCode = code => /\.(SZ|SH)/.test(code);

/**
 * 普通股票格式化成 foxxcode
 * @param code - 股票代码
 * @return {String} - 添加后缀(.sh/.sz)的foxxcode
 */
const formatCode = (code) => {
  const reg = /^\d{6}$/;
  let result = typeof code === 'string' ? code.trim() : code.toString();
  if (reg.test(result)) {
    if (result.charAt(0) === '6') {
      if (result === '699001') {
        result = '000001';
      }
      result = `${result}.SH`;
    } else {
      result = `${result}.SZ`;
    }
  }
  return result;
};

/**
 * foxxcode化成 普通股票格式
 * @param code - 股票代码
 * @return {String} - 去掉后缀的股票代码code
 */
const foxxCodeToCode = (code) => {
  const reg = /\d{6}/g;
  if (reg.test(code)) {
    return code.substr(0, 6);
  }
  return false;
};

const isToday = (date) => {
  if (!(date instanceof Date)) {
    logger.error('参数错误');
  }
};

/**
 * 判断股票是否是上海股票
 * @param code - 股票代码
 * @return {Boolean}
 */
const isSHSTK = (code) => {
  const isFoxxcodeReg = /\.\w{2}/;
  const isSHReg = /\.SH/;
  if (!isFoxxcodeReg.test(code)) {
    throw new Error(`${code} is not a foxxcode`);
  }
  return isFoxxcodeReg.test(code) && isSHReg.test(code);
};

/**
 * 对数值进行某些处理
 * @param value - 要处理的数值
 * @param fn - 处理数值的函数
 * @returns {*} - 处理后的数值，将0.00转换为'-'，其他数值按fn处理
 */
const detailInDelist = (value, fn) => {
  if (parseFloat(value).toFixed(2) === '0.00') {
    return '-';
  } else if (typeof fn === 'function') {
    return fn(value);
  }
  return value;
};

export default {
  isIndex,
  isOpening,
  checkCode,
  formatCode,
  foxxCodeToCode,
  isSHSTK,
  isToday,
  isEnd,
  detailInDelist,
};
