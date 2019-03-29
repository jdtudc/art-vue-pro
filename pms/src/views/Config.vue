<template>
  <div class="page-config">
    <div class="page-config-title row no-gutter flex-between">
      <h3>业务配置</h3>
    </div>
    <div class="page-config-cont">
      <div class="page-config-assist row no-gutter flex-start">
        <div class="page-config-search">
          <art-input placeholder="搜索关键字" v-model="search" @enter="searchConfig" icon="//storage.360buyimg.com/static-res/tech/jrv/1.0.0/input/search.png" :border="false" iconPos="left"></art-input>
        </div>
      </div>
      <div class="page-config-table art-table">
        <table border="0" cellspacing="0">
          <thead>
            <tr>
              <th>
                <p>分类编码</p>
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
            <tr v-for="(config, index) in configData" v-if="configData && configData.length > 0">
              <td>
                <p v-text="config.code || '—'"></p>
              </td>
              <td>
                <p v-text="config.first || '—'"></p>
              </td>
              <td>
                <p v-text="config.second || '—'"></p>
              </td>
              <td>
                <p v-text="config.third || '—'"></p>
              </td>
              <td>
                <p v-text="config.fourth || '—'"></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-config-auxi-box" v-if="!configData || configData.length === 0">
        <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getConfigData">
          <p slot="none">暂无数据</p>
        </art-auxi>
      </div>
    </div>
    <div class="page-config-footer" v-if="count && configData && configData.length > 0">
      <div class="page-config-page-box row no-gutter flex-end">
        <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
  	name: 'config',
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
        configData: null,
        // 数据总条数
        count: null,
        // 数据状态
				chartData: {
					none: false,
					error: false,
					loading: false,
				},
        // 添加和编辑配置通用Modal
        modal: {
					show: false,
          type: '',
          title: '',
          code: '',
          first: '',
          second: '',
          third: '',
          fourth: '',
        },
        // 删除配置Modal
				deleteModal: {
					show: false,
          title: '删除配置',
          code: ''
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
      this.getConfigData()
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
      // 搜索配置
			searchConfig () {
      	this.page = 1
      	this.getConfigData(this.search)
      },
      // 查询业务配置数据
			getConfigData (search) {
      	this.configData = null
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
          this.configData = [{
						code: '9930011',
						first: '供应链金融',
						second: '动产质押',
						third: '采购融资',
						fourth: null,
						dropData: [{
							value: '编辑',
							code: '9930011',
							first: '供应链金融',
							second: '动产质押',
							third: '采购融资',
							fourth: null,
						}, {
							value: '删除',
							code: '9930011',
							first: '供应链金融',
							second: '动产质押',
							third: '采购融资',
							fourth: null,
						}]
					}, {
						code: '9840014',
						first: '财富管理',
						second: '固收理财',
						third: '保险理财定期',
						fourth: '月月盈-保险理财',
					}, {
						code: '9720003',
						first: '众筹业务',
						second: null,
						third: null,
						fourth: null,
					}]
					this.count = 101
          clearTimeout(timer)
				},1500)
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
			}
    },

  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  .page-config { padding: 0 30px;
    &-title { padding: 30px 0 16px; border-bottom: 2px solid $borderColor;
      h3 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding-top: 8px;}
    }
    &-search { padding: 7px 0 20px;}
    &-table {
      tr {
        th, td { position: relative; height: 50px;}
        td:nth-child(6), th:nth-child(6) { text-align: center; width: 184px; padding-right: 30px;}
        td:nth-child(1), td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5) {
          p { position: absolute; left: 30px; right: 0; top: 0; bottom: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; line-height: 50px;}
        }
      }
    }
    &-auxi-box { position: relative; min-height: 300px; min-width: 130px;}
    &-page-box { padding: 68px 0 120px;}
  }
</style>
