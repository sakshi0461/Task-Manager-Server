const express = require('express')
const app = new express.Router
const User = require('../model/User')
const auth = require('../authentication/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeemail , sendCancelemail} = require('../email/account')

//get all the users
app.get('/users/me',auth , async (req, res,next) => {
    res.send(req.user)
})


//Get the avatar by user id
app.get('/users/:id/avatar', auth , async (req,res) => {
    try{
        const user = await findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-type','image/jpg')
        res.send(user.avatar) 
    }catch(err){
        res.status(400).send(err)
    }
})
// //find a user by its id
// app.get('/users/:id', async (req, res) => {
//     try{
//        const user = await User.findById(req.params.id)
//        if(!user){
//           return res.status(400).send('User dont exits')
//        }
//        res.send(user)
//     }catch(err){
//         res.status(400).send(err)
//     }
// })

//add a new user whose data is given in req.body
app.post('/users', async (req, res) => {
    try{
       const user = await new User(req.body)
       await user.save()
       sendWelcomeemail(user.email,user.name)
       const token = await user.generateAuthToken()
       res.send({user , token})
    }catch(err){
        res.status(400).send(err)
    }
})

//Login end points
app.post('/users/login', async (req, res) => {
    try{
      const user = await User.findByCredentials(req.body.email,req.body.password)
      const token = await user.generateAuthToken()
      res.send({user,token})
    }catch(err){
        res.status(400).send(err)
    }
})

//Logout
app.post('/users/logout', auth , async (req,res) => {
    try{
       req.user.tokens = req.user.tokens.filter(token => token !== req.token)
       await req.user.save()
       res.send()
    }catch(err){
        res.status(500).send(err)
    }
})

//Log Out ALL
app.post('/users/logoutAll' , auth , async (req,res) => {
    try{
      req.user.tokens = []
      await req.user.save()
      res.send()
    }catch(err){
        res.status(500).send(err)
    }
})

//Upload Profile picture
const upload = multer({
    // dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg | jpeg | png)$/)){
            return cb(new Error('Please Upload a valid image'))
        }
        cb(undefined,true)
    }
})

app.post('/users/me/avatar' , auth , upload.single('avatar') , async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error : error.message})
})


//update a user whose updates are given in req.body and validate also 
app.patch('/users/me', auth , async (req, res) => {
    const required = Object.keys(req.body)
    const allowed = ['email','password']
    const isValidUpdate = required.every(update => allowed.includes(update))

    if(!isValidUpdate){
        return res.status(400).send('Invalid Updates')
    }

      try{
        //  const user = await User.findById(req.params.id)
        //  if(!user){
        //      return res.status(400).send('User not found')
        //  }
         
         required.forEach(update => req.user[update] = req.body[update])
         await req.user.save()
         res.send(user)
      }catch(err){
          res.status(400).send(err)
      }
})

//delete all
app.delete('/users/all', async(req, res) => {
    try{
       const user = await User.deleteMany({})
       res.send(user)
    }catch(err){
        res.status(401).send(err)
    }
})


//delete a user
app.delete('/users/me',  auth ,async(req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     return res.status(400).send('User not found')
        // }
        await req.user.remove()
        sendCancelemail(req.user.email,req.user.name)
        res.send(user)
    }catch(err){
        res.status(400).send(err)
    }
})

//delete user profile photo
app.delete('/users/me/avatar', auth , async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error:error.message})
})


module.exports = app