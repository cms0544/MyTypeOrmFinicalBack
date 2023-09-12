import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TbUser } from "./TbUser";

@Index("FK_80adec0c55169f3b43bb8b840b6", ["userId"], {})
@Entity("tb_cost", { schema: "mycost" })
export class TbCost {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "descript", length: 255 })
  descript: string;

  @Column("double", { name: "price", precision: 22 })
  price: number;

  @Column("datetime", { name: "date", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column("int", { name: "costtype" })
  costtype: number;

  @Column("int", { name: "userId", nullable: true })
  userId: number | null;

  @ManyToOne(() => TbUser, (tbUser) => tbUser.tbCosts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: TbUser;
}
