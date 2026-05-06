export type MapCoordinates = {
  lat: number;
  lng: number;
};

export type ResolvedMapPlace = MapCoordinates & {
  label: string;
  source: "known" | "coordinates" | "geocoded" | "photon" | "browser";
};

export type RouteDetails = {
  pickup: ResolvedMapPlace;
  destination: ResolvedMapPlace;
  distanceKm: number;
  durationMinutes: number;
  geometry: MapCoordinates[];
  confidence: string;
  source: "osrm" | "estimate";
};

export const mapServiceConfig = {
  tileUrl: process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileAttribution:
    process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ?? "&copy; OpenStreetMap contributors",
  nominatimUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_NOMINATIM_URL ?? "https://nominatim.openstreetmap.org"
  ),
  photonUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_PHOTON_URL ?? "https://photon.komoot.io"),
  osrmUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_OSRM_URL ?? "https://router.project-osrm.org"),
  geocodeCountryCodes: process.env.NEXT_PUBLIC_GEOCODE_COUNTRY_CODES ?? "ng"
};

export const knownPlaces = [
  { label: "Wuse 2, Abuja", lat: 9.081, lng: 7.468 },
  { label: "Central Business District, Abuja", lat: 9.0579, lng: 7.4951 },
  { label: "Garki Area 11, Abuja", lat: 9.0305, lng: 7.4898 },
  { label: "Maitama, Abuja", lat: 9.0965, lng: 7.4942 },
  { label: "Asokoro, Abuja", lat: 9.0455, lng: 7.5241 },
  { label: "Jabi Lake Mall", lat: 9.0757, lng: 7.4255 },
  { label: "Utako, Abuja", lat: 9.069, lng: 7.445 },
  { label: "Nnamdi Azikiwe Airport", lat: 9.0068, lng: 7.2632 },
  { label: "Transcorp Hilton Abuja", lat: 9.0765, lng: 7.4957 },
  { label: "Novare Gateway Mall", lat: 9.0308, lng: 7.3969 }
] as const;

type NominatimSearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type PhotonSearchResult = {
  features?: Array<{
    geometry?: {
      coordinates?: [number, number];
    };
    properties?: {
      name?: string;
      street?: string;
      housenumber?: string;
      district?: string;
      city?: string;
      state?: string;
      country?: string;
      postcode?: string;
    };
  }>;
};

type NominatimReverseResult = {
  display_name?: string;
};

type OsrmRouteResponse = {
  routes?: Array<{
    distance: number;
    duration: number;
    geometry?: {
      coordinates?: [number, number][];
    };
  }>;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function normalizePlaceQuery(value: string) {
  return value.trim().toLowerCase();
}

export function getKnownPlace(query: string): ResolvedMapPlace | null {
  const cleanQuery = normalizePlaceQuery(query);
  const match = knownPlaces.find((place) => normalizePlaceQuery(place.label) === cleanQuery);
  const partial =
    match ??
    knownPlaces.find(
      (place) =>
        normalizePlaceQuery(place.label).includes(cleanQuery) || cleanQuery.includes(normalizePlaceQuery(place.label))
    );

  return partial ? { ...partial, source: "known" } : null;
}

export function getKnownPlaceMatches(query: string, limit = 6): ResolvedMapPlace[] {
  const cleanQuery = normalizePlaceQuery(query);
  const terms = cleanQuery.split(/\s+/).filter(Boolean);
  const source = cleanQuery
    ? knownPlaces.filter((place) => {
        const label = normalizePlaceQuery(place.label);

        return label.includes(cleanQuery) || terms.some((term) => label.includes(term));
      })
    : knownPlaces;

  return source.slice(0, limit).map((place) => ({
    ...place,
    source: "known"
  }));
}

export function parseCoordinates(query: string): ResolvedMapPlace | null {
  const match = query.trim().match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);

  if (!match) {
    return null;
  }

  const lat = Number(match[1]);
  const lng = Number(match[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return null;
  }

  return {
    label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    lat,
    lng,
    source: "coordinates"
  };
}

export function distanceKmBetween(a: MapCoordinates, b: MapCoordinates) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRadians(b.lat - a.lat);
  const lngDelta = toRadians(b.lng - a.lng);
  const startLat = toRadians(a.lat);
  const endLat = toRadians(b.lat);
  const haversine =
    Math.sin(latDelta / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function estimateRouteFromPlaces(pickup: ResolvedMapPlace, destination: ResolvedMapPlace): RouteDetails {
  const directKm = distanceKmBetween(pickup, destination);
  const roadDistanceKm = Math.max(1.8, directKm * 1.32);
  const durationMinutes = Math.max(8, Math.round((roadDistanceKm / 28) * 60 + 6));

  return {
    pickup,
    destination,
    distanceKm: Number(roadDistanceKm.toFixed(1)),
    durationMinutes,
    geometry: [pickup, destination],
    confidence: "Estimated from coordinates; routing service unavailable",
    source: "estimate"
  };
}

export async function searchPlaces(query: string, limit = 6): Promise<ResolvedMapPlace[]> {
  const cleanQuery = query.trim();
  const knownMatches = getKnownPlaceMatches(cleanQuery, limit);

  if (cleanQuery.length < 2) {
    return knownMatches;
  }

  const params = new URLSearchParams({
    q: cleanQuery,
    limit: String(Math.max(1, Math.min(limit, 8))),
    lat: "9.0579",
    lon: "7.4951",
    lang: "en"
  });

  try {
    const response = await fetch(`${mapServiceConfig.photonUrl}/api/?${params.toString()}`);

    if (!response.ok) {
      return knownMatches;
    }

    const data = (await response.json()) as PhotonSearchResult;
    const photonMatches =
      data.features
        ?.map((feature) => {
          const coordinates = feature.geometry?.coordinates;
          const properties = feature.properties;

          if (!coordinates || !properties?.name) {
            return null;
          }

          return {
            label: compactPhotonPlaceLabel(properties),
            lat: coordinates[1],
            lng: coordinates[0],
            source: "photon" as const
          };
        })
        .filter((place): place is Extract<ResolvedMapPlace, { source: "photon" }> => Boolean(place)) ?? [];

    return dedupePlaces([...knownMatches, ...photonMatches]).slice(0, limit);
  } catch {
    return knownMatches;
  }
}

export async function geocodeAddress(query: string): Promise<ResolvedMapPlace> {
  const cleanQuery = query.trim();
  const coordinates = parseCoordinates(cleanQuery);

  if (coordinates) {
    return coordinates;
  }

  const known = getKnownPlace(cleanQuery);

  if (known) {
    return known;
  }

  if (cleanQuery.length < 3) {
    throw new Error("Enter at least 3 characters for the address.");
  }

  const photonResults = await searchPlaces(cleanQuery, 1);
  const photonResult = photonResults.find((place) => place.source === "photon");

  if (photonResult) {
    return photonResult;
  }

  const params = new URLSearchParams({
    format: "jsonv2",
    limit: "1",
    q: cleanQuery,
    addressdetails: "1"
  });

  if (mapServiceConfig.geocodeCountryCodes) {
    params.set("countrycodes", mapServiceConfig.geocodeCountryCodes);
  }

  const response = await fetch(`${mapServiceConfig.nominatimUrl}/search?${params.toString()}`, {
    headers: {
      "Accept-Language": "en"
    }
  });

  if (!response.ok) {
    throw new Error("The address lookup service is unavailable right now.");
  }

  const results = (await response.json()) as NominatimSearchResult[];
  const result = results[0];

  if (!result) {
    throw new Error("No map result found for that address.");
  }

  return {
    label: compactPlaceLabel(result.display_name),
    lat: Number(result.lat),
    lng: Number(result.lon),
    source: "geocoded"
  };
}

export async function reverseGeocodeLocation(place: MapCoordinates): Promise<string | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(place.lat),
    lon: String(place.lng),
    zoom: "18",
    addressdetails: "1"
  });

  const response = await fetch(`${mapServiceConfig.nominatimUrl}/reverse?${params.toString()}`, {
    headers: {
      "Accept-Language": "en"
    }
  });

  if (!response.ok) {
    return null;
  }

  const result = (await response.json()) as NominatimReverseResult;
  return result.display_name ? compactPlaceLabel(result.display_name) : null;
}

export async function routeBetweenPlaces(pickup: ResolvedMapPlace, destination: ResolvedMapPlace): Promise<RouteDetails> {
  const routeUrl = `${mapServiceConfig.osrmUrl}/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}`;
  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "false"
  });

  try {
    const response = await fetch(`${routeUrl}?${params.toString()}`);

    if (!response.ok) {
      return estimateRouteFromPlaces(pickup, destination);
    }

    const payload = (await response.json()) as OsrmRouteResponse;
    const route = payload.routes?.[0];

    if (!route) {
      return estimateRouteFromPlaces(pickup, destination);
    }

    return {
      pickup,
      destination,
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      durationMinutes: Math.max(1, Math.round(route.duration / 60)),
      geometry:
        route.geometry?.coordinates?.map(([lng, lat]) => ({
          lat,
          lng
        })) ?? [pickup, destination],
      confidence: "Live route from OSRM using OpenStreetMap road data",
      source: "osrm"
    };
  } catch {
    return estimateRouteFromPlaces(pickup, destination);
  }
}

function compactPlaceLabel(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
}

function compactPhotonPlaceLabel(properties: NonNullable<PhotonSearchResult["features"]>[number]["properties"]) {
  const street = [properties?.street, properties?.housenumber].filter(Boolean).join(" ");

  return [properties?.name, street, properties?.district, properties?.city, properties?.state, properties?.country]
    .filter(Boolean)
    .filter((part, index, source) => source.indexOf(part) === index)
    .slice(0, 5)
    .join(", ");
}

function dedupePlaces(places: ResolvedMapPlace[]) {
  const seen = new Set<string>();

  return places.filter((place) => {
    const key = `${normalizePlaceQuery(place.label)}-${place.lat.toFixed(4)}-${place.lng.toFixed(4)}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
