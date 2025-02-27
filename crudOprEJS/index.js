const express = require('express')
const path =  require('path')
const userModel = require('./models/user')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/read', async (req,res)=>{
    let allusers = await userModel.find()
    console.log(allusers)
    res.render('read',{users : allusers})
})

app.post('/create-user',async (req,res)=>{
    let createdUser = await userModel.create({
        name : req.body.name,
        email : req.body.email,
        imageUrl : req.body.imageUrl
    })
    res.redirect('/read')
})

app.get('/delete/:id',async (req,res)=>{
    console.log(req.params.id)
    let deletedUser = await userModel.findOneAndDelete({_id:req.params.id})
    res.redirect('/read')
})

app.get('/edit/:userid', async(req,res)=>{
    // res.send(req.params.userid)
    let user = await userModel.findOne({_id:req.params.userid})
    console.log(user)
    res.render('edit',{user})

})

app.post('/update/:id', async (req,res)=>{
    // res.send(req.params.id)
    console.log(req.body)
    let {name, email, imageUrl} = req.body;
    let upadateUser = await userModel.findOneAndUpdate({_id:req.params.id}, {name:name, email:email, imageUrl:imageUrl}, {new:true})
    res.redirect('/read')
})


app.listen(3000,()=>{
    console.log("Server started!")
})