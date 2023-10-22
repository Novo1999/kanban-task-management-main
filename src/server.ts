import 'express-async-errors'
import { StatusCodes } from 'http-status-codes'
import morgan from 'morgan'
import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/authRouter.ts'
import { ErrorHandler } from './middleware/errorHandlerMiddleware.ts'
import { connect } from 'mongoose'
import cookieParser from 'cookie-parser'
import kanbanRouter from './routes/kanbanRouter.ts'
import userRouter from './routes/userRouter.ts'
import { authenticateUser } from './middleware/authMiddleware.ts'
import path from 'path'
import { fileURLToPath } from 'url'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

dotenv.config()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATABASE_URL = process.env.MONGO_URL!

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.static(path.resolve(__dirname, '../public')))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(mongoSanitize())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/kanban', authenticateUser as () => void, kanbanRouter)
app.use('/api/v1/users', authenticateUser as () => void, userRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'))
})

app.use('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'not found' })
})

app.use(ErrorHandler)

const port = process.env.PORT || 8080

try {
  await connect(DATABASE_URL)
  app.listen(port, () => console.log(`Server listening to port ${port}`))
} catch (error) {
  console.log(error)
  process.exit(1)
}
