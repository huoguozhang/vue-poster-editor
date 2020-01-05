<template>
  <div class="blankDialog-comp-ct">
    <el-dialog
      :visible.sync="showDialog">
      <div
        :style="{
          width: contentWidth + 'px',
          height: contentHeight + 'px'
         }"
      >
        <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'blankDialog',
  props: {
    contentWidth: {
      type: Number,
      default: 800
    },
    contentHeight: {
      type: Number,
      default: 607
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showDialog: true
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
    width: 800px;
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

}
</style>
