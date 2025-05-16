import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',],
            
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    profile_pic: {
        default: 'profile_pic.png',
        type: String
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'post'
        }
    ]
}, {
    timestamps: true
})

const userModel = mongoose.model('user', userSchema)

export {
    userModel
}