<template>
  <div id="detail">
   <detail-nav-bar class="detail-bar" ref="nav"  @titleClick="titleClick"/>
   <scroll class="content" 
           ref="scroll"
          @scroll="contentScroll" 
          :probe-type="3">
    <detail-swiper :top-images="topImages"></detail-swiper>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
    <detail-param-info ref="params" :param-info="paramInfo"/>
    <detail-comment-info ref="comment" :comment-info="commentInfo"/>
    <goods-list ref="reccommend" :goods="recommends"/>
   </scroll>
   <back-top @click.native="backClick" v-show="showIcon"/>
   <detail-bottom-bar @addToCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  
  import {imgListenerMinxin}from '../../common/mymixins'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'
  


  import { getDetail, Goods, Shop, GoodsParam, getRecommend} from '../../network/detail'
  import debounce from '../../common/utils'
  export default {
		name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop,
      Scroll
    },
    mixins:[imgListenerMinxin],
    data(){
      return{
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopY:[],
        getThemeTopY: null,
        currentIndex: 0,
        showIcon: false
        
      }
    },
    created() {
      this.iid = this.$route.params.iid

      getDetail(this.iid).then(res => {
        // 获取顶部轮播图数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages
        // 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns,data.shopInfo.services)
        // 创建店铺信息对象
        this.shop = new Shop(data.shopInfo)
        // 保存商品详情数据
        this.detailInfo = data.detailInfo
        // 创新参数信息对象
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 获取评论信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        //获取推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
        })
        // 给getThemeTopY赋值
        // 防抖提高性能
        this.getThemeTopY = debounce (() => {
          this.themeTopY = []
          this.themeTopY.push(0)
          this.themeTopY.push(this.$refs.params.$el.offsetTop)
          this.themeTopY.push(this.$refs.comment.$el.offsetTop)
          this.themeTopY.push(this.$refs.reccommend.$el.offsetTop)
          // 添加这个数值是为了方便后面做判断
          this.themeTopY.push(Number.MAX_VALUE)
        })
      })
    },
    mounted() {
      
    },
    methods: {
      imageLoad(){
        // 
        this.$refs.scroll.refresh()
        // 调用返回的防抖函数
        this.getThemeTopY()
        
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0, -this.themeTopY[index], 100)
      },
      // 下拉对应导航栏位置
      contentScroll(position){
        // 1.判断backTop是否显示
        this.showIcon = -position.y > 1000
        // 获取y的值
          const positionY = -position.y
          // 判断做对比
          let length = this.themeTopY.length
          for(let i = 0; i < length - 1; i++){
            if(this.currentIndex !== i && (positionY >= this.themeTopY[i] && positionY < this.themeTopY[i + 1])){
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
            }
          }
      },
         // 回到顶部
      backClick(){
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      // 保存商品信息
      addToCart() {
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.nowPrice
        product.iid = this.iid     
         // 将商品添加到购物车
         this.$store.dispatch('addCart', product);
         
      }

    },
   
	}
</script>

<style scoped>
 #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .detail-bar {
    position: relative;
     z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
    /* overflow: hidden; */
  }
</style>
