import Vue from 'vue'
import Router from 'vue-router'

// 使用示例
import loadingBar from 'art-vue/components/loading-bar/loading-bar'
import modal from 'art-vue/components/modal/modal'

const loadView = (name) => {
	return resolve => require([`../views/${name}`], resolve)
}

const redirectUrl = (to, from, next) => {
	router.replace({path: '/config'})
	next()
}

// 是否为刷新进入
let isRefresh = true

Vue.use(Router)

// 前置校验，一般用于校验登陆和权限
const checkAuth = (to, from, next) => {
	if (isRefresh) {
		loadingBar.start()
		let timer = setTimeout (() => {
			const res = {
				"code": "000000",
				"msg": "请求成功",
				"data": {
					"name": "McChen"
				}
			}
			loadingBar.finish()
			isRefresh = false
			if (res.code === '100000') {	// 假设约定 100000 为无权限
				router.push({path: '/permission'});
			} else if (res.code === '000000') {	// 假设约定 000000 为成功
				next();
				console.log(`数据为 ${JSON.stringify(res.data)}`);
			} else {	// 其余为失败
				modal.show(res.msg || '数据有误，请检查后重试')
				console.error(res.msg);
			}
			clearTimeout(timer)
		}, 300)
	} else {
		next()
	}
}

const router = new Router({
	routes: [
		// 业务配置
		{path: '/config', name: 'config', component: loadView('Config'), beforeEnter: checkAuth,},
		// 规则管理-全部规则
		{path: '/rule/all', name: 'ruleAll', component: loadView('RuleAll'), beforeEnter: checkAuth,},
		// 规则管理-全部规则-添加规则
		{path: '/rule/all/:type', name: 'ruleAllAdd', component: loadView('RuleAllUpdate'), beforeEnter: checkAuth,},
		// 规则管理-我的规则
		{path: '/rule/my', name: 'ruleMy', component: loadView('RuleMy'), beforeEnter: checkAuth,},
		// 规则管理-我的规则-添加规则
		{path: '/rule/my/:type', name: 'ruleMyAdd', component: loadView('RuleMyUpdate'), beforeEnter: checkAuth,},
		// 规则管理-我的规则-编辑规则
		{path: '/rule/my/:type/:id', name: 'ruleMyEdit', component: loadView('RuleMyUpdate'), beforeEnter: checkAuth,},
		// 页面认领
		{path: '/claim', name: 'claim', component: loadView('Claim'), beforeEnter: checkAuth,},
		// 页面认领-路径认领
		{path: '/claim/:pid', name: 'claimPath', component: loadView('ClaimPath'), beforeEnter: checkAuth,},
		// 页面认领-认领详情
		{path: '/claim/:pid/:id', name: 'claimDetails', component: loadView('ClaimDetails'), beforeEnter: checkAuth,},
		// 自定义代码
		{path: '/code', name: 'code', component: loadView('Code'), beforeEnter: checkAuth,},
		// 代码详情
		{path: '/code/:id', name: 'codeDetails', component: loadView('CodeDetails'), beforeEnter: checkAuth,},
		// 无权限
		{path: '/permission', name: 'permission', component: loadView('Permission'), beforeEnter: checkAuth,},
		// 其他路径自动重定向
		{path: '*', beforeEnter: redirectUrl}
	]
})

export default router

