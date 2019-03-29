import Vue from 'vue'
import Router from 'vue-router'

const loadView = (name) => {
	return resolve => require([`../views/${name}`], resolve);
};

const redirectUrl = (to, from, next) => {
	router.replace({path: '/index'});
	next();
};

Vue.use(Router);

const checkAuth = (to, from, next) => {
	// 前置校验，一般用于校验登陆和权限
	let PASS = true;
	if (PASS) {
		next();
	} else {
		router.replace({path: '/permission'})
	}
};

const router = new Router({
	routes: [
		// 首页
		{path: '/index', name: 'index', component: loadView('Index'), beforeEnter: checkAuth,},
		// 电话营销-模版管理
		{path: '/telemarketing/templateManagement', name: 'template-management', component: loadView('TemplateManagement'), beforeEnter: checkAuth,},
		// 电话营销-中央监控
		{path: '/telemarketing/centralMonitor', name: 'central-monitor', component: loadView('CentralMonitor'), beforeEnter: checkAuth,},
		// 电话营销-黑名单管理
		{path: '/telemarketing/blacklistManagement', name: 'blacklist-management', component: loadView('BlacklistManagement'), beforeEnter: checkAuth,},
		// 电话营销-专属客服配置
		{path: '/telemarketing/csConfig', name: 'cs-config', component: loadView('CSConfig'), beforeEnter: checkAuth,},
		// 电话营销-数据导入
		{path: '/telemarketing/dataImport', name: 'data-import', component: loadView('DataImport'), beforeEnter: checkAuth,},
		// 电话营销-群管理
		{path: '/telemarketing/groupManagement', name: 'group-management', component: loadView('GroupManagement'), beforeEnter: checkAuth,},
		// 无权限
		{path: '/permission', name: 'permission', component: loadView('Permission'), beforeEnter: checkAuth,},
		// 其他路径自动重定向
		{path: '*', beforeEnter: redirectUrl}
	]
});

export default router;

