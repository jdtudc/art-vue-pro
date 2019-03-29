<template>
  <div class="page-central-monitor">
    <div class="page-central-monitor-cont">
      <div class="title row no-gutter flex-between">
        <h4>电话营销-模版管理</h4>
        <art-button type="main" @click="queryMonitorData">查询</art-button>
      </div>
      <div class="cont">
        <div class="query-box">
          <div class="query row no-gutter flex-start flex-middle">
            <art-radio :value="radio.value" :active="radio.active" :disabled="radio.disabled" v-for="(radio, index) in groupRadioData" :key="index" @click.native="!radio.disabled && clickGroupRadio(radio)"></art-radio>
          </div>
          <div class="query row no-gutter flex-start flex-middle">
            <div class="query-item">
              <div class="query-name">销售团队</div>
              <art-input-drop :drop-data="teamDropData" :auto-width="false" size="middle" @on-choose="chooseTeam"></art-input-drop>
            </div>
            <div class="query-item">
              <div class="query-name">销售人员</div>
              <art-input-drop :drop-data="memberDropData" :auto-width="false" size="middle" @on-choose="chooseMember"></art-input-drop>
            </div>
          </div>
          <div class="query row no-gutter flex-start flex-middle">
            <div class="query-item">
              <div class="query-name">监控维度</div>
              <art-input-drop :drop-data="degreeDropData" :auto-width="false" size="middle" @on-choose="chooseDegree"></art-input-drop>
            </div>
            <div class="query-item">
              <art-radio :value="radio.value" :active="radio.active" :disabled="radio.disabled" v-for="(radio, index) in periodRadioData" :key="index" @click.native="!radio.disabled && clickPeriodRadio(radio)"></art-radio>
            </div>
          </div>
          <div class="query row no-gutter flex-start flex-middle">
            <div class="query-item">
              <div class="query-name">业务类型</div>
              <art-input-drop :drop-data="businessTypeDropData" :auto-width="false" size="middle" @on-choose="chooseBusinessType"></art-input-drop>
            </div>
            <div class="query-item">
              <div class="query-name">活动类型</div>
              <art-input-drop :drop-data="activityTypeDropData" :auto-width="false" size="middle" @on-choose="chooseActivityType"></art-input-drop>
              <art-calendar placeholder="请选择开始日期" @select="selectStartDate"></art-calendar>
              <span class="date-concat"></span>
              <art-calendar placeholder="请选择结束日期" @select="selectEndDate
"></art-calendar>
            </div>
          </div>
        </div>
        <div class="art-table table">
          <table cellspacing="0" cellpadding="0">
            <thead>
              <tr>
              <th>时间</th>
              <th>业务类型</th>
              <th>市场活动</th>
              <th>销售团队</th>
              <th>销售人员</th>
              <th>任务总量</th>
              <th>未拨打</th>
              <th>继续联系</th>
              <th>未联系到</th>
              <th>受理</th>
              <th>成交</th>
              <th>未成交</th>
            </tr>
            </thead>
            <tbody v-if="!chartData.none && !chartData.error && !chartData.loading">
              <tr v-for="(monitor, index) in monitorData">
              <td><p v-text="monitor.date"></p></td>
              <td><p v-text="monitor.businessType"></p></td>
              <td><p v-text="monitor.activityType"></p></td>
              <td><p v-text="monitor.team"></p></td>
              <td><p v-text="monitor.member"></p></td>
              <td><p>{{monitor.total | formatMoney(0)}}</p></td>
              <td><p>{{monitor.uncalled | formatMoney(0)}}</p></td>
              <td><p>{{monitor.contacted | formatMoney(0)}}</p></td>
              <td><p>{{monitor.notContacted | formatMoney(0)}}</p></td>
              <td><p>{{monitor.accepted | formatMoney(0)}}</p></td>
              <td><p>{{monitor.traded | formatMoney(0)}}</p></td>
              <td><p>{{monitor.notTraded | formatMoney(0)}}</p></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="art-auxi-box" v-if="chartData.none || chartData.error || chartData.loading">
          <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getMonitorData"></art-auxi>
        </div>
      </div>
      <div class="footer" v-if="count && monitorData && monitorData.length > 0">
        <div class="page-box row no-gutter flex-end">
          <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "central-monitor",
    data () {
    	return {
    		// 组单选数据
				groupRadioData: [{
					value: '销售团队',
          active: false,
        }, {
					value: '销售人员',
					active: true
				}],
        // 当前查看的组
        group: '销售人员',
				// 销售团队下拉列表数据
				teamDropData: [{
					value: '客户关怀部',
					active: true
				}, {
					value: '外呼营销组',
					active: false
				}],
        // 当前选择的团队
        team: '客户关怀部',
				// 销售人员下拉列表数据
				memberDropData: [{
					value: 'test111',
					active: true
				}, {
					value: '李艳艳',
					active: false
				}],
				// 当前选择的人员
				member: 'test111',
				// 监控维度下拉列表数据
				degreeDropData: [{
					value: '任务统计',
					active: true
				}, {
					value: '批次任务',
					active: false
				}],
				// 当前选择的维度
				degree: '任务统计',
				// 周期单选数据
				periodRadioData: [{
					value: '近1天',
					active: false,
				}, {
					value: '近7天',
					active: true
				}],
				// 当前查看的组
				period: '近7天',
				// 业务类型下拉列表数据
				businessTypeDropData: [{
					value: '超音平台智能外呼',
					active: true
				}, {
					value: '消费金融',
					active: false
				}],
				// 当前选择的业务类型
				businessType: '超音平台智能外呼',
				// 活动类型下拉列表数据
				activityTypeDropData: [{
					value: '固收爆款产品推荐',
					active: true
				}, {
					value: '白条分期',
					active: false
				}],
				// 当前选择的活动类型
				activityType: '固收爆款产品推荐',
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: '',

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
				monitorData: null,
      }
    },
    created () {
    	this.resetData()
    	this.getMonitorData()
    },
    methods: {
    	// 点击切换查看组
      clickGroupRadio (radio) {
      	if (!radio.active) {
      		this.group = radio.value
          this.groupRadioData.forEach((_) => {
      			_.active = this.group === _.value ? true : false
          })
        }
      },
			// 选择销售团队
			chooseTeam (choose) {
				this.team = choose.value
			},
			// 选择销售人员
			chooseMember (choose) {
				this.member = choose.value
			},
			// 选择监控维度
			chooseDegree (choose) {
				this.degree = choose.value
			},
			// 点击切换查看周期
			clickPeriodRadio (radio) {
				if (!radio.active) {
					this.period = radio.value
					this.periodRadioData.forEach((_) => {
						_.active = this.period === _.value ? true : false
					})
				}
			},
			// 选择业务类型
			chooseBusinessType (choose) {
				this.businessType = choose.value
			},
			// 选择活动类型
			chooseActivityType (choose) {
				this.activityType = choose.value
			},
      // 选择开始日期
      selectStartDate (date) {
      	this.startDate = `${date.year}-${date.month}-${date.day}`
      },
			// 选择结束日期
			selectEndDate (date) {
				this.endDate = `${date.year}-${date.month}-${date.day}`
			},

    	// 按条件查询模版列表数据
			queryMonitorData () {
				this.page = 1
        this.getMonitorData()
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
      getMonitorData () {
      	this.monitorData = null
        // 查询入参
        let param = {page: this.page, pageSize: this.pageSize, group: this.group, team: this.team, member: this.member, degree: this.degree, period: this.period, businessType: this.businessType, activityType: this.activityType, startDate: this.startDate, endDate: this.endDate}
				console.log(`当前查询入参：${JSON.stringify(param)}`)
      	this.chartData.loading = true
      	this.chartData.error = false
      	this.chartData.none = false
      	let timer = setTimeout(() => {
      		this.chartData.loading = false
      		this.monitorData = [{
						date: '2017-05-21',
						businessType: '消费金融',
						activityType: '白条分期',
						team: '外呼营销组',
						member: '李艳艳',
						total: 235,
						uncalled: 0,
						contacted: 23,
						notContacted: 12,
						accepted: 0,
						traded: 0,
						notTraded: 0,
					}, {
						date: '2017-05-26',
						businessType: '消费金融',
						activityType: '白条分期',
						team: '外呼营销组',
						member: 'test111',
						total: 2350,
						uncalled: 0,
						contacted: 23,
						notContacted: 12,
						accepted: 0,
						traded: 6,
						notTraded: 5,
					}]
          this.count = 101
          clearTimeout(timer)
        }, 1500)
      },
			// 切换页数
			changePage(page) {
				this.page = page
				this.getMonitorData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getMonitorData()
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
		}
	}
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";

  .page-central-monitor {
    .title { position: relative; display: flex; padding-bottom: 17px; border-bottom: 2px solid $borderColor;
      h4 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; margin-top: 4px;}
    }
    .cont { margin-top: 21px;
      .query { height: 32px;
        &-item { display: flex;}
        .query-item + .query-item { margin-left: 70px;}
        .query-name { display: block; font-size: $sizeNormal; line-height: 32px; color: $main; min-width: 66px; padding-right: 10px; vertical-align: middle;}
        .art-radio + .art-radio { margin-left: 24px;}
        .art-input-drop + .art-calendar { margin-left: 50px;}
        .art-text-drop { display: block; width: 200px;}
        .art-calendar .art-input { width: 194px;}
        .date-concat { display: block; width: 9px; height: 1px; margin: auto 5px; background-color: #bdc0c9;}
      }
      .query + .query { margin-top: 22px;}
      .table { position: relative; margin-top: 40px;
        .art-auxi-box { min-height: 300px; position: relative;}
        th, td {
           &:last-child { padding-right: 30px;}
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
  }
</style>
