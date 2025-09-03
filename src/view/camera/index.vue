<template>
  <div class="page-container">
    <div class="van-safe-area-top" />
    <van-nav-bar title="拍照监控" />

    <van-cell-group inset>
      <van-field v-model="to_user" center clearable label="客户端" placeholder="请输入主机名"></van-field>
      <van-field v-model="code" center clearable label="秘钥" placeholder="请输入秘钥">
        <template #button>
          <van-button size="small" type="primary" @click="takePhoto">拍照</van-button>

        </template>
      </van-field>
    </van-cell-group>

    <van-loading v-if="loading" class="content-middle" size="62" text-size="26" vertical>加载中...</van-loading>

    <van-image v-if="!loading" radius="10" :src="photo_url" fit="contain" class="responsive-image" />

    <!-- 添加可滚动容器 -->
    <!-- <div class="scroll-container" v-if="!loading">
      <van-swipe :initial-swipe="todayIndex" :loop="false">
        <van-swipe-item v-for="(url, index) in imgUrlList" :key="index">
          <div class="image-wrapper">
            
          </div>
        </van-swipe-item>
      </van-swipe>
    </div> -->
  </div>
</template>

<script setup>
// 从 Vue 中导入 ref 和 onMounted 函数
// ref 用于创建响应式数据
// onMounted 用于在组件挂载后执行回调函数
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { showFailToast } from "vant"
import axios from "axios"
import { CONST, INIT_DATA } from "@/util/constant/quicker_constants";

const to_user = useStorage('zwap_camera_to_user', INIT_DATA.to_user)
const code = useStorage('zwap_camera_code', INIT_DATA.code)

const loading = ref(false)
// 定义图片 URL 列表的响应式变量，初始为空数组
const photo_url = ref('')

// 拍照
function takePhoto() {
  loading.value = true
  axios.post(CONST.url, {
    "toUser": to_user.value,
    "code": code.value,
    "operation": "action",
    "data": "2",
    "action": CONST.action.camera,
    "wait": true,
    "maxWaitMs": 5000
  }).then(res => {
    // console.log(res)
    loading.value = false
    const data = res.data
    if (data && data.isSuccess) {
      photo_url.value = data.devices?.XBZ
    } else {
      return showFailToast(data?.errorMessage)
    }
  })

}
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

/* 响应式图片 */
.responsive-image {
  max-width: 100%;
  max-height: calc(100vh - 160px);
  /* 减去导航栏和边距 */
  object-fit: contain;
}
</style>