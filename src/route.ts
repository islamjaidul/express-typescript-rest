import { Application, Request, Response } from "express";
import AuthController from "./controller/AuthController";

export default function(app: Application) {
    app.get('/', (req: Request, res: Response) => {
        res.json({
            status: true
        })
    })

    app.get('/users', (req: Request, res: Response) => {
        res.json({
            "first_name": "Jidul",
            "last_name": "Islam"
        })
    })

    app.post('/register', (new AuthController).register)
    app.post('/login', (new AuthController).login)
}
