import baseUtil from './baseUtil';

const format = {};
/**
 * 时间格式化
 * @param date - 时间戳
 * @param dateFormat - 时间格式
 * @returns {*} - 格式化时间
 */
format.date = (date, dateFormat) => {
  if (!(date instanceof Date)) {
    return null;
  }
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  let fmt = dateFormat;

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  baseUtil.each(o, (v, k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (RegExp.$1.length === 1) ? (o[k]) : ((`00${v}`).substr(v.toString().length)));
    }
  });
  return fmt;
};
/**
 * 数字格式化
 * @param num - 需格式化数字
 * @param lan - 中英文后缀，en=[k,m,g],cn=[万，亿]
 * @param decimal - 小数位数
 * @returns {*} - 格式化后数字
 */
format.num = (num, lan, decimal) => {
  const numStr = parseInt(Math.abs(parseFloat(num)), 10).toString();
  const numLength = numStr.length;
  let unit;
  let result;
  let fixed = 1;
  let i = 0;
  if (lan === 'en') {
    unit = ['k', 'm', 'g'];
  } else if (lan === 'cn') {
    unit = ['万', '亿'];
  }
  if (num === '-') {
    return num;
  }
  if (decimal) {
    for (i; i < decimal; i += 1) {
      fixed *= 10;
    }
  }
  if (numLength >= 5 && numLength < 9) {
    result = ((Math.round((num * fixed) / 10000)) / fixed) + unit[0];
  } else if (numLength > 8) {
    result = ((Math.round((num * fixed) / 100000000)) / fixed) + unit[1];
  } else {
    result = parseFloat(num).toFixed(decimal);
  }
  if (typeof result === 'number' && isNaN(result)) {
    result = '-';
  }
  return result;
};

export default format;
