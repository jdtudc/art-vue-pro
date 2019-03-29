import Vue from 'vue'
import App from './App.vue'
import router from './router/router'

import art from 'art-vue'
import 'art-vue/dist/styles/art-vue.css'

Vue.use(art);

Vue.config.productionTip = false

/**
 * @Function 格式化金额
 * @param {Number} s 需要格式化的金额  123456789.01
 * @param {Number} n 小数点位数 2
 * @
 */
Vue.filter('formatMoney', function (s, n) {
  if(n === 0) {
    return (parseInt(s) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  n = (n > 0) && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
});

/**
 * @Function 格式化时间
 * @param {Date} date  '2017/10/01 | 2017-10-01 | 1506787200000'
 * @param {String} format 'yyyy-MM-dd HH:mm:ss'
 * @
 */
Vue.filter('formatTime', function (date, _format) {
  let t = new Date(date);
  let format = _format || 'yyyy-MM-dd HH:dd:ss';
  let tf = function (i) {
    return ( i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
