import { autoInjectable } from 'tsyringe'
import {Request, Response, NextFunction} from 'express'
import UserService from '@app/user/domain/service/user.service'
import { UserDocument } from '@app/user/domain/model/user.model'
import UserValidator from '@app/user/http/validator/user.validator'

@autoInjectable()
export default class UserController {

    public constructor(public userService: UserService) {}

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = await (new UserValidator(req.body)).validateAsync()
            const user = await this.userService.store(payload)
            res.status(201).json(user)
        } catch (error: any) {
            if (error.isJoi == true) {
                res.status(422).json(error.details)
            }
            next(error)
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.validatePassword(req.body)
            
            if (!user) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }
            
            res.json({
                accessToken: this.userService.createAccessToken(user as UserDocument),
                refreshToken: this.userService.createRefreshToken(user as UserDocument),
                expiresIn: this.userService.getExpiresIn()
            })
        } catch(error) {
            res.status(500).json({ error })
        }
    }

    public token = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.getAuthUser(req.body.token as string)
            const refreshTokenObj = await this.userService.checkValidRefreshToken(user as UserDocument)
            if (!refreshTokenObj) return res.status(403).json({ message: "Invalid refresh token" })
            const isVerified =  await this.userService.verifyRefreshToken(refreshTokenObj.refresh_token)
            
            if (!isVerified) return res.status(403).json({ message: "Invalid refresh token" })

            return res.json({
                accessToken: this.userService.createAccessToken(user as UserDocument),
                expiresIn: this.userService.getExpiresIn()
            })
        } catch (error) {
            res.status(500).json({ error })
        }
    }

    public getUsers = async (req: Request, res: Response) => {
        return res.json(await this.userService.all())
    }
}