import ("dotenv/config")
import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, accessTokenSecret);
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}