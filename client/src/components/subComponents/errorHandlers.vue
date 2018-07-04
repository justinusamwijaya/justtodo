<template>
    <b-col class="errorBanner" cols=12 offset-md=2 md=8 v-if="!closed">
        <button @click="closeBanner" class="closeBanner">x</button>
        <p>{{message}}</p>
    </b-col>
</template>

<script>
export default {
  name: 'errorHandlers',
  components: {},
  data () {
    return {
      closed: false
    }
  },
  props: ['message'],
  methods: {
    closeBanner: function () {
      this.closed = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$backgroundColor : rgba(4, 133, 156, 0.774);
$backgroundColor2 : rgba(255, 255, 255, .404);
$backgroundColor3 : rgba(0,0,0,.3);
$backgroundColor4 : rgba(1, 217, 255, 0.842);
$blank: rgba(0,0,0,0);

.errorBanner{
    position:relative;
    background-color:$backgroundColor4;
    margin-bottom:.2rem;
    font-size:1.5rem;
    display:flex;
    justify-content: center;
    align-items: center;
    padding:.5rem;
    border-radius: .7rem;
    p{
        color:white
    }
    .closeBanner{
        background-color:$blank;
        color:white;
        position:absolute;
        border:0;
        top:0;
        right:0;
        cursor: pointer;
        &:hover{
            color:$backgroundColor;
        }
    }
}

</style>
