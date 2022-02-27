import { ObjectId } from "mongodb";
import mongoose from "mongoose"

export interface RefreshTokenDocument extends mongoose.Document {
    user_id: ObjectId
    refresh_token: string
}

const RefreshTokenSchema = new mongoose.Schema(
    {
        user_id: {type: ObjectId, required: true, index: true},
        refresh_token: {type: String, required: true}
    },
    { timestamps: true }
)

const RefreshToken = mongoose.model<RefreshTokenDocument>("RefreshToken", RefreshTokenSchema)
export default RefreshToken