<template>
  <div class="page-blacklist-management">
    <div class="page-blacklist-management-cont">
      <div class="title row no-gutter flex-between flex-middle">
        <h4>黑名单管理</h4>
        <div class="other">
          <art-button type="main" @click="queryBlacklistData">查询</art-button>
          <art-button type="blue" @click="addBlacklist">新增黑名单</art-button>
          <art-button type="blue">删除黑名单</art-button>
        </div>
      </div>
      <div class="cont">
        <div class="query-box">
          <div class="query row no-gutter flex-start flex-middle">
            <div class="query-item">
              <div class="query-name">业务类型</div>
              <art-input-drop :drop-data="businessTypeDropData" :auto-width="false" size="middle" @on-choose="chooseBusinessType"></art-input-drop>
            </div>
            <div class="query-item">
              <div class="query-name">活动类型</div>
              <art-input-drop :drop-data="activityTypeDropData" :auto-width="false" size="middle" @on-choose="chooseActivityType"></art-input-drop>
            </div>
            <div class="query-item">
              <div class="query-name">黑名单原因</div>
              <art-input-drop :drop-data="reasonDropData" :auto-width="false" size="middle" @on-choose="chooseReason"></art-input-drop>
            </div>
          </div>
          <div class="query row no-gutter flex-start flex-middle">
            <div class="query-item">
              <div class="query-name">PIN</div>
              <art-input :value="pin" @input="inputPin"></art-input>
            </div>
            <div class="query-item">
              <div class="query-name">添加时间</div>
              <art-calendar placeholder="选择开始日期" @select="selectStartDate"></art-calendar>
              <span class="calendar-connect"></span>
              <art-calendar placeholder="选择结束日期" @select="selectEndDate"></art-calendar>
            </div>
          </div>
        </div>
        <div class="art-table table">
          <table cellspacing="0" cellpadding="0">
            <thead>
              <tr>
              <th>
                <art-checkbox :value="''" :active="checkAllData.active" :disabled="checkAllData.disabled" @click.native="toggleAll"></art-checkbox>
              </th>
              <th>序号</th>
              <th>业务类型</th>
              <th>活动类型</th>
              <th>PIN<i class="icon-sort desc"></i></th>
              <th>添加时间<i class="icon-sort asc"></i></th>
              <th>黑名单原因<i class="icon-sort"></i></th>
              <th>开始时间</th>
              <th>结束时间<i class="icon-sort"></i></th>
              <th>备注<i class="icon-sort"></i></th>
            </tr>
            </thead>
            <tbody v-if="!chartData.none && !chartData.error && !chartData.loading">
              <tr v-for="(item, index) in blacklistData">
              <td>
                <art-checkbox :value="''" :active="item.check.active" :disabled="item.check.disabled" @click.native="toggleItem(item)"></art-checkbox>
              </td>
              <td><p v-text="item.no"></p></td>
              <td><p v-text="item.lobType"></p></td>
              <td><p v-text="item.activeType"></p></td>
              <td><p v-text="item.pin"></p></td>
              <td><p v-text="item.addTime"></p></td>
              <td><p v-text="item.reason"></p></td>
              <td><p v-text="item.startTime"></p></td>
              <td><p v-text="item.endTime"></p></td>
              <td><p v-text="item.remark || '--'"></p></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="art-auxi-box" v-if="chartData.none || chartData.error || chartData.loading">
          <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getBlacklistData"></art-auxi>
        </div>
      </div>
      <div class="footer" v-if="count && blacklistData && blacklistData.length > 0">
        <div class="page-box row no-gutter flex-end">
          <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
        </div>
      </div>
    </div>
    <art-modal class="addModal" :show="addModal.show" :overlayClose="false" :title="addModal.title" @on-cancel="closeAddModal">
      <div class="addModal-cont">
        <div class="row no-gutter flex-between flex-middle">
          <div class="item">
            <p class="item-name">业务类型</p>
            <art-input-drop :drop-data="addModal.businessTypeDropData" :auto-width="false" size="middle" @on-choose="chooseModalBusinessType"></art-input-drop>
          </div>
          <div class="item">
            <p class="item-name">活动类型</p>
            <art-input-drop :drop-data="addModal.activityTypeDropData" :auto-width="false" size="middle" @on-choose="chooseModalActivityType"></art-input-drop>
          </div>
        </div>
        <div class="row no-gutter flex-between flex-middle">
          <div class="item">
            <p class="item-name">黑名单原因</p>
            <art-input-drop :drop-data="addModal.reasonDropData" :auto-width="false" size="middle" @on-choose="chooseModalReason"></art-input-drop>
          </div>
          <div class="item">
            <p class="item-name">PIN</p>
            <art-input :value="addModal.pin" @input="inputModalPin"></art-input>
          </div>
        </div>
        <div class="row no-gutter flex-between flex-middle">
          <div class="item">
            <p class="item-name">黑名单期限</p>
            <art-input-drop :drop-data="addModal.periodDropData" :auto-width="false" size="middle" @on-choose="chooseModalPeriod"></art-input-drop>
          </div>
        </div>
        <div class="row no-gutter flex-between flex-middle">
          <div class="item">
            <p class="item-name">添加时间</p>
            <art-calendar placeholder="选择开始日期" @select="selectModalStartDate"></art-calendar>
            <span class="calendar-connect"></span>
            <art-calendar placeholder="选择结束日期" @select="selectModalEndDate"></art-calendar>
          </div>
        </div>
        <div class="row no-gutter flex-between flex-middle">
          <div class="item">
            <p class="item-name">备注</p>
            <art-textarea :auto-size="false" @input="inputModalRemark"></art-textarea>
          </div>
        </div>
      </div>
      <div class="addModal-footer" slot="footer">
        <div class="art-modal-btn row no-gutter flex-end">
          <art-button type="minor" size="large" @click="closeAddModal">取消</art-button>
          <art-button type="main" size="large" @click="save" :disabled="addModalDisabled">保存</art-button>
        </div>
      </div>
    </art-modal>
  </div>
</template>
<script>
  export default {
    name: "blacklist-management",
    data () {
    	return {
				// 业务类型下拉列表数据
				businessTypeDropData: [{
					value: '延保险',
					active: true
				}, {
					value: '白条',
					active: false
				}],
				// 当前选择的业务类型
				businessType: '延保险',
				// 活动类型下拉列表数据
				activityTypeDropData: [{
					value: '全活动',
					active: true
				}, {
					value: '白条分期',
					active: false
				}],
				// 当前选择的活动类型
				activityType: '全活动',
				// 黑名单原因下拉列表数据
				reasonDropData: [{
					value: '客户拒绝营销',
					active: true
				}, {
					value: '其他',
					active: false
				}],
        // 当前选择的黑名单原因
        reason: '客户拒绝营销',
        pin: '',
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
    		// 黑名单列表数据
				blacklistData: null,
        // 全部选中数据
				checkAllData: {
        	active: false,
          disabled: false
        },

        // 新建黑名单Modal
        addModal: {
					show: false,
          title: '',
					// 业务类型下拉列表数据
					businessTypeDropData: [{
						value: '延保险',
						active: false
					}, {
						value: '白条',
						active: false
					}],
					// 当前选择的业务类型
					businessType: '',
					// 活动类型下拉列表数据
					activityTypeDropData: [{
						value: '全活动',
						active: false
					}, {
						value: '白条分期',
						active: false
					}],
					// 当前选择的活动类型
					activityType: '',
					// 黑名单原因下拉列表数据
					reasonDropData: [{
						value: '客户拒绝营销',
						active: false
					}, {
						value: '其他',
						active: false
					}],
					// 当前选择的黑名单原因
					reason: '',
					pin: '',
					// 黑名单期限下拉列表数据
					periodDropData: [{
						value: '30天',
						active: false
					}, {
						value: '15天',
						active: false
					}],
					// 当前选择的黑名单原因
					period: '',
					// 开始日期
					startDate: '',
					// 结束日期
					endDate: '',
          // 备注
          remark: ''
        }
      }
    },
		created () {
			this.resetData()
			this.getBlacklistData()
		},
    methods: {
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
			// 选择黑名单原因
			chooseReason (choose) {
				this.reason = choose.value
			},
      // input pin 监听
			inputPin (val) {
				this.pin = val
      },

			// 选择Modal中的业务类型
			chooseModalBusinessType (choose) {
				this.addModal.businessType = choose.value
			},
			// 选择Modal中的活动类型
			chooseModalActivityType (choose) {
				this.addModal.activityType = choose.value
			},
			// 选择Modal中的开始日期
			selectModalStartDate (date) {
				this.addModal.startDate = `${date.year}-${date.month}-${date.day}`
			},
			// 选择Modal中的结束日期
			selectModalEndDate (date) {
				this.addModal.endDate = `${date.year}-${date.month}-${date.day}`
			},
			// 选择Modal中的黑名单原因
			chooseModalReason (choose) {
				this.addModal.reason = choose.value
			},
			// 选择Modal中的黑名单期限
			chooseModalPeriod (choose) {
				this.addModal.period = choose.value
			},
			// Modal中的 input pin 监听
			inputModalPin (val) {
				this.addModal.pin = val
			},
			// Modal中的 input remark 监听
			inputModalRemark (val) {
				this.addModal.remark = val
			},

      // 关闭新增黑名单Modal
      closeAddModal () {
				this.addModal.show = false
      },
      // 新建黑名单Modal中保存按钮点击事件
      save () {
				let param = {businessType: this.addModal.businessType, activityType: this.addModal.activityType, reason: this.addModal.reason, pin: this.addModal.pin, period: this.addModal.period, startDate: this.addModal.startDate, endDate: this.addModal.endDate, remark: this.addModal.remark}
				console.log(`当前新增黑名单的内容为：${JSON.stringify(param)}`)
        this.closeAddModal()
        this.getBlacklistData()
      },

    	// 选中全部
			toggleAll () {
				this.checkAllData.active = !this.checkAllData.active;
				this.blacklistData.forEach((_) => {
					if(!_.disabled) { // 如果是可选项
						_.check.active = this.checkAllData.active;
          }
        })
      },
      // 选中某项
			toggleItem (item) {
				item.check.active = !item.check.active;
				let len = this.blacklistData.length;
				let chkLen = 0;
				this.blacklistData.forEach((_) => {
					_.check.active && (chkLen++);
        });
				this.checkAllData.active = len === chkLen;
      },
      // 新增黑名单
			addBlacklist () {
				this.addModal =  {
					show: true,
          title: '新增黑名单',
          // 业务类型下拉列表数据
          businessTypeDropData: [{
          value: '延保险',
          active: false
        }, {
          value: '白条',
          active: false
        }],
          // 当前选择的业务类型
          businessType: '',
          // 活动类型下拉列表数据
          activityTypeDropData: [{
          value: '全活动',
          active: false
        }, {
          value: '白条分期',
          active: false
        }],
          // 当前选择的活动类型
          activityType: '',
          // 黑名单原因下拉列表数据
          reasonDropData: [{
          value: '客户拒绝营销',
          active: false
        }, {
          value: '其他',
          active: false
        }],
          // 当前选择的黑名单原因
          reason: '',
          pin: '',
          // 黑名单期限下拉列表数据
          periodDropData: [{
          value: '30天',
          active: false
        }, {
          value: '15天',
          active: false
        }],
          // 当前选择的黑名单原因
          period: '',
          // 开始日期
          startDate: '',
          // 结束日期
          endDate: '',
          // 备注
          remark: ''
				}
      },
			// 按条件查询黑名单数据
			queryBlacklistData () {
				this.page = 1
				this.getBlacklistData()
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
      // 获取黑名单数据
      getBlacklistData () {
				this.blacklistData = null;
				// 查询入参
				let param = {page: this.page, pageSize: this.pageSize, businessType: this.businessType, activityType: this.activityType, reason: this.reason, pin: this.pin, startDate: this.startDate, endDate: this.endDate}
				console.log(`当前查询入参：${JSON.stringify(param)}`)
				this.chartData.loading = true
				this.chartData.error = false
				this.chartData.none = false
				let timer = setTimeout(() => {
					this.chartData.loading = false
					this.blacklistData = [{
						check: {
							active: false,
							disabled: false,
						},
						no: 1,
						lobType: '延保险',
						activeType: '全活动',
						pin: '402505682_m',
						addTime: '2017-05-21 10:24:12',
						reason: '客户拒绝营销',
						startTime: '2017-05-21 09:24:12',
						endTime: '2017-05-21 11:24:12',
						remark: '延保外呼完成自动加入黑名单'
					},{
						check: {
							active: false,
							disabled: false,
						},
						no: 2,
						lobType: '白条',
						activeType: '智能分期',
						pin: '黑名单008',
						addTime: '2017-05-21 10:24:12',
						reason: '客户拒绝营销',
						startTime: '2017-05-21 09:24:12',
						endTime: '2017-05-21 11:24:12',
						remark: null
					}];
					this.count = 101
					clearTimeout(timer)
				}, 1500)
      },
			// 切换页数
			changePage(page) {
				this.page = page
				this.getBlacklistData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getBlacklistData()
				}
			},
    },
		computed: {
			addModalDisabled () {
				return !(this.addModal.businessType && this.addModal.activityType && this.addModal.reason  && this.addModal.pin  && this.addModal.period  && this.addModal.startDate  && this.addModal.endDate)
			}
		}
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";

  .page-blacklist-management {
    .title { position: relative; display: flex; padding-bottom: 17px; border-bottom: 2px solid $borderColor;
      h4 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding: 0; margin: 0;}
      .other { display: flex;
        .art-button + .art-button { margin-left: 10px;}
      }
    }
    .cont { margin-top: 30px;
      .query { display: flex; flex-wrap: wrap;
        &:first-child { margin-top: 0;}
        &-item { display: flex;}
        .query-item + .query-item { margin-left: 70px;}
        .query-name { display: block; font-size: $sizeNormal; line-height: 32px; color: $main; min-width: 66px; padding-right: 10px; vertical-align: middle;}
        .art-input, .art-text-drop { display: block; width: 220px;}
        .art-calendar .art-input { width: 140px;}
        .calendar-connect { position: relative; display: block; width: 9px; height: 1px; background-color: #bdc0c9; margin: auto 5px;}
      }
      .query + .query { margin-top: 22px;}
      .table { margin-top: 40px;
        .art-auxi-box { min-height: 300px; position: relative;}
        th, td {
           &:last-child { padding-right: 30px;}
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

    .addModal {
      &-cont { width: 740px; padding: 30px 58px 30px 40px;
        .row + .row { margin-top: 24px;}
        .item { display: flex;
          &-name { position: relative; width: 76px; font-size: $sizeNormal; line-height: 32px; color: $main; white-space: nowrap;
            &:after { content: "*"; position: absolute; right: 10px; top: 8px; display: none; font-size: $sizeNormal; color: #f8636e; line-height: 1;}
          }
          .art-input, .art-text-drop { display: block; width: 220px;}
          .art-calendar .art-input { width: 140px;}
          .calendar-connect { position: relative; display: block; width: 9px; height: 1px; background-color: #bdc0c9; margin: auto 5px;}
          .art-textarea { width: 410px;
            textarea { resize: none;}
          }
          &.required {
            .item-name {
              &:after { display: block;}
            }
          }
        }
        .item:nth-child(2) {
          .item-name { width: 66px;}
        }
        /*.item + .item { margin-left: 60px;}*/
      }
      &-footer {
        .art-button { margin-right: 0!important;}
        .art-button + .art-button { margin-left: 10px;}
      }
    }
  }
</style>
