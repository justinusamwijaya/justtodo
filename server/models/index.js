const { userSchema, userModel } = require('./userSchema.js');
const { listSchema, listModel } = require('./listSchema.js');

const User = userModel
const List = listModel

listSchema.pre('save', function(next) {
    User.findById(this.userId,(err,userFound)=>{
        if(err) return res.status(400)
        userFound.todoLists.push(this)
        userFound.save()
        next();
    })
});

listSchema.pre('remove', function(next) {
    User.update(
        { }, 
        { $pull: { todoLists: this._id } },
        { multi: true })
    .exec();
    next();
})

module.exports = { User, List, listSchema }