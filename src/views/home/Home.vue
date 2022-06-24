<template>
  <div id="home">
    <nav-bar class="nav-bar"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                 @tabClick="tabClick" 
                 ref="tabControl1" 
                 v-show="isTabFixed"
                 class="tab-control"/>
    <scroll class="content" 
            ref="scroll"
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                  ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="showIcon"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  // import debounce from '../../common/utils'

  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'

   import {imgListenerMinxin}from '../../common/mymixins'

  import {
    getHomeMultidata,
    getHomeGoods
  } from 'network/home'
  export default {
		name: "Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      Scroll,
      TabControl,
      GoodsList,
      BackTop
    },
    mixins:[imgListenerMinxin],
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page: 0, list:[]},
          'new':{ page: 0,list:[]},
          'sell':{page: 0,list:[]}
        },
        currentType: 'pop',
        showIcon: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        scrollY:0
        
      }
    },
    
    created() {
      // 请求多个数据
     this.getHomeMultidata()
      // 请求商品数据
     this.getHomeGoods('pop')
     this.getHomeGoods('new')
     this.getHomeGoods('sell')
   
    
    },
    mounted() {
       //  监听图片加载完成
      // const refresh = debounce(this.$refs.scroll.refresh, 200)

      // // 对监听事件尽心保存
      // this.imgListener = () => {
      //   refresh()
      // }
      // this.$bus.$on('imgLoad', this.imgListener)
    
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.scrollY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存Y值
      this.scrollY = this.$refs.scroll.getScrollY()

      // 取消全局事件的监听
      this.$bus.$off('imgLoad',this.imgListener)
    },
    methods: {
       /**
       * 事件监听相关方法
       * 
       */
      // 防抖函数
      
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // 回到顶部
      backClick(){
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      // 监听滚动
      contentScroll(position){
        // 1.判断backTop是否显示
        this.showIcon = -position.y > 1000
        // 2.决定tabControl 是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      // 上拉加载更多
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      // 监听轮播图
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       * 网络请求相关方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res =>{
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 调用bscroll的finishpullup方法才能进行下一次请求
          this.$refs.scroll.finishPullUp()
        })
      }
    }
	}
</script>

<style scoped>
  #home {
    position: relative;
    height: 100vh;
    /* padding-top: 44px; */
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10; */
  }
  
  .tab-control{
    position: relative;
    background-color: #fff;
    z-index: 9;
  }
  .content{
    /* height: calc(100% - 93px);
    margin-top: 44px; */
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
