import ("dotenv/config")
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export default class AuthMiddleware {
    public handle() {
        return (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.header("Authorization") as string
            const bearerToken = authHeader && authHeader.split(" ")[1] as string
            const accessToken = process.env.ACCESS_TOKEN_SECRET as string

            if (!bearerToken) return res.status(401).json({ message: "Token is missing" })

            jwt.verify(bearerToken, accessToken, (error, user) => {
                if (error) return res.status(403).json({ "message": "Unauthorized" })
                next()
            })
        }
    }
}