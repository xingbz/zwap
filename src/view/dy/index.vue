<template>
  <div>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top"/>
    <van-nav-bar title="视频去水印解析在线工具"/>
    <van-row gutter="[20, 20]" justify="space-around">
      <van-col span="24">
        <!-- 可以使用 CellGroup 作为容器 -->
        <!--        <van-cell-group inset>-->
        <van-field v-model="link" label="链接" placeholder="请输入作品链接"/>
        <!--        </van-cell-group>-->
        <van-divider/>
      </van-col>
      <van-button type="primary" :loading="loading" @click="analysis">解析</van-button>
    </van-row>

    <van-divider dashed
                 :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      解析内容
    </van-divider>

    <van-cell-group v-if="result.url" inset>
      <van-cell title="视频标题" :label="result.title"/>
      <van-cell title="视频地址">
        <template #value>
          <van-button type="primary" class="content-middle" size="mini" v-if="result.url" @click="openUrl(result.url)">
            下载
          </van-button>
        </template>
      </van-cell>
      <van-cell>
        <div class="van-multi-ellipsis--l2">
          {{ result.url }}
        </div>
      </van-cell>
      <van-cell title="视频封面">
        <template #value>
          <van-button type="primary" class="content-middle" size="mini" v-if="result.cover"
                      @click="openUrl(result.cover)">下载
          </van-button>
        </template>
      </van-cell>
      <van-cell>
        <div class="van-multi-ellipsis--l2">
          {{ result.cover }}
        </div>
      </van-cell>
      <van-cell title="音乐地址">
        <template #value>
          <van-button type="primary" class="content-middle" size="mini" v-if="result.music?.url"
                      @click="openUrl(result.music?.url)">下载
          </van-button>
        </template>
      </van-cell>
      <van-cell>
        <div class="van-multi-ellipsis--l2">
          {{ result.music?.url }}
        </div>
      </van-cell>
      <van-cell title="作者" :label="result.author"/>
    </van-cell-group>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import {showFailToast} from "vant";
import {showDialog} from 'vant';
import {Cell, CellGroup} from 'vant';

import axios from "axios";

const link = ref('')
const loading = ref(false)
const result = ref({})

function analysis() {
  console.log("analysis, link: " + link.value)
  const url = searchVideoUrl(link.value)
  result.value = {}
  if (!url) {
    return showFailToast({
      message: '请输入链接',
      position: 'top',
      icon: 'warning',
    });
  }
  loading.value = true

  axios.get('https://api.mu-jie.cc/douyin?url=' + url).then(res => {
    const data = res.data
    loading.value = false
    if (data.code === -1) {
      return showFailToast(data.msg)
    }

    result.value = data.data
    // if (data.code === 200 && data.data) {
    //   // showFailToast(data.data.url)
    //   showDialog({
    //     title: '解析成功',
    //     message: data.data.title,
    //   }).then(() => {
    //     console.log(data.data.url)
    //     window.open(data.data.url, '_blank', 'noopener=yes,noreferrer=yes');

    // axios({
    //   url: data.data.url,
    //   method: 'GET',
    //   responseType: 'blob',
    //   noReferrer: true,
    //   noOpener: true
    // }).then(response => {
    //   const url = window.URL.createObjectURL(new Blob([response.data])); // 创建一个下载链接
    //   const link = document.createElement('a'); // 创建一个a标签
    //   link.href = url; // 设置a标签的href属性为下载链接
    //   link.setAttribute('download', 'file.txt'); // 设置a标签的download属性为文件名，以便浏览器将其保存为本地文件
    //   document.body.appendChild(link); // 将a标签添加到DOM中
    //   link.click(); // 模拟点击链接以开始下载
    //   document.body.removeChild(link); // 下载完成后移除a标签
    // }).catch(error => {
    //   return showFailToast({
    //     message: '下载失败',
    //     position: 'top',
    //     icon: 'warning',
    //   });
    // })
    // on confirm
    // }
    // )
    // }
  }).catch(error => {
    showFailToast('解析失败, 请确认抖音链接是否正确')
  })
}

function searchVideoUrl(text) {
  try {
    return text.match(/https:\/\/v.douyin.com\/\w+\//)[0]
  } catch (e) {
    return null
  }
}

function openUrl(url) {
  window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
}

</script>
<style lang="less">
.user {
  &-poster {
    width: 100%;
    height: 53vw;
    display: block;
  }

  &-group {
    margin-bottom: 15px;
  }

  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;

    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.content-middle {
  vertical-align: middle;
}
</style>