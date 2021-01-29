const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const UserSchema = new mongoose.Schema({
    name:{
      type:String,
      required: true,
      trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        lowercase: true,
        validate(value) {
           if(!validator.isEmail(value)){
             throw new Error('Invalid email')
           }
        }
      },
      password: {
        type: String,
        require: true,
        minlength: 6,
        trim: true,
      },
      age:{
        type: Number,
        default:0,
        validate(value) {
          if(value<0){ 
            throw new Error('Invalid age')
          }
        }
      },
      tokens:[{
        token:{
          type:String,
          required:true
        }
      }],
      avatar:{
        type: Buffer
      }
},{
  timestamps:true
})


UserSchema.methods.toJSON = async () => {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

UserSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})


UserSchema.methods.generateAuthToken = async () => {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JSON_SECRET)
    user.tokens = user.tokens.concat({token: token})
    await user.save()
    return user
}


UserSchema.statics.findByCredentials = async (email, password) =>{
  const user = await User.findOne({email})

  if(!user){
    throw new Error('Either email or password is wrong')
  }
 
  const isMatch = await bcrypt.compare(user.password,password)
  console.log(password)
  if(!isMatch){
    throw new Error('Either email or password is wrong')
  }
  return user
}


UserSchema.pre('save',async function(next){
  const user = this
  if(user.isModified('password')){
  bcrypt.hash(user.password,8).then(data => user.password=data)
  }
  next()
})


UserSchema.pre('remove', async function(next){
   const user = this
   await Task.deleteMany({owner : user._id})
   next()
})


const User = mongoose.model('User',UserSchema)

module.exports = User