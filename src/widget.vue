<template>
  <div
    :style="{
      ...getStyleRaw
    }"
    class="widget-ct cursor-p">
    <widgetWrapper :widget-data="widgetData" :widget-name="widgetName">
      <component v-model="widgetData.content" :is="childName"></component>
    </widgetWrapper>
  </div>
</template>
<script>
import widgetWrapper from './widgetWrapper'
import textWidget from './textWidget'
export default {
  props: {
    dZoom: {
      type: Number,
      required: true
    },
    widgetName: {
      type: String,
      default: 'text'
    },
    widgetData: {
      type: Object,
      required: true
    }
  },
  computed: {
    getStyleRaw () {
      let obj = {}
      let style = this.widgetData.style
      let zIndex = style.zIndex
      for (let key in style) {
        obj[key] = typeof style[key] === 'number' ? style[key] * this.dZoom + 'px' : style[key]
      }
      obj.zIndex = zIndex
      return obj
    },
    childName () {
      return this.widgetName + 'Widget'
    }
  },
  components: {
    widgetWrapper,
    textWidget
  }
}
</script>
<style lang="scss">
.widget-ct{
  position: absolute;
}
</style>
