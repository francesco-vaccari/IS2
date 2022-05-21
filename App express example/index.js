const express = require('express')
const path = require('path')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded( { extended : true }))
app.use(express.json())

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home')
})

/////////ROUTES/////////////////////////////////
const login = require('./routes/login')
app.use('/login', login)

const signup = require('./routes/signup')
app.use('/signup', signup)

const profile = require('./routes/profile')
app.use('/profile', profile)
///////////////////////////////////////////////




app.listen(3000)