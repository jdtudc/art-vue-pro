<template>
  <div class="page-rule-all">
    <div class="page-rule-all-title row no-gutter flex-between">
      <h3>全部规则</h3>
      <art-button type="text" size="small" icon="http://storage.360buyimg.com/static-res/tech/jrv/1.0.0/button/plus.png" @click="addRule">添加规则</art-button>
    </div>
    <div class="page-rule-all-cont">
      <div class="page-rule-all-assist row no-gutter flex-start">
        <div class="page-rule-all-search">
          <art-input placeholder="搜索关键字" v-model="search" @enter="searchRule" icon="//storage.360buyimg.com/static-res/tech/jrv/1.0.0/input/search.png" :border="false" iconPos="left"></art-input>
        </div>
      </div>
      <div class="page-rule-all-table art-table">
        <table border="0" cellspacing="0">
          <thead>
          <tr>
            <th>
              <p>名称</p>
            </th>
            <th>
              <p>创建人</p>
            </th>
            <th>
              <p>正则规则／覆盖页面数</p>
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
          </tr>
          </thead>
          <tbody>
          <tr v-for="(rule, index) in ruleData" v-if="ruleData && ruleData.length > 0">
            <td>
              <p v-text="rule.name || '—'"></p>
            </td>
            <td>
              <p v-text="rule.created || '—'"></p>
            </td>
            <td>
              <art-tooltip>
                <a href="javascript:;">
                  <span v-text="rule.reg"></span>
                  <span v-text="`（${rule.covers}）`"></span>
                </a>
                <div slot="content">
                  <ul>
                    <li v-text="rule.reg"></li>
                    <li v-text="`可覆盖页面数：${rule.covers}`"></li>
                  </ul>
                </div>
              </art-tooltip>
            </td>
            <td>
              <p v-text="rule.first || '—'"></p>
            </td>
            <td>
              <p v-text="rule.second || '—'"></p>
            </td>
            <td>
              <p v-text="rule.third || '—'"></p>
            </td>
            <td>
              <p v-text="rule.fourth || '—'"></p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="page-rule-all-auxi-box" v-if="!ruleData || ruleData.length === 0">
        <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getRuleData">
          <p slot="none">您尚未添加任何规则</p>
        </art-auxi>
      </div>
    </div>
    <div class="page-rule-all-footer" v-if="count && ruleData && ruleData.length > 0">
      <div class="page-rule-all-page-box row no-gutter flex-end">
        <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
      </div>
    </div>
    <art-modal class="deleteModal" :show="deleteModal.show" :overlayClose="false" :title="deleteModal.title" @on-cancel="closeDeleteModal">
      <div class="deleteModal-cont">
        <p>确认删除这条规则信息？</p>
        <div class="btn-list">
          <art-button type="main" size="large" @click="deleteRule">删除</art-button>
          <art-button type="minor" size="large" @click="closeDeleteModal">取消</art-button>
        </div>
      </div>
    </art-modal>
  </div>
</template>
<script>
	export default {
		name: 'ruleAll',
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
				ruleData: null,
				// 数据总条数
				count: null,
				// 数据状态
				chartData: {
					none: false,
					error: false,
					loading: false,
				},
				// 删除规则Modal
				deleteModal: {
					show: false,
					title: '删除规则',
					id: ''
				},
				// 结果Modal
				resultModal: {
					show: false,
					title: '',
					status: '',
					desc: ''
				}
			}
		},
		created () {
			this.resetData()
			this.getRuleData()
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
			// 添加规则
			addRule () {
				this.$router.push({path: `/rule/all/add`})
			},
			// 搜索规则
			searchRule () {
				this.page = 1
				this.getRuleData(this.search)
			},
			// 查询规则数据
			getRuleData (search) {
				this.ruleData = null
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
					this.ruleData = [{
						id: '1',
						name: '小金库理财',
            reg: 'cdn.originalfun.net/upload',
						covers: 80,
						first: '供应链金融',
						second: '动产质押',
						third: '采购融资',
						fourth: null,
						created: '张三',
					}, {
						id: '2',
						name: '汽车金融',
            reg: 'http://www.faceh5.com/newyear/activity/acrs.html',
            covers: 22,
						first: '财富管理',
						second: '固收理财',
						third: '保险理财定期',
						fourth: '月月盈-保险理财',
						created: '李四',
					}, {
						id: '3',
						name: '汽车金融',
						reg: 'http://www.faceh5.com/newyear/activity/acrs.html',
						covers: 29,
						first: '众筹业务',
						second: null,
						third: null,
						fourth: null,
						created: '张三',
					}]
					this.count = 101
					clearTimeout(timer)
				},1500)
			},
			// 切换页数
			changePage(page) {
				this.page = page
				this.getRuleData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getRuleData()
				}
			},
			// 删除规则Modal中的删除按钮事件
			deleteRule () {
				console.log(`您删除了id为 ${this.deleteModal.id} 的数据`)
				this.closeDeleteModal()
				this.getRuleData()
			},
			// 删除规则Modal中的取消按钮事件
			closeDeleteModal () {
				this.deleteModal.show = false
			},
		},
	}
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-rule-all { padding: 0 30px;
    &-title { padding: 30px 0 16px; border-bottom: 2px solid $borderColor;
      h3 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding-top: 8px;}
    }
    &-search { padding: 7px 0 20px;}
    &-table {
      tr {
        td { position: relative; height: 50px;
          p { position: absolute; left: 30px; right: 0; top: 0; bottom: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; line-height: 50px;}
          a { display: flex; color: $blue; font-size: $sizeSmall;
            span { display: block;}
            span:first-child { flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}
            span:last-child {}
          }
        }
        th:nth-child(1), td:nth-child(1) { width: 15%;}
        th:nth-child(3), td:nth-child(3) { width: 20%;}
        .art-tooltip { position: absolute; left: 30px; right: 0; top: 50%; height: 18px; margin-top: -9px;
          .art-tooltip-trigger { max-width: 100%;}
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
  }
</style>
