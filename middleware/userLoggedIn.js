import jwt from 'jsonwebtoken'
import { createCustomError } from '../errors/customError.js'

const isUserLoggedIn = (req,res,next) => {

    if(!req.cookies.token) {
       return next(createCustomError(1503,'Token is missing. Please login to continue'))
    }

    const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN 
    const tokenData = jwt.verify(req.cookies.token, JWT_SECRET_TOKEN)

    if(!tokenData) {
       return next(createCustomError(1503,'Invalid Token. Please login to continue'))
    }

    req.user = tokenData
    next();

}

export default isUserLoggedIn;