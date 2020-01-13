import blankDialog from './blankDialog.vue'
import Vue from 'vue'
blankDialog.install = function () {
  Vue.component(blankDialog.name, blankDialog)
}
export default blankDialog
