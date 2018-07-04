const mongoose = require("mongoose")
const Schema = mongoose.Schema
mongoose.connect("mongodb://localhost:27017/todolist")

const listSchema = new Schema({
    name:String,
    finished:Boolean,
    userId:{type:Schema.Types.ObjectId,ref:'User'},
},{timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}})

const listModel = mongoose.model('List',listSchema)

module.exports = { listModel,listSchema }