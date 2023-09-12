import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TbRoleRoute } from "./TbRoleRoute";

@Entity("tb_path", { schema: "mycost" })
export class TbPath {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "path", nullable: true, length: 255 })
  path: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("varchar", { name: "icon", nullable: true, length: 255 })
  icon: string | null;

  @Column("int", { name: "fatherid" })
  fatherid: number;

  @Column("varchar", { name: "componenturl", nullable: true, length: 255 })
  componenturl: string | null;

  @Column("tinyint", { name: "noCache", nullable: true, width: 1 })
  noCache: boolean | null;

  @OneToMany(() => TbRoleRoute, (tbRoleRoute) => tbRoleRoute.path)
  tbRoleRoutes: TbRoleRoute[];
}
