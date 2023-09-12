import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TbRoleRoute } from "./TbRoleRoute";
import { TbUserRole } from "./TbUserRole";

@Index("uni_role", ["key"], { unique: true })
@Entity("tb_role", { schema: "mycost" })
export class TbRole {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "key", nullable: true, unique: true, length: 255 })
  key: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @OneToMany(() => TbRoleRoute, (tbRoleRoute) => tbRoleRoute.role)
  tbRoleRoutes: TbRoleRoute[];

  @OneToMany(() => TbUserRole, (tbUserRole) => tbUserRole.role)
  tbUserRoles: TbUserRole[];
}
