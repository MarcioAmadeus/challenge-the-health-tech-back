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
    //console.log(process.env.SECRET_KEY)
    const token = sign(payload, process.env.SECRET_KEY);
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24* 60 * 60 * 1000 // day
    })

    res.send({
        message: 'success'
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const {password, ...user} = req['user'];
    res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie('jwt',  {
        maxAge: 0 // 
    })
    res.send({message: 'success'}); 
}


export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req['user'];

    const repository = AppDataSource.getRepository(User);
    repository.update(user.id, req.body);

   const {password, ...data} = await repository.findOne({where:{id: user.id}});
   res.send(data); 
};

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req['user'];

    if(req.body.password != req.body.passwordconfirm){
        return res.status(400).send({message: "password not match"});
    }

    const repository = AppDataSource.getRepository(User);

    repository.update(user.id, {
        password: await bcryptjs.hash(req.body.password, 10)   
    });

   const {password, ...data} = await repository.findOne({where:{id: user.id}});
   
   res.send(data); 
};