const express = require('express')
const app = new express.Router
const Task = require('../model/task')

app.get('/tasks', auth , async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
      match.completed = req.query.completed === 'true'
    }

    if(req.query.sort){
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
    //   const task = await Task.find({owner : req.user._id})
    await req.user.populate({
      path:'tasks',
      match,
      option:{
          limit:parseInt(req.query.limit),
          skip:parseInt(req.query.skip)
          sort
      }
    }).execPopulate()

      res.send(req.user.tasks)
    }catch(err){
      res.status(400).send(err)
    }
 })
 
 app.get('/tasks/:id', auth , async (req, res) => {
    const _id = req.params.id
    try{
      const task = await Task.findOne({_id, owner : req.user._id})
      if(!task){
          return res.status(404).send('Task not found')
      }
      res.send(task)
    }catch(err){
      res.status(400).send(err)
    }
 })
 
 app.post('/tasks', auth , async (req,res) => {
     const task = {
         ...req.body,
         owner:req.user._id
     }
     try{
       await task.save()
       res.send(task)
     }catch(err){
         res.status(400).send(err)
     }
 })
 
 app.patch('/tasks/:id', async (req, res) => {
     const requiredUpdates = Object.keys(req.body)
     const allowedUpdate = ['description','completed']
     const isValidUpdate = requiredUpdates.every((update) => allowedUpdate.includes(update))
 
     if(!isValidUpdate){
        res.status(400).send('Invalid update')
     }
 
     try{
        const task = await Task.findOne({_id: req.params.id , owner: req.user._id})
        
        if(!task){
            return res.status(404).send('Task not found')
        }
        
        requiredUpdates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
     }catch(err){
         res.status(400).send(err)
     }
 })
 
 app.delete('/tasks/:id', auth , async (req, res) => {
     try{
         const task = await Task.findOneAndDelete({_id:req.params.id , owner:req.user._id})
         if(!task){
             return res.status(400).send('Task was not found')
         }
         res.send(task)
     }catch(err){
         res.status(400).send(err)
     }
 })

module.exports = app