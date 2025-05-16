import multer from "multer"
import path from 'path'
import crypto from 'crypto'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/upload')
  },
  filename: async function (req, file, cb) {
  
    const name = await crypto.randomBytes(6).toString('hex')
    const fn = name + 'profile_pic' + path.extname(file.originalname)
    cb(null, fn)
  }
})

const upload = multer({ storage: storage })

export default upload;