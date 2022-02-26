import { autoInjectable } from 'tsyringe'
import UserService from '../service/UserService'
import AuthService from '../service/AuthService'
import { UserDocument } from '../model/UserModel'
import UserValidator from '../validator/UserValidator'
import {Request, Response, NextFunction} from 'express'

@autoInjectable()
export default class RegisterController {
    private userService: UserService
    private authService: AuthService

    public constructor(userService: UserService, authService: AuthService) {
        this.userService = userService
        this.authService = authService
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = await (new UserValidator(req.body)).validateAsync()
            const user = await this.userService.store(payload)
            res.json(user)
        } catch (error: any) {
            if (error.isJoi == true) {
                error.status = 422
                res.json(error.details)
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
                accessToken: this.authService.createAccessToken(user as UserDocument),
                refreshToken: this.authService.createRefreshToken(user as UserDocument),
                expiresIn: this.authService.getExpiresIn()
            })
        } catch(error) {
            res.status(500).json({ error })
        }
    }

    public token = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.getAuthUser(req.body.token as string)
            const refreshTokenObj = await this.authService.checkValidRefreshToken(user as UserDocument)
            if (!refreshTokenObj) return res.status(403).json({ message: "Invalid refresh token" })
            const isVerified =  await this.authService.verifyRefreshToken(refreshTokenObj.refresh_token)
            
            if (!isVerified) return res.status(403).json({ message: "Invalid refresh token" })

            return res.json({
                accessToken: this.authService.createAccessToken(user as UserDocument),
                expiresIn: this.authService.getExpiresIn()
            })
        } catch (error) {
            res.status(500).json({ error })
        }
    }
}