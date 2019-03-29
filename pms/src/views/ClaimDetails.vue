<template>
  <div class="page-claim-details">
    <div class="page-claim-details-breadcrumb-box">
      <art-breadcrumb :data="breadcrumbData"></art-breadcrumb>
    </div>
    <div class="page-claim-details-title row no-gutter flex-between">
      <h3>路径认领</h3>
    </div>
    <div class="page-claim-details-cont">
      <div class="page-claim-details-table art-table">
        <table border="0" cellspacing="0">
          <thead>
          <tr>
            <th>
              <p>路径</p>
            </th>
            <th>
              <p>浏览量（PV）</p>
            </th>
            <th>
              <p>独立访客数（UV）</p>
            </th>
            <th>
              <p>IP数</p>
            </th>
            <th>
              <p>操作</p>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(unclaimed, index) in unclaimedData" v-if="unclaimedData && unclaimedData.length > 0">
            <td>
              <art-tooltip placement="right-top">
                <a href="javascript:;" v-text="unclaimed.path || '—'"></a>
                <div class="preview" slot="content">
                  <iframe :src="`//${unclaimed.domain}${unclaimed.path}`" frameborder="0" width="300" height="200"></iframe>
                </div>
              </art-tooltip>
            </td>
            <td>
              <p>{{unclaimed.pv | formatMoney(0)}}</p>
            </td>
            <td>
              <p>{{unclaimed.uv | formatMoney(0)}}</p>
            </td>
            <td>
              <p>{{unclaimed.ip | formatMoney(0)}}</p>
            </td>
            <td>
              <art-button type="blue" size="small" :border="false" @click="claim(unclaimed)">认领</art-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="page-claim-details-auxi-box" v-if="!unclaimedData || unclaimedData.length === 0">
        <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getUnclaimedData">
          <p slot="none">暂无数据</p>
        </art-auxi>
      </div>
    </div>
    <div class="page-claim-details-footer" v-if="count && unclaimedData && unclaimedData.length > 0">
      <div class="page-claim-details-page-box row no-gutter flex-end">
        <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
      </div>
    </div>
    <art-modal class="modal" :show="modal.show" :overlayClose="false" :title="modal.title" @on-cancel="closeModal">
      <div class="modal-cont">
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
          <art-button type="main" size="large" @click="submit" :disabled="modalDisabled">提交</art-button>
          <art-button type="minor" size="large" @click="closeModal">取消</art-button>
        </div>
      </div>
    </art-modal>
    <art-modal :show="resultModal.show" :type="'1'" :overlayClose="false" :result-title="resultModal.title" :result-status="resultModal.status" @on-finish="finishUnclaimed">{{resultModal.desc}}</art-modal>
  </div>
</template>
<script>
  export default {
  	name: 'claimDetails',
		data () {
			return {
				// 父级路径的唯一id
				pathId: '',
				// 该域名的唯一id
        domainId: '',
				// 面包屑数据
				breadcrumbData: [],
				// 当前页
				page: null,
				// 每页显示数量
				pageSize: null,
				// 页数控制器下拉数据
				pageDropData: [],
				// 模拟数据
				unclaimedData: null,
				// 数据总条数
				count: null,
				// 数据状态
				chartData: {
					none: false,
					error: false,
					loading: false,
				},
				// 认领Modal
				modal: {
					show: false,
					title: '',
          domain: '',
          path: '',
					pageType: '',
					first: '',
					second: '',
					third: '',
					fourth: '',
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
			this.pathId = this.$route.params.pid
			this.domainId = this.$route.params.id
      if (this.pathId && this.domainId) {
				this.resetData()
				this.getUnclaimedData()
				this.getPageTypeDropData()
      } else {
				this.$router.replace({path: '/claim'})
      }
		},
		methods: {
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
        this.breadcrumbData = [{
					value: '页面认领', path: `/claim/${this.pathId}`
				}, {
					value: '路径认领', active: true
				}]
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
			// 认领
			claim (unclaimed) {
				this.modal.show = true
				this.modal.title = '认领分类'
				this.modal.domain = unclaimed.domain
				this.modal.path = unclaimed.path
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
			// 查询未认领数据
			getUnclaimedData () {
				this.unclaimedData = null
				// 查询入参
				let param = {domainId: this.domainId, page: this.page, pageSize: this.pageSize}
				console.log(`当前查询入参：${JSON.stringify(param)}`)
				// 模拟异步请求
				this.chartData.loading = true
				this.chartData.error = false
				this.chartData.none = false
				let timer = setTimeout(() => {
					this.chartData.loading = false
					this.unclaimedData = [{
						domain: 'cdn.originalfun.net',
						path: '/spe/main.html',
            pv: 2000,
            uv: 2000,
            ip: 2000
					}, {
						domain: 'cdn.originalfun.net',
						path: '/coin/activity.html',
						pv: 20000,
						uv: 20000,
						ip: 20000
					}]
					this.count = 101
					clearTimeout(timer)
				},1500)
			},
			// 切换页数
			changePage(page) {
				this.page = page
				this.getUnclaimedData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getUnclaimedData()
				}
			},
			// 认领Modal中的提交按钮事件
			submit () {
				const unclaimed = {domain: this.modal.domain, path: this.modal.path, pageType: this.modal.pageType, first: this.modal.first, second: this.modal.second, third: this.modal.third, fourth: this.modal.fourth}
				console.log(`新数据为 ${JSON.stringify(unclaimed)}`)
				this.closeModal()
				this.resultModal.show = true
				this.resultModal.title = '页面认领成功'
				this.resultModal.status = 'success'
				this.resultModal.desc = `您已成功认领页面${this.modal.domain}${this.modal.path}`
			},
			// 认领Modal中的取消按钮事件
			closeModal () {
				this.modal.show = false
			},
			// 结果Modal中的完成按钮事件
			finishUnclaimed () {
				this.closeResultModal()
				this.getUnclaimedData()
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
		},
		computed: {
			modalDisabled () {
				return !(this.modal.pageType && this.modal.first)
			}
		}
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-claim-details { padding: 0 30px;
    &-breadcrumb-box { padding-top: 30px;
      .art-breadcrumb-item-link, .art-breadcrumb-item-separator { display: inline-block;}
    }
    &-title { padding: 30px 0 16px; border-bottom: 2px solid $borderColor;
      h3 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding-top: 8px;}
    }
    &-table { margin-top: 20px;
      tr {
        th .art-text-drop {display: inline-block;
          .art-text-drop-result { color: $remark;}
        }
        th { height: 40px; padding-top: 0; padding-bottom: 0;}
        th, td { position: relative; text-align: center;}
        td:last-child, th:last-child { text-align: center; width: 184px; padding-right: 30px;}
        td:nth-child(1), td:nth-child(2), td:nth-child(3), td:nth-child(4) {
          a { font-size: $sizeSmall; color: $blue; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: flex; text-align: left;}
        }
        th:nth-child(1), td:nth-child(1) { width: 21%; text-align: left;}
        .art-tooltip { position: absolute; left: 30px; right: 0; top: 50%; height: 18px; margin-top: -9px;
          .art-tooltip-trigger { max-width: 100%;}
          .art-tooltip-popper { z-index: 3;}
          .art-tooltip-popper-arrow { top: 9px;}
          .preview { width: 300px; height: 200px;}
        }
      }
    }
    &-auxi-box { position: relative; min-height: 300px; min-width: 130px;}
    &-page-box { padding: 68px 0 120px;}

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
