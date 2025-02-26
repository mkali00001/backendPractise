const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        res.render('index', { files: files })
    })
})

app.get('/files/:fileName', (req, res) => {
    fs.readFile(`./files/${req.params.fileName}`, 'utf-8', (err, fileData) => {
        console.log(fileData)
        res.render('show', { fileData: fileData, fileName: req.params.fileName })
    })
})

app.get('/edit/:fileName', (req, res) => {
    res.render('edit', { fileName: req.params.fileName })
})

app.post('/edit', (req, res) => {
    let pName = req.body.preFilename
    let newName = req.body.newFilename
    fs.rename(`./files/${pName}`, `./files/${newName}`, (err) => {
        res.redirect('/')
    })
})

app.post('/create', (req, res) => {
    console.log(req.body)
    fs.writeFile(`./files/${req.body.taskName.split(' ').join('')}.txt`, req.body.taskDesc, (err) => {
        // console.log(err)
    })
    res.redirect('/')
})

app.listen(3000, () => {
    console.log("Express is listening on port number 3000")
})