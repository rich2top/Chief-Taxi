import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { DriverApplicationStatus } from "../../common/enums/domain.enum";

@Entity("driver_applications")
export class DriverApplicationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  city!: string;

  @Column()
  address!: string;

  @Column()
  licenseNumber!: string;

  @Column({ type: "date" })
  licenseExpiry!: string;

  @Column({ type: "int", default: 0 })
  yearsExperience!: number;

  @Column({ default: false })
  hasEvExperience!: boolean;

  @Column({ nullable: true })
  previousEmployer?: string;

  @Column()
  guarantorName!: string;

  @Column()
  guarantorPhoneNumber!: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({
    type: "enum",
    enum: DriverApplicationStatus,
    default: DriverApplicationStatus.Submitted
  })
  status!: DriverApplicationStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
