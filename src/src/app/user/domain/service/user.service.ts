import 'dotenv/config'
import { omit } from "lodash"
import jwt from "jsonwebtoken"
import User, { UserDocument } from "@app/user/domain/model/user.model";
import RefreshToken from "@app/user/domain/model/refresh-token.model";

export default class UserService {
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

    public all = async (): Promise<Array<Object>> => {
        const userDocument = [
            {
                "first_name": "Jidul",
                "last_name": "Islam",
                "email": "jaidul26@gmail.com",
                "password": "123456"
            },
            {
                "first_name": "Sidul",
                "last_name": "Islam",
                "email": "rahaddiu@gmail.com",
                "password": "123456"
            },
        ]

        return Promise.resolve(userDocument)
    }

    public async validatePassword({email, password}: {
        email: UserDocument["email"]
        password: string
      }) {
            try {
                const user = await User.findOne({ email });
            
                if (!user) {
                    return false;
                }
            
                const isValid = await user.comparePassword(password.toString());
            
                if (!isValid) {
                    return false;
                }
            
                return omit(user.toJSON(), "password");
            } catch (e: any) {
                throw new Error(e)          
            }
      }

      public async store(input: UserDocument) {
        try {
            return await User.create(input)
        } catch(error: any) {
            throw new Error(error)
        }
    }
}