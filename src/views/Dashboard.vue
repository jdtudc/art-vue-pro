<template>
    <div class="dashboard">
        <div class="row large-gutter">
            <div class="col-24">
                <art-tabs :data="tabsData" @on-click="clickTab"></art-tabs>
            </div>
        </div>
        <div class="row large-gutter">
            <div class="col-6">
                <art-card active>
                    <h4>今日访问量</h4>
                    <h2>8,335,146.58</h2>
                    <p>同比昨日<span class="down">-0.34%</span></p>
                </art-card>
            </div>
            <div class="col-6">
                <art-card>
                    <h4>今日访问人数</h4>
                    <h2>4,335,146.58</h2>
                    <p>同比昨日<span class="up">2.78%</span></p>
                </art-card>
            </div>
            <div class="col-6">
                <art-card>
                    <h4>今日参与人数</h4>
                    <h2>3,335,146.58</h2>
                    <p>同比昨日<span class="up">2.78%</span></p>
                </art-card>
            </div>
            <div class="col-6">
                <art-card>
                    <h4>今日平均参与率</h4>
                    <h2>50.36%</h2>
                    <p>同比昨日<span>0.00</span></p>
                </art-card>
            </div>
        </div>
        <div class="row large-gutter">
            <div class="col-16">
                <div class="row large-gutter">
                    <div class="col-12">
                        <div class="chart-box">
                            <h4 class="chart-title">数值柱状图</h4>
                            <div class="chart">
                                <art-chart chart-id="bar5" :option="bar1Opt"></art-chart>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="chart-box">
                            <h4 class="chart-title">占比柱状图</h4>
                            <div class="chart">
                                <art-chart chart-id="bar1" :option="bar1Opt"></art-chart>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row large-gutter">
                    <div class="col-24">
                        <div class="chart-box">
                            <h4 class="chart-title">对比柱状图</h4>
                            <div class="chart">
                                <art-chart chart-id="bar4" :option="bar4Opt"></art-chart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div class="row large-gutter">
                    <div class="col-24">
                        <div class="chart-box">
                            <h4 class="chart-title">饼状图</h4>
                            <div class="chart">
                                <art-chart chart-id="pie2" :option="pie2Opt"></art-chart>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row large-gutter">
                    <div class="col-24">
                        <div class="chart-box">
                            <h4 class="chart-title">雷达图</h4>
                            <div class="chart">
                                <art-chart chart-id="radar1" :option="radar1Opt"></art-chart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row large-gutter">
            <div class="col-12">
                <div class="chart-box">
                    <h4 class="chart-title">多折线图</h4>
                    <div class="chart">
                        <art-chart chart-id="line1" :option="line1Opt_2"></art-chart>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="chart-box">
                    <h4 class="chart-title">对比折线图</h4>
                    <div class="chart">
                        <art-chart chart-id="line3" :option="line3Opt"></art-chart>
                    </div>
                </div>
            </div>
        </div>
        <div class="row large-gutter">
            <div class="col-12">
                <div class="chart-box">
                    <h4 class="chart-title">中国省份地图</h4>
                    <div class="chart">
                        <art-chart chart-id="map1" :option="map1Opt"></art-chart>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="chart-box">
                    <h4 class="chart-title">中国城市地图</h4>
                    <div class="chart">
                        <art-chart chart-id="map2" :option="map2Opt"></art-chart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	export default {
		name: 'dashboard',
    data () {
			return {
				tabsData: [
					{value: "今日数据", active: true},
					{value: "历史数据", active: false},
					{value: "数据分析", active: false, disabled: true}
				],
				bar1Opt: {
					dataAxis: ["15以下","16-25","26-35","35-45","46-55","56以上"],
					data: [100,200,300,200,100,50],
				},
				bar4Opt: {
					dataAxis: ["2018-01-19","2018-01-20","2018-01-21"],
					data: [{
						"name": "广告渠道",
						"data": [5.26,35,63.16]
					}, {
						"name": "其他渠道",
						"data": [62.26,100,17.65]
					}],
				},
				pie2Opt: {
					dataAxis: ["站内流量","站外流量","线下流量","其它"],
					data: [450,250,200,100]
				},
				radar1Opt: {
					indicator: [
						{ name: '参与人数', max: 5},
						{ name: '活动转化', max: 5},
						{ name: '吸引力指数', max: 5},
						{ name: '羊毛指数', max: 5},
						{ name: '访问量', max: 5}
					],
					data: [{
						"name": "该活动综合得分",
						"data": [4.2, 4, 4.4, 3.8, 4]
					}, {
						"name": "同类活动平均得分",
						"data": [3.4, 2, 5, 4, 4]
					}],
				},
				line1Opt_2: {
					dataAxis: ["10-20","10-21","10-22","10-23","10-24","10-25","10-26"],
					data: [{
						name: "活动花费",
						data: [1500.9,14200.9,24000.9,13500.9,5267.9,17200.9, 6400.9]
					}, {
						name: "其它花费",
						data: [500.9,4200.9,4000.9,3500.9,15267.9,7200.9, 16400.9]
					}],
				},
				line3Opt: {
					dataAxis: ["10-20","10-21","10-22","10-23","10-24","10-25","10-26"],
					data: [{
						name: "今日浏览",
						data: [0, 2, 6, 0, 0, 1, null]
					}, {
						name: "昨日浏览",
						data: [0, 0, 4, 10, 3, 1, 2]
					}],
				},
				map1Opt: {
					list: [
						{name: "江苏", value: 735},
						{name: "湖北", value: 381},
						{name: "广西", value: 354},
						{name: "新疆", value: 286},
						{name: "河北", value: 286},
						{name: "广东", value: 286},
						{name: "浙江", value: 136},
						{name: "北京", value: 122},
						{name: "山东", value: 95},
						{name: "福建", value: 7224}
					]
				},
				map2Opt: {
					list: [
						{name: "成都市", value: 735},
						{name: "武汉市", value: 381},
						{name: "南宁市", value: 354},
						{name: "南昌市", value: 286},
						{name: "郑州市", value: 286},
						{name: "广州市", value: 286},
						{name: "杭州市", value: 136},
						{name: "北京市", value: 122},
						{name: "济南市", value: 95},
						{name: "厦门市", value: 7224}
					]
				},
			}
    },
		methods: {
			clickTab (tab) {
				if(tab.active) {
					return false;
        } else {
					this.tabsData.forEach((_) => {
						_.active = _.value === tab.value ? true : false;
          });
          alert("您选中的是：" + JSON.stringify(tab.value))
        }
      },
    },
	}
</script>
<style type="text/scss" lang="scss">
    @import '../assets/css/common/_var.scss';

    .dashboard { padding: 5 * $base 3 * $base;
        // 卡片展示
        .art-card { min-height: 164px;
            h4 { font-size: 16px; padding-bottom: 15px; font-weight: normal; color: $main; }
            h2 { font-size: 32px; font-family: DIN-medium; padding-bottom: 20px; color: $mainStrong;}
            p { position: absolute; bottom: 0; left: 30px; right: 30px; height: 50px; color: $main; line-height: 50px; border-top: 1px solid $borderColor; font-size: 12px;
                // 默认向上
                span { margin-left: 22px; display: inline-block; position: relative; color: $main;
                    &:before { position: absolute; content: ""; left: -12px; top: 0; bottom: 0; margin: auto 0; height: 0; width: 0; border-width: 4px; border-color: transparent transparent $main transparent; border-style: solid; transform: translateY(-2px);}
                    &.down { color: $green;
                        &:before { transform: translateY(2px); border-color: $green transparent transparent transparent;}
                    }
                    &.up { color: $red;
                        &:before { transform: translateY(-2px); border-color: transparent transparent $red transparent;}
                    }
                }

            }
            &_active {
                h4, h2, p {
                    color: #fff;
                }
            }
        }
        // 图表展示
        .chart-box {
            .chart-title {}
            .chart { margin-top: 3 * $base;
                .art-chart_map1-canvas, .art-chart_map2-canvas { width: 280px; height: 220px;}
                .art-chart_map1-result, .art-chart_map2-result { left: 310px; top: 0;}
            }
        }
    }
</style>
