import {Request, Response, NextFunction} from 'express'
import UserService from '../service/UserService'
import UserValidator from '../validator/UserValidator'

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
}