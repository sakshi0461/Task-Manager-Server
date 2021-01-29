const jwt = require('jsonwebtoken')
const User = require('../model/User')

const auth = async (req,res,next) => {
   try{
       const token = req.header('Authentication')
       const decoder = jwt.verify(token,'TaskManager')
       const user = await User.findOne({_id:decoder._id , 'tokens.token':token})
       
       if(!user){
           throw new Error('Authentication failed!!')
       }
       
       req.token = token
       req.user = user
       next()
   }catch(err){
       res.status(400).send('Please authenticate')
   }
}

module.exports = auth