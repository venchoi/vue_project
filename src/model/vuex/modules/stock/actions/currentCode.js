import {
  DEAL_DATA_INIT,
  HANDICAP_INIT,
  CURRENT_CODE_UPDATE,
  CURRENT_CODE_CANCEL,
} from '../mutations/mutationType';
import {
  UPDATE_CURRENT_CODE,
  // CLEAR_DEAL_DATA,
} from './actionType';
import {
  ycjUtil,
  logger,
} from '../../../../../util';


export default {
  /**
   * 更新当前股票代码
   * @param dispatch
   * @param commit
   * @param state
   * @param code
   */
  [UPDATE_CURRENT_CODE]({ dispatch, commit, state }, code) {
    // 更新之前的股票代码
    const codeNow = state.currentCode;
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected, in action - currentCode');
      return;
    }
    // 如果当前股票代码未初始化或者更新前的股票代码与需要被更新的股票代码是同一个，则不需要提交mutation，直接return
    if (!codeNow && codeNow === code) {
      return;
    }
    /**
     * 如果不是上面那种情况并且更新之前股票代码不为空，则提交mutation：取消订阅资金推送股票
     * 这个mutation会被监听，监听到后会进行一个判断，判断需要被更新的股票代码是否是指数，然后再根据判断订阅指数或者资金
     */
    if (codeNow) {
      commit(CURRENT_CODE_CANCEL, codeNow);
    }
    /**
     * 派发action：清除更新之前的股票代码的资金数据
     * 提交mutation：更新当前股票代码
     */
    // dispatch(CLEAR_DEAL_DATA, codeNow);
    commit(CURRENT_CODE_UPDATE, code);
    // 如果需要被更新的股票代码不是指数，则初始化当前股票代码的资金数据和盘口数据
    if (ycjUtil.isIndex(code)) {
      // todo another things;
    } else {
      commit(DEAL_DATA_INIT, code);
      commit(HANDICAP_INIT, code);
    }
  },
};
