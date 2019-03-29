<template>
  <div class="page-index">
    <div class="page-index-cont">
      <div class="row no-gutter">
        <div class="col-12 task">
          <div class="title row no-gutter flex-between flex-middle">
            <h4>任务信息</h4>
            <div class="other">
              <art-text-drop :drop-data="taskDropData" :auto-width="true"></art-text-drop>
              <i class="icon icon-refresh"></i>
            </div>
          </div>
          <div class="cont">
            <div class="row small-gutter">
              <div class="col-6">
                <div class="card card_active">
                  <p>待启用批次<i class="icon-arrow"></i></p>
                  <p>0</p>
                </div>
              </div>
              <div class="col-6">
                <div class="card">
                  <p>待下次批次<i class="icon-arrow"></i></p>
                  <p>1</p>
                </div>
              </div>
              <div class="col-6">
                <div class="card">
                  <p>将到期批次<i class="icon-arrow"></i></p>
                  <p>0</p>
                </div>
              </div>
              <div class="col-6">
                <div class="card">
                  <p>已过期批次<i class="icon-arrow"></i></p>
                  <p>2</p>
                </div>
              </div>
            </div>
            <div class="row small-gutter">
              <div class="col-6">
                <div class="card card_trans">
                  <p>外呼次数</p>
                  <p>72</p>
                </div>
              </div>
              <div class="col-6">
                <div class="card card_trans">
                  <p>外呼通次</p>
                  <p>46</p>
                </div>
              </div>
              <div class="col-6">
                <div class="card card_trans">
                  <p>有效呼出率</p>
                  <p>63.89%</p>
                </div>
              </div>
              <div class="col-6">
                <div class="card card_trans">
                  <p>平均通话时长</p>
                  <p>00:35:45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 performance">
          <div class="title row no-gutter flex-between flex-middle">
            <h4>总体业绩（近30天）</h4>
            <div class="other">
              <i class="icon icon-refresh"></i>
            </div>
          </div>
          <div class="cont">
            <div class="card card_active">
              <p>私募成交数<i class="icon-arrow"></i></p>
              <p>124</p>
            </div>
            <div class="card">
              <p>保险成交数<i class="icon-arrow"></i></p>
              <p>8,189</p>
            </div>
            <div class="card">
              <p>绩效总计<i class="icon-arrow"></i></p>
              <p>35.05</p>
            </div>
            <div class="card">
              <p>白条分期成交数<i class="icon-arrow"></i></p>
              <p>0</p>
            </div>
        </div>
      </div>
      </div>
      <div class="row no-gutter">
        <div class="col-12 client">
          <div class="title row no-gutter flex-between flex-middle">
            <h4>客户管理</h4>
            <div class="other">
              <i class="icon icon-refresh" @click="getClientData"></i>
            </div>
          </div>
          <div class="cont">
            <div class="type">
              <a href="javascript:;">专属客户</a>
              <a class="active" href="javascript:;">关注客户</a>
            </div>
            <div class="art-table table">
              <table border="0" cellspacing="0" v-if="clientData && clientData.length > 0">
                <thead>
                <tr>
                  <th><p>人群名称</p></th>
                  <th><p>关注坐席</p></th>
                  <th><p>客户数</p></th>
                  <th><p>操作</p></th>
                </tr>
                </thead>
                <tbody >
                <tr v-for="(client, index) in clientData" :key="index">
                  <td><p v-text="client.name"></p></td>
                  <td><p v-text="client.watch"></p></td>
                  <td><p>{{client.customers | formatMoney(0)}}</p></td>
                  <td><art-button type="blue" size="small" :border="false">详情</art-button></td>
                </tr>
                </tbody>
              </table>
              <art-auxi :loading="clientChartData.loading" :error="clientChartData.error" :none="clientChartData.none" v-if="clientChartData.loading || clientChartData.error || clientChartData.none" @on-retry="getClientData"></art-auxi>
            </div>
          </div>
          </div>
        <div class="col-12 monitor">
          <div class="title row no-gutter flex-between flex-middle">
            <h4>员工任务监控</h4>
            <div class="other">
              <art-text-drop :drop-data="monitorDropData" :auto-width="true" @on-choose="chooseMonitorPeriod"></art-text-drop>
              <i class="icon icon-refresh" @click="getMonitorData"></i>
            </div>
          </div>
          <div class="cont">
            <art-chart chart-id="line4" auxi :option="lineOpt" :loading="monitorChartData.loading" :error="monitorChartData.error" :none="monitorChartData.none"></art-chart>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: "index",
    data () {
    	return {
    		// 线性图数据
				lineOpt: {
					dataAxis: [],
					data: [],
				},
				// 任务信息下拉列表数据
				taskDropData: [{
					value: '近1年',
					active: true
				}, {
					value: '近半年',
          active: false
				}],
        // 客户管理数据
				clientData: null,
				// 客户管理图表状态
				clientChartData: {
					loading: false,
					error: false,
					none: false,
				},
				// 任务监控下拉列表数据
				monitorDropData: [{
					value: '近7天',
					active: true
				}, {
					value: '近1个月',
					active: false
				}],
				monitorPeriod: '近7天',
				// 任务监控图表状态
				monitorChartData: {
					loading: false,
					error: false,
					none: false,
				},
      }
    },
    created () {
    	this.getClientData()
    	this.getMonitorData()
    },
    methods: {
			// 获取客户管理数据
			getClientData () {
				this.clientData = null
				this.clientChartData.loading = true
				this.clientChartData.none = false
				this.clientChartData.error = false
				// 模拟异步请求
				let timer = setTimeout(() => {
					this.clientChartData.loading = false
					this.clientData = [{
						name: '客户关怀部/天津电销部/理财外呼1组',
            watch: '章袅',
						customers: 3
          }, {
						name: '客户关怀部/天津电销部/理财外呼1组',
						watch: '章袅',
						customers: 2
					}, {
						name: '客户关怀部/天津电销部/理财外呼1组',
						watch: '章袅',
						customers: 1
					}]
					clearTimeout(timer)
				},1500)
			},
    	// 获取员工任务监控数据
    	getMonitorData () {
    		console.log(`查询任务监控数据周期：${this.monitorPeriod}`)
        this.monitorChartData.loading = true
        this.monitorChartData.none = false
        this.monitorChartData.error = false
				// 模拟异步请求
				let timer = setTimeout(() => {
					this.monitorChartData.loading = false
          this.lineOpt = {
						dataAxis: ["20180412","20180413","20180414","20180415","20180416","20180417"],
						data: [{
							name: "已成交",
							data: [1000, 1000, 800, 3000, 700, 2500]
						}, {
							name: "已外呼",
							data: [2000, 400, 200, 2500, 300, 2000]
						}, {
							name: "待外呼",
							data: [1200, 300, 100, 1300, 200, 500]
						}],
					}
					clearTimeout(timer)
        },1500)
      },
      // 切换员工任务监控查看周期
			chooseMonitorPeriod (period) {
    		if (period.value !== this.monitorPeriod) {
    			this.monitorPeriod = period.value
          this.getMonitorData()
        }
      },
    },
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";

  .page-index {
    .title { position: relative; display: flex; padding-bottom: 17px;
      h4 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding: 0; margin: 0;}
      .other { display: flex;
        .art-text-drop-box { left: auto!important; top: 26px; right: 10px; text-align: right;}
        .art-text-drop-result { line-height: 24px;}
        .icon { display: block; width: 12px; height: 12px; background-color: $bg; margin-top: auto; margin-bottom: auto; cursor: pointer;
          &:hover { transition: all $animateTime;}
        }
        .art-text-drop + .icon { margin-left: 20px;}
        .icon + .icon { margin-left: 15px;}
        .icon-refresh { width: 11px; height: 13px; background-image: url("//storage.360buyimg.com/static-res/tech/jrv/pro/icon/icon-refresh.png");
          &:hover { background-image: url("//storage.360buyimg.com/static-res/tech/jrv/pro/icon/icon-refresh_active.png");}
        }
        .icon-save { width: 12px; height: 12px; background-image: url("//storage.360buyimg.com/static-res/tech/jrv/pro/icon/icon-save.png");
          &:hover { background-image: url("//storage.360buyimg.com/static-res/tech/jrv/pro/icon/icon-save_active.png");}
        }
      }
    }
    .cont {
      .card { background-color: $bg; border-radius: $borderRadius; height: 98px; padding: 25px 0 0 20px;
        p { line-height: 1;}
        p:nth-child(1) { font-size: $sizeNormal; color: $main;}
        p:nth-child(2) { font-size: 32px; margin-top: 10px; color: $mainStrong;}
        &_active { background-image: linear-gradient(128deg, #6BAEFF 0%, $blue 100%); box-shadow: 0 2px 10px 0 rgba(15,124,255,0.25);
          p { color: $white!important;}
        }
        &_trans { background-color: transparent;
          p:nth-child(2) { font-size: $sizeLarge; line-height: 32px; margin-top: 16px;}
        }
      }
    }
    .task, .client { padding-right: 28px;}
    .performance, .monitor { padding-left: 28px;}
    .client, .monitor {
      .title { border-bottom: 2px solid $borderColor;}
    }
    .performance {
      .cont { display: flex; flex-wrap: wrap;
        .card { width: 28.7%; height: 98px; margin-left: 10px; margin-bottom: 10px;
          &:nth-child(3n + 1) { margin-left: 0;}
          &:nth-child(4) { margin-bottom: 0;}
        }
      }
    }
    .client {
      .type { padding: 17px 0; font-size: 0;
        a { position: relative; display: inline-block; font-size: $sizeSmall; line-height: 17px; color: $mainStrong; margin: 0 20px;
          &.active { color: $blue;}
          &:after { content: ''; position: absolute; left: -20px; top: 50%; width: 1px; height: 12px; margin-top: -6px; background-color: $borderColor;}
          &:first-child { margin-left: 0;
            &:after { display: none;}
          }
        }
      }
      .table { position: relative;
        th, td {
          &:last-child { padding-right: 30px; text-align: right;}
        }
        tbody {
          tr td {
            a { display: block; color: $blue; line-height: 26px;}
          }
        }
        .art-auxi { min-height: 198px;}
      }
    }
    .monitor {
      .art-chart { height: 231px;}
      .art-chart_line4-legend { margin-top: 18px;}
      .art-chart_line4-canvas { height: 190px; min-height: 190px;}
    }
    .row.small-gutter { margin-left: -5px; margin-right: -5px;
      @for $i from 1 through 24 {
        .col-#{$i}, .col-offset-#{$i} {
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
    .row + .row { margin-top: 46px;}
    .row.small-gutter + .row.small-gutter { margin-top: 5px;}
  }
</style>
