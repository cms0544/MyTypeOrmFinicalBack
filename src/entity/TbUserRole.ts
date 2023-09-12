import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TbRole } from "./TbRole";
import { TbUser } from "./TbUser";

@Index("fk_user_role_roleid", ["roleid"], {})
@Index("fk_user_role_userid", ["userid"], {})
@Entity("tb_user_role", { schema: "mycost" })
export class TbUserRole {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "userid", nullable: true })
  userid: number | null;

  @Column("int", { name: "roleid", nullable: true })
  roleid: number | null;

  @ManyToOne(() => TbRole, (tbRole) => tbRole.tbUserRoles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "roleid", referencedColumnName: "id" }])
  role: TbRole;

  @ManyToOne(() => TbUser, (tbUser) => tbUser.tbUserRoles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
  user: TbUser;
}
