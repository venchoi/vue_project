<template>
  <div class="chart" :id="'c'+ chartId"></div>
</template>

<script>
  import evoChart from 'evoChart';
  import {
    uid,
    baseUtil,
  } from './../../util';
  import seriesStorage from '../../model/memory/seriesMemory';
  import chartDataHandler from '../../plugins/dataHandler/chart';
  import {
    columnSocket,
    EVENT,
  } from '../../plugins/YCJWebSocket/YCJWebSocket';

  const chineseName = {
    '000016.SH': '上证50',
    '399006.SZ': '创业板指数',
  };

  let tradeData = null;

  export default {
    name: 'FiveDaysTickChart',
    data() {
      return {
        isInit: false,
        chartId: uid(),
      };
    },
    props: {
      code: {
        type: [String, Number],
        default: null,
      },
    },
    methods: {
      getData() {
        seriesStorage.listen('tick', this.code, this.seriesHandler);
        seriesStorage.pullData({
          type: 'tick',
          name: 'fiveDaysTick',
          code: this.code,
        });
        seriesStorage.pullData({
          type: 'tick',
          code: this.code,
        });
        this.isInit = true;
      },
      stopData() {
        seriesStorage.unlisten('tick', 'fiveDaysTick', this.code, this.seriesHandler);
      },
      initChart() {
        const seriesData = seriesStorage.getData(this.code).tick || {};
        const fiveDaysTick = seriesData.fiveDaysTick || [];
        const tick = seriesData.line;
        if (document.querySelectorAll(`#c${this.chartId}`).length < 1) {
          return;
        }

        this.chart = evoChart.create({
          chart: {
            container: `#c${this.chartId}`,
            margin: [10, 10, 10, 10],
            background: '#212121',
            displayRange: 'max',
            panable: false,
          },
          plugins: {
            crosshair: {},
            axisTag: {
              format(v) {
                const val = parseFloat(v, 10);
                const series = this.chart.getSeries('tick');
                let point;
                let result = '';
                if (series) {
                  point = series.searchPoint(val);
                  if (point) {
                    result = point.date;
                  }
                }
                return result;
              },
            },
            hoverPoint: true,
          },
          tooltip: {
            position: evoChart.static.TOP,
            x: 0,
            y: -55,
            html: `${chineseName[this.code]}五日分时图   <span style="margin-left: 10px">指数：</span><span style="color: #f4b95c;">{{y}}</span> <span style="margin-left: 10px">日期：{{date}}</span>`,
          },
          xAxis: [
            {
              position: evoChart.static.BOTTOM,
              space: 20,
              max: 'auto',
              min: 'auto',
              rightLimit: 20,
              limit: 0,
              interval: 5,
              inverse: false,
              grid: {
                style: {
                  stroke: '#3b3b3b',
                  lineDash: [2, 5],
                },
                particular: {
                  even: {
                    stroke: null,
                    fill: null,
                  },
                },
              },
              ticks: [121, 241, 362, 483, 604, 725, 846, 967, 1088], // 每一项进行下面的label
              label: function label(v) {
                if ((v + 1) % 242 === 121 || (v + 1) % 242 === 122) {
                  const val = parseInt(v, 10);
                  const series = this.chart.getSeries('tick');
                  let point;
                  let result = '';
                  if (series) {
                    point = series.points[val];
                    if (point && point.date) {
                      result = point.date.substr(0, 10);
                    } else {
                      result = evoChart.format.date(new Date(), 'yyyy-MM-dd');
                    }
                  }
                  return result;
                }
                return null;
              },
              style: {
                tick: {
                  lineWidth: 0,
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
              space: 0,
              max: 'auto',
              min: 'auto',
              topLimit: 50,
              interval: 0,
              inverse: false,
              ticks: false,
              label: false,
              offset: 0,
              length: 100,
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: null,
                },
              },
            },
          ],
          series: [
            {
              type: 'tickLine',
              data: fiveDaysTick.concat(tick), // 用4天历史数据连接当日数据
              name: 'tick',
              id: 'tick',
              style: {
                circle: {
                  lineWidth: 0,
                },
                line: {
                  stroke: '#223d80',
                  lineWidth: 1.5,
                  smooth: 0.5,
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
        this.chart.loading.show();
        if (fiveDaysTick.length > 0 && tick.length > 0) {
          this.updateTradeData();
        }
        if (fiveDaysTick.length > 0) {
          this.chart.loading.hide();
          this.isInit = true;
        }
      },
      /**
       * 买卖点创建
       * @param data -
       * @returns {Array}
       */
      markerCreater(data) {
        const points = [];
        let result = [];
        const buyPoint = {
          x: 0,
          y: 0,
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAvCAYAAACR+4jVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA5LTI2VDEwOjEyOjA0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wOS0yNlQxNDo1NSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wOS0yNlQxNDo1NSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OURCOTI2NzNBMjg3MTFFN0EyQ0VGQjdEMEMzNkJGNDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OURCOTI2NzRBMjg3MTFFN0EyQ0VGQjdEMEMzNkJGNDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5REI5MjY3MUEyODcxMUU3QTJDRUZCN0QwQzM2QkY0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5REI5MjY3MkEyODcxMUU3QTJDRUZCN0QwQzM2QkY0NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoCnAz4AAAOoSURBVHja7JjdT1JhHMcfBXXALASd0VCb2XEiaKmTtGTOrKu6ybtc/hNt1VUXXtVWf0C3tVY3rrZabfQy5xTU6WahtWj5MiBRRFGTN2H0/RE4cGgIKGeL3/Y9zznPec45n/N7ec5LnlarFTLGeiAtJGH8MDc0Cg0Q3HWoi/HLxBGm7XwszjP+2sV8HoU1kUnyGc/t0AEVCoVcLBYXpnq8MNmBqPY2iUQi32t/QUFBscvlmh8bGzPG9stkMnl9fX2nwWB47Xa7/QcFFCiVymvJDLTZbFav1+vc2NhwTE1NTc7NzZnhGTY+Pm6k9ZqaGo3JZBr2eDxxEA6HwykSiYIqlapjdnb226GG2Ofz+XFDXFdX11UKW3l5OUf9VVVVJ8l7q6urm4mOm5mZMQsEgsJm2KGFuLGxUQMI58jIyCABxYZrYWHhF2m/PKS2tLSUw42ZDhLqpD1osVjmyXs6ne4KwRDk1taWM5ljKysrObvdPr2ysmKuq6vTZNyDSPRiMqvVai6EEZxUKpULhcIiWo+O8/v9vsXFxThoSgW5XF47Ojo6gBz2dXR09OB85r3SISVAgkN4FLF9yD+N0+n8HtsPgM3dgC0tLZ1LS0umKBBuclKtVrcNDQ3pMwa4O8cwbXCAWQkEAn6CoiLYK2/h8OKJiYnB2IJBkXFUMJOwjE0z0XA1NDScLSsrqzUaje+QU8sogAoAtweDwXXYZnRcU1NTa0lJyalE8x88Og8vdiPUIpq+0gakKmxtbb2EZFehki2YjIe3t7eDJIR0EX1WjuOaEW4pbWP9NLKiHOP0iSqWjgPY1+rqag3B0vZe187DE+JxMp4Lv6T9Y3qgcak8LdLOwWQvmmm4I3lZyASgi8d8LgLU8xhQTzn4EfJAbVBRiic6DkkTeQBaT+F8Pohe2wzRIjFElKqdgO7RtBXTF4AeQct8KBI79GlX34d04TJdxW+g6AsAhfUt36YZL/Qqsv4ykkdHM1EfwEYgZeSvAOMjYAh68V89SfJCodD//eGeA8wB5gBzgDy3zDzq+nQiLO9CvVAF/cqBnkH32ZMhT3afJH06+iP/HmpPsJdegi8D0p3NEJPn2i3eAOuddjC10RZuaTsCfTvbOXiDFnd+rDGjy8fcwVC4vWVei+6/mW1Ayjn25Xf8N/vnzZ1tZbYBqSDYueL4H/nNx3a2bdkGfE6LB2dk7IK0iIkFeeH2ISeL7n+aq+J97e/Fu6F+6Cfkj7T94f404Mj+CDAAQNKkKeZx9ZUAAAAASUVORK5CYII=',
          width: 40,
          height: 47,
          offsetX: -20,
          offsetY: -43,
        };
        const sellPoint = {
          x: 0,
          y: 0,
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAuCAYAAABap1twAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA5LTI2VDEwOjEyOjA0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wOS0yNlQxNDo1NDo1NyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wOS0yNlQxNDo1NDo1NyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUI3NzlEOEJBMjg3MTFFN0IxNTg4OENDNDE2NkE1RDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUI3NzlEOENBMjg3MTFFN0IxNTg4OENDNDE2NkE1RDEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5Qjc3OUQ4OUEyODcxMUU3QjE1ODg4Q0M0MTY2QTVEMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5Qjc3OUQ4QUEyODcxMUU3QjE1ODg4Q0M0MTY2QTVEMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuU8CyAAAANxSURBVHja7FhNaBNREH7Nz2abGFOaxHTThNgeorEtBDwk7UUNVSl6UxAUz94UPIgnERHUQ0G89Syil6IHqTRqDy1KLj2kWsEVKcFqWpuUhCYxqWKcCZmyLWmbn212kQx8ee/tzm6+nTffvLfbFggEdIyxc4AAwMTUYTlABDCO5M4DTjB1mREQwo4GEGTqtUEk2K5igu0apnKrm2BfX59XEARrtf4gxsFa/Ml01Tp2dnaae3p6vDS2WCxCR0dHxul0rtGxhYUFcXV1tTRGMnCNdX5+XsSxyWSychxnIN9QKHR2amrqpWwE8/l8IZFIxGnM87w5k8kkU6lUUupDfSSDPtvK1Gh0yhpBn883IB0bDIZ9pRvodBwdg4hao9HoBzlzsGqCGD2ICgdT543H4yKOXS6Xl6Lq8Xj6s9lsUnoNpsFRMOzr9Xoz+ttsNmFPRLKyspLANhaLfXS73f0URRj/oHOzYOS/BpZOp+Pb3Q8eclbWCEI+GSBvzEDOE4lEwna73UYEcrnc+vT0dFjq7/f7j0lFAKIQFhcXRXwgqgIIElFDBPFGDodjQ8HBYPCURqMxaLVaDv9Y6kukdhPBTgKqmSA+pfRJsYQA6eNzc3NhiOIaRnCvCrWuFmeICodqhkT3IjmsczAeLBQKGen0kZFAKokEBbRTjtZEkCJWFos4MzMzjlGDRE9iZPF8b2/vACqZcnGrCEDtYj0RbIMlaKza6Mk5lbgyYUsrT8NTLHee7Uas4c1CM3czaRXzSyHBSRUTDGMOvgVky1t/Y503suBeoVIE6pwhemmKkEgiZdRrXYBbAK3k2B/AKOCnIjvqLbaEq9yWY28aJSe3inENptKB0zqh6DtJpU034EW5/xxQaPpaXIW9A7gazOc9JVgEPFPFa2ezrK1YLP6fL+4tgi2CLYItgk1cSU5/GsOvtDcBlwBuwDfAE8D9ySNXfilaqIEcbnJfA4YqnH4POAkkc0pGECM39Hs5zX4+esXyn+OMPySwA1dHmN5hQdI3ALeVzMGL+LP8cILlojH2N79eapdHN74bXVZaJJhzrPBlafPmUNz4quFSmiAKgvGHN3/M4n3d1P2uNMGn+OO4NsKM/oNMw3Oltuv6GTr/WOkycw8Q0tn3D3XfvVBJxQ8UjWC5hAwD7gC+AtbLLY6HGykxaP8EGAAVGkGOdR6VmgAAAABJRU5ErkJggg==',
          width: 40,
          height: 47,
          offsetX: -20,
          offsetY: -43,
        };
        if (this.chart && this.chart.getSeries('tick').points.length > 0) {
          const series = this.chart.getSeries('tick');
          const codeMapCatId = {
            '000016.SH': '14',
            '399006.SZ': '13',
          };
          const matchId = codeMapCatId[this.code];
          baseUtil.each(data, (item) => {
            if (item.cat === matchId) {
              for (let i = 0; i < series.points.length; i += 1) {
                const point = series.points[i];
                if (point.date === item.inputtime) {
                  const x = point.x;
                  const y = point.y;
                  if (item.viewpoint === '1') {
                    points.push(baseUtil.merge(baseUtil.copy(buyPoint), {
                      x,
                      y,
                    }, true));
                  } else {
                    points.push(baseUtil.merge(baseUtil.copy(sellPoint), {
                      x,
                      y,
                    }, true));
                  }
                  break;
                }
              }
            }
          });
          points.sort((a, b) => a.x - b.x);
          if (points.length === 0) {
            result = result.concat(baseUtil.createArray(242 * 5, null));
          }
          baseUtil.each(points, (point, index) => {
            const x = point.x;
            if (points.length === 1) {
              result = result.concat(baseUtil.createArray((x) - 1, null));
              result.push(point);
              result = result.concat(baseUtil.createArray((242 * 5) - x, null));
            } else if (index === points.length - 1) {
              result = result.concat(baseUtil.createArray((x - points[index - 1].x) - 1, null));
              result.push(point);
              result = result.concat(baseUtil.createArray((242 * 5) - x, null));
            } else if (index === 0) {
              result = result.concat(baseUtil.createArray(x, null));
              result.push(point);
            } else {
              result = result.concat(baseUtil.createArray((x - points[index - 1].x) - 1, null));
              result.push(point);
            }
          });
        }
        return result;
      },
      /**
       * 更新买卖点
       * @param isForce
       */
      updateTradeData(isForce) {
        const vm = this;
        if (!vm.chart) {
          return;
        }
        const setMarker = (data) => {
          vm.chart.getSeries('marker').setSeries({
            points: data,
            displayRange: 'max',
          });
        };
        const pullData = () => {
          /**
           * 从state.moduleStock中获取数据
           * data: {
           *   data, // 买卖点信息
           *   head: ['cat', 'inputtime','viewpoint']
           * }
           */
          const data = this.$store.state.moduleStock.tradePoint;
          const handler = chartDataHandler.add(data);
          tradeData = handler.object('cat', 'inputtime', 'viewpoint');
          setMarker(vm.markerCreater(tradeData));
        };
        if (!tradeData || isForce) {
          pullData();
        } else {
          setMarker(vm.markerCreater(tradeData));
        }
      },
      refreshTick(data) {
        const chart = this.chart;
        const tick = data.line;
        const fiveDaysTick = data.fiveDaysTick;
        if (chart && tick && fiveDaysTick) {
          if (fiveDaysTick.length > 0 && tick.length > 0) {
            chart.getSeries('tick').setSeries({
              points: fiveDaysTick.concat(tick),
              displayRange: 'max',
            });
            this.updateTradeData();
          }
          chart.loading.hide();
          chart.refresh();
        }
      },
      seriesHandler(e) {
        const data = e.data;
        this.refreshTick(data);
      },
    },
    /* 订阅推送 */
    mounted() {
      const vm = this;
      columnSocket.on(EVENT.TENDENCY, () => {
        vm.updateTradeData(true);
      });
      if (!this.chart) {
        this.initChart();
      }
      if (!this.isInit) {
        this.getData();
      }
    },
    activated() {
      if (!this.chart) {
        this.initChart();
      }
      if (!this.isInit) {
        this.getData();
      }
    },
    destroyed() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
        this.stopData();
      }
    },
    deactivated() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
        this.stopData();
      }
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .chart {
    width: 100%;
    height: 100%;
  }
</style>
