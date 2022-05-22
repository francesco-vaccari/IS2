const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.render('signup', { message: req.query.message, username: req.query.username})
})

router.post('/', (req, res) => {

    const check = User.findOne({ "username": req.body.username}, 'username', (err, result) => {
        if(isNull(result)){
            const user = new User({
                username: req.body.username,
                password: req.body.password
            })
            user.save()
            .then(data => {
                res.redirect('/profile/' + req.body.username)
            })
        } else {
            res.redirect('/signup?username=' + req.body.username + '&message=ERRORE: username già registrato')
        }
    })

    
})

module.exports = router