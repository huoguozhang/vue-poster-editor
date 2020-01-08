<template>
  <div class="blankDialog-comp-ct">
    <el-dialog
      @close="handleClose"
      :width="contentWidth+'px'"
      :visible.sync="showDialog">
      <div
        class="content"
        :style="{
          background: bg,
          height: contentHeight + 'px',
          contentWidth: contentWidth + 'px',
          padding: padding + 'px'
         }"
      >
          <div class="title">{{ dTitle }}</div>
          <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'blankDialog',
  props: {
    bg: {
      type: String,
      default: '#fff'
    },
    contentWidth: {
      type: Number,
      default: 720
    },
    padding: {
      type: Number,
      default: 48
    },
    contentHeight: {
      type: Number,
      default: 500
    },
    value: {
      type: Boolean,
      default: false
    },
    dTitle: {
      type: String
    }
  },
  data () {
    return {
      showDialog: true
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  },
  watch: {
    value (val) {
      if (val !== this.showDialog) {
        this.showDialog = val
      }
    },
    showDialog (val) {
      if (val !== this.value) {
        this.$emit('input', val)
      }
    }
  },
  created () {
    this.showDialog = this.value
  }
}
</script>
<style lang="scss">
.blankDialog-comp-ct{
  .el-dialog{
   /* width: 800px;*/
    .el-dialog__header{
      padding: 0;
      margin: 0;
      .el-dialog__headerbtn .el-dialog__close{
        color: #282828;
      }
    }
    .el-dialog__body{
      padding: 0;
      height: auto;
      width: auto;
    }
  }
}
</style>
<style lang="scss" scoped>
.blankDialog-comp-ct {
  .content{
    box-sizing: border-box;
    overflow: auto;
    /*padding: 48px;*/
    .title{
      margin-bottom: 16px;
      font-size: 24px;
      color: rgba(33, 33, 33, 1);
    }
  }
}
</style>
