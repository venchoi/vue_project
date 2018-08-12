import Vue from 'vue';
import logMsg from '../../util/logger';
import state from '../../model/vuex/state';
/**
 * 通过调用实例方法notice.notifyMsg发送系统通知
 * @param title 标题
 * @param content 内容
 * @param url 点击跳转url
 */
const noticeList = [];
function senNotification(title, content) {
  const pushLogo = state.appConfig.push_logo;
  const chromeApp = window.clientInformation.appVersion;
  const appVersion = chromeApp.match(/Chrome\/[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/)[0].split('/')[1].replace(/\./g, '');
  const isQQ = /QQBrowser/g.test(chromeApp); // QQ浏览器
  const hostName = window.location.hostname;
  // 判断该浏览器是否支持桌面通知
  if ((!('Notification' in window) || !(Number(appVersion) >= 620320294) || !isQQ) && hostName !== 'localhost') {
    // 当浏览器不支持桌面通知时弹出提示“该浏览器不支持桌面通知”
    // alert('This browser does not support desktop notification');.
    noticeList.unshift({
      logo: state.appConfig.push_logo,
      title,
      content,
      show: true,
    });
    Vue.set(state, 'noticeList', noticeList);
    setTimeout(() => {
      noticeList.splice(noticeList.length - 1, 1);
      Vue.set(state, 'noticeList', noticeList);
    }, 5000);
  } else if (Notification.permission === 'granted') {
    // 当允许通知时，新建一个NotificationI(title, options)对象，标题title是必须参数，options是可选参数
    let notification;
    if (content) {
      notification = new Notification(title, { body: content, icon: pushLogo });
    } else {
      notification = new Notification(title, { icon: pushLogo });
    }
    // 5秒后关闭该通知
    setTimeout(() => (notification.close()), 5000);
  } else if (Notification.permission !== 'denied') {
    // 当不允许通知时，弹出询问是否允许通知的提示
    const fun = function (permission) {
      // 如果用户选择“是”，即允许通知，则新建Notification()对象
      if (permission === 'granted') {
        let notification;
        if (content) {
          notification = new Notification(title, { body: content, icon: pushLogo });
        } else {
          notification = new Notification(title, { icon: pushLogo });
        }
        setTimeout(() => (notification.close()), 5000);
      }
    };
    // 将用户的选择作为回调函数fun(permission)的参数。
    Notification.requestPermission(fun);
  }
}
const notifyMsg = (title, content, url) => {
  // 如果window.Client对象不存在，或者没有window.Client.SendNativeNotify()函数，则调用上面定义的发送通知方法
  if (!window.Client) {
    logMsg.log('Client not exits!');
    if (content) {
      senNotification(title, content);
    } else {
      senNotification(title);
    }
    return;
  }
  if (!window.Client.SendNativeNotify) {
    logMsg.log('Client.SendNativeNotify not exits!');
    if (content) {
      senNotification(title, content);
    } else {
      senNotification(title);
    }
    return;
  }
  // 否则调用浏览器原有的sendNativeNotify（）方法
  window.Client.SendNativeNotify(title, content, url);
};
export default notifyMsg;
