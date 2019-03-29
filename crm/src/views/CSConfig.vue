<template>
  <div class="page-cs-config">
    <div class="page-cs-config-cont">
      <div class="title row no-gutter flex-between flex-middle">
        <h4>专属客服配置</h4>
        <div class="other">
          <art-button type="text" icon="http://storage.360buyimg.com/static-res/tech/jrv/1.0.0/button/plus.png">添加</art-button>
        </div>
      </div>
      <div class="cont">
        <div class="art-table table">
          <table cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th>组合名称</th>
                <th>是否启用</th>
                <th>创建时间</th>
                <th>修改时间</th>
                <th>配置</th>
                <th></th>
              </tr>
            </thead>
            <tbody v-if="!chartData.none && !chartData.error && !chartData.loading">
              <tr v-for="(config, index) in configData" @mouseenter="enterTr(config)" @mouseleave="leaveTr(config)">
              <td><p v-text="config.name"></p></td>
              <td><p v-text="config.status" :class="[config.status === '停用' && 'red']"></p></td>
              <td><p v-text="config.createTime"></p></td>
              <td><p v-text="config.modifyTime"></p></td>
              <td>
                <art-btn-drop :dropData="config.dropData" @on-choose="chooseConfig" :type="config.btnType"></art-btn-drop>
              </td>
              <td>
                <art-button type="blue" size="small" :border="false" @click="openContentModal(config)">内容管理</art-button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="art-auxi-box" v-if="chartData.none || chartData.error || chartData.loading">
          <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getConfigData"></art-auxi>
        </div>
      </div>
      <div class="footer" v-if="count && configData && configData.length > 0">
        <div class="page-box row no-gutter flex-end">
          <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
        </div>
      </div>
    </div>

    <art-modal class="resultModal" :show="resultModal.show" :type="'1'" :overlayClose="false" :result-title="resultModal.title" :result-status="resultModal.status">
      <p class="art-modal-result-title" slot="result-title">您确认要删除<span v-text="resultModal.name"></span>这条信息</p>
      <div slot="result-btn" class="row no-gutter flex-end">
        <art-button type="minor" size="large" @click="closeResultModal">取消</art-button>
        <art-button type="main" size="large" @click="deleteConfig">确定</art-button>
      </div>
    </art-modal>
    <art-modal :show="contentModal.show" :overlayClose="false" :title="contentModal.title" @on-cancel="closeContentModal">
      <div class="contentModal-cont">
        <div class="content-box clearfix">
          <div class="content-list fl" v-innerscroll="contentModal.contentData">
            <ul>
              <li class="content-item" v-for="(content, index) in contentModal.contentData" :key="index">
                <art-checkbox :value="content.name" :active="content.active" :disabled="content.disabled" @click.native="!content.disabled && clickContent(content)"></art-checkbox>
              </li>
            </ul>
          </div>
          <div class="choose-box fl">
            <p class="choose-title">已选择</p>
            <p class="choose-placeholder" v-if="contentModal.chooseData.length === 0">（请从左侧选择内容）</p>
            <div class="choose-list" v-innerscroll="contentModal.chooseData">
              <ul>
                <li class="choose" v-for="(content, index) in contentModal.chooseData" :key="index">
                  <p class="content-item">
                    <span class="name" v-text="content.name"></span>
                  </p>
                  <span class="content-delete" @click="deleteChoose(content)"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="contentModal-footer" slot="footer">
        <div class="art-modal-btn row no-gutter flex-end">
          <art-button type="minor" size="large" @click="closeContentModal">取消</art-button>
          <art-button type="main" size="large" @click="saveContent" :disabled="contentModalDisabled">保存</art-button>
        </div>
      </div>
    </art-modal>
  </div>
</template>
<script>
  export default {
    name: "cs-config",
    data () {
    	return {
        // 当前页
				page: null,
				// 每页显示数量
				pageSize: null,
				// 页数控制器下拉数据
				pageDropData: [],
				// 模拟数据
				codeData: null,
				// 数据总条数
				count: null,
				// 配合使用图表数据
        chartData: {
        	none: false,
          loading: false,
          error: false
        },
    		// 配置列表数据
				configData: null,

        // 内容管理配置Modal
        contentModal: {
					show: false,
          title: '',
          chooseData: [],
          contentData: [],
        },
        // 结果Modal
        resultModal: {
					show: false,
          title: '',
          status: '',
          name: ''
        },
      }
    },
    created () {
    	this.resetData()
    	this.getConfigData()
    },
    methods: {
    	// 点击删除确认Modal中确定按钮事件
			deleteConfig () {
				console.log(`当前要删除的组合为：${this.resultModal.name}`)
        this.closeResultModal()
        this.getConfigData()
			},
    	// 关闭删除确认Modal
      closeResultModal () {
      	this.resultModal.show = false
      },
    	// 打开内容配置Modal
			openContentModal (config) {
				console.log(`当前请求的内容配置入参为： ${JSON.stringify(config)}`)
				this.contentModal.show = true
        this.contentModal.title = '内容管理配置'
				this.contentModal.contentData = []
				this.contentModal.chooseData = []
        let timer = setTimeout(() => {
					this.contentModal.contentData = [{
						name: '白条_白条分期'
          }, {
						name: '白条_金条借款'
					}, {
						name: '白条_定期理财'
					}, {
						name: '白条_短期理财'
					}, {
						name: '保险_车险推广'
					}, {
						name: '保险_车险调研'
					}, {
						name: '测试类型一'
					}, {
						name: '测试类型二'
					}, {
						name: '测试类型三'
					}]
          this.contentModal.chooseData = [{
						name: '保险_车险推广'
          }, {
						name: '保险_车险调研'
					}]
          this.contentDetective()
          clearTimeout(timer)
        },200)
      },
      // 关闭内容配置Modal
      closeContentModal () {
				this.contentModal.show = false
      },
      // 点击内容配置Modal保存按钮事件
			saveContent () {
				console.log(`当前选中的内容为：${JSON.stringify(this.contentModal.chooseData)}`)
        this.closeContentModal()
        this.getConfigData()
      },
			// 点击内容
			clickContent (content) {
				if(content.active) {  // 点击的是选中项
					content.active = false;
					this.contentModal.chooseData = this.contentModal.chooseData.filter((_) => {
						return _.name !== content.name;
					});
				} else {  // 非选中项
					content.active = true;
					this.contentModal.chooseData.push({
						name: content.name,
					});
				}
			},
			// 删除指定内容
			deleteChoose (content) {
				if(this.contentModal.contentData && this.contentModal.contentData.length > 0) {
					this.contentModal.contentData.forEach((_) => {
						if(content.name === _.name) {
							_.active = false;
						}
					})
				}
				this.contentModal.chooseData = this.contentModal.chooseData.filter((_) => {
					return _.name !== content.name;
				})
			},
      // 内容状态侦测
			contentDetective () {
				if(this.contentModal.chooseData && this.contentModal.chooseData.length > 0) { // 有选中数据
					this.contentModal.chooseData.forEach((_) => {
						this.contentModal.contentData.forEach((content) => {
							if(_.name === content.name) {
								content.active = true;
							}
						})
					})
				}
			},
			// 数据重置
			resetData () {
				this.pageSize = 10
				this.page = 1
				this.count = null
				this.pageDropData = [
					{num: 10, value: '10 条/页', active: true},
					{num: 20, value: '20 条/页', active: false},
					{num: 50, value: '50 条/页', active: false}
				]
			},
			// 获取配置列表数据
      getConfigData () {
      	this.configData = null
        // 查询入参
        let param = {page: this.page, pageSize: this.pageSize}
				console.log(`当前查询入参：${JSON.stringify(param)}`)
      	this.chartData.loading = true
      	this.chartData.error = false
      	this.chartData.none = false
      	let timer = setTimeout(() => {
      		this.chartData.loading = false
      		this.configData = [{
						name: '测试组合',
						status: '启用',
						createTime: '2017-05-21 10:24:12',
						modifyTime: '2017-05-21 09:24:12',
            // 按钮状态
            btnType: 0,
						// 配置下拉列表数据
						dropData: [{
							value: '修改',
							name: '测试组合',
              status: '启用'
						}, {
							value: '删除',
							name: '测试组合',
							status: '启用'
						}]
					}, {
						name: '测试',
						status: '停用',
						createTime: '2017-05-21 10:24:12',
						modifyTime: '2017-05-21 09:24:12',
						// 按钮状态
						btnType: 0,
						// 配置下拉列表数据
						dropData: [{
							value: '修改',
							name: '测试',
							status: '停用'
						}, {
							value: '删除',
							name: '测试',
							status: '停用'
						}]
					}]
          this.count = 101
          clearTimeout(timer)
        }, 1500)
      },
      // 选中配置
			chooseConfig (config) {
				console.log(`选中项为：${JSON.stringify(config)}`)
        // 可以用自定义key替换中文做匹配
        if (config.value === "修改") {
          alert("参照黑名单管理-新增黑名单")
        } else if (config.value === "删除") {
					this.resultModal.show = true
					this.resultModal.title = `您确定要删除${config.name}这条信息`
          this.resultModal.name = config.name
					this.resultModal.status = 'warning'
        } else {
					console.error(`错误的配置项：${JSON.stringify(config)}`)
        }
      },
      // 鼠标移入移出 tr
			enterTr(item) {
      	item.btnType = 1
			},
			leaveTr(item) {
        item.btnType = 0
			},
			// 切换页数
			changePage(page) {
				this.page = page
				this.getConfigData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getConfigData()
				}
			},
		},
		computed: {
			contentModalDisabled () {
				return !(this.contentModal.chooseData && this.contentModal.chooseData.length > 0)
			}
		}
	}
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";

  .page-cs-config {
    .title { position: relative; display: flex; padding-bottom: 17px; border-bottom: 2px solid $borderColor;
      h4 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding: 0; margin: 0;}
      .other { display: flex;
        .art-button img { width: 12px;}
        .art-button + .art-button { margin-left: 10px;}
      }
    }
    .cont { margin-top: 30px;
      .table { position: relative;
        .art-auxi-box { min-height: 300px; position: relative;}
        th, td {
           &:last-child { padding-right: 50px; padding-left: 0; width: 118px;}
           &:nth-last-child(2) { text-align: center; width: 118px;}
         }
        tbody {
           tr td {
             p { line-height: 26px; white-space: nowrap;}
             .red { color: $red;}
             .art-button { display: block;}
           }
         }
       }
    }
    .footer {
      .page-box { padding: 20px 0 120px;}
    }

    .contentModal {
      &-cont { padding: 32px 30px; width: 560px;
        .content-box { height: 285px;
          .content-list { width: 190px; height: 100%; border-right: 1px solid $borderColor; overflow: hidden;
            ul { padding-bottom: 1px;}
            .content-item { padding: 0 10px 0 8px;
              .art-checkbox-value { position: relative; width: 108px; margin-right: 0; display: inline-block; white-space: nowrap;text-overflow: ellipsis; overflow: hidden;}
              .icon-info { position: relative; display: inline-block; width: 16px; height: 14px; margin-left: 6px; vertical-align: middle;
                &:before { content: ""; position: absolute; left: 0; top: -1px; width: 16px; height: 16px; background-image: url("//storage.360buyimg.com/static-res/tech/daplatform/icon/icon-info.png"); }
                &:hover {
                  &:before { background-image: url("//storage.360buyimg.com/static-res/tech/daplatform/icon/icon-info_active.png"); transition: all $animateTime; }
                }
              }
            }
            .content-item + .content-item { margin-top: 25px;}
            .content:nth-child(1) { margin-top: 1px;}
          }
          .choose-box { position: relative; width: 310px; height: 100%; overflow: hidden;
            .choose-title { position: absolute; left: 1px; top: 0; right: 6px; height: 30px;  padding-left: 30px; font-size: $sizeNormal; color: $main; background-color: #fff; z-index: 2;}
            .choose-placeholder { position: absolute; top: 154px; left: 0; right: 10px; text-align: center; white-space: nowrap; font-size: 14px; line-height: 19px;
              color: #bec1ca;}
            .choose-list { padding-right: 10px; height: 100%; overflow: hidden;
              ul { padding-top: 30px; padding-bottom: 2px;}
              .choose { position: relative; background: url(//storage.360buyimg.com/static-res/tech/jrv/1.0.0/leftNav/item_bg.png) no-repeat right top; background-size: 100% 100%; padding: 4px 80px 4px 30px; margin-top: 6px;
                .content-item { font-size: $sizeNormal; line-height: 24px; word-break: break-all;
                  span { color: $main;}
                  .name { color: $mainStrong;}
                }
                .content-delete { position: absolute; display: block; right: 12px; top: 50%; margin-top: -12px; width: 24px; height: 24px; background: url(//storage.360buyimg.com/static-res/tech/jrv/1.0.0/modal/close.png) no-repeat center center; background-size: 8px 8px; cursor: pointer;}
              }
              .choose:nth-child(1) { margin-top: 0;}
            }
          }
        }
      }
      &-footer {
        .art-button { margin-right: 0!important;}
        .art-button + .art-button { margin-left: 10px;}
      }
    }

    .resultModal {
      .art-modal-result-title {
        span { color: $blue;}
      }
      .art-modal-result-btn {
        .art-button + .art-button { margin-left: 10px;}
      }
    }
  }
</style>
