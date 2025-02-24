import express, { json, urlencoded } from 'express'

const app = express()
app.use(json())
app.use(urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send("Home page")
})

app.get('/about',(req,res)=>{
    res.send('about Page')
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})