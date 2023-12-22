<template>
  <div>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top"/>
    <van-nav-bar title="计算器"/>

    <van-row :gutter="[10, 10]">
      <van-col span="4">公式</van-col>
      <van-col span="20">帮助</van-col>
      <van-col span="24">
        <van-field v-model="formula" placeholder="在此处输入计算的公式" clearable
                   @update:model-value="compute(false)"
                   @keyup.enter="compute(true)"/>
      </van-col>
      <van-col span="4">结果</van-col>
      <van-col span="20">
        <van-button plain hairline type="primary" size="mini" class="content-middle" @click="copyResult(result)">
          复制
        </van-button>
      </van-col>
      <van-col span="24" class="content-middle">
        <van-field v-model="result" readonly/>
      </van-col>
      <van-col span="4">历史</van-col>
      <van-col span="20">
        <van-button plain hairline type="danger" size="mini" class="content-middle" @click="clearHistory">清除
        </van-button>
      </van-col>
<!--      <van-col span="2">-->
<!--        <van-popover v-model:show="showCopyHelp" placement="top">-->
<!--          阿斯顿发送到-->
<!--          <template #reference>-->
<!--            <van-icon name="question-o" class="content-middle" @click="showCopyHelp = true"/>-->
<!--          </template>-->
<!--        </van-popover>-->
<!--      </van-col>-->
      <van-col span="24">
        <van-list>
          <van-cell v-for="item in history" :title="item.expression" @click="copyResult(item.expression)"/>
        </van-list>
      </van-col>
    </van-row>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {evaluate} from 'mathjs'
import copy from 'copy-to-clipboard'
import {showSuccessToast} from 'vant';

const formula = ref('')
const result = ref('')
const history = ref([])
// const showCopyHelp = ref(true)

function copyResult(text) {
  copy(text)
  showSuccessToast('复制成功')
}

function compute(save) {
  result.value = evaluate(formula.value)

  if (save) {
    history.value.push({
      formula: formula.value,
      result: result.value,
      expression: formula.value + "=" + result.value
    })
  }
}

function clearHistory() {
  history.value = []
}

</script>

<style scoped>
.content-middle {
  vertical-align: middle;
}
</style>