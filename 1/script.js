import express from 'express'

const app = express()

app.use((req,res,next)=>{
    console.log('Middleware 1')
    next()
})

app.use('/about',(req,res,next)=>{
    console.log('Middleware for about page')
    next()
})

app.get('/', (req,res)=>{
    res.send('Hello ')
    console.log('User hitted this  `/`')
})

app.get('/about', (req,res)=>{
    res.send('This is About Page. ')
    console.log('User hitted this  `/about`')
})

app.get('/profile', (req,res,next)=>{
    return next(new Error('Fucked UP'))
})

app.use((err,req,res,next)=>{
    console.log(err.message)
    res.status(500).send('Something went wrong')
})

app.listen(3000,()=>{
    console.log('Express is listening on port 3000!')
})