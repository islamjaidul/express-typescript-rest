import { Application, Request, Response } from "express";
import RegisterController from "./controller/RegisterController";

export default function(app: Application) {
    app.get('/', (req: Request, res: Response) => {
        res.json({
            status: true
        })
    })

    app.post('/register', (new RegisterController).register)
}
