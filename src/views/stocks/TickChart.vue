<template>
  <div class="chartContainer">
    <div class="selector-container">
      <select class="selector" v-if="chartArea[0]" @change="changeT(config[index], index)" v-model="config[index]"
                             v-for="(val, index) in config"
                             :style="{left:`${chartArea[index+1].width + chartArea[index+1].x - 80}px`,top:`${chartArea[index+1].y + 5}px`}">
      <option v-for="(item, key) in typeMap" :value="key" v-if="indexOptions(key)">{{key}}</option>
    </select>
    </div>
    <div :id='"chart_t_"+chartId' class="chart"></div>
  </div>
</template>

<script>
  import evoChart from 'evoChart';
  import {
    baseUtil,
    ycjUtil,
    format,
    uid,
  } from '../../util/index';
  import interactionLimit from '../../model/vuex/plugins/interactionLimit';
  import seriesStorage from '../../model/memory/seriesMemory';
  /**
   * chart0、chart1、chart2分别表示分时图下的3个子图，
   * chart0：默认是 histogram柱状图 - 成交量图；yAxis=1
   * chart1：默认是 histogram柱状图 - 大单净量图；yAxis=2
   * chart2：默认是 multiLine分段图 - 全局委托；yAxis=3
   * 每个图的位置通过yAxis控制，改变yAxis可以控制子图的位置。
   * yAxis：整个图表上有多个Y轴，yAxis值控制图显示在哪个Y轴区域；
   * xAxis：整个图表上有多个x轴，xAxis值控制图显示在哪个x轴区域；
   */
  const chart0 = (data, id) => {
    const d = data;
    return {
      type: 'histogram',
      data: d,
      name: 'vol',
      id,
      gapSize: 1,
//      coAxis: { // 辅助坐标
//        type: 'y', // 选择x/y轴
//        index: 5, // 选择在哪个y轴上展示
//        pointField: 'y', // 选取显示字段
//      },
      yAxis: 1, // 对应yAxis中第1个设置
      splitLine: 0, // 分割线位置
      statusColor: ['#dfe688', '#f5f7fb', '#14D55F'], // 分割线颜色配置分别为黄白绿
      style: {
        // 矩形样式
        rect: {
          stroke: '#dfe688', // 边框样式
          fill: '#dfe688', // 填充样式
          lineWidth: 1,
        },
      },
    };
  };
  const chart1 = (data, id) => {
    const d = data;
    return {
      type: 'histogram',
      data: d,
      name: id,
      id,
      splitLine: 0, // 颜色分割
      statusColor: ['#FF3232', '#f5f7fb', '#00e600'], // 分割线颜色配置分别为红白绿
      gapSize: 1,
      yAxis: 2, // 一个y对应一个区域
//      coAxis: { // 辅助坐标
//        type: 'y', // 选择x/y轴
//        index: 6, // 选择在哪个y轴上展示
//        pointField: 'y', // 选取显示字段
//      },
      style: {
        rect: {
          opacity: 0.7, // 透明度样式
        },
      },
    };
  };
  const chart2 = (data, id) => {
    const d = data;
    return {
      type: 'multiLine',
      name: id,
      id,
      data: d,
      splitLine: 0,
      statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
      gapSize: 1,
      yAxis: 3,
      xAxis: 1,
//      coAxis: { // 辅助坐标
//        type: 'y', // 选择x/y轴
//        index: 7, // 选择在哪个y轴上展示
//        pointField: 'y', // 选取显示字段
//      },
      style: {
        rect: {
          opacity: 0.5,
        },
      },
    };
  };
  /**
   * chartHandler：根据传入指数配置其chart样式
   * @param type - 指标名字，如全局委托
   * @param data - 点信息
   * @param dataType - 区分相同type下不同线段，如全局委托中的sellorder(委托卖出量)
   * @returns Object - chart的配置信息
   */
  const chartHandler = (type, data, dataType) => {
    // 基本设置
    const config = {
      name: type,
      points: data,
      displayRange: 'latest',
    };
    // 样式设置
    const styleConfig = {
      bba: {
        name: '大单主动买入',
        style: {
          line: {
            stroke: '#FF3232', // 红色
          },
        },
      },
      bbd: {
        name: '大单被动买入',
        style: {
          line: {
            stroke: '#FF8F8F', // 橙色
          },
        },
      },
      bsa: {
        name: '大单主动卖出',
        style: {
          line: {
            stroke: '#00B200', // 绿色
          },
        },
      },
      bsd: {
        name: '大单被动卖出',
        style: {
          line: {
            stroke: '#6CDE6C', // 浅绿
          },
        },
      },
      sellorder: {
        name: '委托卖出量',
        style: {
          line: {
            stroke: '#00e600', // 绿色
          },
        },
      },
      buyorder: {
        name: '委托买入量',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      ordersell: {
        name: '委托卖出量',
        style: {
          line: {
            stroke: '#00b200',
          },
        },
      },
      orderbuy: {
        name: '委托买入量',
        style: {
          line: {
            stroke: '#FF3232', // 红色
          },
        },
      },
      buysum: {
        name: '买方委托撤单',
        style: {
          line: {
            stroke: '#FF3232', // 红色
          },
        },
      },
      sellsum: {
        name: '卖方委托撤单',
        style: {
          line: {
            stroke: '#00e600', // 绿色
          },
        },
      },
      fund: {
        name: '资金流向',
        style: {
          line: {
            stroke: '#FF3232', // 红色
          },
        },
      },
    };
    // 切换图表显示数据
    switch (type) {
      case '委托买入':
        baseUtil.merge(config, {
          type: 'histogram',
          gapSize: 1,
          splitLine: false,
          style: {
            rect: {
              fill: '#FF3232',
              opacity: 0.5,
              stroke: '#FFFF00',
            },
          },
        }, true);
        baseUtil.merge(config, styleConfig[dataType], true);
        break;
      case '委托卖出':
        baseUtil.merge(config, {
          type: 'histogram',
          gapSize: 1,
          splitLine: false,
          style: {
            rect: {
              fill: '#00e600',
              opacity: 0.5,
              stroke: '#FFFF00',
            },
          },
        }, true);
        baseUtil.merge(config, styleConfig[dataType], true);
        break;
      case '资金流向':
        baseUtil.merge(config, {
          type: 'multiLine',
          splitLine: 0,
          statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
          style: {
            line: {
              stroke: null,
              lineWidth: 1.5,
              smooth: 0.5,
            },
          },
        }, true);
        break;
      case '成交量':
        baseUtil.merge(config, {
          type: 'histogram',
          gapSize: 1,
          splitLine: false,
          style: {
            rect: {
              fill: '#FFFF00',
              opacity: 1,
              stroke: '#FFFF00',
            },
          },
        }, true);
        break;
        case '全局委托':
          baseUtil.merge(config, {
              type: 'tickLine',
              style: {
                  circle: {
                      lineWidth: 0,
                  },
                  line: {
                      lineWidth: 1.5,
                      smooth: 0.5,
                  },
              },
          }, true);
          baseUtil.merge(config, styleConfig[dataType], true);
          break;
//      case '大单净量':
//        baseUtil.merge(config, {
//          type: 'histogram',
//          splitLine: 0,
//          statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
//          gapSize: 1,
//          style: {
//            rect: {
//              opacity: 0.5,
//            },
//          },
//        }, true);
//        break;
//      case '成交统计':
//        baseUtil.merge(config, {
//          type: 'tickLine',
//          style: {
//            circle: {
//              lineWidth: 0,
//            },
//            line: {
//              lineWidth: 1,
//              smooth: 0.3,
//            },
//          },
//        }, true);
//        baseUtil.merge(config, styleConfig[dataType], true);
//        break;         
//      case '撤单统计':
//        baseUtil.merge(config, {
//          type: 'tickLine',
//          gapSize: 1,
//          style: {
//            circle: {
//              lineWidth: 0,
//            },
//            line: {
//              lineWidth: 1.5,
//              smooth: 0.5,
//            },
//          },
//        }, true);
//        baseUtil.merge(config, styleConfig[dataType], true);
//        break;
//      case '大单流入':
//        baseUtil.merge(config, {
//          type: 'multiLine',
//          splitLine: 0,
//          statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
//          style: {
//            line: {
//              stroke: null,
//              lineWidth: 1.5,
//              smooth: 0.5,
//            },
//          },
//        }, true);
//        break;
      default:
        break;
    }
    return config;
  };
  /**
   * 选项配置，页面初始选项['成交量', '大单流入', '全局委托']
   * @param code - 股票代码
   * @returns {config} - 数组
   */
  const configMaker = (code) => {
    let config;
    if (ycjUtil.isIndex(code)) {
//      config = ['成交量', '大单流入', '全局委托'];
      config = ['成交量'];
    } else {
//      config = ['成交量', '大单流入', '全局委托'];
      config = ['成交量','全局委托', '资金流向'];
    }
    return config;
  };

  /**
   * 选项列表
   * @param code - 股票/指数代码
   * @returns {map} - 指数股票代码和非指数代码有区别
   */
  const configMapMaker = (code) => {
    let map;
    if (ycjUtil.isIndex(code)) {
      map = {
        成交量: 'vol',
//        大单净量: 'ddjl',
//        全局委托: 'qjwt',
//        大单流入: 'ddjlmin',
      };
    } else {
      map = {
        成交量: 'vol',
//        大单流入: 'ddjlmin',
//        大单净量: 'ddjl',
//        成交统计: 'cjtj',
       全局委托: 'qjwt',
//        撤单统计: 'cdtj',
        // 委托买入: 'wtb',
        // 委托卖出: 'wts',
        资金流向: 'zjlr',
      };
    }
    return map;
  };
  export default {
    name: 'TickChart',
    data() {
      return {
        chartId: uid(), // uid
        typeMap: configMapMaker(this.code), // 选项列表
        chartArea: [], // 图表空间位置
        config: configMaker(this.code), // 初始选项配置
        preConfig: configMaker(this.code), // 初始选项配置
        isInit: false, // 是否初始化
        prevCode: this.code,  // 前一个股票的代码，初始为当前股票代码
      };
    },
    props: {
      code: {
        type: [String, Number],
        required: true,
      },
    },
    computed: {
//      ...mapState({
//        preClose(state) {
//          return state.moduleStock.baseInfo[this.code].preClose;
//        },
//        seriesData(state) {
//          if (!state.moduleStock.seriesData[this.code]) {
//            return {};
//          }
//          return baseUtil.copy(state.moduleStock.seriesData[this.code]);
//        },
//      }),
//      tickData() {
//        const result = [];
//        const typeMap = this.typeMap;
//        result.push({
//          data: baseUtil.copy(this.seriesData.tick),
//          dataType: '分时',
//        });
//        baseUtil.each(this.config, (v) => {
//          const dataType = typeMap[v];
//          if (v === '成交量') {
//            result.push({
//              data: baseUtil.copy(this.seriesData[dataType]),
//              dataType: v,
//            });
//          } else {
//            result.push({
//              data: baseUtil.copy(this.seriesData.index.t[dataType]),
//              dataType: v,
//            });
//          }
//        });
//        result.push({
//          data: baseUtil.copy(this.seriesData.index.t.ma),
//          dataType: '均价',
//        });
//        return result;
//      },
    },
    watch: {
      code() {
        if (this.chart) {
          this.chart.loading.show();
        }
        // 如果股票变化则需停止对原股票的监听才开启新股票的绘图
        if (this.prevCode && this.prevCode !== this.code) {
          seriesStorage.unlisten('tick', this.prevCode, this.seriesHandler);
          seriesStorage.stopPullData({
            code: this.prevCode,
            type: 'tick',
          });
          baseUtil.each(this.config, (item) => {
            seriesStorage.stopPullData({
              code: this.prevCode,
              type: 'tick',
              name: this.typeMap[item],
            });
          });
        }
        // 重新设置当前代码的图表选项配置
        // 如果由指数切换到个股或由个股切换到指数，则重新初始化图表
        if(ycjUtil.isIndex(this.prevCode) !== ycjUtil.isIndex(this.code)) {
          this.initChart(); // 初始化页面
        }
        this.config = configMaker(this.code);
        this.preConfig = configMaker(this.code);
        this.typeMap = configMapMaker(this.code);

        seriesStorage.listen('tick', this.code, this.seriesHandler);
        seriesStorage.pullData({
          code: this.code,
          type: 'tick',
        });
        baseUtil.each(this.config, (item) => {
          seriesStorage.pullData({
            code: this.code,
            type: 'tick',
            name: this.typeMap[item],
          });
        });
        this.prevCode = this.code;
      },
    },
    methods: {
      resize() {
        this.chart.resize();
        this.getChartArea();
      },
      indexOptions(value) {
        const isSHSTK = ycjUtil.isSHSTK(this.code);
        const isCDTJ = value === '撤单统计';
        let pass = true;
        if (isSHSTK && isCDTJ) {
          pass = false;
        }
        return pass;
      },
      changeT(value, index) {
        const preSeries = this.preConfig[index];
        if (!this.preConfig[value]) {
//          seriesStorage.listen('tick', this.code, this.typeMap[value], this.singleHandler);
        }
        seriesStorage.pullData({
          code: this.code,
          type: 'tick',
          name: this.typeMap[value],
        });
        if (this.config.indexOf(preSeries) < 0) {
//          seriesStorage.unlisten('tick', this.code, this.typeMap[preSeries], this.singleHandler);
          seriesStorage.stopPullData({
            code: this.code,
            type: 'tick',
            name: this.typeMap[preSeries],
          });
        }
      },
      clearChart(...chartId) {
        if (!this.chart) {
          return;
        }
        const chart = this.chart;
        baseUtil.each(chartId, (id) => {
          chart.getSeries(id).setSeries({
            points: [],
          });
        });
      },
      clearAllChart() {
        const chart = this.chart;
        if (!chart) {
          return;
        }
        const seriesKey = '_series';
        const series = chart[seriesKey];
        baseUtil.each(series, (s) => {
          s.setSeries({
            points: [],
          });
        });
      },
      /**
       * 如果页面大小变化则重新获取图表区域大小
       */
      getChartArea() {
        if (this.chart) {
          const displayArea = this.chart.displayArea;
          this.chartArea = [];
          baseUtil.each(displayArea, (area) => {
            this.chartArea.push(baseUtil.copy(area.axisArea));
          });
          this.chartArea.sort((pre, self) => pre.y - self.y);
        }
      },
      /**
       * 初始化图表
       * @returns {string}
       */
      initChart() {
        const seriesAmount = 4;
        let i = 0;
        const chartSelector = `#chart_t_${this.chartId}`;
        this.chart = evoChart.create({
          chart: {
            container: chartSelector,
            margin: [10, 10, 10, 10], // 包括标尺
            background: '#242424',
            panable: false,
          },
          plugins: {
            crosshair: { // 十字线
              style: {},
            },
//            axisTag: false,
            axisTag: { // 轴标签
              style: {},
            },
            hoverPoint: true, // 开启上面两个事件插件
          },
          /**
           * 图表上方浮动的信息
           * position - 信息位置，evo.static.TOP,
           * float - 是否浮动
           * format - false 或者 function(points) 显示数据
           * x:0,y:-5 - 浮动信息位置
           * @type {Object}
           */
//          tooltip: false,
          tooltip: {
            position: evoChart.static.TOP,
            x: 5,
            y: 18,
            format(point) {
              let result = '';
              if (point.series.name === '分时' && point.y) {
                result += `分时：${point.date}   价格：${parseFloat(point.y, 10).toFixed(2)}    涨跌幅：${parseFloat(point.ratio, 10).toFixed(2)}%`;
              } else if ((point.series.name === '委托卖出量' || point.series.name === '委托买入量') && point.y) {
                result = `${point.series.name}：${format.num(point.y, 'cn', 2)}万   `;
              } else if (point.series.name === '资金流向' && point.y) {
                result = `${point.series.name}：${format.num(point.y, 'cn', 2)}万   `;
              } else if (point.series.name === '均价' && point.y) {
                result = `${point.series.name}：${format.num(point.y, 'cn', 2)}   `;
              } else if (point.series.name === '成交量' && typeof point.y === 'number') {
                result = `${point.series.name}：${format.num(point.y, 'cn', 0)}手   `;
              } else if (point.y !== null && typeof point.y !== 'undefined') {
                result = `${point.series.name}：${format.num(point.y, 'cn', 2)}   `;
              } else {
                result = '';
              }

              return result;
            },
          },
          // x轴设置
          xAxis: [
            // xAxis : 1
            {
              position: evoChart.static.BOTTOM,   //  X轴位置，只有top bottom
              space: 0,
              max: 'auto',
              min: 'auto',
              limit: 0,
              interval: 5,
              inverse: false,
              ticks: () => [120],

              rightLimit: 10, // 折线图右边空间
              leftLimit: 5, // 折线图左边空间
              offset: 0, // 平移比例，x只能水平，y只能垂直
              length: 100, // 坐标轴占绘图区域的比例
              label: () => null,
              splitLine: null,
              grid: { // 网格线，可设奇/偶/mid
                style: {
                  stroke: null,
                  lineDash: null,
                },
                particular: {
                  middle: { // 中间线样式
                    stroke: '#4d4d4d',
                  },
                },
              },
              style: {
                tick: {
                  stroke: null,
                  textFill: null,
                },
                line: {
                  stroke: '#3b3b3b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
            // xAxis : 2 最后一个图的样式（刻度表示不同）
            {
              position: evoChart.static.BOTTOM,
              space: 50,
              max: 'auto',
              min: 'auto',
              rightLimit: 10,
              leftLimit: 5,
              interval: 5,
              inverse: false,
              ticks: () => [0, 60, 120, 180, 240], // X轴刻度
              offset: 0,
              length: 100,
              grid: {
                style: {
                  stroke: null,
                  lineDash: null,
                },
                particular: {
                  middle: {
                    stroke: '#4d4d4d',
                  },
                },
              },
              label: function label(v) {
                const vv = Math.round(v);
                const min = 60 * 1000;
                const hour = 60 * 60 * 1000;
                let result;

                result = evoChart.format.date(new Date((1.5 * hour) + (vv * min)), 'hh:mm');
                if (vv === 120) {
                  result = '11:30/13:00';
                } else if (vv >= 121) {
                  result = evoChart.format.date(new Date((3 * hour) + ((vv) * min)), 'hh:mm');
                }
                return result;
              },
              style: {
                tick: {
                  lineWidth: 1,
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#3b3b3b',
                },
                text: {
                  fill: '#e0e0e0', // 刻度文字颜色
                },
              },
            },
          ],
          yAxis: [
            // yAxis = 0
            {
              position: evoChart.static.LEFT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: {
                style: {
                  stroke: '#2b2b2b',
                  lineDash: null,
                },
                particular: {
                  middle: {
                    stroke: '#838383', // 线条颜色
                    lineDash: [4, 2], // 线性设置，本质是使用zrender库中的setLineDash函数。
                  },
                },
              },
              space: 50, // 左侧空间，包括标尺
              topLimit: 25,
              bottomLimit: 25,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: 'tick', // 刻度
              splitLine: this.preClose, // 红绿分割线？？？无意义？
              statusColor: ['#FF3232', '#f5f7fb', '#00e600'], // 分割线上下颜色
              offset: 0,
              length: 43, // 坐标轴占绘图区域的比例
              label: value => evoChart.format.num(value, 'cn', 2),
              style: {
                tick: { // 刻度样式
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                  lineWidth: 0,
                },
                line: {
                  stroke: '#2b2b2b', // 坐标轴颜色
                },
                text: {
                  fill: '#fff', // 标尺文字颜色
                },
              },
            },
            // yAxis = 1
            {
              position: evoChart.static.LEFT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: false,
              space: 50,
              max: 'auto',
              min: 'auto',
              topLimit: 25,
              bottomLimit: 5,
              interval: 0,
              inverse: false,
              ticks: (max, min) => [min, (max + min) / 2, max],
              offset: 43,
              length: 18,
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b', // Y轴颜色
                },
                text: {
                  fill: '#fff', // 标尺颜色
                },
              },
            },
            // yAxis = 2
            {
              position: evoChart.static.LEFT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              space: 50,
              topLimit: 25,
              bottomLimit: 5,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              grid: false,
              ticks: (max, min) => [min, (max + min) / 2, max],
              offset: 61,
              length: 18,
              label: false,
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#fff',
                },
              },
            },
            // yAxis = 3
            {
              position: evoChart.static.LEFT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              topLimit: 25,
              bottomLimit: 5,
              space: 50,
              max: 'auto',
              min: 'auto',
              interval: 0,
              grid: false,
              inverse: false,
              ticks: (max, min) => [min, (max + min) / 2, max],
              offset: 79,
              length: 24,
              label: 'auto',
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#fff',
                },
              },
            },
            // 辅助坐标 1 yAxis = 4
            {
              position: evoChart.static.RIGHT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: false,
              space: 50, // 左侧空间，包括标尺
              topLimit: 25,
              bottomLimit: 25,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: 'tick', // 刻度
              splitLine: 0,
              statusColor: ['#FF3232', '#f5f7fb', '#00e600'], // 分割线上下颜色
              offset: 0,
              length: 43, // 坐标轴占绘图区域的比例
              label: (value) => {
                let result = `${value.toFixed(2)}%`;
                result = result.replace('-', '');
                return result;
              },
              style: {
                tick: { // 刻度样式
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                  lineWidth: 0,
                },
                line: {
                  stroke: '#2b2b2b', // 坐标轴颜色
                },
                text: {
                  fill: '#fff', // 标尺文字颜色
                },
              },
            },
            // 辅助坐标 2 yAxis = 5
            {
              position: evoChart.static.RIGHT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: false,
              space: 50,
              max: 'auto',
              min: 'auto',
              topLimit: 25,
              bottomLimit: 5,
              interval: 0,
              inverse: false,
              ticks: (max, min) => [min, (max + min) / 2, max],
              offset: 43,
              length: 18,
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b', // Y轴颜色
                },
                text: {
                  fill: '#fff', // 标尺颜色
                },
              },
            },
            // 辅助坐标 3 yAxis = 6
            {
              position: evoChart.static.RIGHT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              space: 50,
              topLimit: 25,
              bottomLimit: 5,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              grid: false,
              ticks: (max, min) => [min, (max + min) / 2, max],
              offset: 61,
              length: 18,
              label: false,
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#fff',
                },
              },
            },
            // 辅助坐标 4 yAxis = 7
            {
              position: evoChart.static.RIGHT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              topLimit: 25,
              bottomLimit: 5,
              space: 50,
              max: 'auto',
              min: 'auto',
              interval: 0,
              grid: false,
              inverse: false,
              ticks: (max, min) => [min, (max + min) / 2, max],
              offset: 79,
              length: 24,
              label: 'auto',
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#fff',
                },
              },
            },
          ],
          series: [
            {
              type: 'multiLine',
              name: '分时',
              id: 'tick',
              data: [],
//              coAxis: { // 辅助坐标
//                type: 'y', // 选择x/y轴
//                index: 4, // 选择在哪个y轴上展示
//                pointField: 'ratio', // 选取显示字段
//              },
              style: {
                circle: {
                  lineWidth: 0,
                },
                line: {
                  stroke: '#fff',
                  lineWidth: 1.5,
                  smooth: 0.1,
                },
              },
            },
            {
              type: 'multiLine',
              name: '均价',
              id: 'ma',
              data: [],
              style: {
                circle: {
                  lineWidth: 0,
                },
                line: {
                  stroke: '#FFFF00',
                  lineWidth: 1.5,
                  smooth: 0.1,
                },
              },
            },
          ],
        });

        for (i; i < 3; i += 1) {
          let ctor;
          switch (i) {
            case 0:
              ctor = chart0;
              break;
            case 1:
              ctor = chart1;
              break;
            case 2:
              ctor = chart2;
              break;
            default:
              break;
          }
          if(ycjUtil.isIndex(this.code)) {
            ctor = chart0;
          }
          for (let j = 0; j < seriesAmount; j += 1) {
            this.chart.addSeries(ctor([], `chart_${i}_${j}`));
          }
        }

        this.chart.loading.show();
        this.chart.on('pan', () => {
          interactionLimit.isInteracting = true;
        });
        this.chart.on('mousewheel', () => {
          interactionLimit.isInteracting = true;
        });
        window.addEventListener('resize', this.getChartArea);
      },
      refreshTick(data) {
        if (!this.chart) {
          return;
        }
        const chart = this.chart;
        const tick = data.line;
        const ma = data.ma;
        const preClose = data.preClose;
        const yA = '_yAxis';
        const yAxis = chart.getSeries('tick')[yA];
        chart.loading.hide();
        yAxis.max = 'auto';
        yAxis.min = 'auto';
        if (!this.isInit) {
//            seriesStorage.unlisten('tick', this.code, this.seriesHandler);
//            seriesStorage.listen('tick', this.code, 'line', this.seriesHandler);
//            seriesStorage.listen('tick', this.code, 'ma', this.seriesHandler);
          this.clearAllChart();
          this.isInit = true;
        }
        if (tick && tick.length) {
          yAxis.splitLine = preClose;
          chart.getSeries('tick').setSeries(chartHandler('分时', tick));
          chart.getSeries('ma').setSeries(chartHandler('均价', ma));
        }
        // 后三个图表的切换
        baseUtil.each(this.config, (name, index) => {
          const seriesName = this.typeMap[name];
          const seriesData = baseUtil.copy(data[seriesName]);
          let count = 0;
          if (seriesData) {
            // 当seriesData是数组的时候，说明只有一条线（或者柱状图），只要处理chart_*_0就可以了
            if (baseUtil.isArray(seriesData)) {
              chart.getSeries(`chart_${index}_0`).setSeries(chartHandler(name, seriesData));
              this.clearChart(`chart_${index}_1`, `chart_${index}_2`, `chart_${index}_3`);
            } else {
              // 当seriesData不是数组的时候，说明会有多条线，分别赋值给chart_*_[0-3]
              baseUtil.each(seriesData, (series, seriesType) => {
                chart.getSeries(`chart_${index}_${count}`).setSeries(chartHandler(name, series, seriesType));
                count += 1;
              });
              for (count; count <= 3; count += 1) {
                this.clearChart(`chart_${index}_${count}`);
              }
            }
          }
        });
      },
      seriesHandler(e) {
        const data = baseUtil.copy(e.data);
        this.refreshTick(data);
      },
      singleHandler(e) {
        if (this.isInit) {
          const data = e.data;
          this.refreshTick(data);
        }
      },
      unListen(code) {
        seriesStorage.unlisten('tick', code, this.seriesHandler);
        seriesStorage.stopPullData({
          code,
          type: 'tick',
        });
        baseUtil.each(this.config, (item) => {
          seriesStorage.stopPullData({
            code,
            type: 'tick',
            name: this.typeMap[item],
          });
        });
      },
    },
    activated() {
      if (!this.chart) {
        this.initChart();
        this.isInit = true;
      }
      this.getChartArea();

      const userConfig = this.config;
      seriesStorage.listen('tick', this.code, this.seriesHandler);
      seriesStorage.pullData({
        code: this.code,
        type: 'tick',
      });
      baseUtil.each(userConfig, (item) => {
        if (item !== '成交量') {
//          seriesStorage.listen('tick', this.code, this.typeMap[item], this.singleHandler);
          seriesStorage.pullData({
            code: this.code,
            type: 'tick',
            name: this.typeMap[item],
          });
        }
      });
    },
    deactivated() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
//        baseUtil.each(this.config, (item) => {
//          seriesStorage.unlisten('tick', this.code, this.typeMap[item], this.singleHandler);
//        });
//        seriesStorage.unlisten('tick', this.code, 'line', this.seriesHandler);
//        seriesStorage.unlisten('tick', this.code, 'ma', this.seriesHandler);
        this.unListen(this.code);
        seriesStorage.unlisten('tick', this.code, this.seriesHandler);
        window.removeEventListener('resize', this.getChartArea);
      }
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .chartContainer {
    width: 100%;
    height: 100%;
    .selector-container {
      position: relative;
      z-index: 11;
    }
  }
</style>
