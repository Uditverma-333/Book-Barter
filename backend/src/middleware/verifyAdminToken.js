const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

const verifyAdminToken =  (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    // console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid credientials' });
        }
        req.user = user;
        next();
    })

}

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from the Authorization header

    if (!token) {
        return res.status(403).send({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
        req.user = decoded; // Attach the user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Invalid Token', err);
        return res.status(403).send({ message: 'Invalid token' });
    }
};

module.exports = {verifyAdminToken, verifyToken};