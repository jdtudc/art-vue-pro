<template>
  <div class="page-template-management">
    <div class="page-template-management-cont">
      <div class="row no-gutter">
        <div class="col-24">
          <div class="title">
            <h4>电话营销-模版管理</h4>
          </div>
          <div class="cont">
            <div class="query-box">
              <div class="query">
                <div class="query-item">
                  <div class="query-name">类型</div>
                  <art-input-drop :drop-data="typeDropData" :auto-width="false" size="middle" @on-choose="chooseType"></art-input-drop>
                </div>
                <div class="query-item">
                  <div class="query-name">状态</div>
                  <art-input-drop :drop-data="statusDropData" :auto-width="false" size="middle" @on-choose="chooseStatus"></art-input-drop>
                </div>
                <div class="query-item">
                  <art-button type="main" @click="queryTemplateData">查询</art-button>
                  <art-button type="blue" @click="createTemplate">新建</art-button>
                  <art-button type="blue">新建特殊模版</art-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row no-gutter">
        <div class="col-24">
          <div class="title">
            <h4>模版列表</h4>
          </div>
          <div class="cont">
            <div class="art-table table">
              <table cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th>模版名称</th>
                    <th>状态</th>
                    <th>类型</th>
                    <th>创建人</th>
                    <th>创建时间</th>
                    <th>修改人</th>
                    <th>修改时间</th>
                    <th>操作</th>
                    <th>配置</th>
                  </tr>
                </thead>
                <tbody v-if="!chartData.none && !chartData.error && !chartData.loading">
                  <tr v-for="(template, index) in templateData" @mouseenter="enterTr(template)" @mouseleave="leaveTr(template)">
                    <td><p v-text="template.name"></p></td>
                    <td><p v-text="template.status"></p></td>
                    <td><p v-text="template.type"></p></td>
                    <td><p v-text="template.create"></p></td>
                    <td><p v-text="template.createTime"></p></td>
                    <td><p v-text="template.modify"></p></td>
                    <td><p v-text="template.modifyTime"></p></td>
                    <td>
                      <art-button type="blue" size="small" :border="false" @click="stopTemplate(template)" v-if="template.status === '已启用'">停用</art-button>
                      <art-button type="blue" size="small" :border="false" @click="startTemplate(template)" v-if="template.status === '已停用'">启用</art-button>
                    </td>
                    <td>
                      <art-btn-drop :dropData="template.configDropData" @on-choose="chooseConfig" :type="template.btnType"></art-btn-drop>
                    </td>
                  </tr>
                </tbody>

                </table>
            </div>
            <div class="art-auxi-box" v-if="chartData.none || chartData.error || chartData.loading">
              <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getTemplateData"></art-auxi>
            </div>
          </div>
          <div class="footer" v-if="count && templateData && templateData.length > 0">
            <div class="page-box row no-gutter flex-end">
              <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <art-modal class="stopModal" :show="stopModal.show" :type="'1'" :overlayClose="false" :result-title="stopModal.title" :result-status="stopModal.status">
      <div slot="result-btn" class="row no-gutter flex-end">
        <art-button type="minor" size="large" @click="closeStopModal">取消</art-button>
        <art-button type="main" size="large" @click="confrim">确定</art-button>
      </div>
    </art-modal>
    <art-modal class="questionModal" :show="questionModal.show" :overlayClose="false" :title="questionModal.title" @on-cancel="closeQuestionModal">
      <p class="art-modal-title" slot="header-title">{{questionModal.title}}<span v-text="questionModal.name"></span></p>
      <div class="questionModal-cont">
        <div class="item">
          <p class="item-name">问卷模版</p>
          <div class="item-cont">
            <art-input-drop :drop-data="questionTemplateDropData" default-text="请选择问卷模版" :auto-width="false" @on-choose="chooseQuestionTemplate"></art-input-drop>
          </div>
        </div>
      </div>
      <div class="questionModal-footer" slot="footer">
        <div class="art-modal-btn row no-gutter flex-end">
          <art-button type="minor" size="large" @click="closeQuestionModal">取消</art-button>
          <art-button type="main" size="large" @click="saveQuestion" :disabled="questionModalDisabled">保存</art-button>
        </div>
      </div>
    </art-modal>
  </div>
</template>
<script>
  export default {
    name: "template-management",
    data () {
    	return {
				// 类型下拉列表数据
				typeDropData: [{
					value: '普通模版',
					active: true
				}, {
					value: '特殊模版',
					active: false
				}],
        // 类型
        type: '普通模版',
				// 状态下拉列表数据
				statusDropData: [{
					value: '已启用',
					active: false
				}, {
					value: '已停用',
					active: true
				}],
				// 类型
				status: '已停用',
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
    		// 模版列表数据
				templateData: null,
        // 停用Modal弹层
				stopModal: {
					show: false,
					title: '',
          status: '',
        },
        // 问卷Modal弹层
        questionModal: {
					show: false,
          title: '',
          name: '',
          template: ''
        },
        // 问卷模版下拉数据
				questionTemplateDropData: []
      }
    },
    created () {
    	this.resetData()
    	this.getTemplateData()
    },
    methods: {
    	// 获取问卷模版下拉数据
      getQuestionTemplateDropData () {
      	this.questionTemplateDropData = [{
      		value: '支付失败外呼调研',
          active: false
        }, {
					value: '理财失败调研',
					active: false
				}]
				if (this.questionModal.template) {
					this.questionTemplateDropData.forEach((_) => {
						if (_.value === this.questionModal.template) {
							_.active = true
						}
					})
				}
			},
      // 关闭问卷配置模版
			closeQuestionModal () {
      	this.questionModal.show = false
      },
      // 点击问卷配置模版中保存按钮事件
			saveQuestion () {
				console.log(`修改后的模版配置为 ${JSON.stringify(this.questionModal.template)}`)
				this.closeQuestionModal()
        this.getTemplateData()
			},
    	// 新建模版
			createTemplate () {

      },
      // 启用模版
			startTemplate (template) {
				console.log(`要启用的模版为 ${JSON.stringify(template.name)}`);
      },
			// 停用模版
      stopTemplate (template) {
				console.log(`要停用的模版信息为 ${JSON.stringify(template.name)}`);
        this.stopModal.show = true
        this.stopModal.title = `您确定要停用${template.name}`
        this.stopModal.status = 'warning'
			},
    	// 按条件查询模版列表数据
			queryTemplateData () {
				this.page = 1
        this.getTemplateData()
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
			// 获取模版列表数据
      getTemplateData () {
      	this.templateData = null
        // 查询入参
        let param = {page: this.page, pageSize: this.pageSize, type: this.type, status: this.status}
				console.log(`当前查询入参：${JSON.stringify(param)}`)
      	this.chartData.loading = true
      	this.chartData.error = false
      	this.chartData.none = false
      	let timer = setTimeout(() => {
      		this.chartData.loading = false
      		this.templateData = [{
						name: '理财模版20180602-1',
						status: '已启用',
						type: '普通模版',
						create: '坐席5',
						createTime: '2017-05-21 10:24:12',
						modify: '坐席5',
						modifyTime: '2017-05-21 09:24:12',
            // 问卷模版
            template: '支付失败外呼调研',
            // 按钮状态
            btnType: 0,
						// 配置下拉列表数据
						configDropData: [{
							value: '短信',
							name: '理财模版20180602-1',
							template: '支付失败外呼调研'
						}, {
							value: '链接',
							name: '理财模版20180602-1',
							template: '支付失败外呼调研'
						}, {
							value: '反馈',
							name: '理财模版20180602-1',
							template: '支付失败外呼调研'
						}, {
							value: '话术',
							name: '理财模版20180602-1',
							template: '支付失败外呼调研'
						}, {
							value: '问卷',
							name: '理财模版20180602-1',
							template: '支付失败外呼调研'
						}],
					}, {
						name: '理财模版20180602-2',
						status: '已停用',
						type: '普通模版',
						create: '坐席5',
						createTime: '2017-05-21 10:24:12',
						modify: '坐席5',
						modifyTime: '2017-05-21 09:24:12',
						// 问卷模版
						template: '支付失败外呼调研',
						// 按钮状态
						btnType: 0,
						// 配置下拉列表数据
						configDropData: [{
							value: '短信',
							name: '理财模版20180602-2',
							template: '支付失败外呼调研'
						}, {
							value: '链接',
							name: '理财模版20180602-2',
							template: '支付失败外呼调研'
						}, {
							value: '反馈',
							name: '理财模版20180602-2',
							template: '支付失败外呼调研'
						}, {
							value: '话术',
							name: '理财模版20180602-2',
							template: '支付失败外呼调研'
						}, {
							value: '问卷',
							name: '理财模版20180602-2',
							template: '支付失败外呼调研'
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
        if (config.value === "短信") {
          alert("请查看问卷示例")
        } else if (config.value === "链接") {
					alert("请查看问卷示例")
        } else if (config.value === "反馈") {
					alert("请查看问卷示例")
				} else if (config.value === "话术") {
					alert("请查看问卷示例")
				} else if (config.value === "问卷") {
          this.questionModal.show = true
          this.questionModal.title = '问卷模板配置'
          this.questionModal.name = config.name
          this.questionModal.template = config.template
					this.questionTemplateDropData.forEach((_) => {
						_.active = false
					})
					this.getQuestionTemplateDropData()
				} else {
					console.error(`错误的配置项：${JSON.stringify(config)}`)
        }
      },
      // 选中问卷模版
      chooseQuestionTemplate (choose) {
      	this.questionModal.template = choose.value
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
				this.getTemplateData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getTemplateData()
				}
			},
			// 选择类型
			chooseType (choose) {
				this.type = choose.value
			},
      // 选择状态
			chooseStatus (choose) {
				this.status = choose.value
			},
      // 关闭停用Modal
			closeStopModal () {
				this.stopModal.show = false
      },
      // 停用Modal中的确定按钮事件
			confrim () {
				console.log(`停用的模版为 ${this.stopModal.name}`)
        this.getTemplateData()
			},
		},
		computed: {
			questionModalDisabled () {
				return !this.questionModal.template
			}
		}
	}
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";

  .page-template-management {
    .title { position: relative; display: flex; padding-bottom: 17px; border-bottom: 2px solid transparent;
      h4 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding: 0; margin: 0;}
    }
    .cont {
      .query { display: flex; flex-wrap: wrap;
        &-item { margin-right: 70px; display: flex;}
        .query-name { display: block; font-size: $sizeNormal; line-height: 32px; color: $main; min-width: 66px; padding-right: 10px; vertical-align: middle;}
        .art-text-drop { display: block; width: 220px;}
        .art-button + .art-button { margin-left: 10px;}
      }
      .query + .query { margin-top: 22px;}
      .table { position: relative; margin-top: 20px;
        .art-auxi-box { min-height: 300px; position: relative;}
        th, td {
           &:last-child { padding-right: 30px; text-align: center;}
           &:nth-last-child(2) { text-align: center;}
         }
        thead {
          tr th {
            .icon-sort { position: relative; display: inline-block; margin-left: 5px; width: 7px; height: 11px; margin-top: -5.5px; cursor: pointer;
              &:before, &:after { content: ""; position: absolute; left: 50%; margin-left: -2.5px; border-width: 0 0 1px 1px; border-style: solid; border-color: transparent transparent $remark $remark; width: 5px; height: 5px; box-sizing: border-box; }
              &:before { transform: rotate(135deg); top: 1.5px; }
              &:after { transform: rotate(-45deg); bottom: 0.5px; }
              &.desc {
                &:after { border-color: transparent transparent $main $main; }
              }
              &.asc {
                &:before { border-color: transparent transparent $main $main; }
              }
            }
          }
        }
        tbody {
           tr td {
             p { line-height: 26px; white-space: nowrap;}
           }
         }
       }
    }
    .footer {
      .page-box { padding: 20px 0 120px;}
    }

    .row + .row { margin-top: 40px;}

    .stopModal {
      .art-modal-result-btn {
        .art-button + .art-button { margin-left: 10px;}
      }
    }

    .questionModal {
      &-cont { width: 456px; padding: 40px;
        .item { display: flex;
          &-name { position: relative; width: 76px; text-align: right; padding-right: 20px; font-size: $sizeNormal; line-height: 32px; color: $main; white-space: nowrap;
            &:after { content: "*"; position: absolute; right: 10px; top: 8px; display: none; font-size: $sizeNormal; color: #f8636e; line-height: 1;}
          }
          &-cont { flex: 1;
            .art-input, .art-input-drop { width: 100%;}
          }
          &.required {
            .item-name {
              &:after { display: block;}
            }
          }
        }
        .item + .item { margin-top: 22px;}
      }
      &-footer {
        .art-button { margin-right: 0!important;}
        .art-button + .art-button { margin-left: 10px;}
      }
    }

  }
</style>
