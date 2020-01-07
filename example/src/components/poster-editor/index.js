import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import ElementUI from 'element-ui'
import './assets/reset.css'
import './assets/common.scss'
import PosterEditor from './index.vue'
Vue.use(ElementUI)
PosterEditor.install = function (Vue) {
  Vue.component(PosterEditor.name, PosterEditor)
}
export default PosterEditor
