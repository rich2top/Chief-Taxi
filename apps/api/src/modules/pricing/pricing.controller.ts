import { Body, Controller, Post } from "@nestjs/common";
import { CreatePriceQuoteDto } from "./dto/create-price-quote.dto";
import { PricingService } from "./pricing.service";

@Controller("pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post("quote")
  createQuote(@Body() input: CreatePriceQuoteDto) {
    return this.pricingService.createQuote(input);
  }
}
