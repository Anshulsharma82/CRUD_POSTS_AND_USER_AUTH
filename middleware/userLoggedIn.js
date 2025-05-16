import jwt from 'jsonwebtoken'

const isUserLoggedIn = (req,res,next) => {

    if(!req.cookies.token) {
        res.status(400).json({msg: 'Token is missing'})
    }

    const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN 
    const tokenData = jwt.verify(req.cookies.token, JWT_SECRET_TOKEN)

    if(!tokenData) {
        return res.status(400).json({msg: 'Invalid Token'})
    }

    req.user = tokenData
    next();

}

export default isUserLoggedIn;