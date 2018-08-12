import { baseUtil } from '../../../../../util';

export const getIndexInfo = (state) => {
  const indexList = ['399006.SZ', '399005.SZ', '399001.SZ', '000001.SH'];
  const result = {};

  baseUtil.each(indexList, (code) => {
    result[code] = state.baseInfo[code];
  });
  return result;
};
export const getStockInfo = (state) => {
  const baseInfo = state.baseInfo;
  return (code) => {
    if (baseInfo[code]) {
      return baseInfo[code];
    }
    return {};
  };
};
export const getStockNameCode = (state) => {
  const baseInfo = state.baseInfo;
  return (code) => {
    if (baseInfo[code]) {
      const codeNum = baseInfo[code].code.split('.')[0];
      return `${baseInfo[code].name}${codeNum}`;
    }
    return '----';
  };
};
export const getStockRatio = (state) => {
  const baseInfo = state.baseInfo;
  return (code) => {
    if (baseInfo[code] && baseInfo[code].preClose && baseInfo[code].close) {
      const close = baseInfo[code].close;
      const preClose = baseInfo[code].preClose;
      return (((close - preClose) * 100) / preClose).toFixed(2);
    }
    return 0;
  };
};

export const getStockUpdownprice = (state) => {
  const baseInfo = state.baseInfo;
  return (code) => {
    if (baseInfo[code]) {
      const close = baseInfo[code].close;
      const preClose = baseInfo[code].preClose;
      return (close - preClose).toFixed(2);
    }
    return 0;
  };
};
