import { userModel } from '../models/userModel.js'
import postModel from "../models/postModel.js"

const createPost = async (req, res) => {
    try {
        const { textContent } = req.body
        const post = await postModel.create({
            textContent,
            userId: req.user.userId
        })
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
        console.log('Error in createPost API::::::::::::::::::::', error)
    }
}

const likePost = async(req,res) => {
    try {
        const _id = req.params.id
        const post = await postModel.findById(_id)
        post.like = !post.like
        await post.save()
        res.redirect('/profile')
    } catch (error) {
        console.log('error in likePost API', error)
    }
}

const deletePost = async (req,res) => {
    const id = req.params.id
    const deletePost = await postModel.findByIdAndDelete(id)
    if(deletePost) {
        const updateQuery = {
            $pull: {
                posts: id
            }
        }
        const userData = await userModel.updateOne({posts: id},updateQuery)
    }
    res.redirect('/profile')
}

const getEditPostPage = async(req,res) => {
    const postData = await postModel.findById(req.params.id)
    res.status(200).render("editPost", {
        postData
    })
}

const editPost = async(req,res) => {
    try {
        const { textContent } = req.body
        const updatedPost = await postModel.updateOne({_id: req.params.id}, { textContent } )
        res.status(200).redirect("/profile")
    } catch (error) {
        console.log('Error in edit post API', error)
    }
}

export {
    createPost,
    likePost,
    deletePost,
    getEditPostPage,
    editPost,
}
