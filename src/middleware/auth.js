import jwt from "jsonwebtoken"
import userModel from "../../DB/models/user.model.js"


export const auth = () => {
    return async (req, res, next) => {

        try {
            const { token } = req.headers
            if (!token) {
                return res.status(400).json({ msg: "token not found" })
            }

            if (!token.startsWith("yara")) {
                return res.status(401).json({ msg: "invalid token" })
            }

            const newToken = token.split("yara")[1]
            if (!newToken) {
                return res.status(400).json({ msg: "invalid token format" })
            }

            const decoded = jwt.verify(newToken, "yara")

            if (!decoded?.id) {
                return res.status(401).json({ msg: "invalid payload" })
            }
            const user = await userModel.findById(decoded.id)
   
            if (!user) {
                return res.status(400).json({ msg: "user not found" })
            }
 
            req.user = user
            next()
        
        } catch (error) {
            
            return res.status(404).json({ message: "catch error", error })
        }


    }
}