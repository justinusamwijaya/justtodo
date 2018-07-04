<template>
  <div class="home">
    <HomePage/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from '@/components/mainComponents/HomePage.vue'

export default {
  name: 'home',
  components: {
    HomePage
  }
}
</script>
