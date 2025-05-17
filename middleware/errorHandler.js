import { CustomError } from '../errors/customError.js'
// ../errors/customError
const errorHandler = (err,req,res,next) => {
    if(err instanceof CustomError) {
       return res.status(400).json({ statusCode: err.statusCode, msg: err.message})
    }
    else {
        console.log("Error from errorHandler middleware", err)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}

export default errorHandler;