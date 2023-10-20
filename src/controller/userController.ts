import { Request, Response } from 'express'
import User from '../model/UserModel.ts'
import { StatusCodes } from 'http-status-codes'

interface GetCurrentUserRequest extends Request {
  user?: {
    email: string
    userId: string
  }
}

export const getCurrentUser = async (
  req: GetCurrentUserRequest,
  res: Response
) => {
  const currentUser = await User.findById(req?.user?.userId)

  res.status(StatusCodes.OK).json(currentUser)
}
