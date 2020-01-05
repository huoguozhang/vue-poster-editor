<template>
  <div>
    <el-tooltip
      :key="item.icon"
      v-for="item in iconList"
      effect="dark"
      :content="item.label"
      placement="top-start">
      <Icon
        :active="(item.dir === 'x' && item.value === align.x) || (item.dir === 'y' && item.value === align.y)"
        @click.native="handleClick(item)" :icon="item.icon"></Icon>
    </el-tooltip>
  </div>
</template>
<script>
import _ from 'lodash'
import Icon from './icon'
export default {
  components: {
    Icon
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      align: {
        x: 2,
        y: 2
      },
      iconList: [
        {
          icon: 'zuoduiqi2',
          label: '左对齐',
          value: 1,
          dir: 'x'
        },
        {
          icon: 'shuipingjuzhongduiqi',
          label: '水平居中对齐',
          value: 2,
          dir: 'x'
        },
        {
          icon: 'youduiqi',
          label: '右对齐',
          value: 3,
          dir: 'x'
        },
        {
          icon: 'shangduiqi',
          label: '上对齐',
          value: 1,
          dir: 'y'
        },
        {
          icon: 'chuizhijuzhongduiqi',
          label: '垂直居中对齐',
          value: 2,
          dir: 'y'
        },
        {
          icon: 'xiaduiqi',
          label: '下对齐',
          value: 3,
          dir: 'y'
        }
      ]
    }
  },
  methods: {
    handleClick (item) {
      this.align[item.dir] = item.value
      this.$emit('input', this.align)
    }
  },
  created () {
    this.align = { ...this.value }
  },
  watch: {
    value (val) {
      if (!_.isEqual(val, this.align)) {
        this.align = { ...val }
      }
    }
  }
}
</script>
<style lang="scss">
</style>
