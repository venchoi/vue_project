import {
  NEW_ITEMS_UPDATE,
  SERVICE_INFO_UPDATE,
} from '../modules/service/mutations/mutationType';

import {
  serviceActions,
} from '../actionsType';

import {
  columnSocket,
  EVENT,
} from '../../../plugins/YCJWebSocket/YCJWebSocket';
import { ycjVoice } from '../../../plugins/base/audio';
import Notify from '../../../plugins/base/notify';
import * as storage from '../../../model/storage';

export default function serviceGetter() {
  return (store) => {
    columnSocket.on(EVENT.STOCK_INDEX_SERVICE, (data) => {
      // todo 推送有更新
      const systemCode = data.system_code;
      // 更新内页数据
      store.dispatch(serviceActions.UPDATE_SERVICE_DETAILS, systemCode);
      // 更新首页数据
      store.dispatch(serviceActions.INIT_SERVICE_INDEX, { complete: null });
    });

    store.subscribe((mutation) => {
      const type = mutation.type;
      if (type === NEW_ITEMS_UPDATE) {
        // 注意，前面做了过滤，股票评级为优选或极优才会提交到这里
        // todo 弹窗通知
        const newObj = mutation.payload.data;
        const title = `【${newObj.name}更新提示】`;
        const content = `最新发现：${newObj.content}`;
        const systemCode = newObj.systemCode;
        const buttonConfig = storage.switchGroup.read(); // 获取推送开关配置
        if (buttonConfig && buttonConfig[systemCode]) {
          const btnBooleanList = buttonConfig[systemCode]; // 这个模块所有开关的boolean集合
          const audioBtnId = `${systemCode}_audio`; // 语音通知id
          const notifyBtnId = `${systemCode}_notify`; // 系统通知id
          if (btnBooleanList[audioBtnId]) {
            ycjVoice.play();
          }
          if (btnBooleanList[notifyBtnId]) {
            Notify(title, content);
          }
        } else {
          ycjVoice.play();
          Notify(title, content);
        }
      } else if (type === SERVICE_INFO_UPDATE) {
        /**
         * 把初始化从service.vue页面移到这里
         * 只初始化一次websocket实例
         * 发送system_code订阅服务更新
         */
        columnSocket.service(mutation.payload.systemCode);
      }
    });
  };
}
