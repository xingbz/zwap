<template>
  <div>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top" />
    <van-nav-bar title="计算器" />

    <van-row :gutter="[10, 10]">
      <van-col span="4">公式</van-col>
      <van-col span="20">
        <span @click="showHelperDialog()" style="cursor: pointer">帮助</span>
        <!-- <van-button plain hairline type="primary" size="mini" class="content-middle" @click="copyResult(result)">
          帮助
        </van-button> -->
      </van-col>
      <van-col span="24">
        <van-field v-model="formula" placeholder="在此处输入计算的公式" clearable @update:model-value="compute(false)"
          @keyup.enter="compute(true)" />
      </van-col>
      <van-col span="2">结果</van-col>
      <van-col span="2">
        <van-button plain hairline type="warning" size="mini" class="content-middle" @click="formula = result">
          回填
        </van-button>
      </van-col>
      <van-col span="20">
        <van-button plain hairline type="primary" size="mini" class="content-middle" @click="copyResult(result)">
          复制
        </van-button>
      </van-col>
      <van-col span="24" class="content-middle">
        <van-field v-model="result" readonly />
      </van-col>
      <van-col span="4">历史</van-col>
      <van-col span="20">
        <van-button plain hairline type="danger" size="mini" class="content-middle" @click="clearHistory">清除
        </van-button>
      </van-col>
      <!-- <van-col span="2">
        <van-popover v-model:show="showCopyHelp" placement="top">
          阿斯顿发送到
          <template #reference>
            <van-icon name="question-o" class="content-middle" @click="showCopyHelp = true" />
          </template>
</van-popover>
</van-col> -->
      <van-col span="24">
        <van-list>
          <van-cell v-for="(item, index) in history" :title="item.expression">
            <template #right-icon>
              <van-button plain hairline type="warning" size="mini" @click="formula = item.result">回填</van-button>
              <van-button plain hairline type="primary" size="mini" @click="copyResult(item.expression)"
                style="margin-left: 8px;">复制</van-button>
              <van-button plain hairline type="danger" size="mini" @click="removeHistoryItem(index)"
                style="margin-left: 8px;">清除</van-button>
            </template>
          </van-cell>
        </van-list>
      </van-col>
    </van-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { evaluate } from 'mathjs'
import copy from 'copy-to-clipboard'
import { showDialog, showSuccessToast } from 'vant';

const formula = ref('')
const result = ref('')
const history = ref([])

function showHelperDialog() {
  showDialog({
    message: '1. 可输入任意数字+公式计算, 支持常见函数 eg: 1+1\n'
      + '2. 复制结果直接复制计算的最终结果 eg: 2'
      + '\n3.复制历史会复制公式和结果 eg: 1+1=2',
  }).then(() => {
    // on close
  });
}

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

function removeHistoryItem(index) {
  history.value.splice(index, 1);
}

</script>

<style scoped>
.content-middle {
  vertical-align: middle;
}
</style>