import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { RideClass, TripStatus } from "../../common/enums/domain.enum";

@Entity("trips")
export class TripEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  bookingId!: string;

  @Column()
  customerId!: string;

  @Column()
  driverId!: string;

  @Column()
  vehicleId!: string;

  @Column({
    type: "enum",
    enum: RideClass,
    default: RideClass.Regular
  })
  rideClass!: RideClass;

  @Column({
    type: "enum",
    enum: TripStatus,
    default: TripStatus.Assigned
  })
  status!: TripStatus;

  @Column({ default: "no_music" })
  musicPreference!: string;

  @Column({ default: "normal" })
  acPreference!: string;

  @Column({ default: "quiet" })
  rideStyle!: string;

  @Column({ type: "timestamp", nullable: true })
  startedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

