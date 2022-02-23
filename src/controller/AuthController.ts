import {Request, Response, NextFunction} from 'express'
import UserService from '../service/UserService'
import UserValidator from '../validator/UserValidator'
import * as jwt from 'jsonwebtoken'
import 'dotenv/config'

export default class RegisterController {
    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = await (new UserValidator(req.body)).validateAsync()
            const user = await (new UserService).store(payload)
            res.json(user)
        } catch (error: any) {
            if (error.isJoi == true) {
                error.status = 422
                res.json(error.details)
            }
            next(error)
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await (new UserService).validatePassword(req.body)
        
            if (!user) {
                return res.status(401).send("Invalid username or password");
            }
            
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
            const accessToken = jwt.sign(user, accessTokenSecret)
            res.json({
                accessToken
            })
        } catch(error) {
            res.sendStatus(500).json({
                error
            })
        }
    }
}