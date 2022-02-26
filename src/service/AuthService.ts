import 'dotenv/config'
import { omit } from "lodash"
import jwt from "jsonwebtoken"
import { autoInjectable } from 'tsyringe';
import User, { UserDocument } from "../model/UserModel";
import RefreshToken from "../model/RefreshTokenModel";

@autoInjectable()
export default class AuthService {
    public createAccessToken(user: UserDocument): string {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
        return jwt.sign(user, accessTokenSecret, { expiresIn: process.env.TOKEN_EXPIRES_IN as string })
    }

    public createRefreshToken(user: UserDocument): string {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
        const refreshToken = jwt.sign(user, refreshTokenSecret)
        // @todo: has to be createOrUpdate
        RefreshToken.create({
            user_id: user._id,
            refresh_token: refreshToken
        })

        return refreshToken
    }

    public getExpiresIn(): string {
        return process.env.TOKEN_EXPIRES_IN as string
    }

    public async getAuthUser(token: string) {
        if (!token) throw new Error("Token is missing")
        let user = jwt.decode(token) as UserDocument
        user = await User.findById(user._id) as UserDocument
        return omit(user.toJSON(), "password")
    }

    public async checkValidRefreshToken(user: UserDocument) {
        return await RefreshToken.findOne({ user_id:  user._id})
    }

    public async verifyRefreshToken(refreshToken: string) {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
        return await new Promise((resolve, reject) => {
            return jwt.verify(refreshToken, refreshTokenSecret, (error: any, user) => {
                if (error) return reject(false)
                return resolve(true)
            })
        })
    }
}