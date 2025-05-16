import express from "express"
const Router = express.Router()
import { userModel } from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

Router.get('/',(req,res) => {
    res.render('register')
})

Router.post('/register', async (req,res) => {

    try {
        const {name,username,age,email,password} = req.body
        const doesUsernameExist = await userModel.find({ username })
        if(doesUsernameExist.length > 0) {
            return res.status(400).json({msg: 'Username is in use, Please use different username'})
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
})

Router.get('/login', (req,res) => {
    res.render('login')
})

Router.post('/login', async (req,res) => {

    try {
        const { username,password } = req.body
        const userData = await userModel.find({ username})
        if(userData.length === 0) {
            return res.status(400).json({msg: 'Either username or password incorrect'})
        }

        // check pwd
        const isPwdCorrect = await bcrypt.compare(password, userData[0].password)
        if(!isPwdCorrect) {
            return res.status(400).json({msg: 'password incorrect'})
        }
        
        const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
        const token = await jwt.sign({ userId: userData[0]._id, email: userData[0].email }, JWT_SECRET_TOKEN)  
        res.cookie("token", token)  
        res.status(200).redirect('profile')
    } catch (error) {
        console.log("Error in Login API::", error)
        res.status(400).json({msg: 'Internal Server Error'})
    }
})

Router.get('/logout', (req,res) => {

    res.clearCookie('token')
    res.redirect('/login')
})

export default Router;