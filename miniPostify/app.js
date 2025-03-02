const express = require('express')
const bcrypt = require('bcryptjs')
const path = require('path')
const userModel = require('./models/user')
const postModel = require('./models/post')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

app.get('/', async (req, res) => {
    res.render('index')
})

app.post('/register', async (req, res) => {
    let { name, username, age, email, password } = req.body;

    let existingUser = await userModel.findOne({
        $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
        if (existingUser.email === email) {
            return res.status(400).send("Email already exists.");
        }
        if (existingUser.username === username) {
            return res.status(400).send("Username already exists.");
        }
    }

    bcrypt.genSalt(10, async (err, salt) => {
        if (err) return res.status(500).send("Error generating salt");

        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send("Error hashing password");

            try {
                let newUser = await userModel.create({
                    name: name,
                    username: username,
                    email: email,
                    age: age,
                    password: hash,
                });

                let token = jwt.sign({ email: email, userid: newUser._id }, "shhh");
                res.cookie("token", token);
                res.send("You have been registered Please visit login page");
            } catch (error) {
                res.status(500).send("Error saving user to database");
            }
        });
    });
})

app.get('/login', async (req, res) => {
    res.render('login')
})

app.post("/login", async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email: email })
    if (!user) return res.status(500).send("Something went wrong")
    bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "shhh");
            res.cookie("token", token);
            res.status(200).redirect('profile')
        }
        else res.redirect('/')
    })
})

app.get("/logout", async (req, res) => {
    res.cookie("token", "")
    res.redirect("/login")
})

app.get("/profile", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts")
    let { name, username, email, posts } = user
    res.render('profile', { name, username, email, posts, user })
})

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id:req.params.id})
    res.render('edit', {post})
})

app.post("/update/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({_id:req.params.id}, {content : req.body.content})
    // await post.save()
    // res.redirect('/profile')
    console.log(post)
    console.log(req.body)
    res.redirect('/profile')
})


app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate('user')
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid)
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save()
    res.redirect('/profile')
})

app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    console.log(req.body)
    let { content } = req.body
    console.log(content)
    let post = await postModel.create({
        user: user._id,
        content: content
    });

    user.posts.push(post)
    await user.save()
    res.redirect("/profile")
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") res.redirect('login')
    else {
        let data = jwt.verify(req.cookies.token, "shhh")
        req.user = data
        next()
    }
}

app.listen(3000, () => {
    console.log("server started!")
})