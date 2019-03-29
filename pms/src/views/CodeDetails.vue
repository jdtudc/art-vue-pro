<template>
  <div class="page-code-details">
    <div class="page-code-details-breadcrumb-box">
      <art-breadcrumb :data="breadcrumbData"></art-breadcrumb>
    </div>
    <div class="page-code-details-title row no-gutter flex-between">
      <h3>代码详情</h3>
    </div>
    <div class="page-code-details-cont">
      <div class="page-code-details-show" v-html="code"></div>
      <art-button class="btn-copy" size="large" @click="copyCode">复制代码</art-button>
    </div>
    <art-modal :show="resultModal.show" :type="'1'" :overlayClose="false" :result-title="resultModal.title" :result-status="resultModal.status" @on-finish="closeResultModal">{{resultModal.desc}}</art-modal>
  </div>
</template>
<script>
  import ClipboardJS from 'clipboard/dist/clipboard.min'
  export default {
  	name: 'codeDetails',
  	data () {
  		return {
  			// 面包屑数据
				breadcrumbData: [{
					value: '自定义代码', path: '/code'
				}, {
					value: '代码详情', active: true
				}],
				// 结果Modal
				resultModal: {
					show: false,
					title: '',
					status: '',
					desc: ''
				},
        code: '&lt;script&gt;<br /> ' +
        'var _hmt = _hmt || [];<br />' +
        '(function() {<br />' +
        '&nbsp;&nbsp;var hm = document.createElement("script");<br />' +
        '&nbsp;&nbsp;hm.src="https://hm.baidu.com/hm.js?b3e741b777db6131a62f22cc3a835a95";<br />' +
        '&nbsp;&nbsp;var s = document.getElementsByTagName("script")[0];<br />' +
        '&nbsp;&nbsp;s.parentNode.insertBefore(hm, s);<br />' +
				'})();<br />' +
        '&lt;/script&gt;',
        // 复制对象
				clipboard: null,
			}
    },
    created () {
    },
    destroyed () {
			this.clipboard && this.clipboard.destroy()
    },
    methods: {
			copyCode () {
				this.clipboard = new ClipboardJS('.btn-copy', {
					text: (trigger) => {
//						return this.code.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&nbsp;/g, ' ')
						return $(".page-code-details-show").text()
          }
        })

				this.clipboard.on('success', (e) => {
					e.clearSelection();
					this.resultModal.show = true
					this.resultModal.title = '复制代码成功'
					this.resultModal.status = 'success'
					this.resultModal.desc = '您已成功复制此自定义代码'
				});

				this.clipboard.on('error', (e) => {
					this.resultModal.show = true
					this.resultModal.title = '复制代码失败'
					this.resultModal.status = 'error'
					this.resultModal.desc = ''
				});
      },
			// 结果Modal中的取消按钮事件
			closeResultModal () {
				this.resultModal.show = false
			},
    },
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-code-details { padding: 0 30px;
    &-breadcrumb-box { padding-top: 30px;
      .art-breadcrumb-item-link, .art-breadcrumb-item-separator { display: inline-block;}
    }
    &-title { padding: 18px 0 16px; border-bottom: 2px solid $borderColor;
      h3 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding-top: 8px;}
    }
    &-show { margin-top: 40px; background-color: $bg; width: 715px; padding: 30px; font-size: $sizeSmall; color: $main; line-height: 20px;}
    .btn-copy { margin-top: 20px;}
  }
</style>
