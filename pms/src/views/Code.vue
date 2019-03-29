<template>
  <div class="page-code">
    <div class="page-code-title row no-gutter flex-between">
      <h3>我的代码</h3>
      <art-button type="text" size="small" icon="http://storage.360buyimg.com/static-res/tech/jrv/1.0.0/button/plus.png" @click="addCode">添加代码</art-button>
    </div>
    <div class="page-code-cont">
      <div class="page-code-assist row no-gutter flex-start">
        <div class="page-code-search">
          <art-input placeholder="搜索关键字" v-model="search" @enter="searchCode" icon="//storage.360buyimg.com/static-res/tech/jrv/1.0.0/input/search.png" :border="false" iconPos="left"></art-input>
        </div>
      </div>
      <div class="page-code-table art-table">
        <table border="0" cellspacing="0">
          <thead>
          <tr>
            <th>
              <p>名称</p>
            </th>
            <th>
              <p>页面类型</p>
            </th>
            <th>
              <p>一级分类</p>
            </th>
            <th>
              <p>二级分类</p>
            </th>
            <th>
              <p>三级分类</p>
            </th>
            <th>
              <p>四级分类</p>
            </th>
            <th>
              <p>操作</p>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(code, index) in codeData" v-if="codeData && codeData.length > 0" @mouseenter="enterTr(code)" @mouseleave="leaveTr(code)">
            <td>
              <p v-text="code.name || '—'"></p>
            </td>
            <td>
              <p v-text="code.pageType || '—'"></p>
            </td>
            <td>
              <p v-text="code.first || '—'"></p>
            </td>
            <td>
              <p v-text="code.second || '—'"></p>
            </td>
            <td>
              <p v-text="code.third || '—'"></p>
            </td>
            <td>
              <p v-text="code.fourth || '—'"></p>
            </td>
            <td>
              <art-btn-drop :dropData="code.dropData" :active="false" @on-choose="chooseAction" :type="code.btnType"></art-btn-drop>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="page-code-auxi-box" v-if="!codeData || codeData.length === 0">
        <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getCodeData">
          <p slot="none">您尚未添加任何代码</p>
        </art-auxi>
      </div>
    </div>
    <div class="page-code-footer" v-if="count && codeData && codeData.length > 0">
      <div class="page-code-page-box row no-gutter flex-end">
        <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
      </div>
    </div>
    <art-modal class="modal" :show="modal.show" :overlayClose="false" :title="modal.title" @on-cancel="closeModal">
      <div class="modal-cont">
        <div class="item required">
          <p class="item-name">名称</p>
          <div class="item-cont">
            <art-input placeholder="必填" status="" :value="modal.name" @input="inputName"></art-input>
          </div>
        </div>
        <div class="item required">
          <p class="item-name">页面类型</p>
          <div class="item-cont">
            <art-input-drop :drop-data="pageTypeDropData" default-text="必选" :auto-width="false" @on-choose="choosePageType"></art-input-drop>
          </div>
        </div>
        <div class="item required">
          <p class="item-name">一级分类</p>
          <div class="item-cont">
            <art-input-drop :drop-data="firstDropData" default-text="必选" :auto-width="false" @on-choose="chooseFirst"></art-input-drop>
          </div>
        </div>
        <div class="item">
          <p class="item-name">二级分类</p>
          <div class="item-cont">
            <art-input-drop :drop-data="secondDropData" default-text="必选" :auto-width="false" @on-choose="chooseSecond" :disabled="!modal.first"></art-input-drop>
          </div>
        </div>
        <div class="item">
          <p class="item-name">三级分类</p>
          <div class="item-cont">
            <art-input-drop :drop-data="thirdDropData" default-text="必选" :auto-width="false" @on-choose="chooseThird" :disabled="!modal.second"></art-input-drop>
          </div>
        </div>
        <div class="item">
          <p class="item-name">四级分类</p>
          <div class="item-cont">
            <art-input-drop :drop-data="fourthDropData" default-text="必选" :auto-width="false" @on-choose="chooseFourth" :disabled="!modal.third"></art-input-drop>
          </div>
        </div>
      </div>
      <div class="footer" slot="footer">
        <div class="art-modal-btn clearfix">
          <art-button type="main" size="large" @click="generateCode" :disabled="modalDisabled">生成代码</art-button>
          <art-button type="minor" size="large" @click="closeModal">取消</art-button>
        </div>
      </div>
    </art-modal>
    <art-modal class="deleteModal" :show="deleteModal.show" :overlayClose="false" :title="deleteModal.title" @on-cancel="closeDeleteModal">
      <div class="deleteModal-cont">
        <p>确认删除这条代码信息？</p>
        <div class="btn-list">
          <art-button type="main" size="large" @click="deleteCode">删除</art-button>
          <art-button type="minor" size="large" @click="closeDeleteModal">取消</art-button>
        </div>
      </div>
    </art-modal>
    <art-modal :show="resultModal.show" :type="'1'" :overlayClose="false" :result-title="resultModal.title" :result-status="resultModal.status" @on-finish="finishCode">{{resultModal.desc}}</art-modal>
  </div>
</template>
<script>
  export default {
  	name: 'codeCustom',
		data () {
			return {
				// 搜索内容
				search: '',
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
				// 数据状态
				chartData: {
					none: false,
					error: false,
					loading: false,
				},
				// 添加代码Modal
				modal: {
					show: false,
					title: '',
					name: '',
					pageType: '',
					first: '',
					second: '',
					third: '',
					fourth: '',
				},
				// 删除代码Modal
				deleteModal: {
					show: false,
					title: '删除代码',
					id: ''
				},
				// 结果Modal
				resultModal: {
					show: false,
					title: '',
					status: '',
					desc: ''
				},
        // 页面类型下拉列表数据
				pageTypeDropData: [],
				// 一级分类下拉列表数据
				firstDropData: [],
				// 二级分类下拉列表数据
				secondDropData: [],
				// 三级分类下拉列表数据
				thirdDropData: [],
				// 四级分类下拉列表数据
				fourthDropData: [],
			}
		},
		created () {
			this.resetData()
			this.getCodeData()
			this.getPageTypeDropData()
		},
		methods: {
			// 数据重置
			resetData () {
				this.pageSize = 10
				this.page = 1
				this.search = null
				this.count = null
				this.pageDropData = [
					{num: 10, value: '10 条/页', active: true},
					{num: 20, value: '20 条/页', active: false},
					{num: 50, value: '50 条/页', active: false}
				]
			},
      // 获取页面类型下拉数据
			getPageTypeDropData () {
				this.pageTypeDropData = [{
					value: '活动类型',
					active: false
				}, {
					value: '理财类型',
					active: false
				}]
      },
			// 获取一级分类下拉数据
			getFirstDropData () {
				this.firstDropData = [{
					value: '供应链金融',
					active: false
				}, {
					value: '财富管理',
					active: false
				}]
			},
			// 获取二级分类下拉数据
			getSecondDropData () {
				// 此时应该带一级分类去查
        console.log(`查询二级分类数据入参，一级分类：${this.modal.first}`)
				this.secondDropData = [{
					value: '动产质押',
					active: false
				}, {
					value: '固收理财',
					active: false
				}]
			},
			// 获取三级分类下拉数据
			getThirdDropData () {
				// 此时应该带一级二级分类去查
				console.log(`查询三级分类数据入参，一级分类：${this.modal.first} 二级分类：${this.modal.second}`)
				this.thirdDropData = [{
					value: '采购融资',
					active: false
				}, {
					value: '保险理财定期',
					active: false
				}]
			},
			// 获取四级分类下拉数据
			getFourthDropData () {
				// 此时应该带一级二级三级分类去查
				console.log(`查询四级分类数据入参，一级分类：${this.modal.first} 二级分类：${this.modal.second} 三级分类：${this.modal.third}`)
				this.fourthDropData = [{
					value: '月月盈-保险理财',
					active: false
				}]
			},
			// 添加代码
			addCode () {
				this.modal.show = true
				this.modal.title = '添加代码'
				this.modal.name = ''
				this.modal.pageType = ''
				this.modal.first = ''
				this.modal.second = ''
				this.modal.third = ''
				this.modal.fourth = ''

        this.pageTypeDropData.forEach((_) => {
					_.active = false
        })
        this.getFirstDropData()
        this.secondDropData = []
        this.thirdDropData = []
        this.fourthDropData = []
			},
			// 搜索代码
			searchCode () {
				this.page = 1
				this.getCodeData(this.search)
			},
			// 查询代码数据
			getCodeData (search) {
				this.codeData = null
				// 查询入参
				let param = {page: this.page, pageSize: this.pageSize}
				if (search) { param.search = search}
				console.log(`当前查询入参：${JSON.stringify(param)}`)
				// 模拟异步请求
				this.chartData.loading = true
				this.chartData.error = false
				this.chartData.none = false
				let timer = setTimeout(() => {
					this.chartData.loading = false
					this.codeData = [{
						id: '1',
						name: '小金库理财',
            pageType: '活动类型',
						first: '供应链金融',
						second: '动产质押',
						third: '采购融资',
						fourth: null,
            // 按钮状态
            btnType: 0,
						dropData: [{
							value: '复制',
							id: '1'
						}, {
							value: '删除',
							id: '1'
						}]
					}, {
						id: '2',
						name: '汽车金融',
						pageType: '活动类型',
						first: '财富管理',
						second: '固收理财',
						third: '保险理财定期',
						fourth: '月月盈-保险理财',
						// 按钮状态
						btnType: 0,
						dropData: [{
							value: '复制',
							id: '2'
						}, {
							value: '删除',
							id: '2'
						}]
					}, {
						id: '3',
						name: '汽车金融',
						pageType: '活动类型',
						first: '众筹业务',
						second: null,
						third: null,
						fourth: null,
						// 按钮状态
						btnType: 0,
						dropData: [{
							value: '复制',
							id: '3'
						}, {
							value: '删除',
							id: '3'
						}]
					}]
					this.count = 101
					clearTimeout(timer)
				},1500)
			},
			// 点击操作中按钮
			chooseAction (action) {
				console.log(`选中项为：${JSON.stringify(action)}`)
				// 可以增加自定义key替换中文做区分
				if (action.value === '复制') {
          this.$router.push({path: `/code/${action.id}`})
				} else if (action.value === '删除') {
					this.deleteModal.show = true
					this.deleteModal.id = action.id
				} else {
					console.error(`错误的操作：${JSON.stringify(action)}`)
				}
			},
			// 切换页数
			changePage(page) {
				this.page = page
				this.getCodeData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getCodeData()
				}
			},
			// 添加代码Modal中的生成代码按钮事件
			generateCode () {
				const code = {name: this.modal.name, pageType: this.modal.pageType, first: this.modal.first, second: this.modal.second, third: this.modal.third, fourth: this.modal.fourth}
				console.log(`新数据为 ${JSON.stringify(code)}`)
				this.closeModal()
				this.resultModal.show = true
				this.resultModal.title = '生成代码成功'
				this.resultModal.status = 'success'
				this.resultModal.desc = '您已成功生成此自定义代码'
			},
			// 添加代码Modal中的取消按钮事件
			closeModal () {
				this.modal.show = false
			},
			// 删除代码Modal中的删除按钮事件
			deleteCode () {
				console.log(`您删除了id为 ${this.deleteModal.id} 的数据`)
				this.closeDeleteModal()
				this.getCodeData()
			},
			// 删除代码Modal中的取消按钮事件
			closeDeleteModal () {
				this.deleteModal.show = false
			},
			// 结果Modal中的完成按钮事件
			finishCode () {
				this.closeResultModal()
				this.getCodeData()
			},
			// 结果Modal中的取消按钮事件
			closeResultModal () {
				this.resultModal.show = false
			},
      // 选择页面类型
			choosePageType (choose) {
				this.modal.pageType = choose.value
      },
			// 选择一级分类
			chooseFirst (choose) {
				if (this.modal.first !== choose.value) {
					this.modal.first = choose.value
					this.getSecondDropData()
				}
			},
			// 选择二级分类
			chooseSecond (choose) {
				if (this.modal.second !== choose.value) {
					this.modal.second = choose.value
					this.getThirdDropData()
				}
			},
			// 选择三级分类
			chooseThird (choose) {
				if (this.modal.third !== choose.value) {
					this.modal.third = choose.value
					this.getFourthDropData()
				}
			},
			// 选择四级分类
			chooseFourth (choose) {
				this.modal.fourth = choose.value
			},
			// input 监听
			inputName (val) {
				this.modal.name = val;
			},

      // table 监听
      enterTr (item) {
				item.btnType = 1
      },
			leaveTr (item) {
				item.btnType = 0
			},
		},
		computed: {
			modalDisabled () {
				return !(this.modal.name && this.modal.pageType && this.modal.first)
			}
		}
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-code { padding: 0 30px;
    &-title { padding: 30px 0 16px; border-bottom: 2px solid $borderColor;
      h3 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding-top: 8px;}
    }
    &-search { padding: 7px 0 20px;}
    &-table {
      tr {
        th .art-text-drop {display: inline-block;
          .art-text-drop-result { color: $remark;}
        }
        th { height: 40px; padding-top: 0; padding-bottom: 0;}
        th, td { position: relative;}
        td:last-child, th:last-child { text-align: center; width: 184px; padding-right: 30px;}
        td:nth-child(1), td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6) {
          p { position: absolute; left: 30px; right: 0; top: 0; bottom: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; line-height: 50px;}
        }
      }
    }
    &-auxi-box { position: relative; min-height: 300px; min-width: 130px;}
    &-page-box { padding: 68px 0 120px;}

    .deleteModal {
      &-cont { width: 340px; height: 194px; padding: 53px 0 35px;
        p { font-size: $sizeLarge; color: $mainStrong; text-align: center; white-space: nowrap; line-height: 24px;}
        .btn-list { font-size: 0; text-align: center; margin-top: 42px;
          .art-button + .art-button { margin-left: 10px;}
        }
      }
      .art-modal-footer { display: none;}
    }

    .modal {
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
    }
  }
</style>
