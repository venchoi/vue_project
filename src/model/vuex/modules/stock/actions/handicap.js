import {
  HANDICAP_UPDATE,
} from '../mutations/mutationType';
import { UPDATE_HANDICAP_DATA } from './actionType';
import interceptor from '../../../plugins/interactionLimit';
import {
  baseUtil,
  logger,
  ycjUtil,
} from '../../../../../util';

export default {
  /**
   * 更新盘口数据 —— 买卖队列
   * @param state
   * @param payload
   */
  [UPDATE_HANDICAP_DATA]({ state }, payload) {
    baseUtil.each(payload, (item, code) => {
      if (!ycjUtil.checkCode(code)) {
        logger.error('code need corrected,in action - baseInfo');
      }
    });
    interceptor.check(HANDICAP_UPDATE, payload);
  },
};
