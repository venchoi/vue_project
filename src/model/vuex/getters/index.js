export default {
  /**
   * 判断搜索弹窗是否可以出现
   * @param state - 当前state
   * @returns {boolean} -当问股和消息弹窗都没有出现时，搜索框可以出现
   */
  canSearchShow(state) {
    return !state.newsModel.isShow && !state.chatModel.isShow;
  },
  /**
   * 判断用户信息弹窗是否可以出现
   * @param state - 当前state
   * @returns {boolean} - 当问股和搜索弹窗都没有出现时，用户框可以出现
   */
  canUserShow(state) {
    return !state.searchView.isShow && !state.chatModel.isShow;
  },
};
