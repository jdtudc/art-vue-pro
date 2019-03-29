<template>
  <div class="page-claim">
    <div class="page-claim-title row no-gutter flex-start">
      <h3>页面认领</h3>
      <span>数据周期为 2018-04-21 至 2018-05-31</span>
    </div>
    <div class="page-claim-cont">
      <div class="page-claim-assist row no-gutter flex-start">
        <div class="page-claim-search">
          <art-input placeholder="搜索关键字" v-model="search" @enter="searchPage" icon="//storage.360buyimg.com/static-res/tech/jrv/1.0.0/input/search.png" :border="false" iconPos="left"></art-input>
        </div>
      </div>
      <div class="page-claim-table art-table">
        <table border="0" cellspacing="0">
          <thead>
          <tr>
            <th>
              <p>路径</p>
            </th>
            <th>
              <p>待认领页面数</p>
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
          </tr>
          </thead>
          <tbody>
          <tr v-for="(page, index) in pageData" v-if="pageData && pageData.length > 0">
            <td>
              <router-link :to="{path: `/claim/${pid}/${page.id}`}" v-text="page.path || '—'"></router-link>
            </td>
            <td>
              <p>{{page.unclaimed | formatMoney(0)}}</p>
            </td>
            <td>
              <p>{{page.pv | formatMoney(0)}}</p>
            </td>
            <td>
              <p>{{page.uv | formatMoney(0)}}</p>
            </td>
            <td>
              <p>{{page.ip | formatMoney(0)}}</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="page-claim-auxi-box" v-if="!pageData || pageData.length === 0">
        <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getPageData">
          <p slot="none">暂无数据</p>
        </art-auxi>
      </div>
    </div>
    <div class="page-claim-footer" v-if="count && pageData && pageData.length > 0">
      <div class="page-claim-page-box row no-gutter flex-end">
        <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
      </div>
    </div>
  </div>
</template>
<script>
	export default {
		name: 'claim',
		data () {
			return {
				// 当前页面id
				pid: null,
				// 搜索内容
				search: '',
				// 当前页
				page: null,
				// 每页显示数量
				pageSize: null,
				// 页数控制器下拉数据
				pageDropData: [],
				// 模拟数据
				pageData: null,
				// 数据总条数
				count: null,
				// 数据状态
				chartData: {
					none: false,
					error: false,
					loading: false,
				},
			}
		},
		created () {
			this.pid = this.$route.params.pid
			this.resetData()
			this.getPageData()
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
			// 搜索页面
			searchPage () {
				this.page = 1
				this.getPageData(this.search)
			},
			// 查询页面数据
			getPageData (search) {
				this.pageData = null
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
					this.pageData = [{
						id: '1',
						domain: 'cdn.originalfun.net',
						path: '/test/1',
						unclaimed: 2000,
						pv: 2000,
						uv: 2000,
						ip: 2000,
					}, {
						id: '2',
						domain: 'www.faceh5.com',
						path: '/test/2',
						unclaimed: 2000,
						pv: 2000,
						uv: 2000,
						ip: 2000,
					}]
					this.count = 101
					clearTimeout(timer)
				},1500)
			},
			// 切换页数
			changePage(page) {
				this.page = page
				this.getPageData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getPageData()
				}
			},
		}
	}
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-claim { padding: 0 30px;
    &-title { padding: 30px 0 16px; border-bottom: 2px solid $borderColor;
      h3 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding-top: 8px;}
      span { font-size: $sizeSmall; color: $mainWeak; line-height: 16px; padding-top: 16px; margin-left: 16px;}
    }
    &-search { padding: 7px 0 20px;}
    &-table {
      tr {
        th .art-text-drop {display: inline-block;
          .art-text-drop-result { color: $remark;}
        }
        td { height: 50px; }
        th, td { position: relative; width: 20%; text-align: center;}
        th:nth-child(1), td:nth-child(1) { text-align: left;
          a { position: absolute; left: 30px; right: 0; top: 0; bottom: 0; color: $blue; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; line-height: 50px;
            &:hover { color: $blueActive;}
          }
        }
      }
    }
    &-auxi-box { position: relative; min-height: 300px; min-width: 130px;}
    &-page-box { padding: 68px 0 120px;}
  }
</style>
