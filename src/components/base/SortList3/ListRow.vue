<script>
  import {
    uid,
    baseUtil,
  } from '../../../util';
  import throttle from '../../../util/throttle';

  const createColList = ($vm) => {
    const columnList = $vm.columnList;
    columnList.splice(0, columnList.length);
    baseUtil.each($vm.renderList, (item) => {
      const row = item;
      if (!item.columnId) {
        row.columnId = `col${uid()}`;
      }
      columnList.push(row.columnId);
    });
  };

  export default {
    name: 'ListRow',
    data() {
      return {
//        childrenHeight: 45, // 每行的高度
        hoverIndex: null, // 当前鼠标悬停hover的列（columnList）
        activeIndex: 0, // 当前鼠标点中active的列（columnList）
        dragEnterIndex: null, // 当前拖拽元素进入的列（columnList），为了拖拽样式设置
        /**
         * 标注1：list.vue中listData是所有要显示的列表数据
         */
        columnList: [], // for sort，页面显示区域的部分列表，自动生成，只包含colId；为了样式设置
        renderList: [], // for render，当前显示的列信息，即当前渲染列表
        /**
         * 标注2：columnList、renderList的长度比renderListLength多2;
         */
        renderListLength: 0, // 计算得到的每页可显示的列表数
        startIndex: 0, // 页面显示的第一个列表在整个列表数组(listData)中的位置,从0开始
        clientHeight: 0, // 列表显示区域高度

        isScroll: false, // 是否需要滚动条,通过计算判断的

        scrollTop: 0, // renderList[0](页面显示的第一行)与ListData[0]的距离，像素距离
        translateY: 0,

        scrollMouseDownY: false,

        scrollStackHeight: 0, // clientHeight - scrollBarHeight;
        scrollBarHeight: 0, // 滚动条的长度
//        scrollBarTop: 0, // 滚动条顶部高度（相对于listData[0]的距离）
        scrollUnit: 0, //
        renderHeight: 0, // 无用变量，不知道干什么的-。-
        TimeFn: {}, // 判断是否是双击事件，双击事件屏蔽单击效果(目前没有考虑)
        dragStart: -1, // 拖拽元素开始时在listData中的数组下标。
        dragEnd: -1, // 拖拽元素放置的位置（在listData中的数组下标）。
        canGetMouseMove: true, // 鼠标移动事件处理判断
      };
    },
    /**
     * Vue提供的DOM选项：渲染函数
     * @param h - createElement方法用于创建VNode
     * @returns {boolean} - HTML结构
     */
    render(h) {
      const columnConfig = this.columnConfig;
      const renderProxy = this._renderProxy;
      const directives = [{ name: 'recive-global-event', value: ['keyup', 'mouseup', 'resize' ] }];
      if (!this.canDrag) {
        return (
          <div class="scroll-panel">
        {
//          hasScroll()
        }
      <div class="list-body" {...{ directives }} style={this.style}>
        {
          this.renderList.map(((row, $index) =>
            <div {...this.getRowProps(row)}
          onMouseup={$event => this.mouseKeyUp($event, row, $index)}
          onMouseover={() => this.mouserOver(row)}
          onMouseout={() => this.mouserOut(row)}
          onDblclick={($event) => this.dblclick(row)}>
          {
            Object.keys(columnConfig).map(key => columnConfig[key].render.call(
              renderProxy,
              h,
              {
                row,
                index: $index + this.startIndex,
              },
            ))
          }
        </div>))
        }
      </div>
        </div>
      );
      } else {
        return (
          <div class="scroll-panel">
        {
//          hasScroll()
        }
      <div class="list-body" {...{ directives }} style={this.style}>
        {
          this.renderList.map(((row, $index) =>
            <div {...this.getRowProps(row)} draggable="true"
          onDragstart={$event => this.dragstartEvent($event, $index)}
          onDragend={$event => this.dragendEvent($event)}
          onDragenter={$event => this.dragenterEvent($event, $index)}
          onDragleave={$event => this.dragleaveEvent($event, $index)}
          onDragover={$event => this.dragoverEvent($event)}
          onMouseup={$event => this.mouseKeyUp($event, row, $index)}
          onMouseover={() => this.mouserOver(row)}
          onMouseout={() => this.mouserOut(row)}
          onDblclick={() => this.dblclick(row)}>
          {
            Object.keys(columnConfig).map(key => columnConfig[key].render.call(
              renderProxy,
              h,
              {
                row,
                index: $index + this.startIndex,
              },
            ))
          }
        </div>))
        }
      </div>
        </div>
      );
      }
    },
    props: {
      /**
       * 从父组件(List)获取所要显示的列表数据，
       * listData: 列表数据；数组形式
       * */
      listData: {
        type: Array,
        required: true,
        default: [],
      },
      /**
       * 从父组件获取列名信息
       * columnConfig: 列名数据；对象形式
       * */
      columnConfig: {
        type: Object,
        default: {},
      },
      hoverColor: String, // 鼠标悬停颜色
      activeColor: String, // 鼠标点击颜色
      isHeadFixed: Boolean, // 表头是否固定
      canDrag: Boolean, // 是否可以拖拽
    },
    /**
     * Vue提供的生命周期钩子函数：create
     * 这里的create用于监听自定义事件。
     */
    created() {
      this.$on('keyup', this.keyDown); // 监听keyup事件
      this.$on('resize', () => { // 监听resize事件
        this.resize();
      });
      this.$on('mouseup', () => { // 监听mouseup事件
        this.scrollMouseDownY = 0;
      });
      if (this.columnList.length > 0) {
        this.activeIndex = this.columnList[0];
      }
    },
    beforeUpdate() {
      if (!this.activeIndex && this.columnList.length > 0) {
        this.activeIndex = this.columnList[0];
      }
    },
    /**
     * Vue中生命周期钩子函数：挂载函数
     */
    mounted() {
      const vm = this;
      this.clientHeight = this.$el.clientHeight;
      this.createRenderList();
    },
    watch: {
      /**
       *  监听listData的改变，如果listData发生变化则重新渲染列表
       *  注意：父组件传递的值得变化也可以监听到，但要注意数组的赋值：
       *  vue中数组直接赋值vm.array[index] = newValue是不能被监测到的；
       *  需要使用vm.array.splice(index, 1, newValue)或者vue.set(vm.array, index, newValue);
       *  */
      listData() {
        this.createRenderList();
      },
      /**
       *  监听当前鼠标点击的行
       *  */
      activeIndex() {
        const colIndex = this.columnList.indexOf(this.activeIndex);
        this.$emit('activeChange', this.activeIndex, this.renderList[colIndex]);
      },
    },
    computed: {
      /**
       *  滚动条的样式：高度和长度
       *  */
//      scrollStyle() {
//        return {
//          top: `${this.scrollBarTop}px`,
//          height: `${this.scrollBarHeight}px`,
//        };
//      },
      /**
       *  列表样式
       *  */
      style() {
        const style = {};
        const headStyle = this.$parent.headStyle;

        if (this.isHeadFixed) {
          style.position = 'relative';
        }
        if (headStyle) {
          if (headStyle.height) {
          }
        }
        return style;
      },
    },
    methods: {
      calcClientHeight() {
        const clientHeight = this.$el.clientHeight;
        this.clientHeight = clientHeight;
      },
      /**
       * 窗口大小变化
       */
      resize() {
        this.clientHeight = this.$el.clientHeight;
        this.createRenderList();
      },
      /**
       * 创建渲染队列
       * */
      createRenderList() {
        this.renderList = this.listData.slice(0, this.listData.length);
        this.startIndex = 0;
        this.renderListLength = this.listData.length;
        createColList(this); // 排序列表重建
        throttle(() => {
          const viewList = [];
          baseUtil.each(this.renderList, (item) => {
            viewList.push(item.columnId);
          });
          // 向父元素提交viewListChange事件
          this.$emit('viewListChange', viewList);
        });
      },
      /*----------------------以下是拖拽相关函数----------------------*/
      /**
       * 拖拽开始时触发函数： dragstart
       * */
      dragstartEvent($event, $index) {
        this.canGetMouseMove = false; // 不触发mouseMove事件
        this.dragStart = $index + this.startIndex; // 保存拖动元素在listData的index值
        this.dragEnd = this.dragStart;
        $event.target.style.opacity = .5; // 使其半透明
//        $event.target.style.background = 'transparent';
//        $event.target.style.position = 'fixed';
//        $event.target.style.top = '-45px';
      },
      /**
       * 放下目标节点时触发事件，当拖动操作结束时触发
       * */
      dragendEvent($event) {
        $event.preventDefault();
        const vm = this;
        $event.target.style.opacity = ''; // 重置透明度
        this.$emit('dragDone', vm.dragStart, vm.dragEnd);
        this.canGetMouseMove = true;
        this.dragEnterIndex = null;
      },
      /**
       * 当可拖动的元素进入可放置的目标时触发dragenter
       * */
      dragenterEvent($event, $index) {
//        $event.target.style.background = "$G2";
        this.dragEnd = $index + this.startIndex;
        const temp = this.columnList[$index];
        this.dragEnterIndex = temp;
      },
      /**
       * 当拖动元素离开可放置目标节点，重置其背景
       * */
      dragleaveEvent($event, $index) {
        $event.target.style.background = "";  // 当拖动元素离开可放置目标节点，重置其背景
      },
      /* 当元素或者选中的文本被拖动到有效放置区域上方时触发 */
      dragoverEvent($event) {
        $event.preventDefault();
      },
      /*----------------------以下是鼠标点击事件----------------------*/
      /**
       * 鼠标点击事件：通过mouseKeyUp事件判断
       * */
      mouseKeyUp($event, row, $index) {
        const button = $event.button;
        const colId = row.columnId;
        if (button === 2) {
          this.$emit('rowRightClick', $event, row, $index);
        } else {
          this.activeIndex = colId;
          this.$emit('rowClick', $event, row, $index);
        }
      },
      /**
       * 双击事件：提交一个双击事件给父对象。
       * 这里只提交了双击事件，对双击事件的具体操作在view的相关父组件中。
       * 注意：此处双击事件并未屏蔽单击事件，如果之后有相关扩展请注意。
       * @param row - 当前行信息
       */
      dblclick(row) {
        this.activeIndex = row.columnId;
        this.$emit('doubleClick', row);
      },
      /**
       * 鼠标悬停事件处理：将hover标志设为当前行的columnId。
       * */
      mouserOver(row) {
        const colId = row.columnId;
        this.hoverIndex = colId;
      },
      /**
       * 鼠标移开事件处理：将hover标志设为空
       * */
      mouserOut(row) {
        const colId = row.columnId;
        if (this.hoverIndex === colId) {
          this.hoverIndex = null;
        }
      },
      /**
       * 键盘事件：方向键控制选中行上下
       * */
      keyDown($event) {
        const keyCode = $event.keyCode;
        const UP = 38;
        const DOWN = 40;
        let activeIndex = this.columnList.indexOf(this.activeIndex);
        if (keyCode === UP) {
          activeIndex -= 1;
          if (activeIndex < 0) {
            activeIndex = this.columnList.length - 1;
          }
        } else if (keyCode === DOWN) {
          activeIndex += 1;
          if (activeIndex === this.columnList.length) {
            activeIndex = 0;
          }
        }
        this.activeIndex = this.columnList[activeIndex];
      },
      /**
       * 每行的样式设置：包括添加class等
       * */
      getRowProps(row) {
        const props = {};
        const rowSynStyle = {};
        const colId = row.columnId;
        const rowClass = ['row', colId]; // 每行元素的class
        // 如果此行是Hover行则添加hover Class 样式
        if (this.hoverIndex === colId) {
          rowClass.push('hover');
          if (this.hoverColor) {
            rowSynStyle.background = this.hoverColor;
          }
        }
        // 如果此行是active行则添加active Class 样式
        if (this.activeIndex === colId) {
          rowClass.push('active');
          if (this.activeColor) {
            rowSynStyle.background = this.activeColor;
          }
        }
        // 如果此行是拖拽进入的行则添加drag Class 样式
        if (this.dragEnterIndex === colId) {
          rowClass.push('drag');
          if (this.dragEnd !== this.dragStart) {
            rowSynStyle.borderTop = '2px solid #223d80';
          }
        }
        props.class = rowClass; // 将class绑定行元素
        props.style = rowSynStyle;
        props.id = colId;
        return props;
      },
      /**
       * 清空渲染列表
       */
      clear() {
        this.renderList = [];
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  .scroll-panel{
    position: absolute;
    top: 37px;
    height: calc(100% - 37px);
    width: 100%;
    user-select: none;
    /*overflow-y: hidden;*/
    overflow-y: scroll;
    overflow-x: hidden;
    .scroll-bar{
      position: absolute;
      width: 6px;
      background: rgba(#333, 0.5);
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 98;
      .block{
        position: absolute;
        width: 100%;
        background: #4d4d4d;
        height: 5px;
      }
    }
  }
  .list-body{
    /*height: 100%;*/
    .row{
      /*display: flex;*/
      width: 100%;
      min-height: 45px;
      line-height: 45px;
      text-align: center;
      cursor: pointer;
      &.active{
        background: $G2;
      }
      &.hover{
        background:$G2;
      }
      &.dray{

      }
      .cell{
        display: inline-block;
      }
    }
  }
</style>
