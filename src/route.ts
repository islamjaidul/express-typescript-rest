import { Application, Request, Response } from "express";
import 'reflect-metadata';
import { container } from "tsyringe";
import AuthController from "./controller/AuthController";
import AuthMiddleware from "./middleware/AuthMiddleware";

const authController = container.resolve(AuthController)

export default function(app: Application) {
    app.get('/', (req: Request, res: Response) => {
        res.json({
            status: true
        })
    })

    app.get('/users', (new AuthMiddleware).handle(), (req: Request, res: Response) => {
        res.json({
            "first_name": "Jidul",
            "last_name": "Islam"
        })
    })

    app.post('/register', authController.register)
    app.post('/login', authController.login)
    app.post('/token', authController.token)
}
