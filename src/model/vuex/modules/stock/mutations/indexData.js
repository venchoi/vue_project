import vue from 'vue';
import {
  INDEX_DATA_UPDATE,
  TRADE_POINT_UPDATE,
} from './mutationType';
import baseUtil from '../../../../../util/baseUtil';

export default {

  /**
   * 更新资金交易数据
   * @param {object} data - 处理的数据包
   *
   */
  [INDEX_DATA_UPDATE](state, payload) {
    const type = payload.type;
    const dataPacket = payload.data;
    const indexData = state.indexData[type];
    baseUtil.merge(indexData, dataPacket, true);
  },

  /**
   * 更新大势五日分时图中交易点的信息
   * @param state  当前状态
   * @param pointData 从后台获得的交易点信息
   */
  [TRADE_POINT_UPDATE](state, pointData) {
    vue.set(state, 'tradePoint', pointData);
  },
};
