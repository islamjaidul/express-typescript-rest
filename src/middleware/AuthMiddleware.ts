import ("dotenv/config")
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export default class AuthMiddleware {
    public handle() {
        return (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.header("Authorization") as string
            const bearerToken = authHeader && authHeader.split(" ")[1] as string

            if (!bearerToken) res.sendStatus(401).json({message: "Token is missing"})

            jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET as string, (error, user) => {
                if (error) res.sendStatus(403).json({"message": "Unauthorized"})
                console.log(user)
                next()
            })
        }
    }
}