<template>
  <div>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top"/>
    <van-nav-bar title="北京菜单"/>
    <van-loading v-if="loading" class="content-middle" size="62" text-size="26" vertical>菜单加载中...</van-loading>
    <van-swipe v-if="!loading" :initial-swipe="todayIndex" :loop="false">
      <van-swipe-item v-for="(url, index) in imgUrlList" :key="index">
        <van-image
            radius="20"
            :src="url"
        />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';

const MD5 = require('md5.js')

const loading = ref(true);

const imgUrlList = ref([])

// 定义当前轮播项索引，初始为 5（因为过去 5 天，今天是第 6 项）
const todayIndex = ref(5);

/**
 * 获取指定天数偏移后的日期，并格式化为 YYYYMMDD 格式
 * @param {number} offsetDays - 偏移的天数，正数表示未来日期，负数表示过去日期
 * @returns {string} 格式化后的日期字符串
 */
function getDateWithOffset(offsetDays = 0) {
  // 获取当前日期对象
  const currentDate = new Date();
  // 根据偏移天数调整日期
  currentDate.setDate(currentDate.getDate() + offsetDays);

  // 提取年、月、日并进行格式化
  const year = currentDate.getFullYear();
  // 月份是从 0 开始计数的，所以需要加 1，同时补零
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  // 对日期补零
  const day = String(currentDate.getDate()).padStart(2, '0');

  // 组合成所需格式的字符串
  return `${year}${month}${day}`;
}


function getImgUrl(offsetDays = 0) {
  const imgUrl = 'https://mob-it-team.s3.ap-southeast-1.amazonaws.com/ac2458867d05eaad/ae8b77b60f314a33/menu/'
      + new MD5().update(getDateWithOffset(offsetDays)).digest('hex')
      + '.jpg'
  // console.log(imgUrl)
  return imgUrl
}

/**
 * 判断图片 URL 是否存在，存在则返回该 URL，否则返回 null
 * @param {string} url - 图片的 URL
 * @returns {Promise<string|null>} - 一个 Promise，解析为图片 URL 或 null
 */
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

const defDayNum = 6;
async function loadImgList() {
  const promises = [];
  // 生成所有图片 URL 检查的 Promise
  for (let i = -defDayNum; i <= defDayNum; i++) {
    const imgUrl = getImgUrl(i);
    promises.push(checkImageExists(imgUrl));
  }
  // 等待所有 Promise 完成
  const results = await Promise.all(promises);
  for (let i = 0; i < results.length; i++) {
    const url = results[i];
    if (url) {
      // console.log(getDateWithOffset(i) + ": " + url);
      imgUrlList.value.push(url);
    }
  }

  // 重新计算当前轮播项索引, 查找url等于当前日期的索引
  todayIndex.value = imgUrlList.value.findIndex(url => url === getImgUrl())
  loading.value = false;
}

onMounted(() => {
  loadImgList();
});
</script>

<style scoped>
.content-middle {
  vertical-align: middle;
}
</style>