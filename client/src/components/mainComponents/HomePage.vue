<template>
  <div>
    <ListPage v-if="statusLogin"/>
    <login v-else/>
  </div>
</template>

<script>
import ListPage from './ListPage.vue'
import login from './Login.vue'
export default {
  name: 'HomePage',
  components: { ListPage, login },
  data () {
    return {
      statusLogin: false
    }
  },
  created () {
    if (localStorage.getItem('token')) this.statusLogin = true
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
