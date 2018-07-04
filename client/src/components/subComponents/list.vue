<template>
    <div v-if="!deleted" class="list">
      <div v-if="!editMode && !removeMode">
        <input class="checkbox" @click="check" type="checkbox" name="" :id="id" ref="checker">
      </div>
      <form v-if="editMode" @submit="editList($event)" action="">
        <input class="inputEdit" type="text" :value="nameList" ref="editContent">
        <button class="edit" style="background:none;border:0;padding:0" type="submit">edit</button>
        <button class="delete" style="background:none;border:0;padding:0" @click="cancelEditForm()">cancel</button>
      </form>
        <div v-if="!editMode && !removeMode">
          <p ref="showContent">{{nameList}}</p>
          <p class="time">created at: {{createdTime}}</p>
          <a class="edit" @click="editListForm()">edit</a>
          <a class="delete" @click="promptremoveList()">delete</a>
        </div>
      <div v-if="removeMode">
        <p>delete?</p>
        <button class="edit" style="background:none;border:0;padding:0" @click="removeList()">yes</button>
        <button class="delete" style="background:none;border:0;padding:0" @click="cancelremoveList()">no</button>
      </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'HomePage',
  data () {
    return {
      nameList: this.content,
      deleted: false,
      editMode: false,
      removeMode: false,
      createdTime: new Date(this.createdList)
    }
  },
  created () {
    this.createdTime = `${this.createdTime.getDate()}/${this.createdTime.getMonth()}/${this.createdTime.getFullYear()}, ${this.createdTime.getHours()}:${this.createdTime.getMinutes()}`
  },
  props: ['id', 'content', 'status', 'createdList'],
  methods: {
    check: function () {
      if (this.$refs.checker.checked) {
        this.$emit('check', this.id)
      } else {
        this.$emit('uncheck', this.id)
      }
    },
    editListForm: function () {
      this.editMode = true
    },
    cancelEditForm () {
      this.editMode = false
    },
    editList: function (event) {
      event.preventDefault()
      let updatedObj = {
        id: this.id,
        name: this.$refs.editContent.value
      }
      axios.put('http://localhost:3000/list/', updatedObj, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
          this.nameList = result.data.result.name
          this.cancelEditForm()
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    promptremoveList: function () {
      this.removeMode = true
    },
    cancelremoveList: function () {
      this.removeMode = false
    },
    removeList: function (event) {
      axios.delete('http://localhost:3000/list/' + this.id, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(() => {
          this.deleted = true
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
$backgroundColor : rgba(4, 133, 156, 0.774);
$backgroundColor2 : rgba(255, 255, 255, .404);
$backgroundColor3 : rgba(0,0,0,.3);
$backgroundColor4 : rgba(1, 217, 255, 0.842);
$blank : rgba(0,0,0,0);
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
    transition:all .3s;
    color: $backgroundColor;
  }
}
.list{
    margin-top: 1rem;
    height: 16rem;
    padding: 2rem;
    border-bottom: 1px solid white;
    display: flex;
    align-items:center;
    font-size: 1.8rem;
    position:relative;

    .time{
      position:absolute;
      font-size: .1rem;
      bottom: .4rem;
      left: .3rem;
    }

    p{
      padding:0;
      margin:0;
      margin-left: 2rem;
    }
    form{
      width:100%;
      .inputEdit{
        color:white;
        background:none;
        border:none;
        border-bottom:1px solid white;
        width:100%;
        &:active,&:focus{
          outline:none;
        }
      }

    }

    .edit{
      position:absolute;
      right: 8rem;
      bottom:1rem;
      cursor: pointer;
      &:focus,&:active{
        outline:none;
      }
      &:hover{
        transition:all .3s;
        color:$backgroundColor
      }
    }

    .delete{
      position:absolute;
      right: 0;
      bottom: 1rem;
      cursor: pointer;
      &:focus,&:active{
        outline:none;
      }
      &:hover{
        transition:all .3s;
        color:$backgroundColor
      }
    }

    .checkbox{
      -webkit-appearance: none;
      background-color: #fafafa;
      border: .1rem solid #cacece;
      padding: .9rem;
      border-radius: .3rem;
      display: inline-block;
      position: relative;
      cursor: pointer;
      &:focus{
        outline:none;
      }
      &:active, &:checked:active {
        outline:none;
      }
      &:checked {
        background-color:$backgroundColor;
        border: .1rem solid #adb8c0;
        color: #99a1a7;
        outline:none;
      }
      &:checked:after {
        font-size: 1.4rem;
        position: absolute;
        top: 0;
        left: .3rem;
        color: #99a1a7;
        outline:none;
      }
    }
}
</style>
