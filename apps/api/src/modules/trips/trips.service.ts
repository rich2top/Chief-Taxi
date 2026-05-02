import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TripStatus } from "../../common/enums/domain.enum";
import { BookingEntity } from "../bookings/booking.entity";
import { TripEntity } from "./trip.entity";

type CreateFromBookingInput = {
  booking: BookingEntity;
  driverId: string;
  vehicleId: string;
};

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(TripEntity)
    private readonly trips: Repository<TripEntity>
  ) {}

  createFromBooking(input: CreateFromBookingInput) {
    const { booking, driverId, vehicleId } = input;
    return this.trips.save(
      this.trips.create({
        bookingId: booking.id,
        customerId: booking.customerId,
        driverId,
        vehicleId,
        rideClass: booking.rideClass,
        musicPreference: booking.musicPreference,
        acPreference: booking.acPreference,
        rideStyle: booking.rideStyle,
        status: TripStatus.Assigned
      })
    );
  }

  findLive() {
    return this.trips.find({
      where: [
        { status: TripStatus.Assigned },
        { status: TripStatus.DriverEnRoute },
        { status: TripStatus.Arrived },
        { status: TripStatus.InProgress },
        { status: TripStatus.Waiting }
      ],
      order: { createdAt: "DESC" }
    });
  }

  async findById(id: string) {
    const trip = await this.trips.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException("Trip not found.");
    }

    return trip;
  }

  async updateStatus(id: string, status: TripStatus) {
    const trip = await this.findById(id);
    trip.status = status;

    if (status === TripStatus.InProgress && !trip.startedAt) {
      trip.startedAt = new Date();
    }

    if (status === TripStatus.Completed && !trip.completedAt) {
      trip.completedAt = new Date();
    }

    return this.trips.save(trip);
  }
}

