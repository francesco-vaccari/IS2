const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const User = require('../../models/User')

router.post('/', (req, res) => {
    const check = User.findOne({ "username": req.body.username}, 'username', (err, result) => {
        if(isNull(result)){
            const user = new User({
                username: req.body.username,
                password: req.body.password
            })
            user.save()
            .then(data => {
                let id = user.id
                res.location('/api/v1/user/' + id).status(201).send()
            })
        } else {
            res.status(400).json({ error: "Username già esistente" })
            return
        }
    })
})

router.get('/:id', (req, res) => {
    const user = User.findById(req.params.id, 'username password', (err, result) => {
        if(isNull(err)){
            res.status(200).json({ username: result.username, password: result.password})
        } else {
            res.status(404).json({ error: "Utente non trovato"})
        }
    })
})

module.exports = router