
/**
 * 获取上证
 */
export const getSZIndex = (state) => {
  const code = '000001.SH';
  const indexData = state.indexData;
  const ycjRange = indexData.ycjRange;
  const interval = ycjRange.interval[code];
  const strategy = ycjRange.strategy[code];

  const fund = indexData.fund[code];
  return {
    interval,
    strategy,
    fund,
  };
};

/**
 * 获取创业板
 */
export const getCYIndex = (state) => {
  const code = '399006.SZ';
  const indexData = state.indexData;
  const ycjRange = indexData.ycjRange;
  const interval = ycjRange.interval[code];
  const strategy = ycjRange.strategy[code];
  const fund = indexData.fund[code];
  return {
    interval,
    strategy,
    fund,
  };
};
