<template>
  <div>
    <errorHandlers id="errorHandlers" v-for="(error,i) in errors" :key="i" :message="error.msg" />
    <div @click="cancel()" id="changebackground" v-if="addListToggle || deleteMarkedToggle">
    </div>
    <b-row>
      <b-col id="topMenuWrapper" cols=12 offset-md=2 md=8>
        <b-row>
          <b-col id="unfinished" class="topMenu" cols=12 md=6>
            <button @click="getAllList(false)" class="selected" ref="unfinished">
              unfinished
            </button>
          </b-col>
          <b-col id="finished" class="topMenu" cols=12 md=6>
            <button @click="getAllList(true)" ref="finished">
              finished
            </button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col id="container" class="card" offset-md=2 cols=12 md=8>
        <a id="addNewList" @click="toggleAddList()">add new list</a>
        <div id="checkedMenu" v-if="checkedList.length > 0">
          <button id="checkedFinished" @click="toggleFinishedStatus()">mark as {{finishstatus === 'finished' ? 'unfinished' : 'finished'}}</button>
          <button id="checkedDelete" @click="promptdeletemarked()">delete marked lists</button>
        </div>
        <div v-if="deleteMarkedToggle" id="deletePrompt" class="card">
          delete marked List?
          <button id="acceptdeletePrompt" @click="deletemarkedList()">yes</button>
          <button id="canceldeletePrompt" @click="cancel()">no</button>
        </div>
        <div id="addListPanel" class ="card" v-if="addListToggle">
          Add a New List
          <form @submit="addnewList($event)" action="" id="formaddProduct">
            <input v-model="addListInput" placeholder="type your new List here..." style="width:100%;" type="text">
            <div style="padding:.7rem;">
              <button type="submit"> add List </button>
            </div>
          </form>
        </div>
        <a id="logout" @click="logout()">Logout</a>
        <b-col cols=12 v-if=" allList.length < 1 " class="noList">
          <h3 v-if="finishstatus === 'unfinished'">
            You don't have any to do lists yet
          </h3>
          <h3 v-else>
            You haven't finished any to do list yet
          </h3>
        </b-col>
        <List v-else @uncheck="removefromCheck" @check="addtoCheck" v-for="list in allList" :key="list._id" :id=list._id :content=list.name :status=list.finished :createdList=list.createdAt />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import List from '../subComponents/list.vue'
import errorHandlers from '../subComponents/errorHandlers.vue'
import axios from 'axios'
export default {
  name: 'HomePage',
  components: { List, errorHandlers },
  data () {
    return {
      allList: [],
      addListToggle: false,
      deleteMarkedToggle: false,
      addListInput: '',
      checkedList: [],
      finishstatus: 'finished',
      keys: {37: 1, 38: 1, 39: 1, 40: 1},
      errors: []
    }
  },
  created () {
    this.getAllList()
  },
  methods: {
    preventDefault: function (e) {
      e = e || window.event
      if (e.preventDefault) { e.preventDefault() }
      e.returnValue = false
    },

    preventDefaultForScrollKeys: function (e) {
      if (this.keys[e.keyCode]) {
        preventDefault(e)
        return false
      }
    },
    enableScroll: function () {
      if (window.removeEventListener) { window.removeEventListener('DOMMouseScroll', this.preventDefault, false) }
      window.onmousewheel = document.onmousewheel = null
      window.onwheel = null
      window.ontouchmove = null
      document.onkeydown = null
    },
    promptdeletemarked: function () {
      window.onwheel = this.preventDefault
      window.onmousewheel = document.onmousewheel = this.preventDefault
      window.ontouchmove = this.preventDefault
      document.onkeydown = this.preventDefaultForScrollKeys

      this.deleteMarkedToggle = true
    },
    cancel: function () {
      this.errors = []
      this.addListToggle = false
      this.deleteMarkedToggle = false
      this.enableScroll()
    },
    deletemarkedList: function () {
      this.errors = []
      let listObj = {
        listArray: this.checkedList
      }
      axios.post('http://localhost:3000/list/delete', listObj, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
          this.deleteMarkedToggle = false
          this.getAllList(this.finishstatus === 'finished')
          this.enableScroll()
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addtoCheck: function (x) {
      this.checkedList.push(x)
    },
    removefromCheck: function (x) {
      this.checkedList.splice(this.checkedList.indexOf(x), 1)
    },
    getAllList: function (status) {
      this.checkedList = []
      if (!status) {
        if (this.$refs.unfinished !== undefined) {
          this.$refs.finished.classList.remove('selected')
          this.$refs.unfinished.classList.add('selected')
        }
        this.finishstatus = 'unfinished'
        axios.get('http://localhost:3000/list/', { headers: { authorization: 'bearer ' + localStorage.getItem('token'), finished: false } })
          .then(allList => {
            this.allList = allList.data.allList.reverse()
          })
          .catch(error => {
            if (error.response.status === 403) {
              localStorage.removeItem('token')
            }
          })
      } else {
        this.$refs.finished.classList.add('selected')
        this.$refs.unfinished.classList.remove('selected')
        this.finishstatus = 'finished'
        axios.get('http://localhost:3000/list/', { headers: { authorization: 'bearer ' + localStorage.getItem('token'), finished: true } })
          .then(allList => {
            this.allList = allList.data.allList.reverse()
          })
          .catch(error => {
            if (error.response.status === 403) {
              localStorage.removeItem('token')
            }
            console.log(error.response)
          })
      }
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    logout: function () {
      localStorage.removeItem('token')
      location.reload()
    },
    toggleAddList: function () {
      window.onwheel = this.preventDefault
      window.onmousewheel = document.onmousewheel = this.preventDefault
      window.ontouchmove = this.preventDefault
      document.onkeydown = this.preventDefaultForScrollKeys

      this.addListToggle = true
    },
    toggleFinishedStatus: function () {
      let listObj = {
        listArray: this.checkedList
      }
      axios.put('http://localhost:3000/list/changeFinishedStatus', listObj, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
          this.getAllList(this.finishstatus === 'finished')
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addnewList: function (event) {
      this.errors = []
      event.preventDefault()
      let newList = {
        name: this.addListInput
      }
      axios.post('http://localhost:3000/list/', newList, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
          this.addListInput = ''
          this.allList.splice(0, 0, result.data.result)
          this.addListToggle = false
          this.enableScroll()
        })
        .catch(error => {
          this.errors.push(error.response.data)
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

#errorHandlers{
  position:fixed;
  z-index:1002
}
button{
  color:white;
  cursor: pointer;
  background: none;
  border: 0;
  z-index:999;
  &:active,&:focus{
    outline:none
  }
  &:hover{
    color: $backgroundColor;
    transition:all .3s;
  }
}
.selected{
  background-color:$backgroundColor3 !important;
  color:white;
}
#topMenuWrapper{
  font-size:1.5rem;
  border-radius: 1rem;
  height:5rem;
  margin-top:5rem;
  margin-bottom:5rem;
  background-color:rgba(0,0,0,0);
  .row{
    height:100%;
    .topMenu{
      height:100%;
      text-align: center;
      padding:0;
    }
    #finished{
      button{
        cursor: pointer;
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
        width:100%;
        height:100%;
        background:none;
        border:0;
        &:active,&:focus{
          outline:none;
        }
        &:hover{
          background-color:$backgroundColor;
          color:white;
          transition:all .3s;
        }
      }
    }
    #unfinished{
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
      button{
        cursor: pointer;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        width:100%;
        height:100%;
        background:none;
        border:0;
        &:active,&:focus{
          outline:none;
        }
        &:hover{
          background-color:$backgroundColor;
          color:white;
          transition:all .3s;
        }
      }
    }
  }
}
#container{
  font-size:1.5rem;
  padding: 5rem;
  padding-bottom:10rem;
  position: relative;
  margin-bottom:5rem;
  background-color:$backgroundColor2;
  border:0;
  border-radius:3rem;
  color:white;
  #checkedMenu{
    position:absolute;
    top:3rem;
    width:100%;
    display:flex;
    justify-content: center;
    #checkedFinished{
      padding:2rem;
      cursor: pointer;
      &:hover{
        color:$backgroundColor;
        transition:all .3s;
      }
    }
    #checkedDelete{
      padding:2rem;
      cursor: pointer;
      &:hover{
        color:$backgroundColor;
        transition:all .3s;
      }
    }
  }
  #deletePrompt{
    top:10rem;
    font-size:2rem;
    left: 20rem;
    position: fixed;
    height: 50rem;
    width: 75%;
    display:flex;
    justify-content: center;
    align-items:center;
    background-color:$backgroundColor2;
    z-index:1001;
    border-radius:1rem;
    #acceptdeletePrompt{
      position:absolute;
      border:0;
      background:none;
      bottom: 5rem;
      left: 7rem;
      &:hover{
        color:$backgroundColor4;
        transition:all .3s;
      }
    }
    #canceldeletePrompt{
      position:absolute;
      border:0;
      background:none;
      bottom:5rem;
      right:7rem;
      &:hover{
        color:$backgroundColor4;
        transition:all .3s;
      }
    }
  }
  #addNewList{
    position:absolute;
    top:2rem;
    right:12rem;
    z-index:1000;
    cursor: pointer;
    &:hover{
      color:$backgroundColor;
      transition:all .3s;
    }
  }
  #addListPanel{
    z-index:1002;
    position:fixed;
    padding:2rem;
    top:30rem;
    right:12rem;
    height:15rem;
    width:75%;
    border-radius:1rem;
    background-color:$backgroundColor2;
    form{
      input{
        padding: 1rem;
        border:none;
        cursor:text;
        border-radius: 1rem;
        &:active, &:focus{
          outline:none
        }
      }
      button{
        &:hover{
          color:$backgroundColor4;
          transition:all .3s;
        }
      }
    }
  }
  #logout{
    position:absolute;
    top:2rem;
    right:5rem;
    z-index:1000;
    cursor: pointer;
    &:hover{
      color:$backgroundColor;
      transition:all .3s;
    }
  }
  #formaddProduct{
    width:100%;
    height:100%;
    display:flex;
    flex-wrap:wrap;
    justify-content: center;
    align-content: center;
  }
  .noList{
    display:flex;
    justify-content: center;
    align-items: center;
    h3{
      font-size:3rem;
    }
  }
}
#changebackground{
  position: fixed;
  z-index:1001;
  top:0;
  right:0;
  background-color:rgba(0,0,0,.7);
  width:100%;
  height:100vh;
}

</style>
