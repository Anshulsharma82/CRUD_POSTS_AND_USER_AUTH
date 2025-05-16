import express from "express"
const Router = express.Router()
import { registerUser,loginUser, logoutUser, updateProfilePicture, userProfile } from "../controllers/userController.js"
import isUserLoggedIn from "../middleware/userLoggedIn.js"
import upload from "../upload.js"

Router.get('/',(req,res) => {
    res.render('register')
})

Router.post('/register', registerUser)

Router.get('/login', (req,res) => {
    res.render('login')
})

Router.post('/login', loginUser)

Router.get('/logout', logoutUser)

Router.get('/profile', isUserLoggedIn, userProfile)

Router.get('/updateProfilePicture', isUserLoggedIn, async (req, res) => {
    res.status(200).render("upload")
})

Router.post('/updateProfilePicture', isUserLoggedIn, upload.single('image'), updateProfilePicture)

export default Router;