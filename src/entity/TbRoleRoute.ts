import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TbPath } from "./TbPath";
import { TbRole } from "./TbRole";

@Index("fk_role_pathid", ["pathid"], {})
@Index("fk_role_roleid", ["roleid"], {})
@Entity("tb_role_route", { schema: "mycost" })
export class TbRoleRoute {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "roleid", nullable: true })
  roleid: number | null;

  @Column("int", { name: "pathid", nullable: true })
  pathid: number | null;

  @ManyToOne(() => TbPath, (tbPath) => tbPath.tbRoleRoutes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "pathid", referencedColumnName: "id" }])
  path: TbPath;

  @ManyToOne(() => TbRole, (tbRole) => tbRole.tbRoleRoutes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "roleid", referencedColumnName: "id" }])
  role: TbRole;
}
