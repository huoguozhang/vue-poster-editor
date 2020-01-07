<template>
  <div id="app">
      <div class="left-pane">
      <div class="header">
        单击选择海报
      </div>
      <ul class="poster-ct">
        <li
          @click="handleEditorClick(i)"
          v-for="(item, i) in editorList"
          :key="i"
          class="poster-item">
          <div @click.stop="deleteEditor(i, item)" class="remove cursor-p">
            <i class="el-icon-delete"></i>
          </div>
          <div class="poster-order">
            {{i + 1}}
          </div>
          <div
            :class="{active: item.active}"
            class="poster-img cursor-p">
            <widget-view
            :background="item.content.background"
            :widget-list="item.content.widgetList"
          >
          </widget-view>
          </div>
          <div @click.stop="" class="poster-name">
            <span class="text">{{item.name}}</span>
            <el-input class="width-200 input" size="mini" v-model="item.name"></el-input>
          </div>
        </li>
      </ul>
      <div class="bottom-ct">
        <el-button @click="showImgSelection=true" size="mini"><i class="el-icon-plus"></i> 新建</el-button>
        <el-button size="mini">取消</el-button>
        <el-button @click="saveAllTheme" size="mini">保存</el-button>
      </div>
    </div>
    <div class="right-pane" v-if="editorList.length">
      <template v-for="(item, i) in editorList">
        <posterEditor
          :order="i"
          v-model="item.content"
          v-show="item.active"
          :key="i"
          @active="handleEditorClick(i, 'active')"
        ></posterEditor>
      </template>
    </div>
    <div v-else class="right-pane" style="display: flex;justify-content: center;align-items: center;height: 300px;">
      请新建
    </div>
    <blankDialog :padding="24" :contentHeight="520" v-model="showImgSelection">
      <imageSelection
        :is-single="false"
        @cancel="showImgSelection=false"
        @success="handleImageSelection"
      ></imageSelection>
    </blankDialog>
  </div>
</template>

<script>
import posterEditor from '@/components/poster-editor/index.vue'
import blankDialog from '@/components/blankDialog'
import imageSelection from '@/components/imageSelection'
import widgetView from './widgetView'
import { findComponentsDownward } from '@/util/assist'
export default {
  components: {
    posterEditor,
    blankDialog,
    imageSelection,
    widgetView
  },
  data () {
    return {
      showImgSelection: false,
      editorList: [],
      activeEditorIndex: -1
    }
  },
  methods: {
    getEditorList () {
      this.editorList = [{
        'name': '蜘蛛侠',
        'active': false,
        'content': {
          'background': '/img/2.774bb612.jpg',
          'material_uid': '79b5ff3f-ab9a-4384-9904-aa96338202d2',
          'materialType': '__vue_devtool_undefined__',
          'widgetList': []
        }
      }, {
        'name': '美国队长',
        'active': false,
        'content': {
          'background': '/img/3.f130f8e7.jpg',
          'material_uid': 'a32c6558-1130-4e45-8d0d-efc6f887be50',
          'materialType': '__vue_devtool_undefined__',
          'widgetList': []
        }
      }]
      this.handleEditorClick(0)
    },
    handleEditorClick (i, b) {
      if (b) {
        console.log('外面的')
      }
      if (this.activeEditorIndex > -1) {
        let oldItem = this.editorList[this.activeEditorIndex]
        this.$set(this.editorList, this.activeEditorIndex, { ...oldItem, active: false })
      }
      let newItem = this.editorList[i]
      this.$set(this.editorList, i, { ...newItem, active: true })
      this.activeEditorIndex = i
    },
    deleteEditor (i, item) {
      this.$confirm('确认删除该海报?').then(async () => {
        if (item.uid) {
          await global.dataFactory.deleteThemePosterItem(item.uid)
        }
        this.editorList.splice(i, 1)
      })
    },
    handleImageSelection (data) {
      this.editorList.push(...data.map(v => {
        return {
          name: v.name,
          active: false,
          content: {
            background: v.path,
            material_uid: v.uid,
            materialType: v.expandType,
            widgetList: []
          }
        }
      }))
      if (this.activeEditorIndex < 0) {
        this.handleEditorClick(0)
      }
      this.showImgSelection = false
    },
    async saveAllTheme () {
      const editors = findComponentsDownward(this, 'posterEditor')
      const activeEditorIndex = this.activeEditorIndex
      const listData = this.editorList.slice(0)
      const tasks1 = []
      editors.forEach(async e => {
        tasks1.push({
          fn: e.uploadCurrentPosterShot,
          index: e.order
        })
        /* tasks1.push(e.uploadCurrentPosterShot().then((path) => {
          console.log(path)
          listData[e.order].path = path
        })) */
      })
      while (tasks1.length) {
        let current = tasks1.shift()
        await current.fn().then((path) => {
          listData[current.index].path = path
        })
      }
      await Promise.all(tasks1)
      this.editorList = listData
      const tasks2 = []
      let fnMap = {
        update: global.dataFactory.updateThemePoster,
        create: global.dataFactory.createThemePoster
      }
      this.editorList.forEach(e => {
        const fn = e.uid ? fnMap.update : fnMap.create
        const args = [{
          content: e.content,
          name: e.name,
          theme: this.theme,
          path: e.path
        }]
        if (e.uid) args.unshift(e.uid)
        tasks2.push(
          fn(...args)
        )
        console.log(args)
      })
      await Promise.all(tasks2)
      console.log('请求完成')
      this.handleEditorClick(activeEditorIndex)
    },
    // 获取主题海报
    getThemePoster () {
      global.dataFactory.getThemePosterList({
        theme_id: this.theme
      }).then(res => {
        let data = res.data.data.results
        data.forEach(v => {
          v.active = false
        })
        if (data.length) {
          this.$nextTick(() => this.handleEditorClick(0))
        }
        this.editorList = data || []
      })
    }
  },
  created () {
    this.getEditorList()
  }
}
</script>
<style lang="scss" scoped>
#app{
  display: flex;
  background: #fff;
  .left-pane{
    position: relative;
    width: 276px;
    min-width: 276px;
    text-align: center;
    background: rgb(232,232,232);
    .header{
      margin: 48px 0 8px;
      color: #2c2c2c;
    }
    .poster-ct{
      .poster-item{
        position: relative;
        .remove{
          display: none;
          position: absolute;
          top: 8px;
          right: 36px;
          width: 24px;
          height: 24px;
          box-sizing: border-box;
          border-radius: 50%;
          background: white;
          border: 1px solid #F56C6C;
          color: #F56C6C;
          z-index: 9;
          transition: all 0.3s linear;
        }
        &:hover{
          .remove{
            display: block;
          }
        }
        .poster-order{
          position: absolute;
          left: 8px;
          top: 8px;
        }
        .poster-img{
          box-sizing: border-box;
          margin-left: 24px;
          width: 240px;
          height: 180px;
          &.active {
            outline: 2px solid #409EFF;
          }
        }
        .poster-name{
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 8px 0;
          height: 40px;
          text-align: center;
          .input{
            display: none;
            transition: all 0.2s linear;
          }
          .text{
            transition: all 0.2s linear;
          }
          &:hover{
            .text {
              display: none;
            }
            .input{
              display: block;
            }
          }
        }
      }
    }
    .bottom-ct{
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 276px;
      height: 48px;
      background: rgb(223,223,223);
    }
  }
  .right-pane{
    flex: 1;
  }
}
</style>
