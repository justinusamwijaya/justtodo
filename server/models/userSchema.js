const mongoose = require("mongoose")
const Schema = mongoose.Schema
mongoose.connect("mongodb://localhost:27017/todolist")

const userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    todoLists:[{type:Schema.Types.ObjectId,ref:'List'}]
},{timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}})

const userModel = mongoose.model('User', userSchema)

module.exports = { userModel,userSchema }