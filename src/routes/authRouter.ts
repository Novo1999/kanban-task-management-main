import { Router } from 'express'
import { login, logout, register } from '../controller/authController.ts'
import {
  validateLoginInput,
  validateRegisterInput,
} from '../middleware/validationMiddleware.ts'

const router = Router()

router
  .post('/register', validateRegisterInput, register)
  .post('/login', validateLoginInput, login)
  .get('/logout', logout)

export default router
