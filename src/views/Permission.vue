<template>
  <div class="page-permission">
    <div class="page-permission-cont">
      <p class="page-permission-cont-title">您暂无权限访问该页面哦！</p>
      <p class="page-permission-cont-info">请联系管理员为您授权</p>
      <div class="page-permission-cont-btn">
        <art-button size="large" @click="pushTo('/dashboard')">返回首页</art-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "permission",
    methods: {
    	pushTo (path) {
    		this.$router.push({path: path});
      }
    },
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-permission { padding: 0 196px;
    &-cont { min-height: 488px; background: url("../assets/css/img/no-permission.png") no-repeat left center; padding-left: 320px; padding-top: 214px;
      &-title { font-size: 24px; color: $mainStrong; line-height: 32px;}
      &-info { font-size: $sizeNormal; color: $main; line-height: 24px; margin-top: 10px;}
      &-btn { margin-top: 25px;}
    }
  }
</style>
