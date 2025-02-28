const express = require('express')
const app = express()
const userModel = require('./models/user')
const postModel = require('./models/post')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    res.send("Home Page")
})

app.get('/create', async (req, res) => {
    let user = await userModel.create({
        username: "kaif",
        email: "mkali@gmail.com",
        age: 23,
    })

    res.send(user)
})

app.get('/post/create', async (req, res) => {
    let post = await postModel.create({
        postdata: "Hello World!",
        user: "67c1e18ae41edf969883f690"
    })

    let user = await userModel.findOne({_id : "67c1e18ae41edf969883f690"})
    user.posts.push(post._id)
    await user.save()
    res.send({post, user})
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})