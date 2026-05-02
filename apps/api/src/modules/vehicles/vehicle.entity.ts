import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { RideClass, VehicleStatus } from "../../common/enums/domain.enum";

@Entity("vehicles")
export class VehicleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  manufacturer!: string;

  @Column()
  model!: string;

  @Column()
  plateNumber!: string;

  @Column({ nullable: true })
  vin?: string;

  @Column({
    type: "enum",
    enum: RideClass,
    default: RideClass.Regular
  })
  rideClass!: RideClass;

  @Column({
    type: "enum",
    enum: VehicleStatus,
    default: VehicleStatus.Available
  })
  status!: VehicleStatus;

  @Column({ type: "int", default: 0 })
  mileageKm!: number;

  @Column({ type: "int", nullable: true })
  batteryPercent?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

