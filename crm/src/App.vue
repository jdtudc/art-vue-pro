<template>
  <div class="main-wrap">
    <div class="header">
      <div class="logo">
        <img src="//github.com/artFE/art-vue/raw/master/static/logo.png" alt="">
      </div>
      <div class="action">
        <a href="javascript:;" @click="openSignModal">签入<i class="icon-arrow"></i></a>
      </div>
      <div class="other">
        <div class="notice">
          <img src="//storage.360buyimg.com/static-res/tech/header/1.0.0/notice_2x.png" alt="">
          <art-badge count="3"></art-badge>
        </div>
        <div class="avatar">
          <img src="//img30.360buyimg.com/jr_image/jfs/t5548/164/2621732684/3420/8fc003ab/591cf4d5Nd96777b0.png" alt="">
        </div>
        <div class="position">
          <art-text-drop :drop-data="positionDropData" :auto-width="true" @on-choose="choosePosition"></art-text-drop>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="side">
        <div class="side-scroll">
          <div class="side-container">
            <art-left-nav :data="navData" @click="clickLeftNav"></art-left-nav>
          </div>
        </div>
      </div>
      <div class="content">
        <transition name="multi-fade">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <art-modal class="modal-sign" :show="signModal.show" :title="signModal.title" @on-cancel="closeSignModal" @on-save="closeSignModal">
      <div class="sign-item">
        <div class="sign-item-name">工号</div>
        <div class="sign-item-cont">
          <art-input></art-input>
        </div>
      </div>
      <div class="sign-item">
        <div class="sign-item-name">分机号</div>
        <div class="sign-item-cont">
          <art-input></art-input>
        </div>
      </div>
    </art-modal>
  </div>
</template>
<script>
	export default {
		name: 'app',
		data() {
			return {
				// 职位下拉列表数据
				positionDropData: [{
					value: '外呼管理职',
					active: true
				}, {
					value: '白条一组组长',
					active: false
				}],
				// 左侧导航数据
				navData: [{
					title: '首页',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					expand: false,
					active: false,
					path: '/index'
				}, {
					title: '电话营销',
					icon: '//storage.360buyimg.com/static-res/tech/adv/1.0.0/index/icon1.png',
					expand: false,
					list: [{
						title: '模版管理',
						active: false,
						path: '/telemarketing/templateManagement'
					}, {
						title: '中央监控',
						active: false,
						path: '/telemarketing/centralMonitor'
					}, {
						title: '黑名单管理',
						active: false,
						path: '/telemarketing/blacklistManagement'
					}, {
						title: '专属客服配置',
						active: false,
						path: '/telemarketing/csConfig'
					}, {
						title: '数据导出',
						active: false,
						path: '/telemarketing/dataImport'
					}, {
						title: '群管理',
						active: false,
						path: '/telemarketing/groupManagement'
					}],
				}],
				// 软电话签入数据
				signModal: {
					title: '软电话签入',
					show: false,
				},
			}
		},
		created () {
			this.initNav(this.$route.path);
		},
		methods: {
			// 打开签入弹层
			openSignModal () {
				this.signModal.show = true
			},
			// 关闭签入弹层
			closeSignModal () {
				this.signModal.show = false
			},
			// header 切换职位
			choosePosition (position) {
				console.log(`选中的是 ${position.value}`)
			},
			// 点击左侧导航
			clickLeftNav (nav, navData) {
				this.$router.push({path: nav.path})
			},
			// 根据路径初始化导航默认选中项
			initNav (path) {
				this.navData.forEach((nav) => {
					if(nav.list && nav.list.length > 0) {
						nav.list.forEach((_) => {
							if(_.list && _.list.length > 0) {
								_.list.forEach((__) => {
									if(path.indexOf(__.path) > -1) {
										__.active = true
										_.expand = true
										nav.expand = true
									} else {
										__.active = false
									}
								})
							} else {
								if(path.indexOf(_.path) > -1) {
									_.active = true
									nav.expand = true
								} else {
									_.active = false
								}
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

  @mixin lm {
    /* Firefox */
    display:-moz-box;
    -moz-box-pack:start;
    -moz-box-align:center;

    /* Safari、Opera 以及 Chrome */
    display:-webkit-box;
    -webkit-box-pack:start;
    -webkit-box-align:center;

    /* W3C */
    display:box;
    box-pack:start;
    box-align:center;
  }
  @mixin rm {
    /* Firefox */
    display:-moz-box;
    -moz-box-pack:end;
    -moz-box-align:center;

    /* Safari、Opera 以及 Chrome */
    display:-webkit-box;
    -webkit-box-pack:end;
    -webkit-box-align:center;

    /* W3C */
    display:box;
    box-pack:end;
    box-align:center;
  }

  *, *:before, *:after { box-sizing: border-box;}
  html { min-width: 1366px;}
  body { line-height: 1;}

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


  .main-wrap { position: relative; width: 100%; min-height: 100vh;}
  .header { position: relative; height: 80px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(#000000, 0.05); display: flex;
    .action { margin-left: 270px; @include lm();
      a { display: flex;}
      .icon-arrow { display: block; width: 4px; height: 7px; margin-top: 3.5px; margin-left: 8.5px; background-image: url(//storage.360buyimg.com/static-res/tech/jrv/1.0.0/calendar/s-arr.png); transform: rotate(180deg);}
    }
    .logo { position: absolute; left: 0; top: 15px;}
    .other { flex: 1; width: 0; @include rm(); padding-right: 20px;}
    .notice, .avatar { position: relative; width: 42px; height: 42px; margin: auto 0;
      img { width: 100%; height: 100%; border-radius: 50%;}
    }
    .notice { margin-right: 30px;
      .art-badge { position: absolute; right: -4px; top: -4px;}
    }
    .avatar { margin-right: 14px;}
    .position {
      .art-text-drop-box { left: auto!important; right: 10px; text-align: right;}
    }
  }
  .body { position: relative; width: 100%; min-height: calc(100vh - 80px); display: flex;
    .side { position: relative; width: 210px; padding-bottom: 30px; background-color: $bg;
      .side-scroll { width: 100%; height: 100%; overflow: hidden;}
    }
    .content { height: 100%; flex: 1; width: 0; padding: 40px 30px;}
  }
  .art-auxi-box { position: relative; min-height: 220px;}
  .art-page-box { position: relative; margin-top: 20px; padding-bottom: 120px;}

  .modal-sign {
    .art-modal-wrap { width: 530px;}
    .art-modal-body { padding: 30px 0 44px 40px;}
    .sign-item { display: flex; margin-top: 24px;
      &:first-child { margin-top: 0;}
      &-name { width: 62px; font-size: $sizeNormal; line-height: 32px; color: $main;}
      &-cont { width: 300px;
        .art-input { width: 100%;}
      }
    }
  }

</style>
