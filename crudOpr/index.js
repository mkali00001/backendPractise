const express = require('express')
const userModel = require('./userModel')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello From the root path!')
})

app.get('/create', async (req, res) => {
    let createUser = await userModel.create({
        name: 'kaif',
        username: 'mkali',
        email: 'mkali@gmail.com'
    })
    res.send(createUser)
    console.log(createUser)
})

app.get('/update',async(req,res)=>{
    let updatedUser = await userModel.findOneAndUpdate({username:'mkali'},{name:'Mohammad Kaif Ali Ansari'},{new:true})
    res.send(updatedUser)
})

app.get('/read',async(req,res)=>{
    let users = await userModel.find()
    res.send(users)
})

app.get('/delete', async(req,res)=>{
    let deletedUser = await userModel.findOneAndDelete({name:'kaif'})
    res.send(deletedUser)
})

app.listen(3000, () => {
    console.log("Server Started")
})