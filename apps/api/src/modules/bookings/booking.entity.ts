import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { BookingStatus, RideClass } from "../../common/enums/domain.enum";

@Entity("bookings")
export class BookingEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  customerId!: string;

  @Column()
  pickupLabel!: string;

  @Column({ type: "decimal", precision: 10, scale: 7 })
  pickupLatitude!: number;

  @Column({ type: "decimal", precision: 10, scale: 7 })
  pickupLongitude!: number;

  @Column()
  destinationLabel!: string;

  @Column({ type: "decimal", precision: 10, scale: 7 })
  destinationLatitude!: number;

  @Column({ type: "decimal", precision: 10, scale: 7 })
  destinationLongitude!: number;

  @Column({
    type: "enum",
    enum: RideClass,
    default: RideClass.Regular
  })
  rideClass!: RideClass;

  @Column({ default: "no_music" })
  musicPreference!: string;

  @Column({ default: "normal" })
  acPreference!: string;

  @Column({ default: "quiet" })
  rideStyle!: string;

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.Requested
  })
  status!: BookingStatus;

  @Column({ type: "int", nullable: true })
  estimatedFareKobo?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

