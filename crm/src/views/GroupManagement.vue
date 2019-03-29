<template>
  <div class="page-group-management">
    <div class="page-group-management-nav">
      <div class="page-group-management-nav-scroll" v-innerscroll="navData">
        <div class="page-group-management-nav-container">
          <art-left-nav :data="navData" type="tree" @click="clickNav" v-if="navData.length > 0"></art-left-nav>
        </div>
      </div>
    </div>
    <div class="page-group-management-cont">
      <div class="title row no-gutter flex-between flex-middle">
        <h4>群管理</h4>
        <div class="other">
          <art-button type="blue">添加</art-button>
        </div>
      </div>
      <div class="cont">
        <div class="art-table table">
          <table cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th>部门ID</th>
              <th>部门名称</th>
              <th>部门描述</th>
              <th>父级ID</th>
              <th>父级名称</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>修改时间</th>
              <th>操作</th>
              <th></th>
            </tr>
            </thead>
            <tbody v-if="!chartData.none && !chartData.error && !chartData.loading">
            <tr v-for="(group, index) in groupData" @mouseenter="enterTr(group)" @mouseleave="leaveTr(group)">
              <td><p v-text="group.id"></p></td>
              <td><p v-text="group.name"></p></td>
              <td><p v-text="group.desc"></p></td>
              <td><p v-text="group.parentId"></p></td>
              <td><p v-text="group.parentName"></p></td>
              <td><p v-text="group.status"></p></td>
              <td><p v-text="group.createTime"></p></td>
              <td><p v-text="group.modifyTime"></p></td>
              <td>
                <art-btn-drop :dropData="group.dropData" @on-choose="chooseAction" :type="group.btnType"></art-btn-drop>
              </td>
              <td>
                <art-button type="blue" size="small" :border="false" @click="stopGroup(group)" v-if="group.status === '启用'">停用</art-button>
                <art-button type="blue" size="small" :border="false" @click="startGroup(group)" v-if="group.status === '停用'">启用</art-button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="art-auxi-box" v-if="chartData.none || chartData.error || chartData.loading">
          <art-auxi :none="chartData.none" :error="chartData.error" :loading="chartData.loading" @on-retry="getGroupData"></art-auxi>
        </div>
      </div>
      <div class="footer" v-if="count && groupData && groupData.length > 0">
        <div class="page-box row no-gutter flex-end">
          <art-pagination :total="count" :data="pageDropData" @on-choose="changePageSize" :pageSize="pageSize" :now="page" @on-change="changePage"></art-pagination>
        </div>
      </div>
    </div>

    <art-modal class="stopModal" :show="stopModal.show" :type="'1'" :overlayClose="false" :result-title="stopModal.title" :result-status="stopModal.status">
      <div slot="result-btn" class="row no-gutter flex-end">
        <art-button type="minor" size="large" @click="closeStopModal">取消</art-button>
        <art-button type="main" size="large" @click="confrim">确定</art-button>
      </div>
    </art-modal>
    <art-modal class="modifyModal" :show="modifyModal.show" :overlayClose="false" :title="modifyModal.title" @on-cancel="closeModifyModal">
      <div class="modifyModal-cont">
        <div class="item row no-gutter flex-start">
          <p class="item-name">部门名称</p>
          <art-input :value="modifyModal.name" @input="inputName"></art-input>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name">活动类型</p>
          <art-input-drop :drop-data="activityTypeDropData" default-text="请选择活动类型" :auto-width="false" @on-choose="chooseActivityType"></art-input-drop>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name">上级部门</p>
          <art-input :value="modifyModal.parentName" disabled></art-input>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name lh1">启用</p>
          <art-radio value="启用" :active="modifyModal.status === '启用'" @click.native="clickRadio('启用')"></art-radio>
          <art-radio value="停用" :active="modifyModal.status === '停用'" @click.native="clickRadio('停用')"></art-radio>
        </div>
        <div class="item row no-gutter flex-start">
          <p class="item-name">群描述</p>
          <art-textarea :auto-size="false" :value="modifyModal.desc" @input="inputDesc"></art-textarea>
        </div>
      </div>
      <div class="modifyModal-footer" slot="footer">
        <div class="art-modal-btn row no-gutter flex-end">
          <art-button type="minor" size="large" @click="closeModifyModal">取消</art-button>
          <art-button type="main" size="large" @click="save" :disabled="modifyDisabled">保存</art-button>
        </div>
      </div>
    </art-modal>
  </div>
</template>
<script>
  export default {
    name: "group-management",
    data () {
    	return {
    		// 左侧导航数据
				navData: [],
        // 当前选中的导航Id
        curId: '',

        // 当前页
				page: null,
				// 每页显示数量
				pageSize: null,
				// 页数控制器下拉数据
				pageDropData: [],
				// 数据总条数
				count: null,
				// 配合使用图表数据
        chartData: {
        	none: false,
          loading: false,
          error: false
        },

    		// 群列表数据
				groupData: null,
        // 停用Modal弹层
				stopModal: {
					show: false,
					title: '',
          status: '',
        },
        // 修改群Modal弹层
        modifyModal: {
					show: false,
          title: '',
          name: '',
          activityType: '',
          parentName: '',
          status: '',
          desc: ''
        },
        // 活动类型下拉数据
				activityTypeDropData: []
      }
    },
    created () {
      this.getNavData()
    },
    methods: {
    	// 获取左侧导航数据
			getNavData () {
				let navData = [{
					title: '服务系统部',
					id: '1001',
					expand: true,
					list: [{
						title: '白条普通1群',
						id: '100001'
					}, {
						title: '白条普通2群',
						id: '100002'
					}, {
						title: '我的群',
						id: '100003'
					}]
				}]

        navData[0].active = true
        this.curId = navData[0].id
        this.navData = navData

				this.resetData()
				this.getGroupData()
      },
    	// 点击左侧导航
			clickNav (nav, index, navData) {
				this.navData = navData;
				if (this.curId != nav.id) {
					this.curId = nav.id;

					this.resetData()
					this.getGroupData()
				}
			},
      // 启用群
			startGroup (group) {
				console.log(`要启用的群为 ${JSON.stringify(group.name)}`);
      },
			// 停用群
      stopGroup (group) {
				console.log(`要停用的群信息为 ${JSON.stringify(group.name)}`);
        this.stopModal.show = true
        this.stopModal.title = `您确定要停用${group.name}`
        this.stopModal.name = group.name
        this.stopModal.status = 'warning'
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
			// 获取群列表数据
      getGroupData () {
      	this.groupData = null
        // 查询入参
        let param = {id: this.curId, page: this.page, pageSize: this.pageSize, type: this.type, status: this.status}
				console.log(`当前查询入参：${JSON.stringify(param)}`)
      	this.chartData.loading = true
      	this.chartData.error = false
      	this.chartData.none = false
      	let timer = setTimeout(() => {
      		this.chartData.loading = false
      		this.groupData = [{
						id: '1003',
						name: '白条普通1群',
						desc: '一个年轻活力的集体',
						parentId: '129',
						parentName: '服务系统部',
						status: '停用',
						createTime: '2017-05-21 09:24:12',
						modifyTime: '2017-05-21 09:24:12',
						activityType: '群机构',
						// 按钮状态
            btnType: 0,
						// 操作下拉列表数据
						dropData: [{
							value: '修改',
							id: '1003',
							name: '白条普通1群',
							activityType: '群机构',
							parentName: '服务系统部',
							status: '停用',
              desc: '一个年轻活力的集体'
						}, {
							value: '管理',
							id: '1003',
							name: '白条普通1群',
							activityType: '群机构',
							parentName: '服务系统部',
							status: '停用',
							desc: '一个年轻活力的集体'
						}, {
							value: '删除',
							id: '1003',
							name: '白条普通1群',
							activityType: '群机构',
							parentName: '服务系统部',
							status: '停用',
							desc: '一个年轻活力的集体'
						}],
					}, {
						id: '1020',
						name: '白条普通4群',
						desc: '白条普通4群描述',
						parentId: '113',
						parentName: '服务系统部',
						status: '启用',
						createTime: '2017-05-21 09:24:12',
						modifyTime: '2017-05-21 09:24:12',
						activityType: '群机构',
						// 按钮状态
						btnType: 0,
						// 操作下拉列表数据
						dropData: [{
							value: '修改',
							id: '1020',
							name: '白条普通4群',
							activityType: '群机构',
							parentName: '服务系统部',
							status: '启用',
							desc: '白条普通4群描述'
						}, {
							value: '管理',
							id: '1020',
							name: '白条普通4群',
							activityType: '群机构',
							parentName: '服务系统部',
							status: '启用',
							desc: '白条普通4群描述'
						}, {
							value: '删除',
							id: '1020',
							name: '白条普通4群',
							activityType: '群机构',
							parentName: '服务系统部',
							status: '启用',
							desc: '白条普通4群描述'
						}],
					}]
          this.count = 101
          clearTimeout(timer)
        }, 1500)
      },
      // 获取活动类型下拉数据
			getActivityType () {
				this.activityTypeDropData = [{
					value: '群机构',
          active: false
        }, {
					value: '组个人',
					active: false
				}]
        if (this.modifyModal.activityType) {
					this.activityTypeDropData.forEach((_) => {
						if (_.value === this.modifyModal.activityType) {
							_.active = true
            }
          })
        }
      },
      // 选中配置
			chooseAction (action) {
				console.log(`选中项为：${JSON.stringify(action)}`)
        // 可以用自定义key替换中文做匹配
        if (action.value === "修改") {
					this.modifyModal.show = true
					this.modifyModal.title = '修改群'
					this.modifyModal.name = action.name
					this.modifyModal.activityType = action.activityType
					this.modifyModal.parentName = action.parentName
					this.modifyModal.status = action.status
					this.modifyModal.desc = action.desc
          this.getActivityType ()
        } else if (action.value === "管理") {
					alert("参考 专属客服配置 中内容管理")
				} else if (action.value === "删除") {
					alert("参考 专属客服配置 中删除Modal")
				} else {
					console.error(`错误的配置项：${JSON.stringify(action)}`)
        }
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
				this.getGroupData()
			},
			// 切换每页数量
			changePageSize(item) {
				if (!item.active) {
					this.page = 1
					this.pageSize = item.num
					this.pageDropData.forEach((_, index) => {
						_.active = _.num === item.num ? true : false
					})
					this.getGroupData()
				}
			},
      // 关闭停用Modal
			closeStopModal () {
				this.stopModal.show = false
      },
      // 停用Modal中的确定按钮事件
			confrim () {
				console.log(`停用的群为 ${this.stopModal.name}`)
        this.stopModal.show = false
        this.getGroupData()
			},
			// 点击修改群Modal中的保存按钮
			save () {
				let param = {name: this.modifyModal.name, activityType: this.modifyModal.activityType, parentName: this.modifyModal.parentName, status: this.modifyModal.status, desc: this.modifyModal.desc}
				console.log(`修改后的群内容为：${JSON.stringify(param)}`)
				this.modifyModal.show = false
				this.getGroupData()
			},
			// 关闭修改群Modal
			closeModifyModal () {
				this.modifyModal.show = false
			},
      // 选中活动类型
      chooseActivityType (choose) {
				this.modifyModal.activityType = choose.value
			},
      // 点击修改群Modal中的单选框
      clickRadio (val) {
				this.modifyModal.status = val
      },
			// input 部门名称 监听
			inputName (val) {
				this.modifyModal.name = val
			},
			// input 群描述 监听
			inputDesc (val) {
				this.modifyModal.desc = val
			},
		},
    computed: {
    	modifyDisabled () {
    		return !(this.modifyModal.name && this.modifyModal.activityType && this.modifyModal.parentName && this.modifyModal.status)
      },
    }
	}
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";

  .page-group-management { position: relative;
    &-nav { position: absolute; left: 0; top: 0; bottom: 0px; width: 214px; border-right: 1px solid $borderColor; overflow: hidden;
      &-scroll { width: 100%; height: 100%; overflow: hidden;}
      .art-left-nav { padding-top: 0;
        & > ul:first-child { margin-top: 0;}
      }
    }
    &-cont { position: relative; margin-left: 214px; padding-left: 30px; min-height: calc(100vh - 160px);}
    .title { position: relative; display: flex; padding-bottom: 17px; border-bottom: 2px solid $borderColor;
      h4 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding: 0; margin: 0;}
    }
    .cont {
      .table { position: relative; margin-top: 10px;
        .art-auxi-box { min-height: 300px; position: relative;}
        th, td {
          &:last-child { padding-right: 20px; padding-left: 0; width: 74px;}
          &:nth-last-child(2) { text-align: center; width: 118px;}
        }
        th { white-space: nowrap;}
        tbody {
           tr td {
             p { line-height: 26px;}
           }
         }
       }
    }
    .footer {
      .page-box { padding: 20px 0 120px;}
    }

    .modifyModal {
      &-cont { width: 500px; padding: 30px 44px 35px 40px;
        .item {
          &-name { position: relative; width: 76px; text-align: right; padding-right: 20px; font-size: $sizeNormal; line-height: 32px; color: $main; white-space: nowrap;
            &:after { content: "*"; position: absolute; right: 10px; top: 8px; display: none; font-size: $sizeNormal; color: #f8636e; line-height: 1;}
          }
          .lh1 { line-height: 1;}
          .art-input, .art-input-drop, .art-textarea { width: 340px;}
          .art-textarea textarea { resize: none;}
          &.required {
            .item-name {
              &:after { display: block;}
            }
          }
        }
        .item + .item { margin-top: 24px;}
      }
      &-footer {
        .art-button { margin-right: 0!important;}
        .art-button + .art-button { margin-left: 10px;}
      }
    }

    .stopModal {
      .art-modal-result-btn {
        .art-button + .art-button { margin-left: 10px;}
      }
    }

  }
</style>
