<template>
  <div id="app">
    <poster v-model="editorData"></poster>
  </div>
</template>

<script>
import poster from '../../src/index.js'
export default {
  name: 'app',
  data () {
    return {
      editorData: {}
    }
  },
  components: {
    poster
  }
}
</script>

<style>
</style>
