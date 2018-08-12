<template>
  <img :src=src alt="图形验证码" @click="getImgCode">
</template>

<script>
  import http from '../../../plugins/http/http';

  export default {
    name: 'ImgCode',
    data() {
      return {
        src: '',
      };
    },
    methods: {
      getImgCode() {
        // 获取图片验证码
        const timeStamp = Date.now();
        this.src = `${http.apiList.GET_CHECK_IMG}?${timeStamp}`;
      },
    },
    created() {
      this.getImgCode();
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  img{
    width:100%;
    height:100%;
    cursor: pointer;
  }
</style>

