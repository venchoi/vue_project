/**
 * 设置 用户token 和 id
 * 设置成功会根据token id 请求用户相关信息
 */
export const SET_BASE_USER_INDEX = 'user/setTokenUid';
export const CLEAR_BASE_USER_INDEX = 'user/clearTokenUid';
/**
 * 获取用户信息
 */
export const GET_INFO = 'user/get_info';
export const LOGOUT = 'user/logout';

/**
 * 自选股CURD
 */
export const GET_MY_STOCK = 'user/get_myStock'; // 获取自选股列表
export const ADD_MY_STOCK = 'user/add_myStock'; // 加入自选股
export const REMOVE_MY_STOCK = 'user/remove_myStock'; // 删除自选股
export const UPDATE_MY_STOCK = 'user/update_myStock'; // 更新自选股

export const GET_STOCK_NEWS = 'user/update_myStock_news'; // 获取自选股新闻

export const REORDER_MY_STOCK = 'user/reorder_myStock'; // 自选股列表重排序
