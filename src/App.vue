<template>
  <div id="app">
    <router-view />
    <van-tabbar route :v-model="0">
      <van-tabbar-item icon="video-o" to="dy"/>
      <van-tabbar-item icon="desktop-o" to="jsq"/>
<!--      <van-tabbar-item icon="friends-o">标签</van-tabbar-item>-->
<!--      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>-->
    </van-tabbar>
  </div>
</template>

<style>
body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
}
</style>
