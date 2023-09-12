import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TbUser } from "./TbUser";

@Entity("tb_cityinfo", { schema: "mycost" })
export class TbCityinfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "fatherid", nullable: true })
  fatherid: number | null;

  @Column("varchar", {
    name: "level",
    nullable: true,
    comment: "1-国家 2-省份 3-城市 4-区",
    length: 255,
  })
  level: string | null;

  @OneToMany(() => TbUser, (tbUser) => tbUser.city2)
  tbUsers: TbUser[];

  @OneToMany(() => TbUser, (tbUser) => tbUser.country)
  tbUsers2: TbUser[];

  @OneToMany(() => TbUser, (tbUser) => tbUser.province)
  tbUsers3: TbUser[];
}
