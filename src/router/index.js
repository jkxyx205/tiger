import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Service from './modules/service'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  Service,
  {
    path: '/usermgt',
    component: Layout,
    alwaysShow: true,
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'users',
        component: () => import('@/views/user/user-list'),
        name: 'Users',
        meta: { title: '用户信息', icon: 'edit', noCache: false }
      },
      {
        path: 'groups',
        component: () => import('@/views/user/group-list'),
        name: 'Groups',
        meta: { title: '公司信息', icon: 'edit' }
      }
    ]
  },
  {
    path: '/component',
    component: Layout,
    alwaysShow: true,
    meta: { title: '组件管理', icon: 'tree', noCache: true },
    children: [
      {
        path: 'site',
        alwaysShow: true,
        name: 'Site',
        meta: { title: '企业建站', icon: 'edit', noCache: true },
        children: [
          {
            path: 'image',
            component: () => import('@/views/icons/index'),
            name: 'Image',
            meta: { title: '图库管理', icon: 'edit', noCache: true }
          }
        ]
      },
      {
        path: 'oa',
        component: () => import('@/views/icons/index'),
        name: 'OA',
        meta: { title: 'OA', icon: 'edit', noCache: true }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    // alwaysShow: true,
    // meta: { title: '消息测试Root', icon: 'guide', noCache: true }, //
    children: [
      {
        path: 'index',
        component: () => import('@/views/message/index'),
        name: 'Message',
        meta: { title: '消息测试', icon: 'guide', noCache: false }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
