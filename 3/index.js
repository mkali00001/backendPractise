const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/profile/:username',(req,res)=>{
    let user = req.params.username
    res.render('users',{user:user})
})

app.listen(3000, () => {
    console.log("Express server is listening on port number 3000!")
})
