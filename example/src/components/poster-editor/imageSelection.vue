<template>
  <div class="image-selection-comp">
    <div class="header-ct m-b-16">
      <div class="title">选择图片</div>
      <div class="right">
        <el-input
          clearable
          @change="getDataFn"
          v-model="search"
          placeholader="搜索内容"
          class="width-200" size="mini"  suffix-icon="el-icon-search">
           <el-button slot="append">搜索</el-button>
        </el-input>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <el-collapse v-model="expandTypes" @change="expandChange">
          <el-collapse-item
            v-for="item in types" :key="item.value" :title="`${item.label}(${item.count})`" :name="item.value">
            <div
              @click="handleTagClick(child)"
              :class="{active: child.uid === tagSelect}"
              class="type-child-item cursor-p" v-for="(child, i) in item.childs" :key="i">{{child.name}}({{child.total}})</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="right">
        <div
          @click="handleClickImageItem(i, item)"
          class="list-item cursor-p"
          :key="item.uid"
          v-for="(item, i) in imageList"
          :style="{background: item.bg}">
          <el-checkbox class="check-ct" :value="item.active"></el-checkbox>
          <img :src="item.path" class="img"/>
          <div class="text single-row-ellipsis">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-ct">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="submit" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    // 是否单选
    isSingle: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object
    }
  },
  data () {
    return {
      search: '',
      expandTypes: [1],
      types: {
        system: {
          value: 1,
          count: 0,
          label: '系统素材',
          childs: []
        },
        school: {
          value: 2,
          label: '本校素材',
          childs: [],
          count: 0
        }
      },
      imageList: [],
      activeIndex: -1,
      selectionImage: [],
      selectionImageUids: [],
      systemMaterialList: [],
      materialList: [],
      tagSelect: ''
      // systemMaterialListCount: 0,
      // materialListCount: 0
    }
  },
  methods: {
    wrapResults (results, expandType) {
      const tagMap = {}
      const r = results.map(v => {
        v.expandType = expandType.value
        v.tag.forEach(t => {
          const key = t.uid
          if (tagMap[key]) {
            tagMap[key]++
          } else {
            tagMap[key] = 1
          }
        })
        if (expandType.value === 2) v.path = this.host + v.path
        return v
      })
      expandType.childs.forEach(child => {
        child.total = tagMap[child.uid] || 0
      })
      return r
    },
    getSystemMaterialList () {
      let params = {
        search: this.search
      }
      if (this.tagSelect) params.tag_id = this.tagSelect
      return global.dataFactory.getSystemMaterialList(params).then(res => {
        this.types.system.count = res.data.data.count
        this.systemMaterialList = this.wrapResults(res.data.data.results, this.types.system)
      })
    },
    getThemeMaterialList () {
      let params = {
        search: this.search
      }
      if (this.tagSelect) params.tag_id = this.tagSelect
      return global.dataFactory.getThemeMaterialList(params).then(res => {
        if (res.data.code === 0) {
          this.types.school.count = res.data.data.count
          this.materialList = this.wrapResults(res.data.data.results, this.types.school)
        }
      })
    },
    async getAllTag () {
      return Promise.all([global.dataFactory.getSystemMaterialTagList().then(res => {
        this.types.system.childs = res.data.data.results
      }),
      global.dataFactory.getThemeMaterialTagList().then(res => {
        this.types.school.childs = res.data.data.results
      })
      ])
    },
    expandChange (activeNames) {
      this.tagSelect = ''
      if (activeNames.length === 0) {
        this.imageList = []
        return
      }
      if (activeNames.length > 1) {
        this.expandTypes.shift()
      }
      this.imageList = activeNames[0] === 1 ? this.systemMaterialList : this.materialList
    },
    handleTagClick (tag) {
      this.tagSelect = tag.uid
      this.getDataFn()
    },
    handleClickImageItem (i, item) {
      this.isSingle ? this.singleModeClick(i, item) : this.multipleModeClick(i, item)
    },
    singleModeClick (i, item) {
      if (i === this.activeIndex) {
        this.$set(this.imageList, i, { ...item, active: false })
        this.activeIndex = -1
      } else {
        let oldItem = this.imageList[this.activeIndex]
        this.$set(this.imageList, this.activeIndex, { ...oldItem, active: false })
        this.activeIndex = i
        this.$set(this.imageList, this.activeIndex, { ...item, active: true })
      }
    },
    multipleModeClick (i, item) {
      this.$set(this.imageList, i, { ...item, active: !item.active })
    },
    reset () {
      this.imageList.forEach(v => {
        v.active = false
      })
    },
    async submit () {
      let imageSelection = this.imageList.filter(v => v.active)
      if (imageSelection.length === 0) {
        this.$message.error('请选择图片!')
        return false
      }
      const tasks = []
      if (this.expandTypes.includes(1)) {
        imageSelection.forEach(v => {
          tasks.push(
            global.dataFactory.changeMaterialOrigin({ material_id: v.uid }).then(res => {
              v.path = this.host + res.data.data.path
            })
          )
        })
      }
      await Promise.all(tasks)
      this.$emit('success', this.isSingle ? imageSelection[0] : imageSelection)
      this.reset()
    },
    cancel () {
      this.$emit('cancel')
      this.reset()
    },
    findBackground () {
      (this.value.expandType === 2 ? this.materialList : this.systemMaterialList).some(v => {
        if (v.uid === this.value.material_uid) v.active = true
      })
      console.log(this.value)
    },
    async getDataFn () {
      if (this.expandTypes.includes(1)) {
        await this.getSystemMaterialList()
        this.imageList = this.systemMaterialList
      }
      if (this.expandTypes.includes(2)) {
        await this.getThemeMaterialList()
        this.imageList = this.materialList
      }
    }
  },
  watch: {
    value () {
      this.findBackground()
    }
  },
  async created () {
    this.getAllTag()
    await this.getThemeMaterialList()
    await this.getSystemMaterialList()
    this.imageList = this.systemMaterialList
    if (this.value) this.findBackground()
  }
}
</script>
<style lang="scss" scoped>
  * {
    box-sizing: border-box;
  }
.image-selection-comp{
  .header-ct{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 27px;
      font-weight: 400;
      color: rgba(44, 62, 80, 1);
    }
    .right{
      display: flex;
    }
  }
  .main{
    display: flex;
    .left{
      box-sizing: border-box;
      width: 200px;
      height: 400px;
      border-right: 1px solid #E4E8EB;
      .type-child-item{
        position: relative;
        padding-left: 24px;
        height: 32px;
        line-height: 32px;
        &.active{
          background: #409EFF;
          color: white;
          &:before{
            background: white;
          }
        }
        &:before{
          content: '';
          display: block;
          position: absolute;
          top: 13px;
          left: 8px;
          background: black;
          width: 6px;
          height: 6px;
          overflow: hidden;
          border-radius: 50%;
          z-index: 9;
        }
      }
    }
    .right{
      flex: 1;
      display: grid;
      flex-wrap: wrap;
      grid-template-columns: repeat(auto-fill, 144px);
      grid-template-rows: repeat(auto-fill, 144px);
      grid-row-gap: 8px;
      grid-column-gap: 8px;
      margin-left: 16px;
      .list-item{
        position: relative;
        width: 144px;
        height: 144px;
        border: 1px solid #e1e1e1;
        overflow: hidden;
        .check-ct{
          position: absolute;
          top: 8px;
          left: 8px;
        }
        .img{
          display: block;
          width: 100%;
          height: 100.8px;
        }
      }
      .text{
        height: 43px;
        line-height: 43px;
        text-align: center;
      }
    }
  }
  .bottom-ct{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
