import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "fgv123",
    "database": "node_admin",
    "entities": [
       "src/entity/*.ts"
    ],
    "logging": false,
    "synchronize": true
});