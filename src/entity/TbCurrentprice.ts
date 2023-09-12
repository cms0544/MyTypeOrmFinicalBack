import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TbUser } from "./TbUser";

@Index("fk_userid", ["userid"], {})
@Entity("tb_currentprice", { schema: "mycost" })
export class TbCurrentprice {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("decimal", {
    name: "currentPrice",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  currentPrice: string | null;

  @Column("datetime", {
    name: "insertdate",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  insertdate: Date | null;

  @Column("int", { name: "userid", nullable: true })
  userid: number | null;

  @ManyToOne(() => TbUser, (tbUser) => tbUser.tbCurrentprices, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
  user: TbUser;
}
