export default {
  /**
   * 用户接口列表
   */
  LOGIN: '/user/login_account_password.html', // 登陆
  LOGOUT: '/user/loging_out.html', // 登出
  REGISTER: '', // 注册
  GET_REG_CODE: '', // 获取验证码
  GET_MSG_CODE: '/user/send_sms.html', // 获取登录验证码
  MSG_LOGIN: '/user/login_account_sms.html', // 短信登录
  GET_CHECK_IMG: '/user/get_verify.html', // 获取图片验证码
  GET_USER_INFO: '/user/get_user_info.html', // 获取用户信息
  CHECK_TYPE: '', // 校验注册手机或用户名
  LOGIN_BY_CODE: '', // 验证码登陆
  GET_CONFIG: '/configs/system_configs.html', // 获取平台配置

  /**
   * 个股接口列表
   */
  GET_MY_STOCK: '/user/get_optional_stock.html', // 获取自选股列表
  EDIT_MY_STOCK: '/user/set_optional_stock.html', // 编辑自选股列表
  RECORD_SORT: '/tool/record_sort.html', // 重排序自选股
  GET_MY_STOCK_NEWS: '/news/get_stocks_top_news.html', // 获取个股最新资讯
  GET_STOCK_INFO: 'get_stock_info', // 无用接口
  GET_STOCK_DATA: '/stock/stock_data.html', // 个股其他数据：有type字段控制获取数量类型个股票市值、换手率...
  GET_STOCK_NEWS: '/news/get_stocks_news.html', // 获取个股（股指）新闻列表
  GET_DEAL_INFO: '/stock/get_stock_trade_detail.html', // 个股交易明细

  /**
   * 实时获取上证，创业资金流入的五个数据
   */
  GET_FUND: '/stock/get_fund_idx.html',
  /**
   * 获取股票代码:type控制类型 idx股指，stk个股（默认是idx）
   */
  GET_INDEX_CODE: '/stock/get_code.html', // 股指股票列表
  GET_STOCK_LIST: '/stock/get_code.html',  // 行情股票列表
  /**
   * 图表数据接口
   */
  GET_K_LINE: '/market/get_kline.html', // 获取日K线
  GET_TICK_LINE: '/market/get_min_timeline.html', // 获取当日分时线
  GET_TEN_DAYS_TICK_LINE: '/market/get_ten_day_timeline.html', // 获取10日分时图
  /**
   * 大势五日分时图接口
   */
  GET_FIVE_DAYS_TICK_LINE: '/market/get_five_day_timeline.html', // 获取历史5日分时图
  GET_TRADE_POINT: '/market/get_buy_sell_point.html', // 五日分时上买入卖出点
  /**
   * 图表指标接口
   */
  GET_K_INDEX_LINE: '/stock/k_index.html', // 获取日k指标接口
  GET_TICK_INDEX_LINE: '/stock/min_k_index.html', // 获取分时指标接口
  GET_TEN_DAYS_TICK_INDEX: '/market/get_capital_inflow_line.html', // 获取十日分时指标

  /**
   * 获取内参消息
   */
  GET_REFERENCE_NEWS: '/news/get_reference_news.html',
  GET_NEWS_INFO: '/news/news_info.html', // 内参新闻详情

  /**
   * 获取实时解盘
   */
  GET_REAL_TIME_STARE: '/news/real_time_stare.html',

  /**
   * 获取热门题材数据
   */
  GET_HOT_NEWS: 'news/hot_news.html',

  /**
   * 获取早读、涨停分析
   */
  GET_NEW_LIST: '/news/get_new_list.html',

  /**
   * 选股页面接口
   */
  GET_STOCK_SERVICE_INDEX: '/picking/index.html', // 获取选股首页数据
  GET_STOCK_SERVICE_LIST: '/picking/picking_stock.html', // 获取选股-股票池增值服务列表，type字段传输服务类型

  /**
   * 咨询问股接口
   */
  SEND_CHAT_MESSAGE: '/message/insert_message.html', // 咨询聊天发送消息,添加用户咨询信息
  GET_CHAT_MESSAGE: '/message/get_mesage.html', // 获取咨询记录

  /**
   * 获取操作记录和日志
   */
  GET_RECORDS_LIST: '/FirmTrack/getDataInfo.html',
  GET_LASTED_RECORD: '/FirmTrack/getNewInfo.html',

  /**
   * 系统配置
   */
  GET_SYSTEM_CONFIG: 'configs/common_configs.html',
  /**
   * 搜索接口，提供搜索数据，返回相关股票信息
   */
  SEARCH_STOCK: '/index/search.html',
};
