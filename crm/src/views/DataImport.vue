<template>
  <div class="page-data-import">
    <div class="page-data-import-cont">
      <div class="title row no-gutter flex-between flex-middle">
        <h4>数据导入</h4>
      </div>
      <div class="cont">
        <div class="item row no-gutter flex-start">
          <p class="item-name">业务类型</p>
          <art-input-drop :drop-data="businessTypeDropData" :auto-width="false" size="middle" @on-choose="chooseBusinessType"></art-input-drop>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name">活动类型</p>
          <art-input-drop :drop-data="activityTypeDropData" :auto-width="false" size="middle" @on-choose="chooseActivityType"></art-input-drop>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name">模版名称</p>
          <art-input-drop :drop-data="templateDropData" :auto-width="false" size="middle" @on-choose="chooseTemplate"></art-input-drop>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name">上传文件</p>
          <Upload :file="file" :class="[showFileErr && !file && 'file_error']" :status="status" :progress="progress" @on-change="upload" @on-error="uploadError" @on-delete="uploadDelete"></Upload>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name">批次名称</p>
          <p class="item-details">wen_20180223_004</p>
        </div>
      </div>
      <div class="btn">
        <art-button type="main" :disabled="disabled" @click="beginImport">开始导入</art-button>
      </div>
    </div>
  </div>
</template>
<script>
	import Upload from '../components/upload'
	import modal from 'art-vue/components/modal/modal'

	export default {
    name: "data-import",
    data () {
    	return {
				// 业务类型下拉列表数据
				businessTypeDropData: [{
					value: '延保险',
					active: false
				}, {
					value: '白条',
					active: false
				}],
				// 当前选择的业务类型
				businessType: '',
				// 活动类型下拉列表数据
				activityTypeDropData: [{
					value: '全活动',
					active: false
				}, {
					value: '白条分期',
					active: false
				}],
				// 当前选择的活动类型
				activityType: '',
				// 模版名称下拉列表数据
				templateDropData: [{
					value: '赠券活动20180213',
					active: false
				}, {
					value: '保险活动',
					active: false
				}],
				// 当前选择的模版名称
				template: '',

        // 上传部分
				file: null,
				progress: null, // 上传进度
				status: null,
				showFileErr: false,
      }
    },
    methods: {
    	// 上传
			upload(file) {

				let self = this;
				this.showFileErr = false;

				this.progress = 0;
				this.status = "uploading";

				let formData = new FormData();
				formData.append("file", file);

				// 模拟上传过程
				let timer = setInterval(() => {
					let up = Math.round(5 * Math.random())
					if (this.progress + up >= 100) {
						this.progress = 100
						self.status = "success"
						self.file = file;
						clearInterval(timer)
          } else {
						this.progress += up
          }
        },100)

        // 下面是一个请求的示例，处理了成功失败各种清空
        /*
				$.ajax({
					url: api.uploadFile,
					data: formData,
					type: window.location.href.indexOf("debug") > -1 ? "get" : "post",
					async: true,
					cache: false,
					contentType: false,
					processData: false,
					xhrFields: {
						withCredentials: true
					},
					xhr: function () {  // 上传显示进度
						let xhr = $.ajaxSettings.xhr();
						if (xhr.upload) {
							xhr.upload.addEventListener('progress', function (e) {
								self.progress = parseInt(100 * e.loaded / e.total);
								if (self.progress == 100) {
									self.status == "processing";
								}
							}, false);
						}
						return xhr;
					},
					success: function (res) {
						self.radioData[0].disabled = false;

						//TODO： 如果小于1000条，需要提示：创建失败，您单次上传号码个数应大于1000条

						if (res.stateCode == "3010") { // 未登录
							window.location.href = "//xxx.com/login?return=" + encodeURIComponent(window.location.href)
						} else if (res.stateCode == "3000" && res.data) { // 成功
							self.status = "success";
							self.file = file;
							self.ruleId2 = res.data;
						} else {
							modal.show(res.retMessage || '创建失败，您单次上传号码个数应大于1000条');

							self.status = "";
							self.file = null;
						}
					},
					error: function () {
						self.radioData[0].disabled = false;

						self.status = "fail";
						self.file = null;

						console.error('调用人群洞察-人群设备上传接口异常')
					}
				});
				*/

			},
			uploadError(err) {
				this.showFileErr = false;

				modal.show(err.msg)
			},
			uploadDelete($input) {
				this.file = null;
			},
			// 选择业务类型
			chooseBusinessType (choose) {
				this.businessType = choose.value
			},
			// 选择活动类型
			chooseActivityType (choose) {
				this.activityType = choose.value
			},
			// 选择模版名称
			chooseTemplate (choose) {
				this.template = choose.value
			},
      // 开始导入
			beginImport () {
				console.log(this.file);
				const params = {businessType: this.businessType, activityType: this.activityType, template: this.template}
				console.log(`导出参数为${JSON.stringify(params)}`)
        console.log('文件：', this.file)
      },
    },
		computed: {
			disabled () {
				return !(this.businessType && this.activityType && this.template  && this.file)
			}
		},
		components: {
			Upload
		}
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-data-import {
    .title { position: relative; display: flex; padding-bottom: 17px; border-bottom: 2px solid $borderColor;
      h4 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding: 0; margin: 0;}
    }
    .cont { padding: 40px 0 0 150px;
      .row + .row { margin-top: 24px;}
      .item {
        &-name { position: relative; width: 76px; font-size: $sizeNormal; line-height: 32px; color: $main; white-space: nowrap;
          &:after { content: "*"; position: absolute; right: 10px; top: 8px; display: none; font-size: $sizeNormal; color: #f8636e; line-height: 1;}
        }
        .art-input, .art-text-drop { display: block; width: 360px;}
        &-details { font-size: $sizeNormal; line-height: 32px;}
        &.required {
          .item-name {
            &:after { display: block;}
          }
        }
      }
    }
    .btn { padding: 50px 0 40px 226px;}
  }
</style>
