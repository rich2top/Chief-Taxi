import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookingStatus } from "../../common/enums/domain.enum";
import { BookingEntity } from "./booking.entity";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookings: Repository<BookingEntity>
  ) {}

  create(input: CreateBookingDto) {
    return this.bookings.save(this.bookings.create(input));
  }

  findAll() {
    return this.bookings.find({
      order: { createdAt: "DESC" },
      take: 100
    });
  }

  findPending() {
    return this.bookings.find({
      where: { status: BookingStatus.Requested },
      order: { createdAt: "ASC" },
      take: 50
    });
  }

  async findById(id: string) {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException("Booking not found.");
    }

    return booking;
  }

  async markAssigned(id: string) {
    const booking = await this.findById(id);
    booking.status = BookingStatus.Assigned;
    return this.bookings.save(booking);
  }
}

