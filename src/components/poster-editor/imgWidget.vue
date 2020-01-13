<template>
  <img
    :style="{
      transform: `scale(${needScale ? dZoom : 1})`
    }"
    class="img-widget-ct"
    :src="value"/>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    // 解决chrome字体无法更小的问题
    needScale: {
      type: Boolean,
      default: false
    },
    dZoom: {
      type: Number,
      required: true
    }
  }
}
</script>
<style lang="scss">
  .img-widget-ct {
    width: 100%;
    height: 100%;
    user-select: none;
  }
</style>
