import mongoose from "mongoose";

const postSchema = mongoose.Schema({

    textContent: {
        type: String,
        required: true,
    },
    like: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

const postModel = mongoose.model('post',postSchema)

export default postModel;