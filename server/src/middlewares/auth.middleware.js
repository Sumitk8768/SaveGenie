import jwt from "jsonwebtoken"
import UserModel from "../models/user.model";

let authMiddleware = async (req, res) => {
     try {
         let token = req.cookies.token;

         if(!token){
             return res.status(404).json({
            message: "unauthorized user",
        })
         }

        let decode = jwt.verify(token, process.env.JWT_SECRET)

        if(!decode){
             return res.status(401).json({
            message: "unauthorized user",
        })
        }

        let user = await UserModel.find(decode.id);

        req.user = user;
        next()

     } catch (error) {
        return res.status(500).json({
            message: "Error in middleware",
            error,
        })
     }
}