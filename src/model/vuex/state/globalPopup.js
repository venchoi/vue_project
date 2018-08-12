/**
 * 更新股票列表
 */
export const notice = {
  isShow: false,
  content: '',
  status: 'none',
};
/**
 * 内参新闻等弹框
 * 返回：弹框是否开启；以及弹框显示内容
 * @type {{isShow: boolean, newsData: {title: string, date: string, desc: string, from: string}}}
 */
export const newsModel = {
  isShow: false,
  newsData: {
    title: '测试标题',
    date: '2016-12-01 16:25',
    desc: '测试描述，这是正文这是正文这是正文这是正文，这是正文这是正文这是正文这是正文，这是正文这是正文这是正文这是正文这是正文，这是正文这是正文这是正文这是正文这是正文，这是正文这是正文这是正文，这是正文这是正文这是正文',
    from: '云财经',
  },
};
/**
 * 登录页面情况
 * @type {{loginShow: boolean, registerShow: boolean, forgetPwdShow: boolean}}
 */
export const loginSuit = {
  loginShow: false,
  registerShow: false,
  forgetPwdShow: false,
};
/**
 * 问股页面是否打开
 * @type {{isShow: boolean}}
 */
export const chatModel = {
  isShow: false,
};
/**
 * 搜索页面是否打开
 * @type {{isShow: boolean}} - 返回搜索页面打开情况
 */
export const searchView = {
  isShow: false,
};
