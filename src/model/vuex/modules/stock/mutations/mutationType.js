/**
 * 订阅资金推送股票（一次只能请求一只）；
 */
export const CURRENT_CODE_UPDATE = 'CURRENT_CODE_UPDATE';
/**
 * 取消订阅资金推送股票
 */
export const CURRENT_CODE_CANCEL = 'CURRENT_CODE_CANCEL';

/**
 * 从列表移除股票
 */
export const STOCK_REMOVE_IN_LIST = 'STOCK_REMOVE_IN_LIST';
/**
 * 初始化列表
 */
export const STOCK_INIT_IN_LIST = 'STOCK_INIT_IN_LIST';
/**
 * 添加股票进列表
 */
export const STOCK_ADD_IN_LIST = 'STOCK_ADD_IN_LIST';

/**
 * 初始化股票快照
 */
export const BASE_INFO_INIT = 'BASE_INFO_INIT';
/**
 * 添加股票快照
 */
export const BASE_INFO_ADD = 'BASE_INFO_ADD';
/**
 * 更新股票快照
 */
export const BASE_INFO_UPDATE = 'BASE_INFO_UPDATE';

/**
 * 更新股票列表
 */
export const SERIES_INIT = 'SERIES_INIT';
/**
 * 更新股票列表
 */
export const SERIES_UPDATE = 'SERIES_UPDATE';
/**
 * 更新股票列表
 */
export const SERIES_ADD = 'SERIES_ADD';

// todo 要不要分开刷新再说
export const DEAL_DATA_INIT = 'DEAL_DATA_INIT';

/**
 * 更新股票列表
 */
export const DEAL_DATA_ADD = 'DEAL_DATA_ADD';
/**
 * 更新股票列表
 */
export const DEAL_DATA_UPDATE = 'DEAL_DATA_UPDATE';
/**
 * 更新股票列表
 */
export const THEME_DATA_INIT = 'THEME_DATA_INIT';
export const THEME_DATA_ADD = 'THEME_DATA_ADD';
export const THEME_DATA_UPDATE = 'THEME_DATA_UPDATE';

export const HANDICAP_INIT = 'HANDICAP_INIT';
export const HANDICAP_ADD = 'HANDICAP_ADD';
export const HANDICAP_UPDATE = 'HANDICAP_UPDATE';

export const RELATIVE_NEWS_INIT = 'RELATIVE_NEWS_INIT';
export const RELATIVE_NEWS_ADD = 'RELATIVE_NEWS_ADD';
export const RELATIVE_NEWS_UPDATE = 'RELATIVE_NEWS_UPDATE';

export const INDEX_DATA_INIT = 'INDEX_DATA_INIT';
export const INDEX_DATA_UPDATE = 'INDEX_DATA_UPDATE';

/**
 * 大势中五日分时图中的交易点信息
 */
export const TRADE_POINT_UPDATE = 'TRADE_POINT_UPDATE';

