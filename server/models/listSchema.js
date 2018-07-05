const mongoose = require("mongoose")
const Schema = mongoose.Schema
mongoose.connect("mongodb://user1:12345a@ds227481.mlab.com:27481/todolistaaaa")

const listSchema = new Schema({
    name:String,
    finished:Boolean,
    userId:{type:Schema.Types.ObjectId,ref:'User'},
},{timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}})

const listModel = mongoose.model('List',listSchema)

module.exports = { listModel,listSchema }