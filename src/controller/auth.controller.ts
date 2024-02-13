import { Request, Response } from "express";
import { RegisterValidation } from "../validation/register.validation";
import { AppDataSource } from "../data-source"
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {verify, sign} from "jsonwebtoken";


export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    const {error} = RegisterValidation.validate(body);

    if(error){
        return res.status(400).send(error.details);
    }

    if(body.password != body.passwordconfirm){
        return res.status(400).send({message: "password not match"});
    }

    const repository = AppDataSource.getRepository(User);
    const {password, ...user} = await repository.save({
        firt_name: body.firt_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcryptjs.hash(body.password, 10)
    });

    res.send(user);
}; 


export const Login = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(User);

    const user = await repository.findOne({where:{email: req.body.email}});

    if(!user){
        return res.status(400).send({message: "user or password not found!"});
    }
    if(!await bcryptjs.compare(req.body.password, user.password)){
        return res.status(400).send({message: "user or password not found!"});
    }

    const payload = {
        id: user.id
    };
    const token = sign(payload, "secret");

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24* 60 * 60 * 1000 // day
    })

    res.send({
        message: 'success'
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try{
    const jwt = req.cookies['jwt'];

    const payload: any = verify(jwt, "secret");

    if (!payload){
        return res.status(401).send(
            {message: 'unauthenticated'
        });
    }
    const repository = AppDataSource.getRepository(User);
    const {password, ...user} = await repository.findOne({where:{id: payload.id}});

    res.send(user);   
    }
    catch(e){
        return res.status(401).send(
            {message: 'unauthenticated'
        });
    }
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie('jwt',  {
        maxAge: 0 // day
    })
    res.send({message: 'success'}); 
}