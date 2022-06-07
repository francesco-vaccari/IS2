const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const jwt = require('jsonwebtoken')


router.post('/', async function(req, res) {

	let user = await User.findOne({
		username: req.body.username
	}).exec()

	if (!user) {
		res.json({ success: false, error: 'Authentication failed. User not found.' })
		return
	} else {
		
		if (user.password != req.body.password) {
			res.json({ success: false, error: 'Authentication failed. Wrong password.' })
			return
		}

		var payload = {
			username: req.body.username
		}
		var options = {
			expiresIn: 86400
		}
		var token = jwt.sign(payload, process.env.SUPER_SECRET, options)
	
		res.json({
			success: true,
			token: token,
			username: user.username,
			self: "./api/v2/users/me"
		})
		return
	}
})



module.exports = router