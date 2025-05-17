import { userModel } from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { createCustomError } from '../errors/customError.js'

const registerUser = async(req,res, next) => {
    try {
        const {name,username,age,email,password} = req.body
        const doesUsernameExist = await userModel.find({ username })
        if(doesUsernameExist.length > 0) {
            return next(createCustomError(1501,'Username is in use, Please try with different username'))
        }

        const genSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,genSalt)        
        const createUser = await userModel.create({
            name,
            username,
            age,
            email,
            password: hashedPassword
        })
        const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
        const token = await jwt.sign({ userId: createUser._id, email: createUser.email }, JWT_SECRET_TOKEN)  
        res.cookie('token', token)      
        res.status(201).redirect('/profile')
    } catch (error) {
        console.log('Error occured while creating new user:::::::::', error)
        res.status(500).json({msg: 'Internal Server Error'})
    }
}

const loginUser = async(req,res, next) => {

    try {
        const { username,password } = req.body
        const userData = await userModel.find({ username})
        if(userData.length === 0) {
            return next(createCustomError(1502,'Either username or password incorrect'))
        }

        // check pwd
        const isPwdCorrect = await bcrypt.compare(password, userData[0].password)
        if(!isPwdCorrect) {
            return next(createCustomError(1502,'Either username or password incorrect'))
        }
        
        const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
        const token = await jwt.sign({ userId: userData[0]._id, email: userData[0].email }, JWT_SECRET_TOKEN)  
        res.cookie("token", token)  
        res.status(200).redirect('profile')
    } catch (error) {
        console.log("Error in Login API::", error)
        res.status(500).json({msg: 'Internal Server Error'})
    }

}

const logoutUser = (req,res) => {

    res.clearCookie('token')
    res.redirect('/login')
}

const updateProfilePicture = async (req, res) => {
    const userData = await userModel.updateOne({ _id: req.user.userId }, { profile_pic: req.file.filename })
    res.status(200).redirect("/profile")
}

const userProfile = async (req, res) => {
    const userData = await userModel.findById(req.user.userId).populate('posts')
    res.status(200).render('profile', {
        userData 
    })
}

export {
    registerUser,
    loginUser,
    logoutUser,
    updateProfilePicture,
    userProfile
}