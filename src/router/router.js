import Vue from 'vue'
import Router from 'vue-router'

const loadView = (name) => {
	return resolve => require([`../views/${name}`], resolve);
};

const redirectUrl = (to, from, next) => {
	router.replace({path: '/dashboard'});
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
		// 数据看板
		{path: '/dashboard', name: 'dashboard', component: loadView('Dashboard'), beforeEnter: checkAuth,},
		// 活动列表
		{path: '/active/list', name: 'activeList', component: loadView('ActiveList'), beforeEnter: checkAuth,},
		{path: '/active/add', name: 'activeAdd', component: loadView('ActiveAdd'), beforeEnter: checkAuth,},
		// 无权限
		{path: '/permission', name: 'permission', component: loadView('Permission'), beforeEnter: checkAuth,},
		// 其他路径自动重定向
		{path: '*', beforeEnter: redirectUrl}
	]
});

export default router;

