/**
 * 更新资金推送股票
 */
export const UPDATE_CURRENT_CODE = 'UPDATE_CURRENT_CODE';

/**
 * 添加股票进监听列表
 */
export const ADD_STOCK_LIST = 'ADD_STOCK_LIST';

/**
 * 移除股票进监听列表
 */
export const REMOVE_STOCK_LIST = 'REMOVE_STOCK_LIST';

/**
 * 更新股票快照
 */
export const UPDATE_BASE_INFO = 'UPDATE_BASE_INFO';

/**
 * 更新股票快照
 */
export const INIT_ALL_BASE_INFO = 'INIT_ALL_BASE_INFO';

/**
 * 获取股票交易数据
 * @type {string}
 */
export const GET_DEAL_DATA = 'GET_DEAL_DATA';
/**
 * 更新股票交易数据
 */
export const UPDATE_DEAL_DATA = 'UPDATE_DEAL_DATA';
/**
 * 取消监听股票交易数据
 * @type {string}
 */
export const CANCEL_DEAL_DATA = 'CANCEL_DEAL_DATA';
/**
 * 清空股票交易数据
 */
export const CLEAR_DEAL_DATA = 'CLEAR_DEAL_DATA';

/**
 * 更新股票盘口
 */
export const UPDATE_HANDICAP_DATA = 'UPDATE_HANDICAP_DATA';

/**
 * 获取股票相关新闻
 */
export const GET_RELATIVE_NEWS = 'UPDATE_RELATIVE_NEWS';

/**
 * 更新股票数据
 */
export const GET_STOCK_DATA = 'GET_STOCK_DATA';

/**
 * 更新股票数据
 */
export const REALTIME_STOCK_DATA = 'REAL_TIME_STOCK_DATA';

/**
 * 取消股票数据
 */
export const CANCEL_STOCK_DATA = 'CANCEL_STOCK_DATA';

/**
 * 取消更新新闻列表
 */
export const CANCEL_REALTIME_NEWS = 'CANCEL_REALTIME_NEWS';

/**
 * 获取K线图 - 有数据就不会发起请求
 */
export const GET_K_LINE = 'GET_K_LINE';
/**
 * 更新K线图 - 无论什么状况都会 发起请求 更新数据
 */
export const UPDATE_K_LINE = 'UPDATE_K_LINE';

/**
 * 获取分时线图- 有数据就不会发起请求
 */
export const GET_TICK_LINE = 'GET_TICK_LINE';

/**
 * 更新分时线图 -  无论什么状况都会 发起请求 更新数据
 */
export const UPDATE_TICK_LINE = 'UPDATE_TICK_LINE';

/**
 * 实时获取分时线图 - 每分钟更新一次数据
 */
export const REALTIME_TICK_LINE = 'REALTIME_TICK_LINE';

/**
 * 取消实时更新分时线图
 */
export const CANCEL_REALTIME_TICK_LINE = 'CANCEL_REALTIME_TICK_LINE';

/**
 * 获取指标线图
 */
export const GET_INDEX_LINE = 'GET_INDEX_LINE';
/**
 * 更新指标线图
 */
export const UPDATE_INDEX_LINE = 'UPDATE_INDEX_LINE';

/**
 * 更新股票新闻信息
 * */
export const RELATIVE_NEWS_UPDATE = 'RELATIVE_NEWS_UPDATE';

/*
* 初始化股票新闻
* */
export const RELATIVE_NEWS_INIT = 'RELATIVE_NEWS_INIT';

/**
 * 实时获取指标数据 - 每分钟更新一次数据
 */
export const REALTIME_INDEX_LINE = 'REALTIME_INDEX_LINE';

/**
 * 取消实时更新分时线图
 */
export const CANCEL_REALTIME_INDEX_LINE = 'CANCEL_REALTIME_INDEX_LINE';

/**
 * 获取股票相关概念
 */
export const GET_THEME_DATA = 'GET_THEME_DATA';
/**
 * 更新指标线图
 */
export const UPDATE_THEME_DATA = 'UPDATE_THEME_DATA';

/**
 * 获取指数数据
 */
export const GET_INDEX_DATA = 'GET_INDEX_DATA';
/**
 * 更新指数数据
 */
export const UPDATE_INDEX_DATA = 'UPDATE_INDEX_DATA';

/**
 * 更新指数数据
 */
export const CANCEL_UPDATE_INDEX_DATA = 'CANCEL_UPDATE_INDEX_DATA';

/**
 * 初始化大势五日分时图交易点信息
 */
export const INIT_TRADE_DATA = 'INIT_TRADE_DATA';
/**
 * 更新大势五日分时图交易点信息
 */
export const UPDATE_TRADE_DATA = 'UPDATE_TRADE_DATA';
