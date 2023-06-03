import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity("tb_Cost")
export class Cost {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descript: string

    @Column({type:"double"})
    price: number

    @CreateDateColumn({default:new Date()})
    date: string

    @Column()
    costtype:number

 
    @ManyToOne(()=>User,user =>user.costs)
    user:User

}
