import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm"
import { Cost } from "./Cost"


export enum Sex {
    MALE = 0,
    FAMALE = 1
}



@Entity("tb_User")
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column({type:"enum",enum:Sex,default:Sex.MALE})
    sex: number

    @Column({default:""})
    photourl: string

    @OneToMany(() => Cost, cost => cost.user)
    costs: Cost[];

    @CreateDateColumn()
    insertdate:string

    @Column({default:""})
    city:string

}
