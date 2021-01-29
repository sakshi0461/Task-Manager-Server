// const {MongoClient , ObjectId} = require('mongodb')

// const connectionurl = 'mongodb://127.0.0.1:27017'
// const databaseName = 'test-manager'

// MongoClient.connect(connectionurl, {useNewUrlParser: true}, (error,res)=> {
//     if(error){
//        return console.log(error.errmsg)
//     }
    
//     const db = res.db(databaseName)

//     //CREATE

//     db.collection('users').insertMany([
//     {
//         description:'1',
//         complete:true
//     },{
//         description:'2',
//         complete:false
//     },{
//         description:'3',
//         complete:false
//     }], (error, result) => {
//            if(error){
//                return console.log(error.errmsg)
//            }
//           console.log(result.ops)
//     })

//     //READ

//     db.collection('users').findOne({ description:'1'},(user) => {
//         console.log(user)
//     })

//     db.collection('users').find({complete:false}).toArray((user) => {
//         console.log(user)
//     })

//     //UPDATE

//     db.collection('users').updateOne({
//         _id: new ObjectId("60056f4fdf7e7638503759d3")
//     },{
//         $set: {
//           complete: false
//         }
//     }).then((result) => {
//         console.log(result.modifiedCount)
//     }).catch((err) => {
//        return console.log(error)
//     })

//     //DELETE

//     db.collection('users').deleteMany({
//         name:'Sakshi'
//     }).then((result) => {
//         console.log(result.deletedCount)
//     }).catch((err) => {
//         console.log(err)
//     })
// })

const mongoose = require('mongoose')
const connectionurl = process.env.MONGODB_URL

mongoose.connect(connectionurl,{ 
   useNewUrlParser:true,
   urlCreateIndex:true,
})

// const hari = new User({
//     description:'I am a good boi',
//     completed:true
// })

// hari.save().then((res) =>{
//     console.log(res)
// }).catch((err) =>{
//     console.log(err)
// })