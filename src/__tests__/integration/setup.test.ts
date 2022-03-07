import User from "@app/user/domain/model/user.model"
import RefreshToken from "@app/user/domain/model/refresh-token.model"

before(async () => {
    return await Promise.all([
        User.deleteMany({}),
        RefreshToken.deleteMany({})
    ])
})