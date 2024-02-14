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
    res.status(200).send(data);
};

export const GetUser = async (req: Request, res: Response) => {
    
    const repository = AppDataSource.getRepository(User);
    const tempId = parseInt(req.params.id);
    console.log(tempId);
    const {password, ...data1} = await repository.findOne({where:{id: tempId}});

    res.send(data1);
};

export const UpdateUser = async (req: Request, res: Response) => {
    const {role_id, ...body} = req.body;
   
    
    const repository = AppDataSource.getRepository(User);
    const tempId = parseInt(req.params.id);
    await repository.update(tempId, body);
    
    const {password, ...data1} = await repository.findOne({where:{id: tempId}});

    res.status(202).send(data1);
};

export const DeleteUser = async (req: Request, res: Response) => {
    const {role_id, ...body} = req.body;
   
    
    const repository = AppDataSource.getRepository(User);
    const tempId = parseInt(req.params.id);
    await repository.delete(tempId);
    res.status(204).send(null);
};