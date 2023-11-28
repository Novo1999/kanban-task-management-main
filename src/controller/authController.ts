import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import User from '../model/UserModel.ts'
import { comparePassword, hashPassword } from '../utils/passwordUtils.ts'
import { UnauthenticatedError } from '../error/customErrors.ts'
import { createJWT } from '../utils/tokenUtils.ts'

export const register = async (req: Request, res: Response) => {
  const hashedPassword = hashPassword(req.body.password)
  const newUser = await User.create({
    ...req.body,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
  })

  return res.status(StatusCodes.CREATED).json({ newUser })
}

export const login = async (req: Request, res: Response) => {
  const email = req.body.email
  const user = await User.findOne({ email: email.toLowerCase() })
  // checking valid user by checking if the user exists by email and then comparing the hashed password
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password!))

  if (!isValidUser) throw new UnauthenticatedError('Password invalid')

  const token = createJWT({
    userId: user._id.toString(),
    email: user.email!,
  })

  // cookie expires in one day
  const oneDay: number = 1000 * 60 * 60 * 24

   res.cookie('token', token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })

  res
    .status(StatusCodes.OK)
    .json({ msg: `Welcome ${user.name}`, email: user.email })
}

export const logoutUser = async (_: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}
