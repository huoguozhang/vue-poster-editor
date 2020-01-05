<template>
  <svg
    :class="{active: active}"
    class="icon el-icon cursor-p" aria-hidden="true">
    <use :xlink:href="'#icon-' + icon"></use>
  </svg>
</template>
<script>
import './iconfont.js'
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
.icon{
  font-size: 18px;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: rgba(0,0,0,0.5);
  overflow: hidden;
  &.active{
    fill: rgba(0,0,0,1);
  }
}
</style>
