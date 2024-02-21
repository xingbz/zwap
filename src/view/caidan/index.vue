<template>
  <div>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top"/>
    <van-nav-bar title="今日菜单"/>

    <!--    <van-row :gutter="[10, 10]">-->
    <!--      <van-col span="24">-->
    <van-image
        radius="20"
        :src="imgUrl"
    >
      <template v-slot:loading>
        <van-loading type="spinner" color="#1989fa" size="62" text-size="26" vertical>
          今日菜单加载中...
        </van-loading>
      </template>
    </van-image>
    <!--      </van-col>-->
    <!--    </van-row>-->
  </div>
</template>

<script setup>
import {ref} from 'vue';

const MD5 = require('md5.js')

const imgUrl = ref(getImgUrl())

function getImgUrl() {
  const imgUrl = 'https://mob-it-team.s3.ap-southeast-1.amazonaws.com/ac2458867d05eaad/ae8b77b60f314a33/menu/'
      + new MD5().update(today()).digest('hex')
      + '.jpg'
  // console.log(imgUrl)
  return imgUrl
}

function today() {
  // 获取当前日期对象
  const currentDate = new Date();

  // 提取年、月、日并进行格式化
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // 月份是从0开始计数的，所以需要加1
  const day = ("0" + currentDate.getDate()).slice(-2); // 对于个位数的天数添加前导零

  // 组合成所需格式的字符串
  const today = '' + year + month + day;
  // console.log(today)
  return today
}

</script>

<style scoped>
.content-middle {
  vertical-align: middle;
}
</style>