import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from  '@/views/Cart'
import Address from  '@/views/Address'
import Confirm from '@/views/Confirm'
import Success from '@/views/Success'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component:GoodsList
    },
    {
      path:'/cart',
      component:Cart
    },
    {
      path:'/address',
      component:Address
    },
    {
      path:'/confirm',
      component:Confirm
    },
    {
      path:'/success',
      component:Success
    }
  ]
})
