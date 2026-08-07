import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { generatePost, getGenerations, getPosts, schedulePost, deletePost, triggerCron } from "../controllers/postController.js"
import { upload } from "../config/multer.js"


const postRouter = express.Router()

postRouter.get('/cron', triggerCron)
postRouter.get('/', protect, getPosts)
postRouter.get('/generations', protect, getGenerations)
postRouter.post('/', protect, upload.single("media"), schedulePost)
postRouter.post('/generate', protect, generatePost)
postRouter.delete('/:id', protect, deletePost)

export default postRouter