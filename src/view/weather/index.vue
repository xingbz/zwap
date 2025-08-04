<template>
  <div class="page-container">
    <div class="van-safe-area-top" />
    <van-nav-bar title="天气预报" />
    <!-- <div>selectedCityIdList: {{ selectedCityIdList }}</div> -->
    <!-- <div>selectedCityMap: {{ selectedCityMap }}</div> -->
    <div>
      <van-cell icon="location-o">
        <template #title>
          <span @click="showCityPopupFlag = true" class="custom-title">城市管理</span>
        </template>
        <template #right-icon>
          <van-button plain type="primary" size="small" @click="onQueryWeather">查询</van-button>
        </template>
      </van-cell>
      <van-cell>
        <!-- <van-dropdown-menu>
          <van-dropdown-item v-model="highlightKeywords" :options="CONST.highlightOptions" />
          <van-dropdown-item v-model="overlookKeywords" :options="CONST.overlookOptions" />
        </van-dropdown-menu> -->
      </van-cell>
    </div>

    <!-- 表格头部 -->
    <van-sticky>
      <van-grid :column-num="selectedCityIdList.length + 1">
        <van-grid-item>
          <div style="font-weight: bold;">
            <van-highlight :keywords="'日期'" :source-string="'日期'" />
          </div>
        </van-grid-item>
        <van-grid-item v-for="selectedCityId in selectedCityIdList">
          <van-cell>
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <div style="text-align: center; cursor: pointer; font-weight: bold;" title="点击跳转详情">
                <van-highlight @click="goToCityWeb(selectedCityId)" :keywords="selectedCityMap[selectedCityId]?.name"
                  :source-string="selectedCityMap[selectedCityId]?.name" />
              </div>
            </template>
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
              <van-badge @click="removeCity(selectedCityId)">
                <div class="child" />
                <template #content>
                  <van-icon name="cross" />
                </template>
              </van-badge>
            </template>
          </van-cell>
        </van-grid-item>
      </van-grid>
    </van-sticky>

    <van-loading v-if="loading" class="content-middle" size="62" text-size="26" vertical>查询中...</van-loading>
    <!-- 表格内容区域 -->
    <div class="weather-content-scroll" v-if="!loading">
      <van-grid :column-num="selectedCityIdList.length + 1" v-for="dateItems in getWeatherDataByDate">
        <!-- 第一列, 取二维数组的第一个元素的日期(每个元素日期一样) -->
        <van-grid-item>{{ dateItems[0].fxDate }}</van-grid-item>

        <!-- 第2-N列, 每个城市的天气数据 -->
        <van-grid-item v-for="cityItem in dateItems">
          <div v-if="cityItem">
            <van-row justify="center" align="center">
              <van-col span="24" class="col-border">
                <!-- 预报白天天气状况的图标代码 -->
                <i :class="`qi-${cityItem.iconDay}`" class="qi-font-size" />&nbsp;
                <!-- 预报白天天气状况文字描述，包括阴晴雨雪等天气状态的描述 -->
                <van-highlight :keywords="highlightKeywords" highlight-class="highlight-class"
                  :source-string="cityItem.textDay + (cityItem.textNight && cityItem.textNight !== cityItem.textDay ? '转&nbsp;' + cityItem.textNight : '')" />
                &nbsp;
              </van-col>
              <!-- <van-col span="2">
                <van-icon name="info-o" />
              </van-col> -->
              <van-col span="24" class="col-border">
                <!-- 预报当天最低温度 ~ 预报当天最高温度 -->
                气温: {{ cityItem.tempMin }}°C~{{ cityItem.tempMax }}°C
              </van-col>
            </van-row>
          </div>
          <div v-else>
            -
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </div>

  <van-popup v-model:show="showCityPopupFlag" position="left"
    :style="{ width: '90%', height: '100%', padding: '64px' }">
    <van-search v-model="param" @search="onQueryCity" show-action placeholder="请输入城市名称, 支持模糊搜索">
      <template #action>
        <div @click="onQueryCity">搜索</div>
      </template>
    </van-search>

    <van-cell-group>
      <van-checkbox-group v-model="selectedCityIdList" shape="square" @change="onChangeSelectedCity">
        <van-space direction="vertical" fill>
          <van-checkbox v-for="item in queryCityList" :name="item.id">{{ item.name + '(' + item.adm1 + "-" +  item.adm2 + ')' }}</van-checkbox>
        </van-space>
      </van-checkbox-group>
    </van-cell-group>

  </van-popup>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { showFailToast } from "vant"
import { CONST, INIT_DATA, API } from "@/util/constant/weather_constants";

const showCityPopupFlag = ref(false); // 是否展示城市弹窗
const param = ref('') // 城市搜索参数
const queryCityList = ref([]); // 城市搜索结果列表
const selectedCityIdList = ref([]); // 选中城市ID列表
const selectedCityMap = ref({}); // 选中城市ID和对象的映射关系
const loading = ref(false); // 城市天气数据加载状态
const weatherMap = ref({}); // 城市天气数据映射关系, key: 城市ID, value: 城市天气数据列表

const highlightKeywords = ref(['雨', '雪', '雷', '雹'])
const overlookKeywords = ref('')

/**
 * 计算属性，按日期组织天气数据
 * 返回的数据是一个二维数组
 * 其中第一级是每个日期的所有城市天气
 * 第二级是单个日期下每个城市的天气
 */
const getWeatherDataByDate = computed(() => {
  const result = [];
  // console.log(selectCityList.value)

  // 如果没有城市，直接返回空数组
  if (selectedCityIdList.value.length === 0) return result;

  // 以第一个城市的天气数据的日期作为基准
  const firstCityId = selectedCityIdList.value[0];
  const firstCityWeather = weatherMap.value[firstCityId] || [];

  // 遍历日期(以第一个城市的为参照)
  for (let i = 0; i < firstCityWeather.length; i++) {
    const dateData = [];
    // 遍历城市
    for (let j = 0; j < selectedCityIdList.value.length; j++) {
      const cityId = selectedCityIdList.value[j];
      const cityWeather = weatherMap.value[cityId] || [];
      if (cityWeather[i]) {
        dateData.push(cityWeather[i]);
      } else {
        dateData.push(null);
      }
    }
    result.push(dateData);
  }
  return result;
});

/**
 * 查询城市
 */
function onQueryCity() {
  if (!param.value) {
    return showFailToast('请输入城市')
  }

  API.get('?path=' + CONST.WEATHER_URL + 'geo/v2/city/lookup?location=' + param.value + '&number=20&lang=zh').then(res => {
    const data = res.data.data
    if (data.code === -1) {
      return showFailToast(data.msg)
    }
    queryCityList.value = data.location
  }).catch(error => {
    console.error('请求失败:', error);
  })
}

/**
 * 选中城市改变
 */
function onChangeSelectedCity(selectedCityIdList) {
  // console.log(selectedCityIdList)
  selectedCityIdList.forEach(selectedCityId => {
    // console.log(selectedCityId, queryCityList.value.find(city => city.id === selectedCityId))
    // 仅当 selectedCityMap 中没有该 ID 且能在 queryCityList 中找到对应城市时才更新映射
    if (!selectedCityMap.value[selectedCityId]) {
      selectedCityMap.value[selectedCityId] = queryCityList.value.find(city => city.id === selectedCityId);
    }
  })
}

/**
 * 查询天气
 */
function onQueryWeather() {
  if (selectedCityIdList.value.length === 0) {
    return showFailToast('请选择城市')
  }

  weatherMap.value = {}
  loading.value = true

  selectedCityIdList.value.forEach(selectedCityId => {
    API.get('?path=' + CONST.WEATHER_URL + 'v7/weather/30d?location=' + selectedCityId).then(res => {
      const data = res.data.data
      if (data.code === -1) {
        return showFailToast(data.msg)
      }
      weatherMap.value[selectedCityId] = data.daily
      loading.value = false
      // 将 fxLink 放到 selectedCityMap 对应的 value 里
      if (selectedCityMap.value[selectedCityId]) {
        selectedCityMap.value[selectedCityId].fxLink = data.fxLink;
      }
    }).catch(error => {
      console.error('请求失败:', error);
    })
  })
}

function goToCityWeb(cityId) {
  const city = selectedCityMap.value[cityId];
  if (city && city.fxLink) {
    window.open(city.fxLink, '_blank');
  }
}

/**
 * 移除城市
 */
function removeCity(cityId) {
  selectedCityIdList.value = selectedCityIdList.value.filter(item => item !== cityId);
  selectedCityMap.value[cityId] = null;
}

function initData() {
  selectedCityIdList.value = INIT_DATA.selectedCityIdList
  selectedCityMap.value = INIT_DATA.selectedCityMap
  queryCityList.value = INIT_DATA.queryCityList
}
onMounted(() => initData())
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

.table-header {
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 10px 0;
  text-align: center;
}

.table-row {
  padding: 10px 0;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.weather-content-scroll {
  padding-bottom: 50px;
  /* 设置底部内边距，避免内容被全局导航栏挡住 */
}

.qi-font-size {
  font-size: 36px;
  text-align: center;
}

.highlight-class {
  color: red;
  font-weight: bold;
}
</style>