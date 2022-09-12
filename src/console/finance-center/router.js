import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  name: `${id}.title`,
  component: () => import('./app'),
  children: [
    {
      path: 'rechargeList',
      name: `${id}.router.rechargeList`,
      component: () => import('./views/RechargeList/RechargeList'),
      meta: { title: '充值列表' }
    },
    {
      path: 'invoiceOrder',
      name: `${id}.router.invoiceOrder`,
      component: () => import('./views/InvoiceOrder/index'),
      meta: { title: '订单列表' }
    },
    {
      path: 'invoiceOrder/invoiceOrderDetail/:id',
      name: `${id}.router.invoiceOrder__id`,
      hidden: true,
      component: () => import('./views/InvoiceOrder/detail'),
      meta: { title: '订单详情' }
    },
    // {
    //   path: 'orderList',
    //   name: `${id}.router.orderList`,
    //   component: () => import('./views/OrderList/OrderList'),
    //   meta: { title: '账单管理' }
    // },
    {
      path: 'orderList/pay',
      name: `${id}.router.orderList__pay`,
      hidden: true,
      component: () => import('./views/OrderList/Pay'),
      meta: { title: '支付页面' }
    },
    {
      path: 'orderList/orderDetail/:id',
      name: `${id}.router.orderList__id`,
      hidden: true,
      component: () => import('./views/OrderList/OrderDetail'),
      meta: { title: '账单详情' }
    },
    {
      path: 'invoiceList',
      name: `${id}.router.invoiceList`,
      component: () => import('./views/InvoiceList/InvoiceList'),
      meta: { title: '发票管理' }
    },
    {
      path: 'couponList',
      name: `${id}.router.couponList`,
      component: () => import('./views/CouponList/CouponList'),
      meta: { title: '优惠码管理' }
    }
  ]
}
