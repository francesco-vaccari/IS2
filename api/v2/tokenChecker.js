const jwt = require('jsonwebtoken')

const tokenChecker = function(req, res, next) {
	
	var token = req.body.token || req.query.token || req.headers['x-access-token']

	if (!token) {
		return res.status(401).send({ 
			success: false,
			error: 'No token provided.'
		})
	}

	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			})
		} else {
			req.loggedUser = decoded;
			next()
		}
	});
	
};

module.exports = tokenChecker