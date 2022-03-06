import { Application, Request, Response } from "express";
import UserRoutes from "@app/user/api"

export default function(app: Application) {
    app.get('/healthcheck', (req: Request, res: Response) => {
        res.json({
            status: true
        })
    })

    UserRoutes(app)
}
