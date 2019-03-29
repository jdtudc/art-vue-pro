<template>
  <div class="file" :class="[file && 'file_uploaded']" @mouseenter="enter" @mouseleave="leave">
    <div class="layer" v-if="!file">
      <span>添加文件</span>
      <p>（可点击或拖拽上传）</p>
    </div>
    <div class="layer" v-if="file" :class="[file && 'bg_xls']">
      <i :style="[bgUrl && 'background-image:url('+ bgUrl +')']"></i>
      <p v-text="file.name"></p>
    </div>
    <div class="progress" :class="[status && 'progress_' + status]" v-if="status && status != 'success'">
      <div class="progress-bg">
        <canvas></canvas>
      </div>
      <div class="progress-cont">
        <p class="num" v-if="status != 'processing'">{{progress}}%</p>
        <p class="text" v-if="status == 'success'">上传成功</p>
        <p class="text" v-if="status == 'fail'">上传失败</p>
        <p class="text" v-if="status == 'uploading'">正在上传...</p>
        <p class="text" v-if="status == 'processing'">处理数据...</p>
      </div>
    </div>
    <div class="layer">
      <input type="file" @change="chooseFile($event)" title="上传文件" />
    </div>
    <div class="mask-trans" v-if="status == 'uploading'"></div>
    <transition name="fade">
      <div class="mask" v-if="(file || status == 'fail') && showAssist">
        <p>重新上传</p>
      </div>
    </transition>
    <transition name="rotate-scale">
      <div class="close" v-if="file && showAssist" @click="clear" title="删除文件"></div>
    </transition>
  </div>
</template>
<script>
  export default {
      props: {
      	file: [Object,File],
        maxSize: {
          type: Number,
          default: 1024 * 1024 * 100, // 默认最大一百M
        },
        exceedError: {
          type: String,
          default: "上传文件大小不正确"
        },
        formatError: {
          type: String,
          default: "上传文件格式不正确"
        },
        bgUrl: String,
        progress: [Number,String],
        status: String
      },
      data () {
        return {
          showAssist: false,
          $input: null,
          $loading: null,
        }
      },
      methods: {
        enter () {
          this.showAssist = true;
        },
        leave () {
          this.showAssist = false;
        },
        clear () {
          this.showAssist = false;
          this.$input.value = "";
          this.$emit("on-delete", this.$input)
        },
        chooseFile (e) {
          this.$input = e.target;

          if(e.target.files.length == 0) {
            return false;
          } else {
            this.showAssist = false;

            let file = e.target.files[0];
            if(file.size > this.maxSize) {
              e.target.value = "";
              this.$emit("on-error", {type: "exceedLimit", msg: this.exceedError})
            } else {
							if(/(\.xlsx)|(\.xls)/.test(file.name) && file.name.length > 4) {
                this.$emit("on-change", e.target.files[0]);
              } else {
                e.target.value = "";
                this.$emit("on-error", {type: "formatError", msg: this.formatError})
              }
            }
          }
        },
	      drawLoading (progress) {
        	if($(".progress-bg").length === 0) {
        		return false;
          }
		      let self = this;
		      let colorArr = [["#0074ff", "#24b4ff"],["#f52f3e", "#ffb540"]];

		      var $chart = $(".progress-bg");
		      var w = $chart.width()
		      var he = $chart.height();
		      var linew = 8;
		      var circle = {x: w, y: he, r: w - 14};
		      var ctx = null;
		      var canvas = null;


		      var startArc = -2 / 8 * 2 * Math.PI; // 从顶部开始逆时针显示
		      var endArc = 6 / 8 * 2 * Math.PI;
		      var endArcFront = startArc + (endArc - startArc) * progress / 100;

		      init();

		      function init() {
			      var $canvas = $chart.find("canvas");
			      canvas = $canvas.get(0);
			      $canvas.css({width: w, height: he});
			      canvas.width = w * 2;
			      canvas.height = he * 2;
			      ctx = canvas.getContext("2d");
			      draw();
		      }

		      function draw() {
			      drawSingle(endArcFront);
		      }

		      function drawSingle(end) {
			      drawBg();
			      progress > 0 && drawMain(end);
		      }

		      function drawBg() {
			      // 背景
			      ctx.save();
			      ctx.lineWidth = linew;
			      ctx.beginPath();
			      ctx.arc(circle.x, circle.y, circle.r + linew / 2, startArc, endArc, false);

			      ctx.strokeStyle = "#ecf0f9";
			      ctx.lineCap = "round";
			      ctx.stroke();
			      ctx.restore();
		      }

		      function drawMain(end) {
			      ctx.save();
			      ctx.lineWidth = linew;
			      ctx.beginPath();
			      ctx.arc(circle.x, circle.y, circle.r + linew / 2, startArc, end, false);
			      var x = circle.x - circle.r;
			      var grad = ctx.createLinearGradient(x, circle.y - circle.r, (circle.x + circle.r) / 2, circle.y + circle.r);
			      if(self.status === "fail") {
				      grad.addColorStop(0, colorArr[1][0]);
				      grad.addColorStop(1, colorArr[1][1]);
				      ctx.shadowColor = "rgba(245, 47, 62, 0.4)";
			      } else {
				      grad.addColorStop(0, colorArr[0][0]);
				      grad.addColorStop(1, colorArr[0][1]);
				      ctx.shadowColor = "rgba(0, 116, 255, 0.4)";
			      }

			      ctx.strokeStyle = grad;
			      ctx.lineCap = "round";
			      ctx.shadowBlur = 6;
			      ctx.shadowOffsetX = 0; // 阴影Y轴偏移
			      ctx.shadowOffsetY = 3; // 阴影X轴偏移
			      ctx.stroke();
			      ctx.restore();
		      }

		      function clear() {
			      ctx.clearRect(0, 0, canvas.width, canvas.height);
		      }
	      },
      },
      watch: {
	      status (val) {
          if(val === "fail") {
	          this.clear();
          }
        },
	      progress (val) {
            this.drawLoading(val)
	      }
      }
    }
</script>

<style type="text/scss" lang="scss">
  @import "../../../assets/css/common/var";

  .file { position: relative; display: block; width: 144px; height: 100px; background-color: $weakBg;

    // slide-up
    .slide-up-enter-active, .slide-up-leave-active {
      transition: all $animateTime;
      height: 100%;
    }
    .slide-up-enter, .slide-up-leave-active {
      height: 0;
    }
    // rotate-scale
    .rotate-scale-enter-active, .rotate-scale-leave-active {
      transition: all $animateTime;
      transform: scale(1) rotateZ(180deg)
    }
    .rotate-scale-enter, .rotate-scale-leave-active {
      transform: scale(0) rotateZ(0deg);
    }

    .layer { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;
      span { position: relative; display: block; width: 74px; padding-left: 18px; margin: 30px auto 0; font-size: $sizeNormal; line-height: 1; color: $blue; white-space: nowrap;
        &:before, &:after { content: ""; position: absolute; left: 0; top: 50%; margin-top: -1px; width: 12px; height: 2px; background-color: $blue;}
        &:after { transform: rotate(-90deg);}
      }
      p { font-size: $sizeSmall; color: $main; text-align: center; margin-top: 10px; line-height: 1; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}
      input { display: block; position: absolute; left: -100%; top: 0; width: 200%; height: 100%; opacity: 0; cursor: pointer;}
      i { display: block; width: 36px; height: 44px; margin: 18px auto 0;}
    }
    .mask { position: absolute; left: 0; bottom: 0; width: 100%; background-color: rgba(0,0,0,0.7); transition: all $animateTime; transform-origin: 50% 100%; pointer-events: none;
      p { text-align: center; color: #fff; font-size: $sizeSmall; line-height: 100px;}
    }
    .close { position: absolute; width: 16px; height: 16px; right: -8px; top: -8px; background-color: #fff; box-shadow: 0 5px 15px 2px rgba(0, 0, 0, 0.05); border-radius: 50%; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGBAMAAAAS4vJ7AAAABGdBTUEAALGPC/xhBQAAABVQTFRFAHT/AHT/AHT/AHT/AHT/AHT/AHT/RxgPQAAAAAZ0Uk5TbZVul5YBsJOAOgAAAB5JREFUCNdjYAkVYnAzSWEITjNlCAFiMeMUBpVQIQA0OQRf98RpJQAAAABJRU5ErkJggg=="); background-position: center center; background-repeat: no-repeat; transition: all $animateTime ease; cursor: pointer;}
    .progress { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden; background-color: $weakBg;
      &-bg { position: absolute; top: 15px; width: 50px; height: 50px; left: 50%; margin-left: -25px;}
      &-cont { padding-top: 15px;
        .num { display: block; width: 50px; height: 50px; margin: 0 auto; font-weight: bolder; line-height: 50px; text-align: center; font-size: $sizeNormal;}
        .text { font-size: $sizeSmall; text-align: center; margin-top: 10px;}
      }
      &_success, &_uploading, &_processing { color: $blue;}
      &_processing {
        &-cont .text { margin-top: 36px;}
      }
      &_fail { color: $red;}
    }
    .mask-trans { position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; background-color: transparent;}
    &_error {
      .layer {
        span { color: $red;}
      }
    }
  }
  .bg_xls {
    i { background-image: url("./xls-bg.png");}
  }
</style>