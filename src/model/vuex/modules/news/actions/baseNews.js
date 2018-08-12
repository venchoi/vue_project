import {
  SHOW_NEWS_BY_ID,
} from './actionType';

import {
  NEWS_DATA_UPDATE,
  NEWS_SHOW,
  NOTICE_CONTENT_UPDATE,
  NOTICE_STATUS_UPDATE,
  NOTICE_SHOW,
  NOTICE_HIDE,
} from '../../../mutations/mutationType';

import {
  NEWS_ID_ADD,
} from '../mutations/mutationType';

import http from '../../../../../plugins/http/http';
import format from '../../../../../util/format';

const apiList = http.apiList;

// 判断消息时间，今天则显示‘今天’
const transformDate = (str) => {
  if (!str) {
    return str;
  }
  const today = format.date(new Date(), 'MM-dd');
  let dateStr = format.date(new Date(Number(str) * 1000), 'MM-dd hh:mm');
  dateStr = dateStr.replace(today, '今天');
  return dateStr;
};

export default {
  /**
   * 通过新闻ID获取详情
   * @param {string} payload.id - 新闻ID
   * @param {boolean} payload.show - 是否显示新闻模态框,默认为false
   */
  [SHOW_NEWS_BY_ID]({ state, commit }, payload) {
    const id = payload.id;
    const show = payload.show || false;
    const newsList = state.baseNews;
    const news = newsList[id];
    if (news && show) {
      if (!news.content) {
        commit(NOTICE_CONTENT_UPDATE, '暂无详情!');
        commit(NOTICE_STATUS_UPDATE, 'fail');
        commit(NOTICE_SHOW);
        setTimeout(() => {
          commit(NOTICE_HIDE);
        }, 2000);
        return;
      }
      commit(NEWS_DATA_UPDATE, {
        date: transformDate(news.inputtime),
        desc: news.content,
        from: news.from,
        title: news.title,
      });
      commit(NEWS_SHOW);
      return;
    }
    http.api[apiList.GET_NEWS_INFO]({
      param: {
        id,
      },
      success(data) {
        commit(NEWS_ID_ADD, {
          id: data.id,
          data,
        });
        if (!data.content) {
          commit(NOTICE_CONTENT_UPDATE, '暂无详情!');
          commit(NOTICE_STATUS_UPDATE, 'fail');
          commit(NOTICE_SHOW);
          setTimeout(() => {
            commit(NOTICE_HIDE);
          }, 2000);
          return;
        }
        commit(NEWS_DATA_UPDATE, {
          date: transformDate(data.inputtime),
          desc: data.content,
          from: data.from,
          title: data.title,
        });
        commit(NEWS_SHOW);
      },
    });
  },
};
