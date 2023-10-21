import { Router } from 'express'
import {
  editCurrentUser,
  getCurrentUser,
} from '../controller/userController.ts'

const router = Router()

router.get('/current-user', getCurrentUser)
router.patch('/edit-user', editCurrentUser)

export default router
