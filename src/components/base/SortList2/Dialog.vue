<template>
    <div class="config-dialog" v-if="enabled" :style="{top: `${top}px`,left: `${left}px`}">
      <drop-panel-transition :isShow="isShow" transition="fade-top">
        <div class="content">
          <div v-for="item in config" class="button" @click="itemClick(item)">
            {{item.text}}
          </div>
        </div>
      </drop-panel-transition>
    </div>
</template>

<script>
  import DropPanelTransition from '../../base/DropPanel-Transition';

  let timer = 0;
  export default {
    name: 'listConfigPoup',
    data() {
      return {
        left: 20,
        top: 50,
        row: null,
        isShow: false,
      };
    },
    components: {
      DropPanelTransition,
    },
    computed: {
      enabled() {
        return this.config.length > 0;
      },
    },
    props: {
      config: {
        type: Array,
        default: () => [],
      },
    },
    watch: {
      isShow() {

      },
    },
    mounted() {
    },
    methods: {
      itemClick(item) {
        if (item.click && typeof item.click === 'function') {
          item.click(this.row);
        }
        if (item.link) {
          this.$router.push(item.link);
        }
      },
      update(row, x, y) {
        const self = this;
        this.left = x;
        this.top = y;
        this.row = row;
        this.isShow = true;

        if (timer && typeof timer === 'number') {
          window.clearTimeout(timer);
          timer = 0;
        }
        if (this.isShow === true) {
          timer = setTimeout(() => {
            self.isShow = false;
            timer = 0;
          }, 2000);
        }
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  .config-dialog{ // 删除提示
    position:fixed;
    top:0;
    z-index: 10000;
    .content{
      background-color: $white;
      width:85px;
      border-radius: 4px;
      .button{
        cursor: pointer;
        color:#000333;
        display:block;
        width:100%;
        height:30px;
        font-size:13px;
        line-height: 30px;
        text-align: center;
        &:hover{
          color:$white;
          background-color: $blue1;
        }
      }
    }
  }
</style>
