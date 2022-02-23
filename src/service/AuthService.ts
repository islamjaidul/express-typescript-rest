import 'dotenv/config'
import jwt from "jsonwebtoken"
import { UserDocument } from "../model/UserModel";

export default class AuthService {
    public createAccessToken(user: UserDocument): string {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
        return jwt.sign(user, accessTokenSecret)
    }

    public createRefreshToken(user: UserDocument) {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
        return jwt.sign(user, refreshTokenSecret)
    }
}