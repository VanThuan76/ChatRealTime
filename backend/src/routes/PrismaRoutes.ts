import express from "express"
import { getListUser, authenticated } from "../controllers/PrismaControllers"

const router = express.Router()
router.post("/login", authenticated)
router.get("/list-user", getListUser)
export default router