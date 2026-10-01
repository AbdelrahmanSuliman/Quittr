import jwt from "jsonwebtoken"
import config from "../config"

export default function generateToken(userId: string, username: string) {
    return jwt.sign({ userId, username }, config.jwt.secretKey, {expiresIn: '1h'})
}