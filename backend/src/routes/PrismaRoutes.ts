import express from "express"
import { 
    getListUser, 
    authenticated,
    logout,
    getListConversation, 
    getMessage,
    getConversation, 
    newMessage, 
    newUser, 
    newConversation ,
    getInforUser,
    getUser
} 
from "../controllers/PrismaControllers"

const router = express.Router()
router.post("/create-user", newUser)
router.post("/login", authenticated)
router.post("/logout", logout)
router.get("/list-user", getListUser)
router.post("/info-user", getInforUser)
router.post("/user", getUser)
router.get("/list-conversation", getListConversation)
router.post("/message", getMessage)
router.post("/conversation", getConversation)
router.post("/new-message", newMessage)
router.post("/new-conversation", newConversation)



export default router