const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
app.use(cookieParser())

app.get('/',(req,res)=>{
    let token = jwt.sign({email:"mkali0000@gmail.com"}, "secret")
    console.log(token)
    res.cookie('token', token)
    res.send("Home")
})

app.get('/read', (req,res)=>{
    console.log(req.cookies.token)
    res.send("read")
})

app.get('/verify', (req,res)=>{
    let data = jwt.verify(req.cookies.token, "secret");
    console.log(data)
    res.send("verify")
})
app.listen(3000,()=>{
    console.log('Server Started!')
})


// =======================================================================================
// const express = require('express')
// const bcrypt = require('bcrypt')
// const app = express()

// app.get('/',(req,res)=>{
//     res.send("home")
//     bcrypt.compare('mkalissd', '$2b$10$qNeGzM1/kvNr4AK45vFzD.zfXS08mzGZULIWGEPB3J0bymaxrwuFq', function(err, result) {
//         console.log(result)
//     });
// })

// app.listen(3000,()=>{
//     console.log('Server Started!')
// })


// ===========================================================================================
// const cookieParser = require('cookie-parser')
// const express = require('express')

// const app = express()
// app.use(cookieParser())

// app.get('/',(req,res)=>{
//     res.cookie("name","kaif")
//     res.send('Hey ther! this is home page.')
// })

// app.get('/read',(req,res)=>{
//     res.send('this is read')
//     console.log(req.cookies)
// })

// app.listen(3000,()=>{
//     console.log('Server Started!')
// })