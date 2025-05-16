import express from "express"
const Router = express.Router()
import upload from "../upload.js"

import { userModel } from '../models/userModel.js'
import isUserLoggedIn from "../middleware/userLoggedIn.js"
import postModel from "../models/postModel.js"
import mongoose from "mongoose"

Router.get('/', isUserLoggedIn, async (req, res) => {
    const userData = await userModel.findById(req.user.userId).populate('posts')
    res.status(200).render('profile', {
        userData 
    })
})

Router.get('/upload', isUserLoggedIn, async (req, res) => {
    res.status(200).render("upload")
})

Router.post('/upload', isUserLoggedIn, upload.single('image'), async (req, res) => {
    console.log('file upload called!!!')
    console.log('file:::::::::::::::::::::', req.file)
    const userData = await userModel.updateOne({ _id: req.user.userId }, { profile_pic: req.file.filename })
    res.status(200).redirect("/profile")
})

Router.post('/createPost', isUserLoggedIn, async (req, res) => {
    try {
        const { textContent } = req.body
        const post = await postModel.create({
            textContent,
            userId: req.user.userId
        })
        console.log('post::::::::::::::::::::::::::::', post)
        if (post) {
            const updateQuery = {
                $push: {
                    posts: post._id
                }
            };
            await userModel.updateOne({ _id: req.user.userId }, updateQuery, { new: true })
        }
        res.status(200).redirect("/profile")

    } catch (error) {
        console.log('Error::::::::::::::::::::', error)
    }
})

Router.post('/likePost/:id', isUserLoggedIn, async(req,res) => {
    try {
        const _id = req.params.id
        // console.log("_id::::::::::::::::::::::::::::::::::::::::::::::", postId)
        const post = await postModel.findById(_id)
        post.like = !post.like
        // console.log(post)
        await post.save()
        res.redirect('/profile')
    } catch (error) {
        console.log('error in likePost API', error)
    }
})

Router.post('/deletePost/:id', async (req,res) => {
    console.log('id:::::::::::::::::::::::', req.params.id)
    const id = req.params.id
    const deletePost = await postModel.findByIdAndDelete(id)
    console.log("deletePost::::::::::::::::::::::::::::::::::::::", deletePost)
    if(deletePost) {
        const updateQuery = {
            $pull: {
                posts: id
            }
        }
        const userData = await userModel.updateOne({posts: id},updateQuery)
        console.log('userData:::::::::::::::::', userData)
    }
    res.redirect('/profile')
})

Router.get('/editPost/:id', async(req,res) => {
    const postData = await postModel.findById(req.params.id)
    res.status(200).render("editPost", {
        postData
    })
})

Router.post('/editPost/:id', async(req,res) => {
    try {
        const { textContent } = req.body
        const updatedPost = await postModel.updateOne({_id: req.params.id}, { textContent } )
        console.log('updatedPost!!')
        res.status(200).redirect("/profile")
    } catch (error) {
        console.log('Error in edit post API', error)
    }
})

export default Router