import express from "express"
const Router = express.Router()
import { createPost,deletePost,editPost,getEditPostPage,likePost } from "../controllers/postController.js"
import isUserLoggedIn from "../middleware/userLoggedIn.js"

Router.post('/create', isUserLoggedIn, createPost)

Router.post('/like/:id', isUserLoggedIn, likePost)

Router.post('/delete/:id', deletePost)

Router.get('/edit/:id', getEditPostPage)

Router.post('/edit/:id', editPost)

export default Router