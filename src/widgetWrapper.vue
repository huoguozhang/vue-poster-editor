<template>
  <div
    :style="{
       'font-weight': widgetData.style.isBold ? 'bold' : 'normal',
       'font-style': widgetData.style.isOblique ? 'oblique' : 'normal',
      'justify-content': alignMap[widgetData.style.align.x],
      'align-items': alignMap[widgetData.style.align.y]
    }"
    :class="{active: widgetData.active}"
    class="widget-wrapper">
    <template v-if="widgetData.active">
      <div
      @mousedown.stop="handleMouseDown($event, item.cursor)"
      :style="item"
      :key="i"
      v-for="(item, i) in sizeControls"
      class="square"></div>
    </template>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    widgetData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 调整尺寸用的
      sizeControls: [
        // 左上
        {
          top: 0,
          left: 0,
          cursor: 'nw-resize'
        },
        {
          top: 0,
          left: '50%',
          cursor: 'n-resize'
        },
        {
          top: 0,
          left: '100%',
          cursor: 'ne-resize'
        },
        {
          top: '50%',
          left: '100%',
          cursor: 'e-resize'
        },
        {
          top: '100%',
          left: '100%',
          cursor: 'se-resize'
        },
        {
          top: '100%',
          left: '50%',
          cursor: 's-resize'
        },
        {
          top: '100%',
          left: 0,
          cursor: 'sw-resize'
        },
        {
          top: '50%',
          left: 0,
          cursor: 'w-resize'
        }
      ],
      dMouseXY: {},
      dActiveWidgetXY: {},
      dResizeWH: {},
      dirs: [],
      dZoom: 0.52,
      page: {
        width: 960,
        height: 720
      },
      // 对齐方式
      alignMap: {
        1: 'flex-start',
        2: 'center',
        3: 'flex-end'
      },
      isMoving: false
    }
  },
  methods: {
    handleMouseDown (e, cursor) {
      const dirMap = {
        n: 'top',
        s: 'bottom',
        e: 'right',
        w: 'left'
      }
      let first = cursor[0]
      let second = cursor[1]
      this.dirs = []
      this.dirs.push(dirMap[first])
      if (/[swen]/.test(second)) {
        this.dirs.push(dirMap[second])
      }
      e.stopPropagation()
      this.initDResize({
        startX: e.pageX,
        startY: e.pageY,
        originX: this.widgetData.style.left,
        originY: this.widgetData.style.top,
        width: this.widgetData.style.width,
        height: this.widgetData.style.height
      })
      document.addEventListener('mousemove', this.handleMouseMove, true)
      document.addEventListener('mouseup', this.handleMouseUp, true)
    },
    initDResize (payload) {
      let mouseXY = this.dMouseXY
      let widgetXY = this.dActiveWidgetXY
      let resizeWH = this.dResizeWH
      mouseXY.x = payload.startX
      mouseXY.y = payload.startY
      widgetXY.x = payload.originX
      widgetXY.y = payload.originY
      resizeWH.width = payload.width
      resizeWH.height = payload.height
    },
    // 更新组件宽高
    dResize ({ x, y, dirs }) {
      let page = this.page
      let target = this.widgetData.style
      let mouseXY = this.dMouseXY
      let widgetXY = this.dActiveWidgetXY
      let resizeWH = this.dResizeWH
      let parent = this.$parent

      if (target.parent !== '-1') {
        // parent = store.state.dWidgets.find(item => item.uuid === target.parent)
      }

      let dx = x - mouseXY.x
      let dy = y - mouseXY.y

      let left = 0
      let top = 0
      const minWidth = this.widgetData.content.length * target.fontSize
      for (let i = 0; i < dirs.length; ++i) {
        let dir = dirs[i]

        switch (dir) {
          case 'top':
            let t = widgetXY.y + Math.floor(dy / this.dZoom)
            top = Math.max(t, 0)
            top = Math.min(widgetXY.y + resizeWH.height - target.fontSize, top)
            target.height += (target.top - top)
            target.height = Math.max(target.height, target.fontSize)
            target.top = top
            break
          case 'bottom':
            top = Math.floor(dy / this.dZoom)
            target.height = Math.max(Math.min(resizeWH.height + top, page.height - target.top), 40)
            break
          case 'left':
            let tLeft = widgetXY.x + Math.floor(dx / this.dZoom)
            left = Math.max(tLeft, 0)
            target.width += (target.left - left)
            target.width = Math.max(target.width, minWidth)
            left = Math.min(widgetXY.x + resizeWH.width - minWidth, left)
            target.left = left
            break
          case 'right':
            left = Math.floor(dx / this.dZoom) // 实际偏移量
            target.width = Math.max(Math.min(resizeWH.width + left, page.width - target.left), minWidth)
            break
        }
      }
      if (parent.uuid !== '-1') {
        // store.dispatch('updateGroupSize', parent.uuid)
      }

      // store.dispatch('reChangeCanvas')
    },
    // 组件调整结束
    stopDResize (store) {
      /* if (store.state.dResizeing) {
        store.dispatch('pushHistory')
      }
      store.state.dResizeing = false */
    },
    handleMouseMove (e) {
      e.stopPropagation()
      e.preventDefault()

      this.dResize({
        x: e.pageX,
        y: e.pageY,
        dirs: this.dirs
      })
    },

    handleMouseUp () {
      document.removeEventListener('mousemove', this.handleMouseMove, true)
      document.removeEventListener('mouseup', this.handleMouseUp, true)
      this.stopDResize()
    }
  }
}
</script>
<style lang="scss">
.widget-wrapper{
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  &.active, &:hover{
    border: 1px dashed;
  }
  .square{
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 999;
    background-color: #fff;
    outline: 1px solid #3b74f1;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
