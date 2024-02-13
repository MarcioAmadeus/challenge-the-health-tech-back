import {Request, Response} from "express";
import { AppDataSource } from "../data-source"
import { User } from "../entity/user.entity";
import {verify, sign} from "jsonwebtoken";

export const AuthMiddleware = async (req: Request,res: Response, next: Function) => {
    try{
        const jwt = req.cookies['jwt'];

        const payload: any = verify(jwt, process.env.SECRET_KEY);
    
        if (!payload){
            return res.status(401).send(
                {message: 'unauthenticated'
            });
        }
        const repository = AppDataSource.getRepository(User);
        req["user"]= await repository.findOne({where:{id: payload.id}});
        
        next();
    }catch(e){
        return res.status(401).send(
            {message: 'unauthenticated'
        });
    }
};