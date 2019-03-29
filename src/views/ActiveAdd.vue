<template>
    <div class="active-add">
        <div class="row large-gutter">
            <div class="col-24">
                <art-breadcrumb :data="breadcrumbData"></art-breadcrumb>
            </div>
        </div>
        <div class="row large-gutter">
            <div class="col-24">
                <div class="title">
                    <h2>添加活动</h2>
                </div>
            </div>
        </div>
        <div class="row large-gutter">
            <div class="col-6">
                <div class="steps-box">
                    <art-steps :data="stepsData" direction="vertical"></art-steps>
                </div>
            </div>
            <div class="col-18">
                <div class="cont-box" v-if="step === 1">
                    <div class="row">
                        <div class="col-4">
                            <p class="item-name">活动名称</p>
                        </div>
                        <div class="col-12">
                            <art-input placeholder="请输入活动名称"></art-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <p class="item-name">活动类型</p>
                        </div>
                        <div class="col-12">
                            <art-input-drop :drop-data="dropData" default-text="请选择活动类型"></art-input-drop>
                        </div>
                        <div class="col-1">
                            <div class="info-box">
                                <art-tooltip content="提示内容"><i class="icon-info"></i></art-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="row flex-middle">
                        <div class="col-4">
                            <p class="item-name">投放状态</p>
                        </div>
                        <div class="col-12">
                            <art-switch :auto-switch="true">
                                <div slot="open">开</div>
                                <div slot="close">关</div>
                            </art-switch>
                        </div>
                    </div>
                    <div class="row flex-middle">
                        <div class="col-4">
                            <p class="item-name">操作风格</p>
                        </div>
                        <div class="col-12">
                            <art-radio :value="radio.value" :active="radio.active" :disabled="radio.disabled" v-for="radio in radioData" :key="radio.id" @click.native="!radio.disabled && clickRadio(radio)"></art-radio>
                        </div>
                    </div>
                    <div class="row flex-middle">
                        <div class="col-4">
                            <p class="item-name">投放渠道</p>
                        </div>
                        <div class="col-12">
                            <art-checkbox :value="checkbox.value" :active="checkbox.active" :disabled="checkbox.disabled" v-for="checkbox in checkboxData" :key="checkbox.id" @click.native="!checkbox.disabled && clickCheckbox(checkbox)"></art-checkbox>
                        </div>
                    </div>
                    <div class="row flex-middle">
                        <div class="col-4">
                            <p class="item-name">活动有效期</p>
                        </div>
                        <div class="col-12">
                            <art-calendar placeholder="请选择投放日期"></art-calendar>
                            <span class="calendar-connect">&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                            <art-calendar placeholder="请选择截止日期"></art-calendar>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <p class="item-name">活动描述</p>
                        </div>
                        <div class="col-12">
                            <art-textarea :auto-size="{minRows: 2, maxRows: 3}" placeholder="最小2行,最大3行"></art-textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                        </div>
                        <div class="col-12">
                            <art-button type="main" size="large" @click="next">下一步</art-button>
                            <art-button type="minor" size="large" @click="back">返回</art-button>
                        </div>
                    </div>
                </div>
                <div class="cont-box" v-if="step === 2">
                    <div class="row">
                        <div class="col-4">
                        </div>
                        <div class="col-12">
                            <art-button type="main" size="large" @click="add">确认添加</art-button>
                            <art-button type="minor" size="large" @click="prev">上一步</art-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	export default {
		name: 'active-add',
    data () {
			return {
				breadcrumbData: [
					{value: "活动列表", active: false, path: "/active/list"},
					{value: "添加活动", active: true},
				],
				stepsData: [
					{title: "活动基本信息", desc: "", active: true, finish: false, step: 1},
					{title: "确认添加", desc: "", active: false, finish: false, step: 2},
				],
        step: 1,
				dropData: [
					{value: 'PC活动', sort: 1, active: false},
					{value: 'H5活动', sort: 2, active: false},
				],
				radioData: [
					{value: "蓝色", active: true, theme: "blue"},
					{value: "红色", active: false, theme: "red"},
				],
				checkboxData: [
					{value: "广告", active: false, disabled: false},
					{value: "活动", active: false, disabled: false},
					{value: "付费渠道", active: false, disabled: true},
				]
      }
    },
		methods: {
			clickRadio (item) {
				this.radioData.forEach((radio) => {
					if(radio.theme === item.theme) {
						radio.active = true;
					} else {
						radio.active = false;
					}
				})
			},
			clickCheckbox (item) {
				item.active = !item.active;
			},
			back () {
				this.$router.go(-1);
      },
      next () {
				this.step += 1;
				this.updateStep();
      },
      prev () {
				this.step -= 1;
				this.updateStep();
			},
      add () {
				this.$router.replace({path: '/active/list'})
      },
      updateStep () {
				this.stepsData.forEach((_) => {
					if(_.step < this.step) {
						_.finish = true;
						_.active = false;
					} else if (_.step === this.step) {
						_.active = true;
						_.finish = false;
					} else {
						_.active = false;
						_.finish = false;
					}
				})
			}
    }
	}
</script>
<style type="text/scss" lang="scss">
    @import '../assets/css/common/_var.scss';
    .active-add { padding: 5 * $base 3 * $base;
        .title { position: relative; font-size: $sizeLarge; color: $mainStrong; border-bottom: 2px solid $borderColor; padding-bottom: 3 * $base;}
        .steps-box { padding: 3 * $base 0 0 5 * $base; height: 300px;}
        .cont-box { border-left: 1px solid $borderColor; padding: 3 * $base;
            .row + .row { margin-top: 3 * $base;}
            .item-name { text-align: right; line-height: 4 * $base; color: $mainWeak;}
            .art-input, .art-input-drop { width: 100%;}
            .art-radio, .art-checkbox, .art-calendar { float: left;}
            .art-calendar { width: 16 * $base;}
            .art-button { width: 15 * $base;
                & + .art-button { margin-left: 3 * $base;}
            }
            .calendar-connect {float: left; display: block; line-height: 4 * $base;}
            .info-box { padding: $base 0;
                .icon-info { position: relative; display: block; width: 2 * $base; height: 2 * $base; padding: $base; cursor: pointer; background-image: url("//storage.360buyimg.com/static-res/tech/daplatform/icon/icon-info.png");
                    &:hover { background-image: url("//storage.360buyimg.com/static-res/tech/daplatform/icon/icon-info_active.png"); transition: all $animateTime;}
                }
            }
        }
    }
</style>
