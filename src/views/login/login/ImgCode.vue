<template>
  <img :src=src alt="图形验证码" @click="getImgCode">
</template>

<script>
  export default {
    name: 'ImgCode',
    data() {
      return {
        src: 'http://www.yuncaijing.com/auth/get_verify.jpg',
      };
    },
    methods: {
      getImgCode() {
        // 获取图片验证码
        const date = new Date().getMilliseconds();
        this.src = `http://www.yuncaijing.com/auth/get_verify.jpg?${date}`;
      },
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

