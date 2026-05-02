import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("drivers")
export class DriverEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  staffCode!: string;

  @Column()
  fullName!: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  assignedVehicleId?: string;

  @Column({ default: false })
  isOnDuty!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

