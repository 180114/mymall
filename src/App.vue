<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <MaintabBar></MaintabBar>
  </div>
</template>

<script>
import MaintabBar from 'components/content/mainTabbar/MainTabBar'
export default {
  name: 'App',
  components: {
   MaintabBar
  }
}
</script>

<style>
 @import "assets/css/base.css";

</style>
