import { Request, Response } from "express";
import { AppDataSource } from "../data-source"
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {verify, sign} from "jsonwebtoken";
import { Any } from "typeorm";


export const Users = async (req: Request, res: Response) => {
    const user = req['user'];

   const repository = AppDataSource.getRepository(User);
   const users = await repository.find();
   res.send(users.map(u => {
    const {password, ...data} = u;

    return data;
   })); 
};

export const Create = async (req: Request, res: Response) => {
    const {role_id, ...body} = req.body;
    const passwordhashed = await bcryptjs.hash('123456', 10);
    
    //const user = req['user'];
    const repository = AppDataSource.getRepository(User);
    const {password, ...data} = await repository.save({
        ...body,
        password: passwordhashed
    });
    res.send(data);
};

export const GetUser = async (req: Request, res: Response) => {
    
    const repository = AppDataSource.getRepository(User);
    const {password, ...data} = await repository.findOne({where:{id: parseInt(req.params.id)}});

    return data;
};