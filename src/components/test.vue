<template>
  <div class="test">
    <h1 @click="click" >{{ msg }}</h1>
    <h2 @click="newsClick" >Essential Links</h2>
    <h2 @click="noticeClick" >NTIOCE</h2>
    <button @click="login">logintab</button>
    <button @click="register">registertab</button>
    <button @click="forget">forgetab</button>

    <div class="a">
      <tooltip content="上面1111" tips="我是在上面的标题" position="top"></tooltip>
      <tooltip content="下面1111" tips="我是在下面的标题" position="bottom"></tooltip>
      <tooltip content="左边1111" tips="我是在左边的标题" position="left"></tooltip>
      <tooltip content="右边1111" tips="我是在右边的标题" position="right"></tooltip>


    </div>
    <div  style="height: 200px;">
      <sort-list :listData="listData" hoverColor="rgba(115,56,200,0.7)" activeColor="#ffb1c9" style="background: #212121" :contextMenu="contextConfig" @viewListChange='viewList' ref="list">

        <list-column prop="id" label="id" :sort="true" :colStyle="{width:'80px'}" icon="user">
          <template scope="prop">
            qwe
            <stock-details :value='prop.row.id' :boundary='0' modal='normal'></stock-details>
          </template>
        </list-column>

        <list-column prop="amount3" label="index" :sort="false" :colStyle="{width:'90px'}">
          <template scope="prop">
            <span>{{prop.$index + 1}}</span>
          </template>
        </list-column>

        <list-column prop="name" label="姓名" :sort="true" :colStyle="{width:'90px'}">
          <template scope="prop">
            <span>{{prop.row.name + 'qwe'}}</span>
          </template>
        </list-column>

        <list-column prop="amount1" label="其他" :sort="true" :colStyle="{width:'90px'}">
        </list-column>
      </sort-list>
    </div>
    <div style="height: 30px">
      <switch-group switchId="test_1" :config="[{label:'声音', name: 'audio'}, {label:'通知', name: 'notify'}]"></switch-group>
    </div>

  <ycj-form :postData="testForm" :api="loginApi">
    <form-input name="account" placeholder="账号" :binding="testForm" :reg="testReg" :inputStyle="{background:'rgba(0,0,0, 0.1)', color:'#fff'}"></form-input>
    <form-input inputType="password" name="password" placeholder="密码" :binding="testForm" :reg="any"></form-input>
    <form-button :binding="testForm" :style="{background:'rgb(50,120,20)'}">asd</form-button>
    <form-check-box name="autoLoginTest" label="自动登陆"></form-check-box>
  </ycj-form>

    <div class="tChart" style="width: 500px; height: 500px;display: inline-block">
      <tick-line code="601616.SH"></tick-line>
    </div>

    <div class="kChart" style="width: 500px; height: 500px;display: inline-block">
      <k-line code="601616.SH"></k-line>
    </div>

    <popup ref="popup" :isShow="popupShow" @click-popupBg="hide">
      <div class="heed">这是一个标题</div>
      <div class="content">
        <p>这是正文，这是正文这是正文这是正文这是正文这是正文，这是正文这是正文这是正文这是正文这是正文</p>
        <p>这是正文，这是正文这是正文这是正文这是正文这是正文，这是正文这是正文这是正文这是正文这是正文，这,这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文,是正文这是正文</p>
      </div>
    </popup>

    <progress-bar :max="5000" :value="1300" height="7px"></progress-bar>
    <stock-progress-bar :max="500" :value="130" :boundary="13" :close="14"></stock-progress-bar>

    <div style="height: 100px">
      <progress-bar :max="5000" :value="1300" type="vertical" width="5px"></progress-bar>
    </div>

    <div class="tag-container">
      <tags :items="['成交明细','只看大单','撤单统计']" type="toggle">
        <div slot="panel_0" class="panel_0 pp">000</div>
        <div slot="panel_1" class="panel_1 pp">111</div>
        <div slot="panel_2" class="panel_2 pp">222</div>
      </tags>

    </div>
    <div class="tag-container">
      <tags :items="['成交明细','只看大单','撤单统计']" type="event" :tagEvent="tagEvent"></tags>
    </div>


    <div class="b">
      <associate></associate>
    </div>
  </div>
</template>

<script>
  import Popup from '../components/base/Popup';
  import Tags from './base/Tags';
  import Loading from './global/Loading';
  import Tooltip from './base/Tooltip';
  import SwitchGroup from './base/SwitchGroup';
  import ProgressBar from './base/ProgressBar';
  import IconFont from './base/IconFont';
  import StockProgressBar from './stockBase/StockProgressBar';
  import StockDetails from './stockBase/StockDetails';
  import associate from './associate';
  import SortList from './base/SortList2/List';

  import NewsModel from './global/NewsModel';

  import { actions } from '../model/vuex/actionsType';
  import ListColumn from './base/SortList2/ListColumn';
  import YcjForm from './base/form/YcjForm';
  import FormInput from './base/form/FormInput';
  import FormButton from './base/form/FormButton';
  import FormCheckBox from './base/form/FormCheckBox';
  import KLine from './stockBase/KLine';
  import TickLine from './stockBase/TickLine';

  export default {
    name: 'test',
    data() {
      return {
        msg: 'click me click me @@@@',
        contextConfig: [
          {
            text: '删除股票',
            click() { // row
              // console.log(row);
            },
            link: '/myStock',
          },
          {
            text: '查看详情',
            click() { // row
              // console.log(row);
            },
          },
        ],
        testForm: {
          account: '13501566426',
          password: '.',
        },
        testReg: {
          event: 'blur',
          value: /^1[34578]\d{9}$/,
          errorMsg: '请输入正确的手机格式',
        },
        any: {
          event: 'blur',
          value: /./,
          errorMsg: false,
        },
        loginApi: {
          url: this.$ycjHttp.apiList.LOGIN,
          success: (data) => {
            this.$storage.application.save('token', data.token);
            this.$storage.application.save('uid', data.uid);
          },
        },

        popupShow: false,
        tagEvent: () => { // e, a
          // console.log(e, a, this.msg);
        },
        listData: [{
          id: '123',
          name: '王小虎5',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
        }, {
          id: '345',
          name: '王小虎4',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
        }, {
          id: '234',
          name: '王小虎3',
          amount1: '324',
          amount2: '1.9',
          amount3: 9,
        }, {
          id: '456',
          name: '王小虎2',
          amount1: '621',
          amount2: '2.2',
          amount3: 17,
        }, {
          id: '567',
          name: '王小虎1',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
        }, {
          id: '567',
          name: '王小虎1',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
        }, {
          id: '567',
          name: '王小虎1',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
        }, {
          id: '567',
          name: '王小虎1',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
        }, {
          id: '567',
          name: '王小虎1',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
        }, {
          id: '567',
          name: '王小虎1',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
        },
        ],
      };
    },
    methods: {
      viewList() { // v
        // console.log(v);
      },
      testEvent() { // { index, row, event }
        // console.log(index, row, event);
      },
      click: function click() {
        this.popupShow = true;
      },
      hide() {
        this.popupShow = false;
      },
      newsClick() {
        this.$store.dispatch(actions.UPDATE_NEWS_DATA, {
          title: `${Date.now()}【标题】测试标题`,
          date: `2015-20-12 21:${parseInt(Math.random() * 100, 10)}`,
          from: '云财经',
          desc: '<p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p> <p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文，测试正文测试正文测试正文</p><p>【正文】测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试正文测试正文测试正文测试正文，测试正文测试测试正文测试正文测试正文测试正文测试正文正文测试正文测试正文，测试正文测试正文测试正文</p>',
        });
      },
      noticeClick() {
        this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
          status: 'success',
          content: 'test',
        });
      },
      submit() {
        // console.log(123123);
      },
      login() {
        this.$store.dispatch(actions.SHOW_LOGIN_TAB);
      },
      register() {
        this.$store.dispatch(actions.SHOW_REGISTER_TAB);
      },
      forget() {
        this.$store.dispatch(actions.SHOW_FORGET_PWD_TAB);
      },
    },
    mounted() {
//      const loading = this.$refs.loading;
//      console.log(loading);
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 100);
//      });
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 500);
//      });
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 5100);
//      });
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 3100);
//      });
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 4100);
//      });
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 3100);
//      });
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 1300);
//      });
//      loading.registerTasks((done) => {
//        setTimeout(() => {
//          done();
//        }, 2100);
//      });
//      loading.launch();
    },
    components: {
      ListColumn,
      Loading,
      StockProgressBar,
      ProgressBar,
      IconFont,
      StockDetails,
      Popup,
      Tags,
      Tooltip,
      associate,
      NewsModel,
      SortList,
      YcjForm,
      FormInput,
      FormButton,
      FormCheckBox,
      TickLine,
      KLine,
      SwitchGroup,
    },
  };
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .test{
    color: #878787;
    height: 100%;
    overflow-y: hidden;
    h1 {
      color: red;
    }
    div.a{
      margin: 50px 110px;
      >*{
        margin-right: 30px;
      }
    }
    .b{
      background: #b4b4b4;
      width: 150px;
      color: #000;
    }
    .tag-container {
      width: 500px;
      .panel_0 {
        height: 200px;
      }
      .pp {
        color: black;
      }
    }
    .item{
      color: #000;
    }
  }

</style>
