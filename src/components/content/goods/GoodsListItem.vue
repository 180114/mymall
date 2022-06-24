<template>
  <div class="goods-list-item" @click="itemClick">
          <img :src="showImage" alt="" @load="imgLoad">
      <div class="goods-info">
          <p>{{goodsItem.title}}</p>
          <span class="price">￥{{goodsItem.price}}</span>
          <span class="collect">收藏:{{goodsItem.cfav}}</span>
      </div>
  </div>
</template>

<script>
export default {
    name:'GoodsListItem',
    props:{
        goodsItem:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    methods: {
        imgLoad(){
            this.$bus.$emit('imgLoad')
        },
        itemClick(){
            this.$router.push('/detail/' + this.goodsItem.iid)
        }
    },
    computed:{
        showImage(){
            return this.goodsItem.image || this.goodsItem.show.img
        }
    }
}
</script>

<style scoped>
    .goods-list-item{
        padding-bottom: 40px;
        position: relative;
        width: 48%;
    }
    .goods-list-item img{
        width: 100%;
        border-radius: 5px;
    }
    .goods-info{
        font-size: 12px;
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        overflow: hidden;
        text-align: center;
    }
    .goods-info p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 3px;
        text-align: center;
    }
    .goods-info .price {
        color:var(--color-high-text);
        /* margin-right: 20px; */
    }
    .goods-info .collect {
        position: relative;
    }
    .goods-info .collect{
       margin-left: 10px;
    }
</style>