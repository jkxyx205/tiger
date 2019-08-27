import Layout from '@/layout'

export default {
  path: '/service',
  component: Layout,
  alwaysShow: true,
  redirect: '/service/job',
  meta: { title: '服务中心', icon: 'component' },
  children: [
    {
      path: 'job',
      component: () => import('@/views/job/index'),
      name: 'Job',
      meta: { title: '工单管理', icon: 'edit', noCache: true }
    },
    {
      path: 'job/detail/:id(\\d+)',
      component: () => import('@/views/job/detail'),
      name: 'JobDetail',
      meta: { title: '工单详情', icon: 'edit', noCache: true },
      hidden: true
    },
    {
      path: 'order',
      component: () => import('@/views/order/index'),
      name: 'Order',
      meta: { title: '订单管理', icon: 'edit', noCache: true }
    },
    {
      path: 'order/detail/:id(\\d+)',
      component: () => import('@/views/order/detail'),
      name: 'OrderDetail',
      meta: { title: '订单详情', icon: 'edit', noCache: true },
      hidden: true
    },
    {
      path: 'deploy',
      component: () => import('@/views/deploy/index'),
      name: 'Deploy',
      meta: { title: '部署清单', icon: 'edit', noCache: true }
    }
  ]
}
