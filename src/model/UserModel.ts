import mongoose from "mongoose"
const bcrypt =  require("bcrypt")

export interface UserDocument extends mongoose.Document {
    first_name: string
    last_name: string
    email: string
    password: string
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema(
    {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    },
    { timestamps: true }
)

// Used for logged in
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
    const user = this as UserDocument
    return bcrypt.compare(candidatePassword, user.password).catch((e: any) => false)
}

UserSchema.pre("save", async function (next) {
    let user = this as UserDocument

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next()

    // Random additional data
    const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR))
    const hash = await bcrypt.hashSync(user.password, salt)

    // Replace the password with the hash
    user.password = hash

    return next()
})

const User = mongoose.model<UserDocument>("User", UserSchema)
export default User