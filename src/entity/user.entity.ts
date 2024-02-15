import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm";
import { Role } from "./role.entity";



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
    
    @ManyToOne(type => Role, {nullable: true })
    @JoinColumn({name: 'role_id'})
    role: Role;
}