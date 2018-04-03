<!--eslint-disable -->
<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
          <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price" @click="sortPrice">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" :class="{'filterby-show':filterFlag}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a @click="priceChecked='all'" :class="{'cur':priceChecked=='all'}" href="javascript:void(0)">All</a></dd>
                            <dd v-for="(price,index) in priceRange">
                                <a @click="setPrice(index)" :class="{'cur':priceChecked==index}" href="javascript:void(0)">{{price.start}} - {{price.end}}</a>
                            </dd>                          
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item,index) in goodsList">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="`static/${item.productImage}`" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                                    <img v-if="showLoading" src="../../static/loading-svg/loading-spinning-bubbles.svg">
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" @click="hideFilter" v-show="filterFlag"></div>
        <nav-footer></nav-footer>

        <Modal :mdShow="warnShow">
            <p slot="message">
                请先登录！
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="warnShow=false">关闭</a>
            </div>
        </Modal>
        <Modal :mdShow="cartShow">
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功！</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="cartShow=false">继续购物</a>
                <router-link to="/cart" class="btn btn--m btn--red" href="javascript:;">查看购物车</router-link>
            </div>
        </Modal>
    </div>
</template>

<script>
/* eslint-disable */
import "./../assets/css/base.css"
import "./../assets/css/product.css"
import "./../assets/css/login.css"
import "./../assets/css/checkout.css"
import NavHeader from "@/components/Header"
import NavFooter from "@/components/Footer"
import NavBread from "@/components/Bread"
import Modal from "@/components/Modal"
import axios from "axios"

export default {
  data () {
    return {
      goodsList:[],
      priceRange:[
      {
        "start":0,
        "end":100
      },
      {
        "start":100,
        "end":500
      },
      {
        "start":500,
        "end":1000
      },
      {
        "start":1000,
        "end":5000
      }
      ],
      priceChecked:'all',
      filterFlag:false,
      pageSize:8,            //页面大小
      page:1,                //页码
      sortFlag:1,            //排序标志
      priceGt:0,             //价格区间
      priceLt:10000,
      busy:false,           //是否启用scroll-infinite
      showLoading:false,    //加载动画，
      warnShow:false,       //提示框显示
      cartShow:false
    }
  },
  components:{
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted:function (){
    this.getGoodsList();
  },
  methods:{
    getGoodsList(split){
      let param={//get请求的参数
        pageSize:this.pageSize,
        page:this.page,
        sortFlag:this.sortFlag,
        priceGt:this.priceGt,
        priceLt:this.priceLt
      };
      this.showLoading=true;//启用加载svg动画
      axios.get("/goods",{
          params:param
      }).then(response =>{
        let res=response.data;
        if(res.status===0){
          if(split){//split==true，需要滚动追加页数
            this.goodsList=this.goodsList.concat(res.result.list);
            if(res.result.count===0){//返回0条数据，禁用滚动
              this.busy=true;
            }else{
              this.busy = false;
            }
          }else{
            this.goodsList=res.result.list;
          }
        }else{
          console.log("从服务器请求数据失败！");
        }
      });
      this.showLoading=false;
    },
    //按价格排序
    sortPrice(){
      this.sortFlag=this.sortFlag===1?-1:1;
      this.page=1;
      this.getGoodsList();
    },
    //按价格区间筛选
    setPrice(index){
      this.priceChecked=index;
      this.filterFlag=false;
      this.page=1;//注意将页面号归1
      if (this.priceChecked=='all'){
        this.priceGt=0;
        this.priceLt=10000;
      }else{
        this.priceGt=this.priceRange[index].start;
        this.priceLt=this.priceRange[index].end;
      }
      this.getGoodsList();
    },
    showFilter(){
      this.filterFlag=true;
    },
    hideFilter(){
      this.filterFlag=false;
    },
    //滚动加载插件
    loadMore(){
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 1000);
    },
    //加入购物车
    addCart(productId){
      axios.post('./users/addCart',{
        userId:"100000077",
        productId:productId
      }).then((response)=>{
        let res=response.data;
        if(res.status===0){
          this.cartShow=true;
        }else{
          this.warnShow=true;
        }
      });
    }
  }
}
</script>
