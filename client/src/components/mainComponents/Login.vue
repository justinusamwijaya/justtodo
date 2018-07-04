<template>
  <b-row>
    <errorHandlers v-for="(error,i) in errors" :key="i" :message="error.msg" />
    <b-col :class="{'options':true, 'col-md-5':!signedUp, 'offset-md-2 col-md-8':signedUp}" cols=12>
      <form @submit="login($event)" class="col-12" action="">
        <h1>Login</h1>
        <b-col class="inputwrapper" cols=12>
          username or email
          <input v-model="loginUsername" type="text">
        </b-col>
        <b-col class="inputwrapper" cols=12>
          password
          <input v-model="loginPassword" type="password">
        </b-col>
        <b-col class="inputwrapper" cols=12>
          <button type="submit">login</button>
        </b-col>
      </form>
    </b-col>
    <b-col v-if="!signedUp" cols=12 md=2 style="display:flex;justify-content:center;align-items:center;">
      <p style="font-size:5rem;color:white;">or</p>
    </b-col>
    <b-col v-if="!signedUp" class="options" cols=12 md=5>
      <form @submit="signup($event)" class="col-12" action="">
        <h1>Signup</h1>
        <b-col class="inputwrapper" cols=12>
          username
          <input v-model="registerUsername" type="text">
        </b-col>
        <b-col class="inputwrapper" cols=12>
          email
          <input v-model="registerEmail" type="text">
        </b-col>
        <b-col class="inputwrapper" cols=12>
          password
          <input v-model="registerPassword" type="password">
        </b-col>
        <b-col class="inputwrapper" cols=12>
          <button type="submit">signup</button>
        </b-col>
      </form>
    </b-col>
    <button @click="popupLogin()" style="width:100%;font-size: 2rem;">Login with Facebook instead</button>
  </b-row>
</template>

<script>
import axios from 'axios'
import errorHandlers from '../subComponents/errorHandlers.vue'
import { app } from '@/firebase.js'
export default {
  name: 'HomePage',
  components: { errorHandlers },
  data () {
    return {
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      loginUsername: '',
      loginPassword: '',
      signedUp: false,
      errors: []
    }
  },
  created () {
  },
  methods: {
    popupLogin () {
      let provider = new app.firebase_.auth.FacebookAuthProvider()
      let self = this
      app.firebase_.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        let token = result.credential.accessToken
        // The signed-in user info.
        let user = result.user
        axios.post('http://localhost:3000/facebookLogin', {email: user.email})
          .then(response => {
            localStorage.setItem('token', response.data.token)
            location.reload()
          })
          .catch(errors => {
            console.log(errors.response)
          })
        // ...
      }).catch(function (error) {
        console.log(error)
        // Handle Errors here.
        let errorCode = error.code
        let errorMessage = error.message
        // The email of the user's account used.
        let email = error.email
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential
        // ...
      })
    },
    login: function (event) {
      this.errors = []
      event.preventDefault()
      let account = {
        username: this.loginUsername,
        password: this.loginPassword
      }
      axios.post('http://localhost:3000/login', account)
        .then(result => {
          localStorage.setItem('token', result.data.token)
          location.reload()
        })
        .catch(error => {
          this.errors.push(error.response.data)
        })
    },
    signup: function (event) {
      this.errors = []
      event.preventDefault()
      let account = {
        username: this.registerUsername,
        email: this.registerEmail,
        password: this.registerPassword
      }
      axios.post('http://localhost:3000/signup', account)
        .then(result => {
          this.signedUp = true
        })
        .catch(error => {
          this.errors = error.response.data.errors
        })
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
.options{
  min-height: 50rem;
  padding: 0 5rem;
  display:flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: $blank;
  color:white;
}
button{
  background-color:$blank;
  color:white;
  border:0;
  cursor: pointer;
    &:active,&:focus{
    outline:none
  }
  &:hover{
    color: $backgroundColor3;
  }

}
.inputwrapper{
  background-color:$blank;
  color:white;
  display:flex;
  flex-wrap:wrap;
  justify-content: center;
  font-size:1.5rem;
  margin-top:2.5rem;
  input{
    width:100%;
    text-align: center;
    border:none;
    height:3.5rem;
    border-radius:1rem;
    &:active, &:focus{
      outline:none;
    }
  }
}
</style>
