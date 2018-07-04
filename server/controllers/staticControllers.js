const models = require('../models')
const {User} = models
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const helper = require('../helpers')

module.exports={
    signup: (req,res)=>{
        let {username,password,email} = req.body
        password = bcrypt.hashSync(password, 10);
        let newUser = new User({
            username,
            password,
            todoList:[],
            email
        })
        User.create(newUser,(err,data)=>{
            if(err) res.status(400).json(err)
            res.status(200).json({
                msg: "data has been added",
                data
            })
        })
    },
    login: (req,res)=>{
        let { username, password } = req.body
        
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        let dataSearch = regex.test(username)?{ email:username }:{ username }

        User.findOne( dataSearch ,(err,data)=>{
            if(!data)return res.status(400).json({msg:"data tidak ditemukan!"}) 
            if(bcrypt.compareSync(password, data.password)){
                jwt.sign({ id:data._id,username:data.username },process.env.SECRETKEY,(err,result)=>{
                    if(err) res.status(400)
                    res.status(200).json({
                        token:result
                    })
                })
            }else{
                res.status(403).json({
                    msg: "password yang dimasukkan salah!"
                })
            }

        })
    },
    facebookLogin:(req,res)=>{
        let { email } = req.body
        User.findOne({ email },(err,data)=>{
            if(err) return res.status(400).json({msg:'terjadi kesalahan', err})
            if(!data){
                function userAvailable(){
                    let newName = helper.generateRandomUser()
                    User.findOne({ username:newName }, (err,result)=>{
                        if(err) throw err
                        if(result) return userAvailable()
                        let newUser = {
                            username:newName,
                            email,
                            password:'',
                            postsUploaded:[],
                            postsUpvoted:[]
                        }
                        User.create(newUser)
                        .then(FBuserCreated =>{
                            jwt.sign({ id:FBuserCreated._id,username:FBuserCreated.username },process.env.SECRETKEY,(err,result)=>{
                                if(err) res.status(400).json({msg:'terjadi kesalahan', err})
                                res.status(200).json({
                                    token:result,
                                    id:FBuserCreated._id,
                                    username:FBuserCreated.username,
                                })
                            })
                        })
                        .catch(error =>{
                            res.status(400).json({
                                msg:'terjadi kesalahan!',
                                error,
                            })
                        })
                    })
                }
                userAvailable()
            }else{
                jwt.sign({ id:data._id,username:data.username },process.env.SECRETKEY,(err,result)=>{
                    if(err) res.status(400).json({msg:'terjadi kesalahan', err})
                    res.status(200).json({
                        token:result,
                        id:data._id,
                        username:data.username,
                    })
                })
            }
        })
    },
}