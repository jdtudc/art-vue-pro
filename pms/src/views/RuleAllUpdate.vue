<template>
  <div class="page-rule-all-update">
    <div class="page-rule-all-update-breadcrumb-box" v-if="breadcrumbData && breadcrumbData.length > 0">
      <art-breadcrumb :data="breadcrumbData"></art-breadcrumb>
    </div>
    <div class="page-rule-all-update-title row no-gutter flex-between">
      <h3>{{this.type === 'add' ? '添加规则' : '编辑规则'}}</h3>
    </div>
    <div class="page-rule-all-update-cont">
      <div class="item required">
        <p class="item-name">名称</p>
        <div class="item-cont">
          <art-input placeholder="必填" status="" :value="ruleData.name" @input="inputName"></art-input>
        </div>
      </div>
      <div class="item required">
        <p class="item-name">正则规则</p>
        <div class="item-cont">
          <art-input placeholder="必填" status="" :value="ruleData.reg" :status="verifyStatus === '4' ? 'error' : ''" @input="inputReg" @blur="blurReg"></art-input>
          <i class="icon-loading" v-if="verifyStatus === '2'"></i>
        </div>
      </div>
      <div class="error-box" v-if="verifyStatus === '4' && errorList && errorList.length > 0">
        <div class="error-reg" v-innerscroll="errorList">
          <ul>
            <li v-for="error in errorList" v-text="`- 与 ${error.name} 冲突，负责人 ${error.erp}`"></li>
            <li v-for="error in errorList" v-text="`- 与 ${error.name} 冲突，负责人 ${error.erp}`"></li>
          </ul>
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
          <art-input-drop :drop-data="secondDropData" default-text="可选" :auto-width="false" @on-choose="chooseSecond" :disabled="!ruleData.first"></art-input-drop>
        </div>
      </div>
      <div class="item">
        <p class="item-name">三级分类</p>
        <div class="item-cont">
          <art-input-drop :drop-data="thirdDropData" default-text="可选" :auto-width="false" @on-choose="chooseThird" :disabled="!ruleData.second"></art-input-drop>
        </div>
      </div>
      <div class="item">
        <p class="item-name">四级分类</p>
        <div class="item-cont">
          <art-input-drop :drop-data="fourthDropData" default-text="可选" :auto-width="false" @on-choose="chooseFourth" :disabled="!ruleData.third"></art-input-drop>
        </div>
      </div>
    </div>
    <div class="page-rule-all-update-btn">
      <art-button type="main" size="large" :disabled="btnDisabled" @click="submit">提交</art-button>
    </div>
    <art-modal :show="resultModal.show" :type="'1'" :overlayClose="false" :result-title="resultModal.title" :result-status="resultModal.status" @on-finish="finishCode">{{resultModal.desc}}</art-modal>
  </div>
</template>
<script>
  export default {
  	name: 'ruleAllUpdate',
    data () {
  		return {
  			// 规则id
        ruleId: '',
        // 区分添加还是编辑
  			type: '',
				// 面包屑数据
				breadcrumbData: null,
        // 规则数据
        ruleData: {
					name: '',
					reg: '',
					pageType: '',
					first: '',
					second: '',
					third: '',
					fourth: ''
				},
        // 正则规则校验状态
				verifyStatus: '',  // 1 表示未校验；2 表示校验中；3 表示校验通过；4 表示校验失败
        // 正则校验错误列表
				errorList: null,
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
				// 结果Modal
				resultModal: {
					show: false,
					title: '',
					status: '',
					desc: ''
				},
			}
    },
		created () {
      this.type = this.$route.params.type
      if (this.type === 'add') {
        console.log(`添加操作`);
        this.breadcrumbData = [{
          value: '全部规则', path: '/rule/all'
        }, {
          value: '添加规则', active: true
        }]
        this.verifyStatus = '1'
				this.getPageTypeDropData()
				this.getFirstDropData()
			} else if (this.type === 'edit') {
        this.ruleId = this.$route.params.id;
        if (this.ruleId) {
          console.log(`编辑操作，操作规则id为：${this.ruleId}`);
          this.breadcrumbData = [{
            value: '全部规则', path: '/rule/all'
          }, {
            value: '编辑规则', active: true
          }]
          this.verifyStatus = '3'
					this.getRuleData()
				} else {
          this.$router.replace({path: '/rule/all'})
        }
      } else {
        this.$router.replace({path: '/rule/all'})
      }
		},
		methods: {
      // 获取单条规则数据
      getRuleData () {
				console.log(`当前查询规则id为：${this.id}`)

				let timer = setTimeout(() => {
					this.ruleData.name = '汽车金融'
					this.ruleData.reg = 'http://www.faceh5.com/newyear/activity/acrs.html'
					this.ruleData.pageType = '活动性页面'
					this.ruleData.first = '财富管理'
					this.ruleData.second = '固收理财'
					this.ruleData.third = '保险理财定期'
					this.ruleData.fourth = '月月盈-保险理财'

					if (this.ruleData.pageType) {this.getPageTypeDropData()}
					if (this.ruleData.first) {this.getFirstDropData()}
          if (this.ruleData.second) {this.getSecondDropData()}
          if (this.ruleData.third) {this.getThirdDropData()}
          if (this.ruleData.fourth) {this.getFourthDropData()}

					clearTimeout(timer)
				},1500)
			},
      // 校验正则
			verifyReg () {
      	this.verifyStatus = '2'
      	let timer = setTimeout(() => {
      		// 校验通过
      		this.verifyStatus = '3'

          // 校验不通过
//          this.verifyStatus = '4'
//          this.errorList = [{
//          	name: '支付闪付',
//            erp: 'luyi78'
//          }, {
//						name: '财富小金库',
//						erp: 'jiaoli1'
//					}, {
//						name: '白条贴',
//						erp: 'xuyang066'
//					}]
				}, 1500)
      },
      // 提交数据
			submit () {
				const rule = {name: this.ruleData.name, reg: this.ruleData.reg, pageType: this.ruleData.pageType, first: this.ruleData.first, second: this.ruleData.second, third: this.ruleData.third, fourth: this.ruleData.fourth}
				console.log(`数据为 ${JSON.stringify(rule)}`)
				this.resultModal.show = true
				this.resultModal.title = this.type === 'add' ? '添加规则' : '修改规则'
				this.resultModal.status = 'success'
				this.resultModal.desc = this.type === 'add' ? '您已成功添加此规则' : '您已成功修改此规则'
      },
			// 结果Modal中的完成按钮事件
			finishCode () {
				this.closeResultModal()
				this.$router.push({path: '/rule/all'})
			},
			// 结果Modal中的取消按钮事件
			closeResultModal () {
				this.resultModal.show = false
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
				if (this.ruleData.pageType) {
					this.pageTypeDropData.forEach((_) => {
						if (_.value === this.ruleData.pageType) {
							_.active = true
						}
					})
				}
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
        if (this.ruleData.first) {
					this.firstDropData.forEach((_) => {
						if (_.value === this.ruleData.first) {
							_.active = true
            }
          })
        }
			},
			// 获取二级分类下拉数据
			getSecondDropData () {
				// 此时应该带一级分类去查
				console.log(`查询二级分类数据入参，一级分类：${this.ruleData.first}`)
				this.secondDropData = [{
					value: '动产质押',
					active: false
				}, {
					value: '固收理财',
					active: false
				}]
				if (this.ruleData.second) {
					this.secondDropData.forEach((_) => {
						if (_.value === this.ruleData.second) {
							_.active = true
						}
					})
				}
			},
			// 获取三级分类下拉数据
			getThirdDropData () {
				// 此时应该带一级二级分类去查
				console.log(`查询三级分类数据入参，一级分类：${this.ruleData.first} 二级分类：${this.ruleData.second}`)
				this.thirdDropData = [{
					value: '采购融资',
					active: false
				}, {
					value: '保险理财定期',
					active: false
				}]
				if (this.ruleData.third) {
					this.thirdDropData.forEach((_) => {
						if (_.value === this.ruleData.third) {
							_.active = true
						}
					})
				}
			},
			// 获取四级分类下拉数据
			getFourthDropData () {
				// 此时应该带一级二级三级分类去查
				console.log(`查询四级分类数据入参，一级分类：${this.ruleData.first} 二级分类：${this.ruleData.second} 三级分类：${this.ruleData.third}`)
				this.fourthDropData = [{
					value: '月月盈-保险理财',
					active: false
				}]
				if (this.ruleData.fourth) {
					this.fourthDropData.forEach((_) => {
						if (_.value === this.ruleData.fourth) {
							_.active = true
						}
					})
				}
			},
			// 选择一级分类
			chooseFirst (choose) {
				if (this.ruleData.first !== choose.value) {
					this.ruleData.first = choose.value
					this.ruleData.second = ''
					this.ruleData.third = ''
					this.ruleData.fourth = ''
					this.secondDropData.forEach((_) => {
						_.active = false
					})
					this.thirdDropData.forEach((_) => {
						_.active = false
					})
					this.fourthDropData.forEach((_) => {
						_.active = false
					})
					this.getSecondDropData()
				}
			},
			// 选择二级分类
			chooseSecond (choose) {
				if (this.ruleData.second !== choose.value) {
					this.ruleData.second = choose.value
					this.ruleData.third = ''
					this.ruleData.fourth = ''
					this.thirdDropData.forEach((_) => {
						_.active = false
					})
					this.fourthDropData.forEach((_) => {
						_.active = false
					})
					this.getThirdDropData()
				}
			},
			// 选择三级分类
			chooseThird (choose) {
				if (this.ruleData.third !== choose.value) {
					this.ruleData.third = choose.value
					this.ruleData.fourth = ''
					this.fourthDropData.forEach((_) => {
						_.active = false
					})
					this.getFourthDropData()
				}
			},
			// 选择四级分类
			chooseFourth (choose) {
				if (this.ruleData.fourth !== choose.value) {
					this.ruleData.fourth = choose.value
				}
			},
      // 选择页面类型
      choosePageType (choose) {
      	this.ruleData.pageType = choose.value
      },
			// input 监听
			inputName (val) {
				this.ruleData.name = val;
			},
			inputReg (val) {
      	this.verifyStatus = '1'
				this.ruleData.reg = val;
			},
      // blur 监听
			blurReg () {
      	if (this.ruleData.reg) {
      		this.verifyReg()
        }
      },
		},
    computed: {
			btnDisabled () {
				return !(this.ruleData.name && this.verifyStatus === '3' && this.ruleData.pageType && this.ruleData.first)
			}
    }
  }
</script>
<style type="text/scss" lang="scss">
  @import "../../src/assets/css/common/var";
  @keyframes rotate {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }
  .page-rule-all-update { padding: 0 30px;
    &-breadcrumb-box { padding-top: 30px;
      .art-breadcrumb-item-link, .art-breadcrumb-item-separator { display: inline-block;}
    }
    &-title { padding: 18px 0 16px; border-bottom: 2px solid $borderColor;
      h3 { font-size: $sizeLarge; color: $mainStrong; line-height: 24px; padding-top: 8px;}
    }
    &-cont { padding: 60px 120px 40px;
      .item { display: flex;
        &-name { position: relative; width: 76px; text-align: right; padding-right: 20px; font-size: $sizeNormal; line-height: 32px; color: $main; white-space: nowrap;
          &:after { content: "*"; position: absolute; right: 10px; top: 8px; display: none; font-size: $sizeNormal; color: #f8636e; line-height: 1;}
        }
        &-cont { flex: 1; font-size: 0;
          .art-input, .art-input-drop { width: 300px;}
          .icon-loading { display: inline-block; vertical-align: middle; margin-left: 10px; width: 20px; height: 20px; background-image: url("//storage.360buyimg.com/static-res/tech/jrv/pro/icon/icon-loading.png"); animation: rotate 1.8s linear infinite;}
        }
        &.required {
          .item-name {
            &:after { display: block;}
          }
        }
      }
      .item + .item { margin-top: 22px;}
      .error-box { padding-left: 76px; padding-top: 3px; padding-bottom: 3px;
        .error-reg { position: relative; max-height: 56px; width: 300px; overflow: hidden; padding-right: 10px;
          ul {
            li { font-size: $sizeSmall; color: $red; line-height: 16px;}
            li + li { margin-top: 3px;}
          }
        }
      }
    }
    &-btn { padding-left: 196px; margin-bottom: 40px;}
  }
</style>
