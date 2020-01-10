<template>
  <div class="poster-editor-comp" :id="editorUid">
    <div class="main-pane" :style="{minHeight: 720 * dZoom + 58 + 'px' }">
      <div class="header-ct">
        <div class="left">
          <el-tooltip effect="dark" content="撤销" placement="top-start">
            <el-button :disabled="!canClickPrev" @click="getHistory(-1)" type="text">
              <Icon :active="canClickPrev" class="m-r-16" icon="Undo"></Icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="前进" placement="top-start">
            <el-button :disabled="!canClickNext" @click="getHistory(1)" type="text">
              <Icon :active="canClickNext" class="mirror" icon="Undo"></Icon>
            </el-button>
          </el-tooltip>
        </div>
        <div class="center">
          轻点元素开始编辑
        </div>
        <div class="right">
          <el-tooltip class="item m-r-16" effect="dark" content="添加文本组件" placement="top-start">
            <span @click="addWidget('text')" class="cursor-p">
              <i class="el-icon-document"></i>
            </span>
          </el-tooltip>
          <el-tooltip class="item m-r-16" effect="dark" content="添加图片组件" placement="top-start">
            <span @click="showImageSelectionWidget=true" class="cursor-p">
              <i class="el-icon-picture-outline"></i>
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑背景图" placement="top-start">
            <span class="cursor-p" @click="showImageSelection=true">
              <i class="el-icon-picture"></i>
             </span>
          </el-tooltip>
        </div>
      </div>
      <draggable
        ref="posterContent"
        v-bind="getOptions()"
        @end="isDragging = false"
        @start="isDragging=true"
        :style="{
        width: dZoom * page.width + 'px',
        height: dZoom * page.height + 'px'
        }"
        class="poster-content m-b-16"
        tag="div"
      >
        <img
          class="bg-puppet"
          :src="value && value.background">
        <widget
          :class="{disabled: !item.active}"
          @click.native = "handleActiveWidget(item)"
          @dragstart.native="dragStart($event, item)"
          @dragend.native="dragEnd($event, item)"
          @modify="pushHistory"
          :widget-data="item"
          :order="index"
          :page="page"
          :d-zoom="dZoom"
          :key="item.uuid"
          v-for="(item, index) in widgetList"></widget>
      </draggable>
    </div>
    <div class="right-pane">
      <el-tabs>
        <el-tab-pane label="当前组件">
          <div v-if="activeWidget" class="style-setting-ct">
            <el-collapse v-model="activeNames">
              <el-collapse-item v-if="activeWidget.setDataRange.content.show" title="文本内容" name="1">
                <div class="style-config m-r-16">
                  <el-input v-model="activeWidget.content" type="textarea"></el-input>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="activeWidget.setDataRange.box.show" title="组件样式" name="2">
                <div class="style-config">
                    <span class="label">
                      X
                    </span>
                  <el-input-number
                    :precision="0"
                    v-model="activeWidget.style.left"
                    class="w-60"
                    :controls="false"
                    size="mini"></el-input-number>
                  <span class="label">
                     Y
                  </span>
                  <el-input-number
                    :precision="0"
                    v-model="activeWidget.style.top"
                    class="w-60"
                    :controls="false"
                    size="mini"></el-input-number>
                </div>
                <div class="style-config">
                  <span class="label">
                    宽度
                  </span>
                  <el-input-number
                    v-model="activeWidget.style.width"
                    class="w-60" :controls="false" size="mini"></el-input-number>
                  <span class="label">
                     高度
                   </span>
                  <el-input-number
                    v-model="activeWidget.style.height"
                    class="w-60" :controls="false" size="mini"></el-input-number>
                </div>
                <div class="style-config">
                  <template v-if="activeWidget.setDataRange.box.detail.background">
                    <span class="label">
                     背景色
                    </span>
                    <el-color-picker
                      v-model="activeWidget.style.background"
                      class="w-60"
                      show-alpha
                      size="mini"></el-color-picker>
                  </template>
                  <span class="label">
                   层级
                  </span>
                  <el-input-number
                    disabled
                    :value="activeWidget.style.zIndex"
                    class="w-60"
                    :controls="false"
                    size="mini"></el-input-number>
                </div>
                <div class="style-config">
                  <!-- <span class="label">
                     对齐
                   </span>
                   {{activeWidget.style.textAlign}}-->
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="activeWidget.setDataRange.innerStyle.show" title="字体样式" name="3">
                <div class="style-config">
                  <span class="label">
                    大小
                  </span>
                  <el-input-number
                    v-model="activeWidget.style.fontSize"
                    class="w-60" :controls="false" size="mini"></el-input-number>
                  <span class="label">
                    行高
                  </span>
                  <el-input-number
                    v-model="activeWidget.style.lineHeight"
                    class="w-60" :controls="false" size="mini"></el-input-number>
                </div>
                <div class="style-config">
                  <span class="label">
                    字距
                  </span>
                  <el-input-number
                    v-model="activeWidget.style.letterSpacing"
                    class="w-60" :controls="false" size="mini"></el-input-number>
                  <span class="label">
                   颜色
                 </span>
                  <el-color-picker
                    v-model="activeWidget.style.color"
                    class="w-60"
                    show-alpha
                    size="mini"></el-color-picker>
                </div>
                <div class="style-config">
                  <!--<span class="label">
                    对齐
                  </span>
                  <el-input-number class="w-60" :controls="false" size="mini"></el-input-number>-->
                  <!-- <span class="label">
                     字体
                   </span>
                   <el-input-number class="w-60" :controls="false" size="mini"></el-input-number>-->
                </div>
                <div class="style-config">
                 <span class="label">
                   对齐
                  </span>
                  <align-select v-model="activeWidget.style.align"></align-select>
                </div>
                <div class="style-config">
                  <span class="label">其他</span>
                  <span
                    :class="{active: activeWidget.style.isBold}"
                    @click="handleOtherClick('isBold')"
                    class="cursor-p other"><b>B</b></span>
                  <span
                    :class="{active: activeWidget.style.isOblique}"
                    @click="handleOtherClick('isOblique')"
                    class="m-l-8 cursor-p other"><i>I</i></span>
                  <span></span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="图层调整">
          <div class="widget-zIndex-config-ct">
            <draggable :sort="false">
              <div
                tabindex="0"
                @dragstart="dragZIndexStart(item)"
                @drop="dragZIndexEnd(item)"
                @keyup.delete="deleteWidget(item)"
                :key="item.uuid"
                v-for="(item) in sortWidgetList"
                class="widget-list-item item">
                <i
                  @click="deleteWidget(item)"
                  class="delete-btn el-icon-delete cursor-p"></i>
                <div class="view" :style="{background: item.type === 'text' ? item.style.background : `url(${item.content})`}"></div>
                <div title="拖拽调整图层层级,按delete键或点击删除该图层" class="m-l-16 desc">
                  {{item.label}}图层
                </div>
                <div v-if="item.type === 'text'" style="font-size: 14px;flex: 1;" class="m-l-16 single-row-ellipsis">
                  {{item.content}}
                </div>
              </div>
            </draggable>
            <div class="bg item">
              <div class="view"></div>
              <div class="m-l-16 desc">
                背景图层
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <blankDialog v-model="showImageSelection" :content-height="540" :content-width="760">
      <imageSelection isSingle @success="changeBackground" @cancel="showImageSelection=false" v-model="value"></imageSelection>
    </blankDialog>
    <blankDialog v-model="showImageSelectionWidget" :content-height="540" :content-width="760">
      <imageSelection isSingle @success="beforeAddImgWidget" @cancel="showImageSelectionWidget" v-model="value"></imageSelection>
    </blankDialog>
  </div>
</template>
<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import uuid from 'uuid'
import html2canvas from 'html2canvas'
import { Loading } from 'element-ui'
import alignSelect from './alignSelect'
import widget from './widget'
import blankDialog from '@/components/blankDialog'
import imageSelection from '@/components/imageSelection'
import { setDataRangeMap, defaultDataMap } from './widgetInitDataMap'
import Icon from './icon/index'

let zIndex = 0

export default {
  name: 'posterEditor',
  props: {
    order: {
      type: Number,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    page: {
      type: Object,
      default () {
        return {
          width: 960,
          height: 720
        }
      }
    }
  },
  components: {
    widget,
    draggable,
    alignSelect,
    blankDialog,
    imageSelection,
    Icon
  },
  data () {
    return {
      editorUid: 'uid' + uuid(),
      dZoom: 0.52,
      isDragging: false,
      activeNames: ['1', '2', '3', '4', '5', '6'],
      widgetList: [],
      dragStartPosition: null,
      widgetDragStart: null, // 当前拖的是哪个文本图层 便于后期交互值
      handleResizeFn: null,
      showImageSelection: false,
      showImageSelectionWidget: false,
      widgetHistory: [], // 记录历史记录变动的
      historyIndex: -1
    }
  },
  methods: {
    beforeAddImgWidget (imgObj) {
      this.addWidget('img', imgObj.path)
      this.showImageSelectionWidget = false
    },
    addWidget (type, path) {
      zIndex++
      const typeLabelMap = {
        text: '文本',
        img: '图片'
      }
      const item = {
        label: typeLabelMap[type],
        type,
        content: type === 'text' ? '文本' : path,
        uuid: uuid(),
        active: false,
        setDataRange: setDataRangeMap[type],
        style: {
          ...defaultDataMap[type],
          zIndex
        }
      }
      this.widgetList.push(item)
      this.$nextTick(() => {
        this.handleActiveWidget(item)
      })
      this.$emit('input', {
        background: this.value.background,
        widgetList: this.widgetList
      })
      this.pushHistory('add', item)
    },
    handleActiveWidget (item) {
      this.widgetList.forEach(w => {
        if (item.uuid === w.uuid) {
          w.active = !item.active
        } else {
          w.active = false
        }
      })
    },
    getOptions () {
      return {
        filter: '.disabled'
      }
    },
    dragStart (e) {
      this.dragStartPosition = {
        pageX: e.pageX,
        pageY: e.pageY
      }
    },
    dragEnd (e, item) {
      let target = item.style
      let left = (e.pageX - this.dragStartPosition.pageX) / this.dZoom
      let top = (e.pageY - this.dragStartPosition.pageY) / this.dZoom
      target.left = Math.max(Math.min(left + target.left, this.page.width - target.width), 0)
      target.top = Math.max(Math.min(top + target.top, this.page.height - target.height), 0)
    },
    deleteWidget (item) {
      let index = this.widgetList.findIndex(v => v.uuid === item.uuid)
      if (index > -1) {
        this.$confirm(`此操作将永久删除该${item.label}图层, 是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.widgetList.splice(index, 1)
          this.pushHistory('delete', item)
        })
      }
    },
    handleOtherClick (key) {
      this.activeWidget.style[key] = !this.activeWidget.style[key]
    },
    dragZIndexStart (item) {
      this.widgetDragStart = item
    },
    dragZIndexEnd (item) {
      let tmp = item.style.zIndex
      item.style.zIndex = this.widgetDragStart.style.zIndex
      this.widgetDragStart.style.zIndex = tmp
      this.widgetDragStart = null
    },
    getDZoom () {
      // const currentEditorBox = document.querySelector(`#${this.editorUid}`).getBoundingClientRect()
      // fix v-show隐藏元素宽度太小的问题
      const currentEditorBox = document.querySelector(`.poster-editor-comp`).getBoundingClientRect()
      let width = currentEditorBox.width - 32 - 295
      if (width >= 480) {
        this.dZoom = Number((width / 960).toFixed(2))
      }
      if (width >= 960) {
        this.dZoom = 1
      }
    },
    // 上传当前poster截图
    uploadCurrentPosterShot (cb) {
      let instance = Loading.service({
        text: '保存中，请稍候！',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      console.time('1')
      this.widgetList.forEach(w => {
        w.active = false
      })
      return new Promise(resolve => {
        // 激活当前编辑器 方便截图
        this.$emit('active')
        this.$nextTick(() => {
          html2canvas(document.querySelector(`#${this.editorUid}`).querySelector('.poster-content'), {
            useCORS: true,
            // 编辑器缩放保持 960 * 720 的尺寸
            scale: 1 / this.dZoom
          }).then(async canvas => {
            console.timeEnd('1')
            console.time('2')
            let file = canvas.toDataURL('image/jpeg', 1).replace('data:image/jpeg;base64,', '')
            // base64的图片
            console.timeEnd('2')
            console.time('3')
            if (cb) {
              await cb(file, resolve)
              console.timeEnd('3')
              console.log('截图完成')
              instance.close()
            }
          })
        })
      })
    },
    changeBackground (imgObj) {
      this.value.background = imgObj.path
      this.value.material_uid = imgObj.uid
      this.value.materialType = imgObj.expandType
      this.showImageSelection = false
    },
    pushHistory (type, item, index) {
      const obj = {
        uuid: item.uuid,
        item,
        index,
        type
      }
      if (this.canClickNext) {
        // 已经执行过撤销的操作了 再添加历史记录把后面的删除掉
        this.widgetHistory.length = this.historyIndex + 1
      }
      this.widgetHistory.push(obj)
      this.historyIndex = this.widgetHistory.length - 1
      /* switch (type) {
        case 'add':
          obj.type = 'add'

          this.historyIndex = this.widgetHistory.length - 1
          break
        case 'delete':
          obj.type = 'delete'
          this.widgetHistory.push(obj)
          this.historyIndex = this.widgetHistory.length
          break
        case 'modify':
          break
      } */
    },
    getHistory (num) {
      console.log(num, this.canClickPrev, this.canClickNext)
      if ((num < 0 && this.canClickPrev) || (num > 0 && this.canClickNext)) {
        if (num > 0) this.historyIndex += num
        let historyObj = this.widgetHistory[this.historyIndex]
        switch (historyObj.type) {
          case 'add':
            // 撤回操作
            if (num < 0) {
              let index = this.widgetList.findIndex(v => v.uuid === historyObj.uuid)
              if (index > -1) {
                this.widgetList.splice(index, 1)
              }
            } else {
              this.widgetList.push(historyObj.item)
            }
            break
          case 'delete':
            if (num < 0) {
              this.widgetList.splice(historyObj.index, 0, historyObj.item)
            } else {
              this.widgetList.splice(historyObj.index, 1)
            }
            break
        }
        if (num < 0) {
          this.historyIndex += num
        }
        // this.widgetHistory[this.historyIndex - 1]
      }
    }
  },
  computed: {
    activeWidget () {
      return this.widgetList.find(w => w.active)
    },
    sortWidgetList () {
      return this.widgetList.slice(0).sort((a, b) => b.style.zIndex - a.style.zIndex)
    },
    canClickPrev () {
      // 是否能点击上一步
      return this.historyIndex > -1
    },
    canClickNext () {
      return this.historyIndex < this.widgetHistory.length - 1 && this.widgetHistory.length > 0
    }
  },
  watch: {
    widgetList: {
      handler (val) {
        zIndex = val.length
        // console.log(zIndex)
        val.forEach((v, i) => {
          v.style.zIndex = i + 1
        })
        this.$emit('input', {
          background: this.value.background,
          widgetList: this.widgetList
        })
      }
    },
    'value.widgetList': {
      handler (val) {
        if (val !== this.widgetList) {
          this.widgetList = val
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getDZoom()
    this.handleResizeFn = _.throttle(this.getDZoom, 100)
    window.addEventListener('resize', this.handleResizeFn)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResizeFn)
  },
  created () {
    this.widgetList = this.value.widgetList || []
  }
}
</script>
<style lang="scss" scoped>
 .w-60{
   width: 60px !important;
 }
.poster-editor-comp{
  display: flex;
  min-width: 830px;
  .main-pane{
    position: relative;
    flex: 1;
    padding: 0 16px;
    .header-ct{
      display: flex;
      height: 40px;
      align-items: center;
      text-align: center;
      .left{
        display: flex;
        align-items: center;
        .mirror{
          transform: rotateY(180deg);
        }
      }
      .center{
        flex: 1;
      }
    }
    .poster-content{
      top: 40px;
      left: 50%;
      position: absolute;
      /*min-width: 480px;
      min-height: 360px;
      max-width: 960px;
      max-height: 720px;*/
      width: 960px;
      height: 720px;
     /* margin: 0 auto;*/
      transform: translateX(-50%);
      &:hover{
        outline: 1px solid grey;
      }
      transform-origin: 0 0;
      background-size: 100% 100% !important;
      .bg-puppet{
        width: 100%;
        height: 100%;
        z-index: -1;
      }
    }
  }
  .right-pane{
    box-sizing: border-box;
    width: 295px;
    padding-left: 16px;
    border: 1px solid #e4e4e4;
    background: #fff;
    z-index: 900;
    .header-ct{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 40px;
    }
    .style-setting-ct{
      .style-config{
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        padding-left: 16px;
        .label{
          display: inline-block;
          margin-left: 8px;
          width: 48px;
          text-align: left;
        }
        .other{
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 18px;
          color: rgba(0,0,0,0.8);
          &.active{
            background: rgba(0,0,0,0.8);
            color: white;
          }
        }
      }
    }
    .widget-zIndex-config-ct{
      .widget-list-item{
        cursor: move;
      }
      .item{
        position: relative;
        display: flex;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #e1e1e1;
        font-size: 14px;
        .delete-btn{
          position: absolute;
          display: none;
          transition: all 200ms linear;
        }
        &:hover .delete-btn{
          display: block;
        }
        .view{
          margin-left: 40px;
          width: 24px;
          height: 18px;
          background-size: 100% 100% !important;
          border: 1px solid rgba(0,0,0,0.3);
        }
        .desc{
          font-size: 14px;
        }
      }
      .bg{
        .view{
          margin-left: 24px;
        }
      }
    }
  }
}
</style>
