<template>
  <div class="main-wrap">
    <div class="header row no-gutter flex-between flex-middle">
      <div class="logo">
        <a href="javascript:;">
          <img src="//raw.githubusercontent.com/artFE/art-vue/master/static/logo.png" alt="">
        </a>
      </div>
      <div class="user">
        jiaoli
        <div class="user-box"></div>
      </div>
    </div>
    <div class="body">
      <div class="side">
        <art-left-nav :data="navData" @click="clickLeftNav"></art-left-nav>
      </div>
      <div class="cont">
        <transition name="multi-fade">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
	export default {
		name: 'app',
		data() {
			return {
				navData: [{
					title: '业务配置',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					active: false,
					path: '/config'
				}, {
					title: '规则管理',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					expand: false,
					list: [{
						active: false,
						title: '全部规则',
						path: '/rule/all'
					}, {
						active: false,
						title: '我的规则',
						path: '/rule/my'
					}],
				}, {
					title: '页面认领',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					active: false,
					path: '/claim'
				}, {
					title: '自定义代码',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					active: false,
					path: '/code'
				}],
			}
		},
		created () {
			this.initNav(this.$route.path)
		},
		methods: {
			clickLeftNav (nav) {
				this.$router.push({path: nav.path})
			},
			initNav (path) {
				this.navData.forEach((nav) => {
					if(nav.list && nav.list.length > 0) {
						nav.list.forEach((_) => {
							if(path.indexOf(_.path) > -1) {
								_.active = true
								nav.expand = true
							} else {
								_.active = false
							}
						})
					} else {
						nav.active = path.indexOf(nav.path) > -1 ? true : false
					}
				})
			},
		},
		watch: {
			'$route': function (to, form) {
				this.initNav(to.path)
			}
		},
	}
</script>
<style type="text/scss" lang="scss">
  @import './assets/css/common/_var.scss';

  html { min-width: 1366px;}
  body { line-height: 1;}
  *, *:before, *:after { box-sizing: border-box;}

  // multi-fade
  .multi-fade-leave-active {
    display: none;
  }
  .multi-fade-enter-active {
    transition: opacity 0.5s;
  }
  .multi-fade-enter
    /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }

  .main-wrap { position: absolute; left: 0; top: 80px; right: 0; bottom: 0; overflow: hidden; min-width: 1366px;}

  .header { position: fixed; left: 0; top: 0; width: 100%; height: 80px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(#000000, 0.05); padding: 0 30px!important; z-index: 2; box-sizing: border-box;
    .logo a { display: block;}
  }

  .body { position: relative; display: flex; height: calc(100vh - 80px);
    .side { position: absolute; left: 0; top: 0; bottom: 0; width: 210px;}
    .cont { position: absolute; left: 210px; right: 0; top: 0; bottom: 0; overflow-y: auto;}
  }

</style>
