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

  const chart0 = (data, id) => {
    const d = data;
    return {
      type: 'histogram',
      data: d,
      name: 'vol',
      id,
      gapSize: 1,
      yAxis: 1,
      xAxis: 1,
      splitLine: 0,
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
  const chartHandler = (type, data, dataType) => { // type 为指标名字 datatype 为指标内的线段
    const config = {
      name: type,
      points: data,
      displayRange: 'latest',
    };
    const styleConfig = {
      bba: {
        name: '大单主动买入',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      bbd: {
        name: '大单被动买入',
        style: {
          line: {
            stroke: '#FF8F8F',
          },
        },
      },
      bsa: {
        name: '大单主动卖出',
        style: {
          line: {
            stroke: '#00B200',
          },
        },
      },
      bsd: {
        name: '大单被动卖出',
        style: {
          line: {
            stroke: '#6CDE6C',
          },
        },
      },
      sellorder: {
        name: '委托卖出量',
        style: {
          line: {
            stroke: '#00e600',
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
      buysum: {
        name: '买方委托撤单',
        style: {
          line: {
            stroke: '#FF3232',
          },
        },
      },
      sellsum: {
        name: '卖方委托撤单',
        style: {
          line: {
            stroke: '#00e600',
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
      case '资金流入':
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
//      case '全局委托':
//        baseUtil.merge(config, {
//          type: 'tickLine',
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
//          style: {
//            line: {
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

  const configMaker = (code) => {
    let config;
    if (ycjUtil.isIndex(code)) {
      config = ['成交量'];
    } else {
      config = ['成交量'];
    }
    return config;
  };
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
//        全局委托: 'qjwt',
//        撤单统计: 'cdtj',
        委托买入: 'wtb',
        委托卖出: 'wts',
        资金流入: 'zjlr',
      };
    }
    return map;
  };
  export default {
    name: 'TickChart',
    data() {
      return {
        chartId: uid(),
        typeMap: configMapMaker(this.code),
        chartArea: [],
        config: configMaker(this.code),
        preConfig: configMaker(this.code),
        isInit: false,
        prevCode: this.code,
      };
    },
    props: {
      code: {
        type: [String, Number],
        required: true,
      },
      marker: {
        type: String,
      },
    },
    watch: {
      code() {
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
        if (this.chart) {
          this.chart.loading.show();
        }
        this.config = configMaker(this.code);
        this.preConfig = configMaker(this.code);
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
      findMarker(data, time) {
        let point = {
          x: 0,
          y: 0,
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAEBGQTXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA3LTI2VDE1OjEyOjQzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wNy0yNlQxNToxMjo0NiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wNy0yNlQxNToxMjo0NiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDMyQTg2QkI3MUQxMTFFNzlCMzZDNTFDQTQ3RTRFN0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDMyQTg2QkM3MUQxMTFFNzlCMzZDNTFDQTQ3RTRFN0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMzJBODZCOTcxRDExMUU3OUIzNkM1MUNBNDdFNEU3QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMzJBODZCQTcxRDExMUU3OUIzNkM1MUNBNDdFNEU3QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmfl/JUAAAD0SURBVHjaYvwfa8sABIxMDBDwDyCAGKEiDCCR/0CcCRBAMBEFIL4PU7sFygGB/wABBFPBCNXCADcNiBVhAqlQwXswgVkMCLATIIDg9kLBE6h50jABFiTJ/2hsRmRLkSVRNAAEELoVE4E4H8ZhQpLgAeI8KI0h+RqNhkvaAzEHlA2iHZElD6A5aB9MsocBO5gIcu1/HJIMAAGG7hVkEAPEi4E4AYgXYlPAhENjE1QjCCwA4nZsiliwiK0C4lA0sQogVgfiIFw2MwPxeSwaYSAQiC9B1aFoFgDi50BswIAf6ALxC6h6sGaQc14BsSgDcUAEql4DAFiOMUsbJbWnAAAAAElFTkSuQmCC',
          width: 15,
          height: 13,
          offsetX: -7.5,
          offsetY: 0,
        };
        const timeReg = new RegExp(time);
        baseUtil.each(data, (item) => {
          if (timeReg.test(item.date)) {
            point.x = item.x;
            point.y = item.y;
          }
        });
        if (!point.y && !point.x) {
          point = false;
        }
        return point;
      },
      indexOptions(value) {
        if (!this.code) {
          return false;
        }
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
        seriesStorage.pullData({
          code: this.code,
          type: 'tick',
          name: this.typeMap[value],
        });
        if (this.config.indexOf(preSeries) < 0) {
          if (preSeries !== '成交量') {
            seriesStorage.stopPullData({
              code: this.code,
              type: 'tick',
              name: this.typeMap[preSeries],
            });
          }
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
        const seriesAmount = 4;
        let i = 0;

        const chartSelector = `#chart_t_${this.chartId}`;
        this.chart = evoChart.create({
          chart: {
            container: chartSelector,
            margin: [10, 10, 10, 10],
            background: '#212121',
            panable: false,
          },
          plugins: {
            crosshair: {
              style: {},
            },
            axisTag: {
              style: {},
            },
            hoverPoint: true,
          },
          tooltip: {
            position: evoChart.static.TOP,
            x: 5,
            y: 18,
            format(point) {
              let result = '';
              if (point.series.name === '分时' && point.y) {
                result += `分时:${point.date}   价格：${parseFloat(point.y, 10).toFixed(2)}    涨跌幅：${parseFloat(point.ratio, 10).toFixed(2)}%`;
              } else if ((point.series.name === '委托卖出量' || point.series.name === '委托买入量') && point.y) {
                result = `${point.series.name}：${format.num(point.y / 100, 'cn', 2)}万   `;
              } else if (point.series.name === '资金流向' && point.y) {
                result = `${point.series.name}：${format.num(point.y, 'cn', 2)}万   `;
              } else if (point.series.name === '均价' && point.y) {
                result = `${point.series.name}：${format.num(point.y, 'cn', 2)}   `;
              } else if (point.series.name === '成交量' && typeof point.y === 'number') {
                result = `${point.series.name}：${format.num(point.y, 'cn', 0)}手   `; // 这里有问题
              } else if (point.y !== null && typeof point.y !== 'undefined') {
                result = `${point.series.name}：${format.num(point.y, 'cn', 2)}   `;
              } else {
                result = '';
              }

              return result;
            },
          },
          xAxis: [
            {
              position: evoChart.static.BOTTOM,
              space: 0,
              max: 'auto',
              min: 'auto',
              limit: 0,
              interval: 5,
              inverse: false,
              ticks: () => [120],

              rightLimit: 10,
              leftLimit: 5,
              offset: 0,
              length: 100,
              label: () => null,
              splitLine: null,
              grid: {
                style: {
                  stroke: null,
                  lineDash: null,
                },
                particular: {
                  middle: {
                    stroke: '#2b2b2b',
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
            {
              position: evoChart.static.BOTTOM,
              space: 50,
              max: 'auto',
              min: 'auto',
              rightLimit: 10,
              leftLimit: 5,
              interval: 5,
              inverse: false,
              ticks: () => [0, 60, 120, 180, 240],
              offset: 0,
              length: 100,
              grid: {
                style: {
                  stroke: null,
                  lineDash: null,
                },
                particular: {
                  middle: {
                    stroke: '#2b2b2b',
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
                  fill: '#e0e0e0',
                },
              },
            },
          ],
          yAxis: [
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
              },
              space: 50,
              topLimit: 25,
              bottomLimit: 25,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: 'tick',
              splitLine: this.preClose,
              statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
              offset: 0,
              length: 76,
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
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: false,
              space: 50,
              max: 'auto',
              min: 'auto',
//              topLimit: 25,
//              bottomLimit: 5,
              interval: 0,
              inverse: false,
              ticks: (max, min) => [min, (max + min) / 2, max],
              offset: 76,
              length: 26,
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
            {
              position: evoChart.static.RIGHT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: false,
              space: 50,
              topLimit: 25,
              bottomLimit: 25,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: 'tick',
              splitLine: this.preClose,
              statusColor: ['#FF3232', '#f5f7fb', '#00e600'],
              offset: 0,
              length: 76,
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
          ],
          series: [
            {
              type: 'multiLine',
              name: '分时',
              id: 'tick',
              data: [],
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
            {
              type: 'marker',
              id: 'marker',
              hover: false,
              data: [],
            },
          ],
        });

        for (i; i < 1; i += 1) {
          let ctor;
          switch (i) {
            case 0:
              ctor = chart0;
              break;
            default:
              break;
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
        const tick = data.line;
        const ma = data.ma;
        const preClose = data.preClose;
        const chart = this.chart;
        const yA = '_yAxis';
        const yAxis = chart.getSeries('tick')[yA];
        let marker;

        chart.loading.hide();
        yAxis.max = 'auto';
        yAxis.min = 'auto';

        if (tick && tick.length) {
          const markerSeries = chart.getSeries('marker');
          yAxis.splitLine = preClose;
          chart.getSeries('tick').setSeries(chartHandler('分时', tick));
          chart.getSeries('ma').setSeries(chartHandler('均价', ma));
          this.clearChart('marker'); // 移除marker 图表
          if (this.marker) {
            marker = this.findMarker(tick, this.marker);
          }

          if (marker && markerSeries.points.length === 0) {
            chart.getSeries('marker').setSeries({
              points: [marker],
            });
          }
        }
        baseUtil.each(this.config, (name, index) => {
          const seriesName = this.typeMap[name];
          const seriesData = baseUtil.copy(data[seriesName]);
          let count = 0;
          if (seriesData) {
            if (baseUtil.isArray(seriesData)) {
              chart.getSeries(`chart_${index}_0`).setSeries(chartHandler(name, seriesData));
              this.clearChart(`chart_${index}_1`, `chart_${index}_2`, `chart_${index}_3`);
            } else {
              baseUtil.each(seriesData, (series, seriesType) => {
                chart.getSeries(`chart_${index}_${count}`).setSeries(chartHandler(name, series, seriesType));
                count += 1;
              });
              for (count; count < 3; count += 1) {
                this.clearChart(`chart_0_${count}`);
              }
            }
          }
        });
      },
      seriesHandler(e) {
        const data = e.data;
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
    mounted() {
      if (!this.chart) {
        this.initChart();
        this.getChartArea();
        const userConfig = this.config;
        if (this.code) {
          seriesStorage.listen('tick', this.code, this.seriesHandler);
          seriesStorage.pullData({
            code: this.code,
            type: 'tick',
          });
          baseUtil.each(userConfig, (item) => {
            if (item !== '成交量') {
              seriesStorage.pullData({
                code: this.code,
                type: 'tick',
                name: this.typeMap[item],
              });
            }
          });
        }
      }
    },
    activated() {
      if (!this.chart) {
        this.initChart();
        this.getChartArea();
        const userConfig = this.config;
        if (this.code) {
          seriesStorage.listen('tick', this.code, this.seriesHandler);
          seriesStorage.pullData({
            code: this.code,
            type: 'tick',
          });
          baseUtil.each(userConfig, (item) => {
            if (item !== '成交量') {
              seriesStorage.pullData({
                code: this.code,
                type: 'tick',
                name: this.typeMap[item],
              });
            }
          });
        }
      }
    },
    deactivated() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
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
    .chart{
      width: 100%;
      height: 100%;
    }
  }
</style>
