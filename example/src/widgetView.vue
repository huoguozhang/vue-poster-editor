<template>
  <div class="widgetView-comp-ct"
       :style="{
       background: `url(${background})`
       }">
    <widget
      :show-wrapper="false"
      v-for="item in widgetList"
      :widget-data="item"
      :d-zoom="0.25"
      :key="item.uuid"></widget>
  </div>
</template>
<script>
import widget from '@/components/poster-editor/widget'
export default {
  name: 'widgetView',
  props: {
    background: {
      type: String
    },
    widgetList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    widget
  }
}
</script>
<style lang="scss" scoped>
.widgetView-comp-ct {
  position: relative;
  width: 240px;
  height: 180px;
  background-size: 100% 100% !important;
  background-repeat: no-repeat;
}
</style>
