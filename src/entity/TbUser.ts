import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TbCost } from "./TbCost";
import { TbCurrentprice } from "./TbCurrentprice";
import { TbCityinfo } from "./TbCityinfo";
import { TbUserRole } from "./TbUserRole";

@Index("fk_user_city", ["cityid"], {})
@Index("fk_user_country", ["countryid"], {})
@Index("fk_user_province", ["provinceid"], {})
@Entity("tb_user", { schema: "mycost" })
export class TbUser {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("enum", { name: "sex", enum: ["0", "1"], default: () => "'0'" })
  sex: "0" | "1";

  @Column("varchar", { name: "photourl", length: 255 })
  photourl: string;

  @Column("datetime", {
    name: "insertdate",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  insertdate: Date;

  @Column("varchar", { name: "city", length: 100 })
  city: string;

  @Column("int", { name: "countryid", nullable: true })
  countryid: number | null;

  @Column("int", { name: "provinceid", nullable: true })
  provinceid: number | null;

  @Column("int", { name: "cityid", nullable: true })
  cityid: number | null;

  @OneToMany(() => TbCost, (tbCost) => tbCost.user)
  tbCosts: TbCost[];

  @OneToMany(() => TbCurrentprice, (tbCurrentprice) => tbCurrentprice.user)
  tbCurrentprices: TbCurrentprice[];

  @ManyToOne(() => TbCityinfo, (tbCityinfo) => tbCityinfo.tbUsers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "cityid", referencedColumnName: "id" }])
  city2: TbCityinfo;

  @ManyToOne(() => TbCityinfo, (tbCityinfo) => tbCityinfo.tbUsers2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "countryid", referencedColumnName: "id" }])
  country: TbCityinfo;

  @ManyToOne(() => TbCityinfo, (tbCityinfo) => tbCityinfo.tbUsers3, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "provinceid", referencedColumnName: "id" }])
  province: TbCityinfo;

  @OneToMany(() => TbUserRole, (tbUserRole) => tbUserRole.user)
  tbUserRoles: TbUserRole[];
}
