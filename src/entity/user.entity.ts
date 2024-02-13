import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    firt_name: string;
    
    @Column()
    last_name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

}