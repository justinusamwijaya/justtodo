const mongoose = require('mongoose')
const models = require('../models')
const { List } = models

module.exports={
    searchList:(req,res)=>{
        List.find({ name: { $regex: req.params.name, $options: 'i' }, userId:req.user.id }, (err,result)=>{
            if(err) return res.status(400).json({msg: err})
            res.status(200).json({
                msg: 'data has been found!',
                result
            })
        })
    },
    getAllList:(req,res)=>{
        List.find({userId:req.user.id,finished:req.headers.finished})
        .populate('userId','username email')
        .exec((err,allList)=>{
            if(err) return res.status(400)
            res.status(200).json({
                allList
            })
        })
    },
    getOneList:(req,res)=>{
        List.findById(req.params.id,(err,result)=>{
            if(err) return res.status(400)
            if(result.userId.toString() !== req.user.id.toString()) return res.status(403).json({
                msg: "you cannot view list that isn't yours"
            })
            res.status(200).json({
                result
            })
        })
    },
    addList:(req,res)=>{
        let { name }  = req.body
        if(name.trim() === "") return res.status(400).json({ msg:"cannot be blank!" })
        let newList = new List({
            name,
            finished : false,
            userId : mongoose.Types.ObjectId(req.user.id),
        })
        List.create(newList,(err,result)=>{
            if(err) return res.status(400)
            res.status(200).json({
                msg: "data berhasil dimasukkan!",
                result
            })
        })
    },
    updateList:(req,res)=>{
        List.findById(req.body.id,(err,listToUpdate)=>{
            if(listToUpdate.userId.toString() !== req.user.id.toString()){
                res.status(403).json({
                    msg: "you cannot edit list that isn't yours"
                })
            }else{
                let { name } = req.body

                let updatedList = {
                    name
                }
                List.updateOne({_id:req.body.id},updatedList,(err,result)=>{
                    if(err) return res.status(400)
                    List.findById(req.body.id,(err,updatedData)=>{
                        res.status(200).json({
                            msg: "data berhasil diupdate!",
                            result:updatedData
                        })
                    })
                })
            }
        })
    },
    changeFinishTask:(req,res)=>{
        let listArray = req.body.listArray
        function finishTaskFunction(x){
            if( x === listArray.length ){
                res.status(200).json({
                    msg:'we did it??'
                })
            }else{
                List.findById(listArray[x],(err,listToUpdate)=>{
                    if(listToUpdate.userId.toString() !== req.user.id.toString()) {
                        finishTaskFunction(x+1)
                    }else{
                        listToUpdate.finished = !listToUpdate.finished
                        listToUpdate.save(err=>{
                            if(err) return res.status(500)
                            finishTaskFunction(x+1)
                        })
                    }
                })
            }
        }

        finishTaskFunction(0)
    },
    deleteList:(req,res)=>{
        if(req.body.listArray){
            let listArray = req.body.listArray
            function deleteMultiple(x){
                if( x === listArray.length ){
                    res.status(200).send('you did it!')
                }else{
                    List.findById(listArray[x],(err,listToDelete)=>{
                        if(listToDelete.userId.toString() !== req.user.id.toString()) {
                            deleteMultiple(x+1)
                        }else{
                            listToDelete.remove((err,result)=>{
                                if(err) return res.status(400)
                                deleteMultiple(x+1)
                            })
                        }
                    })
                }
            }

            return deleteMultiple(0)
        }
        List.findById(req.params.id,(err,listToDelete)=>{
            if(listToDelete.userId.toString() !== req.user.id.toString()) {
                res.status(403).json({
                    msg: "you cannot delete list that isn't yours"
                })
            }else{
                listToDelete.remove((err,result)=>{
                    if(err) return res.status(400)
                    res.status(200).json({
                        msg: "data berhasil dihapus!"
                    })
                })
            }
        })
    },
}
