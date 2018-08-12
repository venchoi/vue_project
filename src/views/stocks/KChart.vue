<template>
  <!-- 图表容器 -->
  <div class="chartContainer">
    <!-- 图表选项容器 -->
    <div class="selector-container">
      <select class="selector" v-if="chartArea[0]" @change="changeT(config[index], index)" v-model="config[index]"
              v-for="(val, index) in config"
              :style="{left:`${chartArea[index+1].width + chartArea[index+1].x - 80}px`,top:`${chartArea[index+1].y + 5}px`}">
        <option v-for="(item, key) in typeMap" :value="key" v-if="indexOptions(key)">{{key}}</option>
      </select>
    </div>
    <!-- 图表显示区域 -->
    <div :id='"chart_t_"+chartId' class="chart"></div>
  </div>
</template>

<script>
  import evoChart from 'evoChart';
  import {
    baseUtil,
    ycjUtil,
    uid,
  } from '../../util/index';
  import interactionLimit from '../../model/vuex/plugins/interactionLimit';
  import seriesStorage from '../../model/memory/seriesMemory';

  // 图表0-2
  const chart0 = (data, id) => {
    const d = data;
    return {
      type: 'histogram', // 柱状图
      data: d,
      name: 'vol',
      id,
      gapSize: 1,
      yAxis: 1, // 图表0的y索引值,映射到线段实例中时，对应的是yAixsIndex属性
      splitLine: 0, // 状态分割线
      statusColor: ['#dfe688', '#f5f7fb', '#14D55F'],
      style: {
        rect: {
          stroke: '#dfe688',
          fill: '#dfe688',
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
      splitLine: 0,
      statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
      gapSize: 1,
      yAxis: 2,
      style: {
        rect: {
          opacity: 0.7,
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
      style: {
        rect: {
          opacity: 0.5,
        },
      },
    };
  };
  const chart3 = (data, id) => {
    const d = data;
    return {
      type: 'histogram', // 柱状图
      data: d,
      name: 'vol',
      id,
      gapSize: 1,
      yAxis: 4, // 图表0的y索引值,映射到线段实例中时，对应的是yAixsIndex属性
      xAxis: 1,
      splitLine: 0, // 状态分割线
      statusColor: ['#dfe688', '#f5f7fb', '#14D55F'],
      style: {
        rect: {
          stroke: '#dfe688',
          fill: '#dfe688',
          lineWidth: 1,
        },
      },
    };
  };

  // 图表处理方法
  const chartHandler = (isInit, type, data, dataType) => {
    const config = {
      name: type,
      points: data,
    };
    if (!isInit) {
      config.displayRange = [data.length - 120, data.length];
    }
    // 线段样式配置
    const styleConfig = {
      orderbuy_avg: {
        name: '主力多头',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      ordersell_avg: {
        name: '主力空头',
        style: {
          line: {
            stroke: '#00B200',
          },
        },
      },
      ab: {
        name: '大单主动买',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      db: {
        name: '大单被动买',
        style: {
          line: {
            stroke: '#FF8F8F',
          },
        },
      },
      as: {
        name: '大单主动卖',
        style: {
          line: {
            stroke: '#00B200',
          },
        },
      },
      ds: {
        name: '大单被动卖',
        style: {
          line: {
            stroke: '#6CDE6C',
          },
        },
      },
      sellorder: { // 委托卖出量
        style: {
          line: {
            stroke: '#00e600',
          },
        },
      },
      buyorder: { // 委托买入量
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      bc_total: {
        name: '买方委托撤单',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      sc_total: {
        name: '卖单委托撤单',
        style: {
          line: {
            stroke: '#00e600',
          },
        },
      },
      buysum: {
        name: '买方委托撤单',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      sellsum: {
        name: '卖单委托撤单',
        style: {
          line: {
            stroke: '#00e600',
          },
        },
      },
      b: {
        name: '大单总买入',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      s: {
        name: '大单总卖出',
        style: {
          line: {
            stroke: '#00e600',
          },
        },
      },
    };
    switch (type) {
      case '成交量':
        baseUtil.merge(config, {
          type: 'histogram',
          gapSize: 1,
          splitLine: false,
          style: {
            rect: {
              fill: '#FFFF00',
              stroke: null,
              opacity: 1,
            },
          },
        }, true);
        break;
      case '大单净量':
        baseUtil.merge(config, {
          type: 'histogram',
          splitLine: 0,
          statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
          gapSize: 1,
          style: {
            rect: {
              opacity: 0.5,
            },
          },
        }, true);
        break;
      case '大单动向':
        baseUtil.merge(config, {
          type: 'tickLine',
          style: {
            circle: {
              lineWidth: 0,
            },
            line: {
              lineWidth: 1.5,
              smooth: 0.7,
            },
          },
        }, true);
        baseUtil.merge(config, styleConfig[dataType], true);
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
      case '撤单统计':
        baseUtil.merge(config, {
          type: 'tickLine',
          gapSize: 1,
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
      case '主力多空':
        baseUtil.merge(config, {
          type: 'tickLine',
          gapSize: 1,
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
//      case '阻力线':
//        baseUtil.merge(config, {
//          type: 'tickLine',
//          gapSize: 1,
//          style: {
//            circle: {
//              lineWidth: 0,
//            },
//            line: {
//              lineWidth: 1.5,
//              stroke: '#FFFF00',
//            },
//          },
//        }, true);
//        baseUtil.merge(config, styleConfig[dataType], true);
//        break;
      case '大单攻防':
        baseUtil.merge(config, {
          type: 'tickLine',
          gapSize: 1,
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
      default:
        break;
    }
    return config;
  };

  // 图表默认选项配置处理。如果是指数，默认成交量。否则就是其他个股，默认选中成交量、主力多空、大单净量
  const configMaker = (code) => {
    let config;
    if (ycjUtil.isIndex(code)) {
//      config = ['成交量', '暂空', '暂空'];
      config = ['成交量'];
    } else {
      config = ['成交量', '主力多空', '大单净量'];
    }
    return config;
  };
  // 图表所有可选选项配置处理。如果是指数，只有成交量。否则就是其他个股，有成交量、大单净量、阻力线、成交统计、主力多空、撤单统计可选
  const configMapMaker = (code) => {
    let map;
    if (ycjUtil.isIndex(code)) {
      map = {
        成交量: 'vol',
      };
    } else {
      map = {
        成交量: 'vol',
        大单净量: 'ddjl',
        大单动向: 'dddx',
//        大单攻防: 'ddgf',
//        阻力线: 'zlx',
//        成交统计: 'cjtj',
        主力多空: 'zldk',
        撤单统计: 'cdtj',
      };
    }
    return map;
  };

  export default {
    name: 'KChart',
    data() {
      return {
        chartId: uid(), // 图表ID
        typeMap: configMapMaker(this.code), // 图表类型映射，表示该股票代码可配置哪些图表，所有的图表选项
        chartArea: [], // 图表显示区域
        config: configMaker(this.code), // 当前图表选项
        preConfig: configMaker(this.code),
        isInit: false, // 是否已经初始化
        changeConfig: false,
      };
    },
    props: {
      // 当前图表股票代码
      code: {
        type: [String, Number],
        required: true,
      },
    },
    watch: {
      // 监听股票代码变化
      code() {
        // 当股票代码变化时，首先设置初始化标志位false
        this.isInit = false;
        // 如果图表已经被创建过，首先显示loading页面，然后清除图表数据
        if (this.chart) {
          this.chart.loading.show();
          this.clearAllChart();
        }
        // 如果存在上一个股票代码并且上一个股票代码与当前代码不是同一个时进行以下操作
        if (this.prevCode && this.prevCode !== this.code) {
          seriesStorage.unlisten('k', this.prevCode, this.seriesHandler); // 停止监听上一个股票代码的k线数据
          seriesStorage.stopPullData({ // 停止拉取上一个股票代码的k线数据
            code: this.prevCode,
            type: 'k',
          });
          baseUtil.each(this.config, (item) => { // 停止拉取上一个股票代码的其他图表数据
            seriesStorage.stopPullData({
              code: this.prevCode,
              type: 'k',
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
        seriesStorage.listen('k', this.code, this.seriesHandler);
        // 拉取当前代码的K线数据
        seriesStorage.pullData({
          code: this.code,
          type: 'k',
        });
        // 遍历当前代码可选图表选项，拉取相应图表数据
        baseUtil.each(this.config, (item) => {
          seriesStorage.pullData({
            code: this.code,
            type: 'k',
            name: this.typeMap[item],
          });
        });
        this.prevCode = this.code;
      },
      // 监听当前选中的图表选项
      config() {
        this.changeConfig = true;
      },
    },
    components: {},
    methods: {
      // 窗口大小重置
      resize() {
        this.chart.resize(); // 调整图表大小
        this.getChartArea(); // 获取图表显示区域
      },

      indexOptions(value) {
        const isSHSTK = ycjUtil.isSHSTK(this.code); // 是否是上海股票
        const isCDTJ = value === '撤单统计'; // 是否是撤单统计
        return !(isSHSTK && isCDTJ);
      },
      changeT(value, index) {
        const preSeries = this.preConfig[index];
        if (!this.preConfig[value]) {
          seriesStorage.listen('k', this.code, this.typeMap[value], this.singleHandler);
        }
        seriesStorage.pullData({
          code: this.code,
          type: 'k',
          name: this.typeMap[value],
        });
        if (this.config.indexOf(preSeries) < 0) {
          seriesStorage.unlisten('k', this.code, this.typeMap[preSeries], this.singleHandler);
          seriesStorage.stopPullData({
            code: this.code,
            type: 'k',
            name: this.typeMap[preSeries],
          });
        }
      },

      /**
       * 清除图表内容
       * @param {Array | Object} chartId
       */
      clearChart(...chartId) {
        if (!this.chart) {
          return;
        }
        const chart = this.chart;
        // 遍历传入的所有chartId，清除每一个chart的线段内容
        baseUtil.each(chartId, (id) => {
          chart.getSeries(id).setSeries({
            points: [],
          });
        });
      },
      markerCreate(data) {
        const buyPoint = {
          x: 0,
          y: 0,
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAFRk36sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA5LTE4VDExOjE3OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wOS0xOFQxNzozNTowNyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wOS0xOFQxNzozNTowNyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTg2MDlCOUI5QzU0MTFFN0I4MjBGNkJGNThBOUVFRjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTg2MDlCOUM5QzU0MTFFN0I4MjBGNkJGNThBOUVFRjgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBODYwOUI5OTlDNTQxMUU3QjgyMEY2QkY1OEE5RUVGOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBODYwOUI5QTlDNTQxMUU3QjgyMEY2QkY1OEE5RUVGOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsUzURgAAAEHSURBVHjaYvxvZMQAAkxALA7E/wECiBEmwgLiAfFjgACCifwEYjYgZmRigAA2KM0AEEAwFVFAvIwFKrgUiK8wQQ0BgYsgDiNMC0AAwe0BAmYg/gPE+4HYCeYaEJgGlQABR5hRyDphZjPAjGZiwAMAAghZJwhEAvFyGAdZ5wGQR5BcC5c0BmJ7KPs7uuQZJBPYgbgXJvkCi1uKgFgQFFYSZHkFryRAgKH7EwbkgfgC1Cp9UNQSY2oFED8AYgGQg4H4EdTxOG3kAuKzQKyBw3WXgNgMmp7gNvoA8Rc8mkBAD4i/QVMCOHkugmr8AMR80HSEL8D2geIbpDEOTfI/roAkOsjJjit8AABzPzLVbvUqKQAAAABJRU5ErkJggg==',
          width: 15,
          height: 13,
          offsetX: -7.5,
          offsetY: 7,
        };
        const sellPoint = {
          x: 0,
          y: 0,
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAFRk36sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA5LTE4VDExOjE3OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wOS0xOFQxNzozNTo0MiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wOS0xOFQxNzozNTo0MiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkQ1Q0NCNDg5QzU0MTFFN0FCNUNGQzRFQTFFOTc5QzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkQ1Q0NCNDk5QzU0MTFFN0FCNUNGQzRFQTFFOTc5QzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRDVDQ0I0NjlDNTQxMUU3QUI1Q0ZDNEVBMUU5NzlDMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRDVDQ0I0NzlDNTQxMUU3QUI1Q0ZDNEVBMUU5NzlDMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po15JpkAAAEISURBVHjaYmR4xgAC/5kYoAAggBiBIh+AtABIhB+InQECiBGq5gNUgBGmtgmmByCAYCr+I8uCAYjzD8oG2wGTZQQIIJgeZJMhZkFVzQLid0gSMAv+w3RyAPF3JMkrQKwLM/8H1Kj3QKwAkgAJAgQQsp3/kXTC7cQJ8EqyQF3KgSYOsmIFyE43IGMnFkkmkLG7oE5HBlzIduoiSZRBvcaA7BVpIL6GHFIAAYYsiS2MGdD9TpQ3yQ4fQhqFgPgZLHZxOJMBSf4REAsyQQNdCognEmFRPxDLgRIEeuDoAfEpIGZH0/ALiM2A+CIuP14CYk4g3oskdhAaeRdRg/gZTmeFAzEbEC/GJgkAkVg1x0TIhFcAAAAASUVORK5CYII=',
          width: 15,
          height: 13,
          offsetX: -7.5,
          offsetY: -18,
        };
        baseUtil.each(data, (marker) => {
          if (marker) {
            if (marker.status) {
              baseUtil.merge(marker, buyPoint);
            } else {
              baseUtil.merge(marker, sellPoint);
            }
          }
        });
        return data;
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
      initChart() {
        const seriesAmount = 4; // 线段数量
        const self = this;
        let i = 0;
        let toggleFlag = false; // 悬浮窗位置切换flag
        const chartSelector = `#chart_t_${this.chartId}`; // 图表选择器
        // 创建图表
        this.chart = evoChart.create({
          // 图表选项
          chart: {
            container: chartSelector, // 包裹该图表的容器
            margin: [25, 10, 10, 10],
            background: '#242424',
            panable: true, // 是否可拖动
          },
          // 插件选项
          plugins: {
            // 十字准线
            crosshair: {
              style: {},
            },
            // x坐标标签
            axisTag: {
              style: {},
            },
            // 悬浮点
            hoverPoint: {},
          },
          // 图表数据显示title
          tooltip: {
            position: evoChart.static.TOP,
            x: 5, // 偏移值
            y: -15,
            color: {
              value: '#e0e0e0',
              charts: ['k'],
            },
            // 日期、开低高收、涨跌幅在一个point上，其余MA5等分别单独在一个point上
            htmlHandler(point) { // return 字符串，字符串颜色跟随线段颜色
              let result = '';
              let pointColor = point.color;
              /**
               * 蜡烛图跌是浅蓝色，显示到tooltip上要求改为绿色
               * 开收一致原本是白色，现改成灰色显示
               */
              if (pointColor === '#54FCFC') {
                pointColor = '#3cc13e';
              } else if (pointColor === '#f5f7fb') {
                pointColor = '#4d4d4d';
              }
              const series = point.series; // point所属线段
              // 如果point所属线段是蜡烛线，并且具有date属性返回日期、开低高收、涨跌幅信息
              if (series.type === 'candleStick' && point.date) {
                const resultContent = `<div class="tooltip-date">日期${point.date}</div><div class="tooltip-content"><div class="item tooltip-open"><span class="txt">开盘：</span><span class="val" style="color: ${pointColor}">${evoChart.format.num(point.open, 'cn', 2)}</span></div><div class="item tooltip-low"><span class="txt">最低：</span><span class="val" style="color: ${pointColor}">${evoChart.format.num(point.low, 'cn', 2)}</span></div><div class="item tooltip-high"><span class="txt">最高：</span><span class="val" style="color: ${pointColor}">${evoChart.format.num(point.high, 'cn', 2)}</span></div><div class="item tooltip-close"><span class="txt">收盘：</span><span class="val" style="color: ${pointColor}">${evoChart.format.num(point.close, 'cn', 2)}</span></div><div class="item tooltip-ratio"><span class="txt">涨跌：</span><span class="val" style="color: ${pointColor}">${point.ratio}%</span></div></div>`;
                if (point.plotX > (series.seriesArea.width - 130)) {
                  result = `<div class="tooltip candleStick offsetL">${resultContent}</div>`;
                  toggleFlag = false;
                } else if (point.plotX < 220) {
                  result = `<div class="tooltip candleStick offsetR">${resultContent}</div>`;
                  toggleFlag = true;
                } else if (!toggleFlag) {
                  result = `<div class="tooltip candleStick offsetL">${resultContent}</div>`;
                } else {
                  result = `<div class="tooltip candleStick offsetR">${resultContent}</div>`;
                }
              } else if (point.y !== null && typeof point.y !== 'undefined') {
                // 或者如果point的y不为空，则返回该point的名称以及相应的y值
                result = `<span class="tooltip notCandleStick" style="color: ${pointColor}">${point.series.name}：${evoChart.format.num(point.y, 'cn', 2)}   </span>`;
              } else {
                result = '';
              }
              return result;
            },
          },
          // x轴选项
          xAxis: [
            {
              position: evoChart.static.BOTTOM, // x轴位置
              space: 0, // 坐标占据的空间
              max: 'auto',
              min: 'auto',
              limit: 0,
              interval: 5, // tick的间距
              inverse: false, // 是否翻转
              ticks: false, // 刻度的值
              rightLimit: 20, // 绘图区域的右边距
              offset: 0, // 平移比例， x只能水平，y只能垂直
              length: 100, // 坐标占绘图区的比例（chart.paintArea以这个属性计算）
              label: false, // 刻度上的文字
              splitLine: null, // 状态分割线
              style: { // 坐标的样式集合
                tick: {
                  length: 0,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },

              },
            },
            {
              position: evoChart.static.BOTTOM,
              space: 50,
              max: 'auto',
              min: 'auto',
              rightLimit: 20,
              limit: 0,
              interval: 5,
              inverse: false,
              // 刻度上的值
              ticks: (max, min) => {
                const length = max - min;
                const result = [];
                const series = self.chart.getSeries('k'); // 获取到k线线段
                const monthCache = {}; // 月份缓存
                const yearCache = {}; // 年份缓存
                let j = 0;
                if (!series) {
                  return result;
                }
                for (j; j < length; j += 1) {
                  const index = min + j;
                  const point = series.points[index];
                  // 判断该点是否有线段日期属性
                  if (point && point.date) {
                    const date = point.date.split('-');
                    const year = date[0];
                    const month = date[1];
                    // 判断年份、月份缓存中是否有当前点所属的年月份，没有的话则push到刻度队列中
                    if (!yearCache[year]) {
                      result.push({
                        x: index,
                        text: year,
                      });
                      yearCache[year] = 1;
                    } else if (!monthCache[year + month] && month !== '01') {
                      result.push({
                        x: index,
                        text: `${month}月`,
                      });
                      monthCache[year + month] = 1;
                    }
                  }
                }
                return result;
              },
              // x轴标签 这里显示日期
              label(v) {
                const val = parseInt(v, 10);
                const series = self.chart.getSeries('k');
                let point;
                let result = '';
                if (series) {
                  point = series.points[val];
                  if (point) {
                    result = point.date;
                  }
                }
                return result;
              },
              offset: 0,
              length: 100,
              style: {
                tick: {
                  stroke: null,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
          ],
          // y轴选项
          yAxis: [
            {
              position: evoChart.static.LEFT, // y轴位置
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              // 网格选项
              grid: {
                style: {
                  stroke: '#2b2b2b',
                  lineDash: null,
                },
              },
              space: 50, // y坐标占据的空间
              topLimit: 15, // 绘图区域上内边距
              bottomLimit: 0, // 绘图区域下内边距
              max: 'auto',
              min: 'auto',
              interval: 0, // tick的间距
              inverse: false, // 是否翻转
              ticks: 'auto',
              offset: 0,
              length: 43, // y轴长度
              label: value => evoChart.format.num(value, 'cn', 2),
              style: {
                tick: {
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                  lineWidth: 0,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#fff',
                },
              },
            },
            {
              position: evoChart.static.LEFT,
              grid: false,
              space: 50,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: (dmax, dmin) => [dmin, (dmax + dmin) / 2, dmax],
              topLimit: 15,
              offset: 43, // 上面的y轴的长度是43，这里就向下偏移43
              length: 18,
              style: {
                tick: {

                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
            {
              position: evoChart.static.LEFT,
              space: 50,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              grid: false,
              ticks: (dmax, dmin) => [dmin, (dmax + dmin) / 2, dmax],
              topLimit: 15,
              offset: 61, // 这里的偏移值由上面两个y轴的长度相加得到43 + 18
              length: 18,
              style: {
                tick: {
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
            {
              position: evoChart.static.LEFT,
              grid: false,
              space: 50,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: (dmax, dmin) => [dmin, (dmax + dmin) / 2, dmax],
              topLimit: 15,
              offset: 79,
              length: 24,
              label: 'auto',
              style: {
                tick: {
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
            {
              position: evoChart.static.LEFT,
              grid: false,
              space: 50,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: (dmax, dmin) => [dmin, (dmax + dmin) / 2, dmax],
              topLimit: 15,
              offset: 43, // 上面的y轴的长度是43，这里就向下偏移43
              length: 28,
              style: {
                tick: {

                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
          ],
          // 线段选项
          series: [
            // k线 线段
            {
              type: 'candleStick', // k线的线段类型是蜡烛图，其余是折线图
              id: 'k',
              data: [],
              gapSize: 3,
              statusColor: ['#FF3232', '#f5f7fb', '#54FCFC'],
            },
            // ma5 线段
            {
              type: 'tickLine',
              id: 'ma5',
              data: [],
              style: {
                circle: {
                  lineWidth: 0,
                },
                line: {
                  stroke: '#fff',
                  lineWidth: 1.5,
                  smooth: 0.7,
                },
              },
            },
            // ma10 线段
            {
              type: 'tickLine',
              id: 'ma10',
              data: [],
              style: {
                circle: {
                  lineWidth: 0,
                },
                line: {
                  stroke: '#FFFF0B',
                  lineWidth: 1.5,
                  smooth: 0.7,
                },
              },
            },
            // ma20 线段
            {
              type: 'tickLine',
              id: 'ma20',
              data: [],
              style: {
                circle: {
                  lineWidth: 0,
                },
                line: {
                  stroke: '#FF80FF',
                  lineWidth: 1.5,
                  smooth: 0.7,
                },
              },
            },
            // ma60 线段
            {
              type: 'tickLine',
              id: 'ma60',
              data: [],
              style: {
                circle: {
                  lineWidth: 0,
                },
                line: {
                  stroke: '#00E600',
                  lineWidth: 1.5,
                  smooth: 0.7,
                },
              },
            },
            {
              type: 'marker',
              id: 'marker',
              hover: false,
              data: [],
            },
          ],
        });
        // 循环遍历图表数量，嵌套遍历线段数量，给每一个图表分别添加4条线段
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
             ctor = chart3;
          }
          for (let j = 0; j < seriesAmount; j += 1) {
            /**
             * 添加线段到图表实例
             * chart_0_0: 成交量
             * chart_1_0: 主力多头 chart_1_1: 主力空头
             * chart_2_0: 大单净量
             */
            this.chart.addSeries(ctor([], `chart_${i}_${j}`));
          }
        }

        // 显示图表正在加载
        this.chart.loading.show();
        // 监听拖动事件
        this.chart.on('pan', () => {
          interactionLimit.isInteracting = true; // 打开的时候不接收数据，每隔三秒自动刷新
        });
        // 监听鼠标滚轮事件
        this.chart.on('mousewheel', () => {
          interactionLimit.isInteracting = true;
        });
        // 监听浏览器窗口resize事件，窗口大小调整就重新获取图表显示区域
        window.addEventListener('resize', this.getChartArea);
      },
      // 刷新图表
      refreshTick(data) {
        if (!this.chart) {
          return;
        }
        const k = data.line;
        const ma5 = data.ma5;
        const ma10 = data.ma10;
        const ma20 = data.ma20;
        const ma60 = data.ma60;
        const chart = this.chart;
        if (chart) {
          chart.loading.hide();
        }
        if (k && k.length) {
          chart.getSeries('k').setSeries(chartHandler(this.isInit, 'k线', k));
          chart.getSeries('ma5').setSeries(chartHandler(this.isInit, 'MA5', ma5));
          chart.getSeries('ma10').setSeries(chartHandler(this.isInit, 'MA10', ma10));
          chart.getSeries('ma20').setSeries(chartHandler(this.isInit, 'MA20', ma20));
          chart.getSeries('ma60').setSeries(chartHandler(this.isInit, 'MA60', ma60));
          chart.getSeries('marker').setSeries(chartHandler(this.isInit, 'marker', this.markerCreate(data.marker)));
        }
        baseUtil.each(this.config, (name, index) => {
          const seriesName = this.typeMap[name];
          const seriesData = baseUtil.copy(data[seriesName]);
          let count = 0;
          if (seriesData) {
            if (baseUtil.isArray(seriesData)) {
              chart.getSeries(`chart_${index}_0`).setSeries(chartHandler(this.isInit, name, seriesData));
              this.clearChart(`chart_${index}_1`, `chart_${index}_2`, `chart_${index}_3`);
            } else {
              baseUtil.each(seriesData, (series, seriesType) => {
                chart.getSeries(`chart_${index}_${count}`).setSeries(chartHandler(this.isInit, name, series, seriesType));
                count += 1;
              });
              for (count; count < 3; count += 1) {
                this.clearChart(`chart_${index}_${count}`);
              }
            }
          }
        });
        if (!this.isInit) {
          this.isInit = true;
        }
      },
      seriesHandler(e) {
        const data = baseUtil.copy(e.data);
        this.refreshTick(data);
      },
      singleHandler(e) {
        if (this.isInit) {
          const data =baseUtil.copy(e.data);
          this.refreshTick(data);
        }
      },
      hoverLastPoint() {
        const vm = this;
        const chart = vm.chart;
        // 获取图表dom
        const chartDom = document.getElementById(`chart_t_${vm.chartId}`);
        if (chartDom) {
          // 给图表dom绑定onmouseleave事件
          chartDom.onmouseleave = function () {
            // 将原来hover的点的isHover属性设置为false
            const prevHover = chart.hoverPoints; // prevHover也可通过chart.plugnis.hoverPoint.prevHover获得
            baseUtil.each(prevHover, (p) => {
              p.isHover = false;
            });
            // 先清空chart原来hover的点
            chart.hoverPoints = [];
            // 获取所有线段最后一个点并放进chart的hoverPoints里
            // 这里要读取chart的私有属性_series，所以要在eslint忽略KChart.vue
            baseUtil.each(chart._series, (serie) => {
              const lastPoint = baseUtil.getLast(serie.points);
              if (lastPoint) {
                chart.hoverPoints.push(lastPoint);
              }
            });
            // 渲染更新chart的 tooltip
            chart.component.tooltip._eventHandler();
            // 让悬浮窗消失
            const candleStickDom = document.getElementsByClassName('candleStick');
            baseUtil.each(candleStickDom, (candleStick) => {
              candleStick.style.display = 'none';
            });
          };
        }
      },
    },
    activated() { // 入口
      this.initChart();
      this.getChartArea();
      const userConfig = this.config;
      seriesStorage.listen('k', this.code, this.seriesHandler);
      seriesStorage.pullData({
        code: this.code,
        type: 'k',
      });
      baseUtil.each(userConfig, (item) => {
        if (item !== '成交量') {
          seriesStorage.listen('k', this.code, this.typeMap[item], this.singleHandler);
          seriesStorage.pullData({
            code: this.code,
            type: 'k',
            name: this.typeMap[item],
          });
        }
      });
      // 鼠标移出图表时，tooltip显示最后一个点的数据
      this.hoverLastPoint();
    },
    deactivated() { // 出口
      if (this.chart) {
        this.isInit = false;
        this.chart.destroy();
        delete this.chart;
        seriesStorage.unlisten('k', this.code, this.seriesHandler);
        window.removeEventListener('resize', this.getChartArea);
      }
    },
  };
</script>
<!-- 删除了scoped属性，不然悬浮框的样式不生效-->
<style lang="scss" rel="stylesheet/scss">

  .evoChart-title {
    width: calc(100% - 65px);
    height: 20px;
    .offsetR {
      right: 10px;
    }
    .offsetL {
      left: 6px;
    }
    .candleStick {
      position: absolute;
      top: 20px;
      width: 130px;
      height: 152px;
      .tooltip-date {
        padding: 11px 16px 9px 17px;
        border-radius: 6px 6px 0 0;
        width: 100%;
        height: 32px;
        background-color: #223d80;
        line-height: 12px;
        color: #fff;
      }
      .tooltip-content {
        padding-top: 10px;
        padding-bottom: 1px;
        border-radius: 0 0 6px 6px;
        background-color: #ebebeb;
        .item {
          margin-bottom: 10px;
          height: 12px;
          line-height: 12px;
          font-size: 12px;
          .txt {
            margin-right: 10px;
            margin-left: 20px;
            width: 100%;
            letter-spacing: 0;
            color: #4d4d4d;
          }
        }
      }
    }
  }
  .chartContainer {
    width: 100%;
    height: 100%;
    .selector-container {
      position: relative;
      z-index: 11;
    }
  }
</style>
