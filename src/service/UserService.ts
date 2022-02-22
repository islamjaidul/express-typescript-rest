// import { DocumentDefination } from "mongoose"
import User, { UserDocument } from "../model/UserModel"
export default class UserService {
    public async store(input: UserDocument) {
        try {
            return await User.create(input)
        } catch(error: any) {
            throw new Error(error)
        }
    }
}