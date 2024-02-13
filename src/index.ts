import express, { Request, Response } from 'express'
import cors from 'cors'
import { routes } from './routes';
import {DataSource} from "typeorm"
import { AppDataSource } from "./data-source"
import cookieParser from "cookie-parser"

AppDataSource.initialize().then(() =>{

    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        credentials: true,
        origin: ["http://localhots:3000"]
    }));
    
    routes(app); 
    
    app.listen(8000, () => {
        console.log("listening to port 8000")
    });
});

