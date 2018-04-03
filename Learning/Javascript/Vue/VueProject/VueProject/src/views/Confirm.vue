<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>Confirm</nav-bread>
        <div class="container">
            <div class="checkout-order">
                <!-- process step -->
                <div class="check-step">
                    <ul>
                        <li class="cur"><span>确认地址</span></li>
                        <li class="cur"><span>检查订单</span></li>
                        <li><span>付款</span></li>
                        <li><span>订单信息</span></li>
                    </ul>
                </div>

                <!-- order list -->
                <div class="page-title-normal checkout-title">
                    <h2><span>订单内容</span></h2>
                </div>
                <div class="item-list-wrap confirm-item-list-wrap">
                    <div class="cart-item order-item">
                        <div class="cart-item-head">
                            <ul>
                                <li>商品</li>
                                <li>价格</li>
                                <li>数量</li>
                                <li>小计</li>
                            </ul>
                        </div>
                        <ul class="cart-item-list">
                            <li v-for="item in orderList">
                                <div class="cart-tab-1">
                                    <div class="cart-item-pic">
                                        <img :src="`/static/${item.productImage}`">
                                    </div>
                                    <div class="cart-item-title">
                                        <div class="item-name">{{item.productName}}</div>

                                    </div>
                                </div>
                                <div class="cart-tab-2">
                                    <div class="item-price">￥{{item.salePrice}}</div>
                                </div>
                                <div class="cart-tab-3">
                                    <div class="item-quantity">
                                        <div class="select-self">
                                            <div class="select-self-area">
                                                <span class="select-ipt">×{{item.productNum}}</span>
                                            </div>
                                        </div>
                                        <div class="item-stock item-stock-no">有货</div>
                                    </div>
                                </div>
                                <div class="cart-tab-4">
                                    <div class="item-price-total">￥{{item.productNum*item.salePrice}}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Price count -->
                <div class="price-count-wrap">
                    <div class="price-count">
                        <ul>
                            <li>
                                <span>小计:</span>
                                <span>{{subtotal}}</span>
                            </li>
                            <li>
                                <span>配送费:</span>
                                <span>{{shipping}}</span>
                            </li>
                            <li>
                                <span>折扣:</span>
                                <span>{{discount}}</span>
                            </li>
                            <li>
                                <span>税:</span>
                                <span>{{tax}}</span>
                            </li>
                            <li class="order-total-price">
                                <span>总计:</span>
                                <span>{{orderTotal}}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="order-foot-wrap">
                    <div class="prev-btn-wrap">
                        <router-link to="/address" class="btn btn--m">上一步</router-link>
                    </div>
                    <div class="next-btn-wrap">
                        <button @click="confirmOrder" class="btn btn--m btn--red">确认付款</button>
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
  import NavBread from "@/components/Bread"
  import axios from 'axios'

  export default {
    data() {
      return {
        orderList:[],
        shipping:30
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread
    },
    computed:{
      subtotal(){
        let total=0;
        this.orderList.forEach((item)=>{
          total+=item.salePrice*item.productNum;
        })
        return total;
      },
      tax(){
        return toDecimal(this.subtotal*0.1);
      },
      discount(){
        return toDecimal(this.subtotal*0.2);
      },
      orderTotal(){
        return this.subtotal+this.shipping+this.tax-this.discount;
      }
    },
    mounted(){
      this.getOrder();
    },
    methods:{
      getOrder(){
        axios.get('users/getCart').then((response,err)=>{
          let res=response.data;
          if(res.status===0){
            res.result.list.forEach((item)=>{
              if(item.checked){
                this.orderList.push(item);
              }
            })
          }else{
            console.log(res.msg);
          }
        })
      },
      confirmOrder(){
        let addIndex=this.$route.query.checkIndex;
        axios.post('/users/confirmOrder',{
          addIndex,
          orderTotal:this.orderTotal
        }).then((response,err)=>{
          let res=response.data;
          if(res.status===0){
            this.$router.push({
              path:'/success',
              query:{
                orderId:res.result.orderId
              }
            })
          }
        })
      }
    }
  }

  function toDecimal(x) {
    let f = parseFloat(x);
    if (isNaN(f)) {
      return;
    }
    f = Math.round(x*100)/100;
    return f;
  }
</script>