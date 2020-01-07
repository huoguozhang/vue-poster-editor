<template>
  <div
    :style="{
      transform: `scale(${needScale ? dZoom : 1})`
    }"
    class="text-widget-ct">
    {{value}}
  </div>
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
<style lang="scss">.text-widget-ct {
    user-select: none;
  }

</style>
