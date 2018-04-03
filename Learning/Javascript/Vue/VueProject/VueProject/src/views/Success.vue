<template>
    <div>
        <nav-header></nav-header>
        <div class="container">
            <div class="page-title-normal">
                <h2 class="page-title-h2"><span>check out</span></h2>
            </div>
            <!-- 进度条 -->
            <div class="check-step">
                <ul>
                    <li class="cur"><span>确认地址</span></li>
                    <li class="cur"><span>检查订单</span></li>
                    <li class="cur"><span>付款</span></li>
                    <li class="cur"><span>订单信息</span></li>
                </ul>
            </div>

            <div class="order-create">
                <div class="order-create-pic"><img src="../../static/ok-2.png" alt=""></div>
                <div class="order-create-main">
                    <h3>购物成功! <br>您的订单正在处理中...</h3>
                    <p>
                        <span>订单编号：{{orderId}}</span>
                        <span>订单总价：￥{{orderTotal}}</span>
                    </p>
                    <div class="order-create-btn-wrap">
                        <div class="btn-l-wrap">
                            <router-link to="/cart" class="btn btn--m">购物车</router-link>
                        </div>
                        <div class="btn-r-wrap">
                            <router-link to="/" class="btn btn--m">商城</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
  import '../assets/css/checkout.css'
  import NavHeader from "@/components/Header"
  import NavFooter from "@/components/Footer"
  import axios from 'axios'

  export default {
    data() {
      return {
        orderId:0,
        orderTotal:0
      }
    },
    components: {
      NavHeader,
      NavFooter
    },
    mounted(){
      this.getTotal();
    },
    methods:{
      getTotal(){
        this.orderId=this.$route.query.orderId;
        axios.post('/users/getTotal',{
          orderId:this.orderId
        }).then((response,err)=>{
          if(response.data.status===0){
            this.orderTotal=response.data.result;
          }else{
            console.log(response.data.msg);
          }
        })

      }
    }
  }
</script>