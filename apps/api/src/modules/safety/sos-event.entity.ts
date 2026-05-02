import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { SosStatus } from "../../common/enums/domain.enum";

@Entity("sos_events")
export class SosEventEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tripId!: string;

  @Column()
  raisedByUserId!: string;

  @Column({ default: "customer" })
  raisedByType!: "customer" | "driver" | "staff";

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  note?: string;

  @Column({
    type: "enum",
    enum: SosStatus,
    default: SosStatus.Open
  })
  status!: SosStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

