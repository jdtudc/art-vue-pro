<template>
    <div class="active-list">
        <div class="row large-gutter">
            <div class="col-24">
                <div class="title">
                    <h2>活动列表</h2>
                </div>
            </div>
            <div class="col-12">
                <div class="assist-box">
                    <div class="assist">
                        <art-text-drop :dropData="dropData" @on-choose="chooseDrop" :size="'small'"></art-text-drop>
                    </div>
                    <div class="assist">
                        <art-input placeholder="搜索活动" v-model="activeName" icon="//storage.360buyimg.com/static-res/tech/jrv/1.0.0/input/search.png" :border="false" iconPos="left" @enter="searchActive"></art-input>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <art-calendar type="range" :data-range="dateRange" :disabled-date="disabledDate" placeholder="请选择日期范围" :left-nav="true" @quick-select="selectDateRange" @select="selectDateRange"></art-calendar>
            </div>
            <div class="col-24">
                <div class="art-table table">
                    <table cellspacing="0" cellpadding="0" v-if="!chartData.none && !chartData.error && !chartData.loading">
                        <tr>
                            <th>
                                <art-checkbox :value="checkAllData.value" :active="checkAllData.active" :disabled="checkAllData.disabled" name="checkall" @click.native="checkAll"></art-checkbox>
                            </th>
                            <th>活动名称</th>
                            <th>投放时间/截止时间</th>
                            <th>每日预算</th>
                            <th>今日消费</th>
                            <th>投放状态</th>
                            <th>操作</th>
                        </tr>
                        <tr v-for="(item, index) in activeData.list" @mouseenter="enterTr(item)" @mouseleave="leaveTr(item)">
                            <td>
                                <art-checkbox :value="item.check.value" :active="item.check.active" :disabled="item.check.disabled" name="checkItem" @click.native="toggleItem(item)"></art-checkbox>
                            </td>
                            <td>{{item.name}}</td>
                            <td>
                                <span>{{item.startTime}} / {{item.endTime}}</span>
                                <art-countdown :total="item.countDown.total" :remain="item.countDown.remain" :warn="item.countDown.warn">
                                    {{item.countDown.text}}
                                </art-countdown>
                            </td>
                            <td>{{item.budget}}</td>
                            <td :class="item.sum<100 && 'red'">{{item.sum}}</td>
                            <td>
                                <art-switch :active="item.status" @on-change="switchClick(item, index)">
                                    <p slot="open">开</p>
                                    <p slot="close">关</p>
                                </art-switch>
                            </td>
                            <td>
                                <art-btn-drop v-if="btnDropData && btnDropData.length > 0" :dropData="btnDropData" :type="item.btnType || 0" :theme="item.btnTheme" @on-choose="chooseAction"></art-btn-drop>
                            </td>
                        </tr>
                    </table>
                    <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getActiveData" v-if="chartData.none || chartData.error || chartData.loading"></art-auxi>
                </div>
            </div>
        </div>
        <div class="row large-gutter">
            <div class="col-24">
                <art-pagination :total="activeData.pageCount" :data="pageDropData" :pageSize="pageSize" :now="page" @on-change="changePage" @on-choose="changePageSize" v-if="activeData && activeData.list.length > 0"></art-pagination>
            </div>
        </div>
        <art-modal class="modal-confirm" :show="modal.show" type="1" :overlayClose="false" :resultStatus="modal.resultStatus" :resultTitle="modal.resultTitle" @on-cancel="closeModal">
            <art-button type="main" size="large" @click="delActive" slot="result-btn">确定</art-button>
            <art-button type="minor" size="large" @click="closeModal" slot="result-btn">取消</art-button>
        </art-modal>
    </div>
</template>
<script>
	export default {
		name: 'activeList',
    data () {
			return {
				chartData: {
					none: false,
					error: false,
					loading: false,
        },

        // 活动下拉选项
        dropData: [
					{value: "全部活动", active: true, sort: null},
					{value: "PC活动", active: false, sort: 1},
					{value: "H5活动", active: false, sort: 2},
					{value: "自定义活动", active: false, sort: 3},
        ],
				sort: null,

				// 选中的日期，可以通过这个设置初始日期
				dateRange: null,

        // 搜索的活动名称
				activeName: "",

				btnDropData: [{'id': 0, 'value': '编辑'}, {'id': 1, 'value': '删除'}],
				checkAllData: {id: "0001", value: "", idx: 0, active: false},  // 选择全部

				page: 1,
				pageSize: 10,
				// 分页下拉
				pageDropData: [
					{num: 10, value: "10 条/页", active: true},
					{num: 20, value: "20 条/页", active: false},
					{num: 50, value: "50 条/页", active: false}
				],
				activeData: null,

				modal: {
					show: false,
					resultStatus: "warning",
					resultTitle: "你确定删除该活动吗？",
					activeId: null,
				},
      }
    },
    created () {
			this.activeData = this.defaultData();
    },
		methods: {
			defaultData () {
				return {
					pageCount: 101,
					list: [{
						"activeId": "0001",
						"budget": "10,000.00",
						"name": "PC转盘活动",
						"sort": 1,
						"count": 2,
						"startTime": "2018-01-01",
						"endTime": "2018-01-10",
						"status": false,
						"sum": "72.00",
						"countDown": {
							"total": 10,
							"remain": 5,
							"warn": false,
							"text": "剩余5天"
						},
						"btnType": 1,
						"btnTheme": "red",
						"check": {
							value: "",
							active: false,
							disabled: false,
						}
					}, {
						"activeId": "0002",
						"budget": "10,000.00",
						"name": "H5抽奖活动",
						"sort": 2,
						"count": 2,
						"startTime": "2018-01-01",
						"endTime": "2018-01-10",
						"status": true,
						"sum": "123.00",
						"countDown": {
							"total": 10,
							"remain": 2,
							"warn": true,
							"text": "剩余2天"
						},
						"btnType": 0,
						"btnTheme": "blue",
						"check": {
							value: "",
							active: false,
							disabled: false,
						}
					}]
				};
      },
			// 设置不可选日期
			disabledDate (day) {
				let ts = +new Date();
				return day.ts > ts;
			},
      // 选中日期范围
			selectDateRange (dateRange) {
				this.dateRange = [dateRange[0].ts, dateRange[1].ts];
        this.page = 1;
        this.getActiveData();
			},
			chooseDrop (drop) {
				this.sort = drop.sort;
				this.getActiveData();
      },
			searchActive () {
        this.getActiveData(this.activeName)
      },
			getActiveData (name) {
        let param = {sort: this.sort, name: name, date:""}
				console.log(`查询条件`)
        this.chartData.loading = true;
        this.chartData.none = false;
        this.chartData.error = false;
        this.activeData = null;

        // 模拟异步
        let timer = setTimeout(() => {
					this.chartData.loading = false;
					let activeData = this.defaultData();
					if(name) {
						activeData.list = activeData.list.filter((_) => {
							return ~_.name.indexOf(name)
						});
          }
					if(this.sort) {
						activeData.list = activeData.list.filter((_) => {
							return _.sort === this.sort
						});
          }
          if(activeData.list.length === 0) {
						this.chartData.none = true;
          }

          this.activeData = activeData;

					clearTimeout(timer);
        },1500)
      },
			changePage(page) {
				this.page = page;
				this.getActiveData();
			},
			changePageSize(item) {
				if (item.num !== this.pageSize) {
					this.page = 1;
					this.pageSize = item.num;
					this.pageDropData.forEach(function (drop, index) {
						drop.active = drop.num === item.num ? true : false;
					});

					this.getActiveData();
				}
			},
			chooseAction (action) {
				if(action.value === "删除") {
            this.modal.activeId = action.activeId;
            this.modal.show = true;
        }
      },
      delActive () {
				this.activeData.list = this.activeData.list.filter((_) => {
            return _.activeId !== this.modal.activeId;
        });
				this.closeModal();
      },
      closeModal () {
				this.modal.show = false;
      },

			// table start
			// 鼠标移入移出 tr
			enterTr(item) {
				item._btnType = item.btnType;
				item._btnType !== 1 && (item.btnType = 1);
				this.btnDropData.forEach((_) => {
					_.activeId = item.activeId;
				})
			},
			leaveTr(item) {
				item._btnType === 0 && (item.btnType = 0);
			},
			// 切换投放状态
			switchClick(item) {
				item.status = !item.status;
			},
			// 选中某一行
			toggleItem(item) {
				item.check.active = !item.check.active;
				let len = this.activeData.list.length;
				let chkLen = 0;
				this.activeData.list.forEach((obj,i)=>{
					obj.check.active && (chkLen++);
				});
				this.checkAllData.active = len === chkLen;
			},
			checkAll(){
				let checked = this.checkAllData.active;
				this.checkAllData.active = !checked;
				this.activeData.list.forEach((item,i)=>{
					item.check.active = !checked;
				});
			},
			// table end
    }
	}
</script>
<style type="text/scss" lang="scss">
    @import '../assets/css/common/_var.scss';

    .active-list { padding: 5 * $base 3 * $base;
        .title { position: relative; font-size: $sizeLarge; color: $mainStrong; border-bottom: 2px solid $borderColor; padding-bottom: 3 * $base;
            .art-button { position: absolute; right: 0; top: -7px;}
        }
        .assist-box { font-size: 0; margin: 2 * $base 0;
            .assist { position: relative; display: inline-block; vertical-align: middle; margin: 0 $base;
                &:before { content: ""; display: block; position: absolute; left: -$base; top: 50%; margin-top: -0.75 * $base; width: 1px; height: 1.5 * $base; background-color: $borderColor;}
                &:first-child { margin: 0 $base 0 0;
                    &:before { display: none;}
                }
            }
        }
        .art-calendar { margin: 2 * $base 0;
            .art-cal-cont { right: 0!important; left: auto;}
        }

        .table { position: relative;
            th, td {
                &:nth-of-type(1) { padding-left: 30px;
                    .art-checkbox { margin-right: 10px; }
                }
                &:nth-of-type(2) { width: 12%; padding-left: 0;
                }
                &:nth-of-type(3) { width: 36%; padding-left: 0; min-width: 290px; }
                &:nth-of-type(4) { width: 10%; text-align: right;
                }
                &:nth-of-type(5) { width: 12%; text-align: right; }
                &:nth-of-type(6) { width: 8%; text-align: right; }
                &:nth-of-type(7) { text-align: center; }
            }
            td {
                &.red { color: $red; }
                &:nth-of-type(3) { font-size: 0;
                    span, .art-countdown { font-size: 12px; display: inline-block; vertical-align: middle; }
                    .art-countdown { width: 120px; margin-left: 10px; }
                }
                &:nth-of-type(5), &:nth-of-type(6) { font-weight: bold; }
            }
            .art-auxi { min-height: 300px;}
        }

        .modal-confirm {
            z-index: 1501;
            .art-modal-result {
                width: 440px !important;
                height: 128px !important;
            }
            .art-modal-result-btn {
                position: absolute;
                left: 40px;
                bottom: 40px;
                right: 40px;
            }
        }
    }
</style>
