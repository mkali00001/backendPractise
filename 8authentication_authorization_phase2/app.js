const express = require('express')
const bcrypt = require('bcryptjs')
const path = require('path')
const cookieParser = require('cookie-parser')
const userModel = require('./models/usermodel')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.render('index')
})


app.post('/create-user', async (req, res) => {
    let user = await req.body
    console.log(req.body)
    let { username, email, password, age } = await req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({ username: username, email: email, age: age, password: hash })
            let token = jwt.sign({email}, "shhhhhh")
            res.cookie("token",token)
            res.send(createdUser)
        })
    })
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async (req,res)=>{
    console.log(req.body)
    let user = await userModel.findOne({email:req.body.email})
    if(!user){
        return res.send("Please check your email or password!")
    }

    bcrypt.compare(req.body.password, user.password, (err, result)=>{
        if(result){
            let token = jwt.sign({email: user.email}, "shhhh")
            res.cookie("token", token)
            res.send("you're logged in")
        }else{
            res.send("Please check your email or password!")
        }
    })
})

app.get('/logout',async (req,res)=>{
    res.cookie("token", "")
    res.redirect('/')
})


app.listen(3000, () => {
    console.log("App is listening on port number 3000")
})