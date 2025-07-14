<template>
  <div class="page-container">
    <div class="van-safe-area-top"/>
    <van-nav-bar title="北京菜单"/>
    <van-loading v-if="loading" class="content-middle" size="62" text-size="26" vertical>菜单加载中...</van-loading>
    
    <!-- 添加可滚动容器 -->
    <div class="scroll-container" v-if="!loading">
      <van-swipe :initial-swipe="todayIndex" :loop="false">
        <van-swipe-item v-for="(url, index) in imgUrlList" :key="index">
          <div class="image-wrapper">
            <van-image 
              @dragstart.prevent
              radius="20"
              :src="url"
              fit="contain"
              class="responsive-image"
            />
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup>
// 从 Vue 中导入 ref 和 onMounted 函数
// ref 用于创建响应式数据
// onMounted 用于在组件挂载后执行回调函数
import { ref, onMounted } from 'vue';

// 引入 md5.js 库，用于计算日期的 MD5 哈希值
const MD5 = require('md5.js')

// 定义加载状态的响应式变量，初始值为 true，表示正在加载
const loading = ref(true);

// 定义图片 URL 列表的响应式变量，初始为空数组
const imgUrlList = ref([])

// 定义当前轮播项索引的响应式变量，初始为 5（因为过去 5 天，今天是第 6 项）
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

/**
 * 根据日期偏移量生成对应的图片 URL
 * @param {number} offsetDays - 日期偏移量，默认值为 0 表示当前日期
 * @returns {string} 生成的图片 URL
 */
function getImgUrl(offsetDays = 0) {
  // 拼接基础 URL、日期的 MD5 哈希值和文件扩展名，生成完整的图片 URL
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
    // 创建一个 Image 对象
    const img = new Image();
    // 图片加载成功时，解析 Promise 并返回图片 URL
    img.onload = () => resolve(url);
    // 图片加载失败时，解析 Promise 并返回 null
    img.onerror = () => resolve(null);
    // 设置图片的源 URL，触发图片加载
    img.src = url;
  });
}

// 定义日期偏移量的默认值，用于获取前后各 6 天的图片
const defDayNum = 6;

/**
 * 加载图片列表，检查指定日期范围内的图片是否存在，并更新图片列表和当前轮播项索引
 */
async function loadImgList() {
  // 用于存储所有图片 URL 检查的 Promise
  const promises = [];
  // 生成所有图片 URL 检查的 Promise
  for (let i = -defDayNum; i <= defDayNum; i++) {
    const imgUrl = getImgUrl(i);
    promises.push(checkImageExists(imgUrl));
  }
  // 等待所有 Promise 完成，获取所有图片检查的结果
  const results = await Promise.all(promises);
  // 遍历检查结果，将存在的图片 URL 添加到 imgUrlList 中
  for (let i = 0; i < results.length; i++) {
    const url = results[i];
    if (url) {
      // console.log(getDateWithOffset(i) + ": " + url);
      imgUrlList.value.push(url);
    }
  }

  // 重新计算当前轮播项索引，查找 URL 等于当前日期对应图片的索引
  todayIndex.value = imgUrlList.value.findIndex(url => url === getImgUrl())
  // 所有图片加载检查完成，将加载状态设置为 false
  loading.value = false;
}

// 在组件挂载后调用 loadImgList 函数，开始加载图片列表
onMounted(() => {
  loadImgList();
});
</script>

<style scoped>
/* 页面容器 */
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 加载提示 */
.content-middle {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 可滚动区域 */
.scroll-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

/* 图片容器 */
.image-wrapper {
  display: flex;
  justify-content: center;
  min-height: 100%;
}

/* 响应式图片 */
.responsive-image {
  max-width: 100%;
  max-height: calc(100vh - 160px); /* 减去导航栏和边距 */
  object-fit: contain;
}
</style>