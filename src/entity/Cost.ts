import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Cost {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descript: string

    @Column("double")
    price: number

    @Column()
    date: string

    @Column()
    insertdate:string

    @Column()
    costtype:number

    @Column()
    userid:number

}
