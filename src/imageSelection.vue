<template>
  <div class="image-selection-comp">
    <div class="header-ct m-b-16">
      <div class="title">选择图片</div>
      <div class="right">
        <el-input
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
              :class="{active: child.label === tagSelect}"
              class="type-child-item cursor-p" v-for="(child, i) in item.childs" :key="i">{{child.label}}({{child.count}})</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="right">
        <div @click="handleClickImageItem(i, item)" class="list-item cursor-p" :key="item.uid"
             v-for="(item, i) in imageListSearch" :style="{background: item.bg}">
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
import config from '@/api/config'
export default {
  props: {
    // 是否单选
    isSingle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      host: config.host0,
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
      fileList: [],
      imageList: [],
      activeIndex: -1,
      systemMaterialList: [],
      materialList: [],
      tagSelect: ''
      // systemMaterialListCount: 0,
      // materialListCount: 0
    }
  },
  computed: {
    imageListSearch () {
      return this.tagSelect ? this.imageList.filter(v => v.tag.find(t => t.name === this.tagSelect)) : this.imageList
    }
  },
  methods: {
    wrapResults (results, expandType) {
      const tagMap = {}
      const r = results.map(v => {
        v.expandType = expandType.value
        v.tag.forEach(t => {
          const key = t.name
          if (tagMap[key]) {
            tagMap[key]++
          } else {
            tagMap[key] = 1
          }
        })
        if (expandType.value === 2) v.path = this.host + v.path
        return v
      })
      expandType.childs = Object.keys(tagMap).map(key => {
        return {
          label: key,
          active: false,
          count: tagMap[key]
        }
      })
      return r
    },
    getSystemMaterialList () {
      global.dataFactory.getSystemMaterialList().then(res => {
        this.types.system.count = res.data.data.count
        this.imageList = this.systemMaterialList = this.wrapResults(res.data.data.results, this.types.system)
      })
    },
    getThemeMaterialList () {
      global.dataFactory.getThemeMaterialList({}).then(res => {
        if (res.data.code === 0) {
          this.types.school.count = res.data.data.count
          this.materialList = this.wrapResults(res.data.data.results, this.types.school)
        }
      })
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
      tag.active = !tag.active
      this.tagSelect = tag.label
    },
    handleClickImageItem (i, item) {
      this.isSingle ? this.singleModeClick(i, item) : this.multipleModeClick(i, item)
    },
    singleModeClick (i) {
      if (this.activeIndex > -1) {
        this.imageListSearch[this.activeIndex].active = false
      }
      this.activeIndex = i
      this.imageListSearch[this.activeIndex].active = true
    },
    multipleModeClick (i, item) {
      this.$set(this.imageListSearch, i, { ...item, active: !item.active })
    },
    reset () {
      this.imageList.forEach(v => {
        v.active = false
      })
    },
    submit () {
      this.$emit('success', this.imageListSearch.filter(v => v.active))
      this.reset()
    },
    cancel () {
      this.$emit('cancel')
      this.reset()
    }
  },
  created () {
    this.getThemeMaterialList()
    this.getSystemMaterialList()
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
