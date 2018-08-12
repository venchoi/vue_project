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
  const chartHandler = (isInit, type, data, dataType) => {
    const config = {
      name: type,
      points: data,
    };
    if (!isInit) {
      config.displayRange = data.length ? [data.length - 61, data.length - 1] : 'latest';
    }
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
      sellorder: {
        style: {
          line: {
            stroke: '#00e600',
          },
        },
      },
      buyorder: {
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
      case '阻力线':
        baseUtil.merge(config, {
          type: 'tickLine',
          gapSize: 1,
          style: {
            circle: {
              lineWidth: 0,
            },
            line: {
              lineWidth: 1.5,
              stroke: '#FFFF00',
            },
          },
        }, true);
        baseUtil.merge(config, styleConfig[dataType], true);
        break;
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
        大单净量: 'ddjl',
      };
    } else {
      map = {
        成交量: 'vol',
        大单净量: 'ddjl',
//        阻力线: 'zlx',
        成交统计: 'cjtj',
        主力多空: 'zldk',
        全局委托: 'qjwt',
        撤单统计: 'cdtj',
      };
    }
    return map;
  };

  export default {
    name: 'KChart',
    data() {
      return {
        chartId: uid(),
        typeMap: configMapMaker(this.code),
        chartArea: [],
        config: configMaker(this.code),
        preConfig: configMaker(this.code),
        isInit: false,
        changeConfig: false,
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
        this.isInit = false;
        if (this.chart) {
          this.chart.loading.show();
        }
        if (this.prevCode && this.prevCode !== this.code) {
          seriesStorage.unlisten('k', this.prevCode, this.seriesHandler);
          seriesStorage.stopPullData({
            code: this.prevCode,
            type: 'k',
          });
          baseUtil.each(this.config, (item) => {
            seriesStorage.stopPullData({
              code: this.prevCode,
              type: 'k',
              name: this.typeMap[item],
            });
          });
        }

        this.config = configMaker(this.code);
        this.preConfig = configMaker(this.code);
        if (this.chart) {
          this.chart.loading.show();
        }
        seriesStorage.listen('k', this.code, this.seriesHandler);
        seriesStorage.pullData({
          code: this.code,
          type: 'k',
        });
        baseUtil.each(this.config, (item) => {
          seriesStorage.pullData({
            code: this.code,
            type: 'k',
            name: this.typeMap[item],
          });
        });
        this.prevCode = this.code;
      },
      config() {
        this.changeConfig = true;
      },
    },
    components: {},
    methods: {
      resize() {
        this.chart.resize();
        this.getChartArea();
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
        if (!this.preConfig[value]) {
          seriesStorage.listen('k', this.code, this.typeMap[value], this.singleHandler);
        }
        seriesStorage.pullData({
          code: this.code,
          type: 'k',
          name: this.typeMap[value],
        });
        if (this.config.indexOf(preSeries) < 0 && preSeries !== '成交量') {
          seriesStorage.unlisten('k', this.code, this.typeMap[preSeries], this.singleHandler);
          seriesStorage.stopPullData({
            code: this.code,
            type: 'k',
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
      findMarker(data, time) {
        const markers = [];
        const buyPoint = {
          x: 0,
          y: 0,
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAEBGQTXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA3LTI2VDE1OjEyOjQzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wNy0yNlQxNToxMjo0NiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wNy0yNlQxNToxMjo0NiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDMyQTg2QkI3MUQxMTFFNzlCMzZDNTFDQTQ3RTRFN0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDMyQTg2QkM3MUQxMTFFNzlCMzZDNTFDQTQ3RTRFN0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMzJBODZCOTcxRDExMUU3OUIzNkM1MUNBNDdFNEU3QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMzJBODZCQTcxRDExMUU3OUIzNkM1MUNBNDdFNEU3QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmfl/JUAAAD0SURBVHjaYvwfa8sABIxMDBDwDyCAGKEiDCCR/0CcCRBAMBEFIL4PU7sFygGB/wABBFPBCNXCADcNiBVhAqlQwXswgVkMCLATIIDg9kLBE6h50jABFiTJ/2hsRmRLkSVRNAAEELoVE4E4H8ZhQpLgAeI8KI0h+RqNhkvaAzEHlA2iHZElD6A5aB9MsocBO5gIcu1/HJIMAAGG7hVkEAPEi4E4AYgXYlPAhENjE1QjCCwA4nZsiliwiK0C4lA0sQogVgfiIFw2MwPxeSwaYSAQiC9B1aFoFgDi50BswIAf6ALxC6h6sGaQc14BsSgDcUAEql4DAFiOMUsbJbWnAAAAAElFTkSuQmCC',
          width: 15,
          height: 13,
          offsetX: -7.5,
          offsetY: 5,
        };
        const sellPoint = {
          x: 0,
          y: 0,
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAEBGQTXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA3LTI2VDE1OjEyOjQzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wNy0yNlQxNToxMjo0MyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wNy0yNlQxNToxMjo0MyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDFBODdDRjE3MUQxMTFFNzkxRUJFMzlGRjJCOUVDOTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDFBODdDRjI3MUQxMTFFNzkxRUJFMzlGRjJCOUVDOTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMUE4N0NFRjcxRDExMUU3OTFFQkUzOUZGMkI5RUM5OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMUE4N0NGMDcxRDExMUU3OTFFQkUzOUZGMkI5RUM5OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvmUYIAAAAD2SURBVHjaYjQ5aLKDgYHBnQlIeAAxA0AAMQJF/oMYIBElkABAAIFEQAJgUSBIY4EyGKH4P0AAwfVAwVaQ3iwkAR+QwHQoRxFEwMxgghkMEEDotqADRiYkWzEkYUYhC7wA4qfIGgACCN2ZKACkexIOuV58joM7zAlNwgHZUfuB+CeU/QOID6K7WARKiyI7CAa+APEUKA0GAAEGcpAGkL4ExKwMxIPfQKwDMvkGEIsB8RsiNb6GOu0WzFkfgFgCiC8T0HgBiCWB+CO6n/4CsR4Qr8ehcTUQG0LVYQQIDAQBcQeaWDMQh2GLXmygEogToOxYIK7DpggAjxIvm4fIFp4AAAAASUVORK5CYII=',
          width: 15,
          height: 13,
          offsetX: -7.5,
          offsetY: -13,
        };
        let buyIndex;
        const timeReg = new RegExp(time);
        baseUtil.each(data, (item, index) => {
          if (timeReg.test(item.date)) {
            buyPoint.x = item.x;
            buyPoint.y = item.low;
            buyIndex = index;
            if (data[index + 1]) {
              const sellItem = data[index + 1];
              sellPoint.x = sellItem.x;
              sellPoint.y = sellItem.high;
            }
            markers.push(buyPoint);
          } else {
            markers.push(null);
          }
        });
        return {
          index: buyIndex,
          markers,
        };
      },
      initChart() {
        const seriesAmount = 4;
        const self = this;
        let i = 0;
        const chartSelector = `#chart_t_${this.chartId}`;
        this.chart = evoChart.create({
          chart: {
            container: chartSelector,
            margin: [25, 10, 10, 10],
            background: '#212121',
            panable: true,
          },
          plugins: {
            crosshair: {
              style: {},
            },
            axisTag: {
              style: {},
            },
            hoverPoint: {},
          },
          tooltip: {
            position: evoChart.static.TOP,
            x: 5,
            y: 17,
            color: {
              value: '#e0e0e0',
              charts: ['k'],
            },
            format(point) {
              let result = '';
              const series = point.series;
              if (series.type === 'candleStick' && point.date) {
                result = `日期${point.date}   开：${evoChart.format.num(point.open, 'cn', 2)}   低：${evoChart.format.num(point.low, 'cn', 2)}  高：${evoChart.format.num(point.high, 'cn', 2)}  收：${evoChart.format.num(point.close, 'cn', 2)}   涨跌幅：${point.ratio}%`;
              } else if (point.y !== null && typeof point.y !== 'undefined') {
                result = `${point.series.name}：${evoChart.format.num(point.y, 'cn', 2)}   `;
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
              ticks: false,
              rightLimit: 20,
              offset: 0,
              length: 100,
              label: false,
              splitLine: null,
              style: {
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
              ticks: (max, min) => {
                const length = max - min;
                const result = [];
                const series = self.chart.getSeries('k');
                const monthCache = {};
                const yearCache = {};
                let j = 0;
                if (!series) {
                  return result;
                }
                for (j; j < length; j += 1) {
                  const index = min + j;
                  const point = series.points[index];
                  if (point.date) {
                    const date = point.date.split('-');
                    const year = date[0];
                    const month = date[1];
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
              topLimit: 15,
              bottomLimit: 0,
              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: 'auto',
              offset: 0,
              length: 73,
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
              offset: 76,
              length: 30,
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
              offset: 61,
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

              position: evoChart.static.RIGHT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: false,

              max: 'auto',
              min: 'auto',
              interval: 0,
              inverse: false,
              ticks: 'auto',
              label: value => evoChart.format.num(value, 'cn'),
              style: {
                tick: {
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#e0e0e0',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
          ],
          series: [
            {
              type: 'candleStick',
              id: 'k',
              data: [],
              gapSize: 3,
              statusColor: ['#FF3232', '#f5f7fb', '#54FCFC'],
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
        const k = data.line;
        const chart = this.chart;
        chart.loading.hide();
        let marker;
        if (k && k.length) {
          const markerSeries = chart.getSeries('marker');
          this.clearChart('marker');
          chart.getSeries('k').setSeries(chartHandler(this.isInit, 'k线', k));
          if (this.marker) {
            marker = this.findMarker(k, this.marker);
          }
          if (!this.isInit) {
            this.isInit = true;
          }
          if (marker) {
            markerSeries.setSeries({
              points: marker.markers,
            });
          }
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
    },
    deactivated() {
      if (this.chart) {
        this.isInit = false;
        this.chart.destroy();
        delete this.chart;
        seriesStorage.unlisten('k', this.code, this.seriesHandler);
        window.removeEventListener('resize', this.getChartArea);
      }
    },
    activated() {
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
    .chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
