const express = require('express')
const Taskroutes = require('./Router/Taskrouter')
const Userroutes = require('./Router/Userrouter')
require('./mongodb')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(Userroutes)
app.use(Taskroutes)

app.listen(port, () => {
    console.log('listening on port')
})