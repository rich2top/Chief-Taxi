import { createHmac } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RideClass } from "../../common/enums/domain.enum";
import { CreatePriceQuoteDto } from "./dto/create-price-quote.dto";

const classRates = {
  [RideClass.Regular]: {
    baseFare: 1800,
    perKm: 320,
    perMinute: 70,
    minimumFare: 3500
  },
  [RideClass.Comfort]: {
    baseFare: 2600,
    perKm: 430,
    perMinute: 90,
    minimumFare: 5500
  },
  [RideClass.Vip]: {
    baseFare: 5000,
    perKm: 760,
    perMinute: 130,
    minimumFare: 11000
  }
} as const;

type Coordinates = {
  latitude: number;
  longitude: number;
};

@Injectable()
export class PricingService {
  constructor(private readonly config: ConfigService) {}

  createQuote(input: CreatePriceQuoteDto) {
    const route = this.estimateRoute(
      { latitude: input.pickupLatitude, longitude: input.pickupLongitude },
      { latitude: input.destinationLatitude, longitude: input.destinationLongitude }
    );
    const rates = classRates[input.rideClass];
    const rawFare = rates.baseFare + route.distanceKm * rates.perKm + route.durationMinutes * rates.perMinute;
    const bookingAddOn = input.bookingType === "hourly" ? 7000 : input.bookingType === "airport" ? 3000 : 0;
    const waitAddOn = (input.waitMinutes ?? 0) * 120;
    const driverAddOn = input.femaleDriver ? 1200 : 0;
    const securityFee = 250;
    const fareNaira = Math.ceil(Math.max(rates.minimumFare, rawFare) + bookingAddOn + waitAddOn + driverAddOn + securityFee);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const payload = {
      pickupLabel: input.pickupLabel,
      destinationLabel: input.destinationLabel,
      rideClass: input.rideClass,
      bookingType: input.bookingType,
      scheduledAt: input.scheduledAt,
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
      fareKobo: fareNaira * 100,
      expiresAt
    };

    return {
      ...payload,
      quoteSignature: this.signQuote(payload)
    };
  }

  private estimateRoute(origin: Coordinates, destination: Coordinates) {
    const directDistanceKm = this.distanceKmBetween(origin, destination);
    const distanceKm = Number(Math.max(1.8, directDistanceKm * 1.32).toFixed(1));
    const durationMinutes = Math.max(8, Math.round((distanceKm / 28) * 60 + 6));

    return { distanceKm, durationMinutes };
  }

  private distanceKmBetween(origin: Coordinates, destination: Coordinates) {
    const earthRadiusKm = 6371;
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const latDelta = toRadians(destination.latitude - origin.latitude);
    const lngDelta = toRadians(destination.longitude - origin.longitude);
    const startLat = toRadians(origin.latitude);
    const endLat = toRadians(destination.latitude);
    const haversine =
      Math.sin(latDelta / 2) ** 2 +
      Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  private signQuote(payload: Record<string, unknown>) {
    const secret = this.config.get<string>("PRICING_SIGNING_SECRET", "development-pricing-secret");
    return createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");
  }
}
