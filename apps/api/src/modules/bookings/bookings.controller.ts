import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() input: CreateBookingDto) {
    return this.bookingsService.create(input);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get("pending")
  findPending() {
    return this.bookingsService.findPending();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.bookingsService.findById(id);
  }
}

