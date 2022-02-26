import { omit } from "lodash"
import { autoInjectable } from "tsyringe"
import User, { UserDocument } from "../model/UserModel"

@autoInjectable()
export default class UserService {
    public async store(input: UserDocument) {
        try {
            return await User.create(input)
        } catch(error: any) {
            throw new Error(error)
        }
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
}