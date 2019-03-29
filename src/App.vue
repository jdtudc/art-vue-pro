<template>
  <div class="main-wrap">
    <div class="header">
      <div class="logo">
        <img src="//raw.githubusercontent.com/artFE/art-vue/master/static/logo.png" alt="">
      </div>
      <div class="row no-gutter flex-middle">
        <art-left-nav :data="menuData" horizontal></art-left-nav>
      </div>
    </div>
    <div class="body">
      <div class="side">
        <art-left-nav :data="navData" @click="clickLeftNav"></art-left-nav>
      </div>
      <div class="cont">
        <router-view></router-view>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
	export default {
		name: 'app',
		data() {
			return {
				menuData: [{
					title: '顶部导航一',
					active: true
				}, {
					title: '顶部导航二'
				}],
				navData: [{
					title: 'Dashboard',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					expand: false,
					active: false,
					path: '/dashboard'
				}, {
					title: '活动列表',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					expand: false,
					active: false,
					list: [{
						active: false,
						title: '活动列表',
						path: '/active/list',
					}, {
						active: false,
						title: '添加活动',
						path: '/active/add',
					}],
				}],
				refresh: true
			}
		},
		methods: {
			clickLeftNav (nav) {
				this.$router.push({path: nav.path});
			},
			setNavActive (path) {
				this.navData.forEach((nav) => {
					if(nav.list && nav.list.length > 0) {
						nav.list.forEach((_) => {
							if(_.path === path) {
								_.active = true;
								nav.expand = true;
							}
						})
					} else {
						if(nav.path === path) {
							nav.active = true;
						}
					}
				});
				this.refresh = false;
			},
		},
		watch: {
			'$route': function (to, form) {
				if(this.refresh) {
					this.setNavActive(to.path);
				}
			}
		},
	}
</script>
<style type="text/scss" lang="scss">
  @import './assets/css/common/_var.scss';

  *, *:before, *:after {
    box-sizing: border-box;
  }

  @mixin mm {
    /* Firefox */
    display:-moz-box;
    -moz-box-pack:center;
    -moz-box-align:center;

    /* Safari、Opera 以及 Chrome */
    display:-webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;

    /* W3C */
    display:box;
    box-pack:center;
    box-align:center;
  }

  .main-wrap {
    position: relative;
    min-width: 100vw;
    min-height: 100vh;
  }

  .header {
    position: relative;
    height: 80px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(#000000, 0.05);
    display: flex;
    .logo {
      position: relative;
      width: 220px;
      height: 100%;
      @include mm();
    }
  }

  .body {
    position: relative;
    display: flex;
    height: calc(100vh - 80px);
    .side {
      width: 220px;
    }
    .cont {
      flex: 1;
      width: 0;
      height: 100%;
      overflow-x: hidden;
    }

    .row.large-gutter { margin-left: -1.5 * $base; margin-right: -1.5 * $base;
      @for $i from 1 through 24 {
        .col-#{$i}, .col-offset-#{$i} {
          padding-left: 1.5 * $base;
          padding-right: 1.5 * $base;
        }
      }
    }
    .row + .row { margin-top: 5 * $base;}
  }

</style>
