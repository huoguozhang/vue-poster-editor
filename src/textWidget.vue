<template>
  <div class="text-widget-ct">
    {{value}}
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss">.text-widget-ct {
    user-select: none;
  }

</style>
