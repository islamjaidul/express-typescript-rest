import User from "../model/UserModel"
import RefreshToken from "../model/RefreshTokenModel"

before(async () => {
    return await Promise.all([
        User.deleteMany({}),
        RefreshToken.deleteMany({})
    ])
})