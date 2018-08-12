import { baseUtil } from '../util/index';
import { actions } from '../model/vuex/actionsType';

const ycjDirective = {};
/**
 * 全局事件控制；
 * 包括：click, mouseup, mousedown, mousemove, keydown, keyup, resize
 */
ycjDirective.installed = false;
ycjDirective.install = function install(vue) {
  const Vue = vue;
  const eventList = ['click', 'mouseup', 'mousedown', 'mousemove', 'keydown', 'keyup', 'resize'];
  const vNodes = [];
  window.vn = vNodes;
  const eventHandler = (e) => {
    const type = e.type;
    baseUtil.each(baseUtil.clone(vNodes).reverse(), (item) => {
      const node = item.node;
      const isActive = '_inactive'; // 是否活动中，（显示中）
      if (item.events.indexOf(type) > -1 // vnode 是否触发该事件
        && !node[isActive] // 是否活动中，（显示中）
        && !e.defaultPrevented) { // 是否停止 中断事件
        node.$emit(type, e);
        return; // 当有一个节点获取到事件并向上派发之后，就停止继续冒泡。若没有该return语句，会导致在按上下键时，股票列表跟搜索框联动滚动
      }
    });
  };
  baseUtil.each(eventList, (event) => {
    if (event === 'resize') {
      window.addEventListener(event, eventHandler);
    } else {
      document.addEventListener(event, eventHandler);
    }
  });
  /**
   * 登录页面键盘输入
   */
  vue.directive('checkLogin', {
    bind(el, binding, node) {
      el.addEventListener('blur', () => {
        const vm = node.context;
        const reg = {
          phone: /^1[34578]\d{9}$/,
          email: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          password: /^([a-zA-Z0-9@*#]{6,30})$/,
          verify: /^[0-9a-zA-Z]{4}$/,
          msgCode: /^\d{8}$/,
          nickname: /^[a-zA-Z0-9\u4e00-\u9fa5_-]{2,10}$/,
          username: [/^1[34578]\d{9}$/, /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/],
        };
        const tips = {
          phone: '手机号码格式错误',
          email: '邮箱格式错误',
          password: '请输入6~30位密码',
          verify: '图片验证码错误',
          msgCode: '短信验证码错误',
          username: '手机或者邮箱格式错误',
        };
        const value = el.value;
        const modifiers = binding.modifiers;
        const status = 'fail';
        let content = '';
        // 遍历输出你需要检测的规则
        baseUtil.each(modifiers, (modifier, key) => {
          let checked;
          if (key === 'username') { // 云财经登录时
            if (reg.phone.test(value) || reg.email.test(value)) {
              checked = true;
            }
          } else {
            checked = reg[key].test(value);
          }
          if (!checked) {
            content += tips[key];
            vm.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              content,
              status,
            });
          }
        });
      });
    },
  });
  /**
   * 滚动到底部
   */
  vue.directive('scrollBottom', {
    componentUpdated(el) {
      if (!el || el.scrollHeight === el.clientHeight) {
        return;
      }
      const ele = el;
      if (ele.scrollHeight - (ele.scrollTop + ele.clientHeight) < 80) {
        ele.scrollTop = ele.scrollHeight - ele.clientHeight;
      }
    },
  });
  /**
   * 全局键盘事件
   */
  vue.directive('reciveGlobalEvent', {
    /**
     * 指令第一次绑定到元素时调用，在这里进行初始化设置
     * @param el －指令所绑定的元素，可以用来直接操作 DOM
     * @param binding
     * @param binding.value - 指令的绑定值，如：v-recive-global-event="'click'"中，绑定值为'click'
     * @param vNode - vue编译生成的虚拟节点
     */
    bind(el, binding, vNode) {
      const context = vNode.context; // context: Component | void; // rendered in this component's scope
      const uidStr = '_uid';
      const uid = context[uidStr];
      let listeningEvent;
      let isPass = true;

      if (baseUtil.isArray(binding.value)) {
        listeningEvent = binding.value;
      } else {
        listeningEvent = [binding.value];
      }
      // 这是求补集操作，遍历被绑定节点下的所有节点，如果被绑定节点下的渲染队列中已经存在之后需要渲染的节点，则设置标志位为false，不push进虚拟节点队列中
      baseUtil.each(vNodes, (v) => {
        if (v.uid === uid) {
          isPass = false;
        }
      });
      if (isPass) {
        vNodes.push({
          events: listeningEvent,
          node: context,
          uid,
        });
      }
    },
    // 别删
    // unbind(el, binding, vNode) {
    //   const context = vNode.context;
    //   const uidStr = '_uid';
    //   const uid = context[uidStr];
    //   let delIndex;
    //
    //   baseUtil.each(vNodes, (v, index) => {
    //     if (v.uid === uid) {
    //       delIndex = index;
    //     }
    //   });
    //   if (typeof delIndex === 'number') {
    //     vNodes.splice(delIndex, 1);
    //   }
    // },
  });

  vue.filter('myFilter', () => {});

  Vue.prototype.Bus = new Vue();
};

export default ycjDirective;
