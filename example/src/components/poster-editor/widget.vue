<template>
  <div
    :style="{
      ...getStyleRaw
    }"
    class="widget-ct cursor-p">
    <widgetWrapper
      :d-zoom="dZoom"
      :page="page"
      :show-wrapper="showWrapper"
      :widget-data="widgetData"
      :widget-name="widgetData.type">
      <component :need-scale="widgetData.type === 'text' && !showWrapper" :d-zoom="dZoom" v-model="widgetData.content" :is="childName"></component>
    </widgetWrapper>
  </div>
</template>
<script>
import widgetWrapper from './widgetWrapper'
import textWidget from './textWidget'
import imgWidget from './imgWidget'
export default {
  props: {
    dZoom: {
      type: Number,
      required: true
    },
    widgetData: {
      type: Object,
      required: true
    },
    order: {
      type: Number
    },
    showWrapper: {
      type: Boolean,
      default: true
    },
    page: {
      type: Object
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
      return this.widgetData.type + 'Widget'
    }
  },
  components: {
    widgetWrapper,
    textWidget,
    imgWidget
  },
  watch: {
    widgetData: {
      handler (val) {
        if (this.hasOwnProperty('order')) {
          console.log('change', val)
          this.$emit('modify', 'modify', val, this.order)
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss">
.widget-ct{
  position: absolute;
}
</style>
