<template>
  <div class="image-selection-comp">
    <div class="header-ct m-b-16">
      <div class="title">选择图片</div>
      <div class="right">
        <el-input
          clearable
          v-model="search"
          placeholader="搜索内容"
          class="width-200" size="mini"  suffix-icon="el-icon-search">
           <el-button slot="append">搜索</el-button>
        </el-input>
      </div>
    </div>
    <div class="main">
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
import uuid from 'uuid'
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
      imageList: [
        {
          uid: uuid(),
          name: '钢铁侠',
          path: require('../assets/image/1.jpg')
        },
        {
          uid: uuid(),
          name: '蜘蛛侠',
          path: require('../assets/image/2.jpg')
        },
        {
          uid: uuid(),
          name: '美国队长',
          path: require('../assets/image/3.jpg')
        },
        {
          uid: uuid(),
          name: '奇异博士',
          path: require('../assets/image/4.jpg')
        },
        {
          uid: uuid(),
          name: '蚁人',
          path: require('../assets/image/5.jpg')
        },
        {
          uid: uuid(),
          name: '钢铁侠2',
          path: require('../assets/image/6.jpg')
        }
      ],
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
      this.$emit('success', this.isSingle ? imageSelection[0] : imageSelection)
      this.reset()
    },
    cancel () {
      this.$emit('cancel')
      this.reset()
    }
  },
  watch: {
    value (val) {
      if (val) {
        // this.findBackground()
      }
    }
  },
  async created () {
  }
}
</script>
<style lang="scss" scoped>
  * {
    box-sizing: border-box;
  }
.image-selection-comp{
  position: relative;
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
    /*position: absolute;
    left: 0;
    bottom: 0;*/
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
}
</style>
