"use client";

import {
  AlertTriangle,
  Armchair,
  ArrowLeft,
  ArrowRight,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Droplets,
  Headphones,
  Leaf,
  LocateFixed,
  Luggage,
  MapPin,
  Navigation,
  Radio,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Snowflake,
  ThermometerSun,
  UserRound,
  Volume2,
  WalletCards,
  X,
  type LucideIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { RiderMap } from "@/components/RiderMap";
import {
  distanceKmBetween,
  estimateRouteFromPlaces,
  geocodeAddress,
  getKnownPlaceMatches,
  getKnownPlace,
  mapServiceConfig,
  reverseGeocodeLocation,
  routeBetweenPlaces,
  searchPlaces,
  type MapCoordinates,
  type ResolvedMapPlace,
  type RouteDetails
} from "@/lib/map-services";
import {
  buildSmsHref,
  buildTripShareUrl,
  buildTripSmsMessage,
  createTripId,
  getTripShareLimit,
  latestTripStorageKey,
  type RideSharePayload
} from "@/lib/trip-share";

const rideClasses = [
  {
    name: "Regular",
    label: "Everyday EV",
    car: "Aion Y Plus",
    baseFare: 1800,
    perKm: 320,
    perMinute: 70,
    minimumFare: 3500,
    eta: 6,
    detail: "Clean electric ride with route sharing, AC, and smooth city pickup.",
    included: ["Verified driver", "Clean cabin", "Route sharing"],
    perks: [
      { title: "Efficient", detail: "Low-emission city ride", icon: Leaf },
      { title: "Clean", detail: "Fresh cabin standard", icon: ShieldCheck },
      { title: "Verified", detail: "Screened driver", icon: UserRound }
    ]
  },
  {
    name: "Comfort",
    label: "Comfort EV",
    car: "Aion i60",
    baseFare: 2600,
    perKm: 430,
    perMinute: 90,
    minimumFare: 5500,
    eta: 8,
    detail: "Extra room, cleaner cabin air, steady AC, and a calmer driver experience.",
    included: ["Extra legroom", "Odor-free cabin", "Polite driver"],
    perks: [
      { title: "Spacious", detail: "Relaxed leg room", icon: Armchair },
      { title: "Clean air", detail: "Odor-free cabin", icon: Leaf },
      { title: "Polite driver", detail: "Courteous service", icon: UserRound }
    ]
  },
  {
    name: "Executive",
    label: "Premium EV",
    car: "Aion V",
    baseFare: 5000,
    perKm: 760,
    perMinute: 130,
    minimumFare: 11000,
    eta: 12,
    detail: "Premium SUV cabin with priority matching, quiet service, and hospitality add-ons.",
    included: ["Wet towel", "Premium wipes", "Bottled water", "Luggage assist"],
    perks: [
      { title: "Wet towel", detail: "Sealed refresh towel", icon: Droplets },
      { title: "Wipes", detail: "Premium hygiene kit", icon: Sparkles },
      { title: "Assisted", detail: "Water + luggage help", icon: Luggage }
    ]
  }
] as const;

const acOptions = ["Cool", "Normal", "Warm"] as const;
const musicMoodOptions = [
  { label: "Afrobeats", tag: "afrobeat" },
  { label: "Gospel", tag: "gospel" },
  { label: "Jazz", tag: "jazz" },
  { label: "Calm", tag: "easy listening" },
  { label: "News", tag: "news" }
] as const;
const radioBrowserUrl = (process.env.NEXT_PUBLIC_RADIO_BROWSER_URL ?? "https://de1.api.radio-browser.info").replace(
  /\/$/,
  ""
);
const driverProfile = {
  name: "Daniel E.",
  plate: "ABJ-024EV"
};

type RideClass = (typeof rideClasses)[number]["name"];
type AcOption = (typeof acOptions)[number];
type MusicMood = (typeof musicMoodOptions)[number]["tag"];
type MapStatus = "idle" | "mapping" | "locating" | "ready" | "fallback" | "error";
type TripPhase = "idle" | "starting" | "active";
type AddressFieldName = "pickup" | "destination";
type RideStation = {
  id: string;
  name: string;
  subtitle: string;
  streamUrl: string;
  homepage?: string;
};
type RadioBrowserStation = {
  stationuuid?: string;
  name?: string;
  url?: string;
  url_resolved?: string;
  homepage?: string;
  tags?: string;
  country?: string;
  codec?: string;
  bitrate?: number;
};

type ChoiceMenuProps<T extends string> = {
  label: string;
  icon: LucideIcon;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

type AddressFieldProps = {
  id: AddressFieldName;
  label: string;
  icon: LucideIcon;
  value: string;
  active: boolean;
  isSearching: boolean;
  suggestions: ResolvedMapPlace[];
  onActivate: (field: AddressFieldName | null) => void;
  onChange: (value: string) => void;
  onMapTyped: () => void;
  onSelect: (place: ResolvedMapPlace) => void;
};

function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

function compactLabel(value: string) {
  return value.split(",")[0]?.trim() || value;
}

const fallbackStations: Record<MusicMood, RideStation[]> = {
  afrobeat: [
    {
      id: "fallback-afrobeat-1",
      name: "Afrobeats Gospel Radio",
      subtitle: "Nigeria • MP3",
      streamUrl: "https://stream.zeno.fm/zyd9stmdlnlvv"
    },
    { id: "fallback-afrobeat-2", name: "Naija Pop Mix", subtitle: "Contemporary African pop", streamUrl: "" }
  ],
  gospel: [
    {
      id: "fallback-gospel-1",
      name: "Afrobeats Gospel Radio",
      subtitle: "Gospel ride sound",
      streamUrl: "https://stream.zeno.fm/zyd9stmdlnlvv"
    },
    { id: "fallback-gospel-2", name: "Praise Radio", subtitle: "Uplifting ride sound", streamUrl: "" }
  ],
  jazz: [
    {
      id: "fallback-jazz-1",
      name: "Adroit Jazz Underground",
      subtitle: "Jazz • MP3",
      streamUrl: "https://icecast.walmradio.com:8443/jazz"
    },
    { id: "fallback-jazz-2", name: "Classic Jazz", subtitle: "Soft evening ride", streamUrl: "" }
  ],
  "easy listening": [
    {
      id: "fallback-calm-1",
      name: "Classic Vinyl HD",
      subtitle: "Easy listening • MP3",
      streamUrl: "https://icecast.walmradio.com:8443/classic"
    },
    { id: "fallback-calm-2", name: "Soft Lounge", subtitle: "Low-volume cabin mood", streamUrl: "" }
  ],
  news: [
    { id: "fallback-news-1", name: "News Briefing", subtitle: "News and talk preference", streamUrl: "" },
    { id: "fallback-news-2", name: "Business News", subtitle: "Executive ride updates", streamUrl: "" }
  ]
};

function getAddressSuggestions(query: string) {
  return getKnownPlaceMatches(query, 6);
}

function getMoodLabel(tag: MusicMood) {
  return musicMoodOptions.find((item) => item.tag === tag)?.label ?? "Music";
}

function getFallbackStations(tag: MusicMood) {
  return fallbackStations[tag] ?? fallbackStations.afrobeat;
}

function toRideStation(station: RadioBrowserStation): RideStation | null {
  const name = station.name?.trim();
  const streamUrl = station.url_resolved?.trim() || station.url?.trim() || "";

  if (!name || !streamUrl) {
    return null;
  }

  if (!streamUrl.startsWith("https://")) {
    return null;
  }

  const stationMeta = [station.country, station.codec, station.bitrate ? `${station.bitrate}kbps` : null]
    .filter(Boolean)
    .join(" • ");

  return {
    id: station.stationuuid ?? `${name}-${streamUrl}`,
    name,
    subtitle: stationMeta || station.tags?.split(",").slice(0, 2).join(", ") || "Live station",
    streamUrl,
    homepage: station.homepage
  };
}

function interpolateRoutePosition(routePoints: MapCoordinates[], progress: number): MapCoordinates | null {
  if (routePoints.length === 0) {
    return null;
  }

  if (routePoints.length === 1) {
    return routePoints[0];
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const scaledIndex = clampedProgress * (routePoints.length - 1);
  const startIndex = Math.floor(scaledIndex);
  const endIndex = Math.min(routePoints.length - 1, startIndex + 1);
  const localProgress = scaledIndex - startIndex;
  const start = routePoints[startIndex];
  const end = routePoints[endIndex];

  return {
    lat: start.lat + (end.lat - start.lat) * localProgress,
    lng: start.lng + (end.lng - start.lng) * localProgress
  };
}

function ChoiceMenu<T extends string>({ label, icon: Icon, value, options, onChange }: ChoiceMenuProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`choice-menu ${open ? "open" : ""}`}>
      <span className="choice-label">
        <Icon size={16} />
        {label}
      </span>
      <button type="button" className="choice-trigger" aria-expanded={open} onClick={() => setOpen((next) => !next)}>
        {value}
        <ChevronDown size={16} />
      </button>
      {open ? (
        <div className="choice-list" role="listbox">
          {options.map((option) => (
            <button
              className={value === option ? "selected" : ""}
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AddressField({
  id,
  label,
  icon: Icon,
  value,
  active,
  isSearching,
  suggestions,
  onActivate,
  onChange,
  onMapTyped,
  onSelect
}: AddressFieldProps) {
  const inputId = `${id}-address`;
  const showTypedSearch = value.trim().length >= 3;
  const open = active && (suggestions.length > 0 || showTypedSearch);

  return (
    <div className={`booking-field address-field ${open ? "open" : ""}`}>
      <span id={`${inputId}-label`}>{label}</span>
      <div>
        <Icon size={18} />
        <input
          aria-autocomplete="list"
          aria-controls={`${inputId}-suggestions`}
          aria-expanded={open}
          aria-labelledby={`${inputId}-label`}
          autoComplete="off"
          id={inputId}
          value={value}
          onBlur={() => {
            window.setTimeout(() => onActivate(null), 120);
          }}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => onActivate(id)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onMapTyped();
            }
          }}
        />
      </div>
      {open ? (
        <div className="address-suggestions" id={`${inputId}-suggestions`} role="listbox">
          {suggestions.map((place) => (
            <button
              key={`${id}-${place.label}`}
              role="option"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(place)}
            >
              <MapPin size={15} />
              <span>
                <strong>{compactLabel(place.label)}</strong>
                <small>{place.label.split(",").slice(1).join(",").trim() || "Abuja, Nigeria"}</small>
              </span>
            </button>
          ))}
          {isSearching ? (
            <div className="address-suggestion-status" role="status">
              <Search size={15} />
              <span>Searching map results</span>
            </div>
          ) : null}
          {showTypedSearch ? (
            <button
              className="address-suggestion-search"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onMapTyped}
            >
              <Search size={15} />
              <span>
                <strong>Map typed address</strong>
                <small>{value}</small>
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const defaultPickup = "Wuse 2, Abuja";
const defaultDestination = "Nnamdi Azikiwe Airport";
const initialPickupPlace = getKnownPlace(defaultPickup) ?? {
  label: defaultPickup,
  lat: 9.081,
  lng: 7.468,
  source: "known" as const
};
const initialDestinationPlace = getKnownPlace(defaultDestination) ?? {
  label: defaultDestination,
  lat: 9.0068,
  lng: 7.2632,
  source: "known" as const
};

export default function CustomerPage() {
  const [pickup, setPickup] = useState(defaultPickup);
  const [destination, setDestination] = useState(defaultDestination);
  const [pickupPlace, setPickupPlace] = useState<ResolvedMapPlace>(initialPickupPlace);
  const [destinationPlace, setDestinationPlace] = useState<ResolvedMapPlace>(initialDestinationPlace);
  const [route, setRoute] = useState<RouteDetails>(() =>
    estimateRouteFromPlaces(initialPickupPlace, initialDestinationPlace)
  );
  const [routeDirty, setRouteDirty] = useState(false);
  const [mapStatus, setMapStatus] = useState<MapStatus>("idle");
  const [mapMessage, setMapMessage] = useState("Route will update before confirmation.");
  const [activeAddressField, setActiveAddressField] = useState<AddressFieldName | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<ResolvedMapPlace[]>(() =>
    getAddressSuggestions(defaultPickup)
  );
  const [destinationSuggestions, setDestinationSuggestions] = useState<ResolvedMapPlace[]>(() =>
    getAddressSuggestions(defaultDestination)
  );
  const [addressSearching, setAddressSearching] = useState(false);
  const [rideClass, setRideClass] = useState<RideClass>("Comfort");
  const [ac, setAc] = useState<AcOption>("Cool");
  const [musicMood, setMusicMood] = useState<MusicMood>("afrobeat");
  const [musicQuery, setMusicQuery] = useState("");
  const [musicStations, setMusicStations] = useState<RideStation[]>(() => getFallbackStations("afrobeat"));
  const [selectedStation, setSelectedStation] = useState<RideStation>(() => getFallbackStations("afrobeat")[0]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicPlaybackMessage, setMusicPlaybackMessage] = useState("Music starts after confirmation.");
  const [activeTrip, setActiveTrip] = useState<RideSharePayload | null>(null);
  const [shareNumbers, setShareNumbers] = useState<string[]>(() =>
    Array.from({ length: getTripShareLimit("Comfort") }, () => "")
  );
  const [shareStatus, setShareStatus] = useState("");
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState("Route watch is ready.");
  const [confirmed, setConfirmed] = useState(false);
  const [tripPhase, setTripPhase] = useState<TripPhase>("idle");
  const [vehiclePosition, setVehiclePosition] = useState<MapCoordinates | null>(null);
  const [tripProgress, setTripProgress] = useState(0);
  const routeRequestRef = useRef(0);
  const initialMapRequestedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const locationWatchRef = useRef<number | null>(null);
  const simulationTimerRef = useRef<number | null>(null);

  const clearActiveTripDraft = useCallback(() => {
    const audio = audioRef.current;

    if (locationWatchRef.current !== null) {
      navigator.geolocation?.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }

    if (simulationTimerRef.current !== null) {
      window.clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setConfirmed(false);
    setActiveTrip(null);
    setTripPhase("idle");
    setVehiclePosition(null);
    setTripProgress(0);
    setMusicPlaying(false);
    setMusicPlaybackMessage("Music starts after confirmation.");
    setShareStatus("");
  }, []);

  const mapRoute = useCallback(
    async (
      nextPickup = pickup,
      nextDestination = destination,
      mappedPickup?: ResolvedMapPlace,
      mappedDestination?: ResolvedMapPlace
    ) => {
      const requestId = routeRequestRef.current + 1;
      routeRequestRef.current = requestId;
      clearActiveTripDraft();
      setMapStatus("mapping");
      setMapMessage("Converting addresses to map coordinates.");

      try {
        const [resolvedPickup, resolvedDestination] = await Promise.all([
          mappedPickup ? Promise.resolve(mappedPickup) : geocodeAddress(nextPickup),
          mappedDestination ? Promise.resolve(mappedDestination) : geocodeAddress(nextDestination)
        ]);
        const nextRoute = await routeBetweenPlaces(resolvedPickup, resolvedDestination);

        if (routeRequestRef.current !== requestId) {
          return false;
        }

        setPickupPlace(resolvedPickup);
        setDestinationPlace(resolvedDestination);
        setRoute(nextRoute);
        setRouteDirty(false);
        setMapStatus(nextRoute.source === "osrm" ? "ready" : "fallback");
        setMapMessage(nextRoute.confidence);
        return true;
      } catch (error) {
        if (routeRequestRef.current !== requestId) {
          return false;
        }

        setMapStatus("error");
        setRouteDirty(true);
        setMapMessage(error instanceof Error ? error.message : "The route could not be mapped right now.");
        return false;
      }
    },
    [clearActiveTripDraft, destination, pickup]
  );

  useEffect(() => {
    if (initialMapRequestedRef.current) {
      return;
    }

    initialMapRequestedRef.current = true;
    void mapRoute(defaultPickup, defaultDestination, initialPickupPlace, initialDestinationPlace);
  }, [mapRoute]);

  useEffect(() => {
    if (!activeAddressField) {
      setAddressSearching(false);
      return;
    }

    const query = activeAddressField === "pickup" ? pickup : destination;
    const applySuggestions = activeAddressField === "pickup" ? setPickupSuggestions : setDestinationSuggestions;
    const localSuggestions = getAddressSuggestions(query);

    applySuggestions(localSuggestions);

    if (query.trim().length < 2) {
      setAddressSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setAddressSearching(true);

      try {
        const results = await searchPlaces(query, 6);

        if (!controller.signal.aborted) {
          applySuggestions(results.length > 0 ? results : localSuggestions);
        }
      } finally {
        if (!controller.signal.aborted) {
          setAddressSearching(false);
        }
      }
    }, 360);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [activeAddressField, destination, pickup]);

  useEffect(() => {
    const controller = new AbortController();
    const fallback = getFallbackStations(musicMood);
    const query = musicQuery.trim();

    const timeout = window.setTimeout(async () => {
      setMusicLoading(true);

      try {
        const params = new URLSearchParams({
          hidebroken: "true",
          limit: "6",
          order: "clickcount",
          reverse: "true"
        });

        if (query) {
          params.set("name", query);
        } else {
          params.set("tag", musicMood);
        }

        const response = await fetch(`${radioBrowserUrl}/json/stations/search?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Station search is unavailable.");
        }

        const data = (await response.json()) as RadioBrowserStation[];
        const stations = data.map(toRideStation).filter((station): station is RideStation => Boolean(station)).slice(0, 4);
        const nextStations = stations.length > 0 ? stations : fallback;

        setMusicStations(nextStations);
        setSelectedStation((current) =>
          nextStations.some((station) => station.id === current.id) ? current : nextStations[0]
        );
      } catch {
        if (!controller.signal.aborted) {
          setMusicStations(fallback);
          setSelectedStation((current) =>
            fallback.some((station) => station.id === current.id) ? current : fallback[0]
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setMusicLoading(false);
        }
      }
    }, 320);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [musicMood, musicQuery]);

  useEffect(() => {
    setShareNumbers((current) =>
      Array.from({ length: getTripShareLimit(rideClass) }, (_, index) => current[index] ?? "")
    );
  }, [rideClass]);

  useEffect(() => {
    return () => {
      if (locationWatchRef.current !== null) {
        navigator.geolocation?.clearWatch(locationWatchRef.current);
      }

      if (simulationTimerRef.current !== null) {
        window.clearInterval(simulationTimerRef.current);
      }
    };
  }, []);

  const useCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setMapStatus("error");
      setMapMessage("Current location is not available in this browser.");
      return;
    }

    clearActiveTripDraft();
    setMapStatus("locating");
    setMapMessage("Getting your current pickup location.");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 12000
        });
      });
      const browserPlace = {
        label: "Current location",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        source: "browser" as const
      };
      const address = await reverseGeocodeLocation(browserPlace).catch(() => null);
      const resolvedPickup = {
        ...browserPlace,
        label: address ?? browserPlace.label
      };

      setPickup(resolvedPickup.label);
      await mapRoute(resolvedPickup.label, destination, resolvedPickup);
    } catch {
      setMapStatus("error");
      setMapMessage("Location permission was not granted, or the browser could not locate this device.");
    }
  }, [destination, mapRoute]);

  const selectedClass = useMemo(
    () => rideClasses.find((item) => item.name === rideClass) ?? rideClasses[1],
    [rideClass]
  );

  const estimate = useMemo(() => {
    const rawFare =
      selectedClass.baseFare +
      route.distanceKm * selectedClass.perKm +
      route.durationMinutes * selectedClass.perMinute;
    const securityFee = 250;
    return Math.ceil(Math.max(selectedClass.minimumFare, rawFare) + securityFee);
  }, [route.distanceKm, route.durationMinutes, selectedClass]);

  const eta = selectedClass.eta;
  const bookingCode = `${rideClass.slice(0, 1)}N-${eta}${Math.round(route.distanceKm)}`.toUpperCase();
  const selectedStationLabel = selectedStation.name || getMoodLabel(musicMood);
  const routeIsLoading = mapStatus === "mapping" || mapStatus === "locating";
  const routeMessage = routeDirty ? "Address changed. Confirming will refresh the route." : mapMessage;
  const shareLimit = getTripShareLimit(rideClass);
  const shareUrl = useMemo(() => {
    if (!activeTrip || typeof window === "undefined") {
      return "";
    }

    return buildTripShareUrl(activeTrip, window.location.origin);
  }, [activeTrip]);

  const startRideMusic = useCallback(async () => {
    const audio = audioRef.current;

    if (!selectedStation.streamUrl || !audio) {
      setMusicPlaying(false);
      setMusicPlaybackMessage("Music preference saved for the driver.");
      return;
    }

    try {
      audio.src = selectedStation.streamUrl;
      audio.volume = 0.42;
      await audio.play();
      setMusicPlaying(true);
      setMusicPlaybackMessage(`Playing ${selectedStation.name}`);
    } catch {
      setMusicPlaying(false);
      setMusicPlaybackMessage("Tap play if the browser blocks autoplay.");
    }
  }, [selectedStation]);

  const buildActiveTrip = useCallback(
    (): RideSharePayload => ({
      tripId: createTripId(),
      startedAt: new Date().toISOString(),
      pickup: pickupPlace.label,
      destination: destinationPlace.label,
      etaMinutes: route.durationMinutes,
      distanceKm: route.distanceKm,
      fare: estimate,
      driverName: driverProfile.name,
      driverPlate: driverProfile.plate,
      vehicle: `${selectedClass.car} EV`,
      rideClass,
      ac,
      music: selectedStationLabel,
      musicStreamUrl: selectedStation.streamUrl,
      status: "Trip started"
    }),
    [
      ac,
      destinationPlace.label,
      estimate,
      pickupPlace.label,
      rideClass,
      route.distanceKm,
      route.durationMinutes,
      selectedClass.car,
      selectedStation.streamUrl,
      selectedStationLabel
    ]
  );

  const persistTrip = useCallback((trip: RideSharePayload) => {
    setActiveTrip(trip);
    window.localStorage.setItem(latestTripStorageKey, JSON.stringify(trip));
  }, []);

  const updateTripStatus = useCallback(
    (status: string) => {
      setActiveTrip((currentTrip) => {
        if (!currentTrip) {
          return currentTrip;
        }

        const nextTrip = { ...currentTrip, status };
        window.localStorage.setItem(latestTripStorageKey, JSON.stringify(nextTrip));
        return nextTrip;
      });
    },
    []
  );

  const startTripTracking = useCallback(
    (trip: RideSharePayload) => {
      if (locationWatchRef.current !== null) {
        navigator.geolocation?.clearWatch(locationWatchRef.current);
        locationWatchRef.current = null;
      }

      if (simulationTimerRef.current !== null) {
        window.clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }

      setTripPhase("active");
      setTripProgress(1);
      setVehiclePosition(interpolateRoutePosition(route.geometry, 0) ?? pickupPlace);
      updateTripStatus("Trip started");

      const startedAt = Date.now();
      const demoDurationMs = Math.max(90000, Math.min(route.durationMinutes * 60 * 1000, 180000));

      simulationTimerRef.current = window.setInterval(() => {
        const progress = Math.min(0.98, (Date.now() - startedAt) / demoDurationMs);
        const nextPosition = interpolateRoutePosition(route.geometry, progress);

        setTripProgress(Math.round(progress * 100));

        if (nextPosition) {
          setVehiclePosition(nextPosition);
        }

        if (progress > 0.92) {
          updateTripStatus("Approaching destination");
        }
      }, 1500);

      if (!navigator.geolocation) {
        setSafetyStatus("Live device tracking unavailable; showing route progress.");
        return;
      }

      locationWatchRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (simulationTimerRef.current !== null) {
            window.clearInterval(simulationTimerRef.current);
            simulationTimerRef.current = null;
          }

          const nextPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const totalDistance = Math.max(0.1, distanceKmBetween(pickupPlace, destinationPlace));
          const remainingDistance = distanceKmBetween(nextPosition, destinationPlace);
          const nextProgress = Math.max(1, Math.min(98, Math.round((1 - remainingDistance / totalDistance) * 100)));

          setVehiclePosition(nextPosition);
          setTripProgress(nextProgress);
          setSafetyStatus("Live device tracking is active.");
          updateTripStatus(nextProgress > 92 ? "Approaching destination" : trip.status);
        },
        () => {
          setSafetyStatus("Location permission is off; showing estimated route progress.");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 12000
        }
      );
    },
    [destinationPlace, pickupPlace, route.durationMinutes, route.geometry, updateTripStatus]
  );

  async function copyTripLink() {
    if (!shareUrl) {
      setShareStatus("Confirm the ride first.");
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setShareStatus("Trip link copied.");
  }

  async function shareNativeTrip() {
    if (!activeTrip || !shareUrl) {
      setShareStatus("Confirm the ride first.");
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: `LEEL Ride ${activeTrip.tripId}`,
        text: buildTripSmsMessage(activeTrip, shareUrl),
        url: shareUrl
      });
      setShareStatus("Trip shared.");
      return;
    }

    await copyTripLink();
  }

  function sendTripSms() {
    if (!activeTrip || !shareUrl) {
      setShareStatus("Confirm the ride first.");
      return;
    }

    const numbers = shareNumbers.map((number) => number.trim()).filter(Boolean).slice(0, shareLimit);

    if (numbers.length === 0) {
      setShareStatus("Add at least one contact.");
      return;
    }

    window.location.href = buildSmsHref(numbers, buildTripSmsMessage(activeTrip, shareUrl));
    setShareStatus("SMS composer opened.");
  }

  async function confirmRide() {
    const routeReady = routeDirty || mapStatus === "error" ? await mapRoute() : true;

    if (routeReady) {
      const trip = buildActiveTrip();
      setTripPhase("starting");
      setConfirmed(true);
      persistTrip(trip);
      setShareStatus("Trip link ready.");
      startTripTracking(trip);
      await startRideMusic();
    }
  }

  return (
    <main className="ride-app-page">
      <div className="ride-shell">
        <section className="ride-map-panel" aria-label="Route map">
          <RiderMap
            pickup={pickupPlace}
            destination={destinationPlace}
            routeGeometry={route.geometry}
            vehiclePosition={vehiclePosition}
            tileUrl={mapServiceConfig.tileUrl}
            tileAttribution={mapServiceConfig.tileAttribution}
            isLoading={routeIsLoading}
          />

          <header className="ride-app-header">
            <Link className="ride-icon-button" href="/" aria-label="Back home">
              <ArrowLeft size={20} />
            </Link>
            <BrandMark />
            <span className={`ride-live-pill map-${mapStatus}`}>
              <span />
              {routeIsLoading ? "Mapping" : mapStatus === "error" ? "Check route" : "Online"}
            </span>
          </header>

          <div className="ride-route-card" aria-label="Route estimate">
            <div>
              <strong>
                {tripPhase === "active"
                  ? "Trip in progress"
                  : routeDirty
                    ? "Route pending"
                    : `To ${compactLabel(route.destination.label)}`}
              </strong>
              <span>
                {tripPhase === "active"
                  ? `${tripProgress}% complete`
                  : `${route.distanceKm}km  ${route.durationMinutes}min  Distance`}
              </span>
            </div>
            <div>
              <span>Fare</span>
              <strong>{formatNaira(estimate)}</strong>
            </div>
          </div>

          <div className="ride-map-tools">
            <button className="ride-safety-chip" type="button" onClick={() => setSafetyOpen(true)}>
              <ShieldCheck size={18} />
              Safety Center
              <ChevronDown size={16} />
            </button>
            <button
              className="ride-locate-button"
              type="button"
              aria-label="Use current pickup location"
              onClick={useCurrentLocation}
              disabled={routeIsLoading}
            >
              <LocateFixed size={21} />
            </button>
          </div>
        </section>

        <section className="ride-sheet" aria-label="Book a ride">
          <form
            className="ride-form"
            onSubmit={(event) => {
              event.preventDefault();
              void confirmRide();
            }}
          >
            <div className="ride-sheet-handle" aria-hidden="true" />

            <div className="ride-driver-row">
              <div className="ride-driver-avatar">
                <UserRound size={22} />
              </div>
              <div>
                <span>{tripPhase === "active" ? "Trip underway" : "Nearest driver"}</span>
                <strong>
                  {selectedClass.name} driver • {selectedClass.car}
                </strong>
              </div>
              <em>{eta} min</em>
            </div>

            <div className="ride-address-card">
              <AddressField
                active={activeAddressField === "pickup"}
                icon={MapPin}
                id="pickup"
                isSearching={activeAddressField === "pickup" && addressSearching}
                label="Pickup"
                suggestions={pickupSuggestions}
                value={pickup}
                onActivate={setActiveAddressField}
                onChange={(value) => {
                  setPickup(value);
                  setPickupSuggestions(getAddressSuggestions(value));
                  setRouteDirty(true);
                  clearActiveTripDraft();
                }}
                onMapTyped={() => {
                  setActiveAddressField(null);
                  void mapRoute();
                }}
                onSelect={(place) => {
                  setPickup(place.label);
                  setActiveAddressField(null);
                  clearActiveTripDraft();
                  void mapRoute(place.label, destination, place);
                }}
              />
              <span className="ride-address-divider" aria-hidden="true" />
              <AddressField
                active={activeAddressField === "destination"}
                icon={Navigation}
                id="destination"
                isSearching={activeAddressField === "destination" && addressSearching}
                label="Destination"
                suggestions={destinationSuggestions}
                value={destination}
                onActivate={setActiveAddressField}
                onChange={(value) => {
                  setDestination(value);
                  setDestinationSuggestions(getAddressSuggestions(value));
                  setRouteDirty(true);
                  clearActiveTripDraft();
                }}
                onMapTyped={() => {
                  setActiveAddressField(null);
                  void mapRoute();
                }}
                onSelect={(place) => {
                  setDestination(place.label);
                  setActiveAddressField(null);
                  clearActiveTripDraft();
                  void mapRoute(pickup, place.label, undefined, place);
                }}
              />
            </div>

            <div className={`ride-route-state map-${mapStatus}`}>
              <span>
                <Clock3 size={16} />
                {tripPhase === "active" ? `${tripProgress}% complete` : `${route.durationMinutes} min trip`}
              </span>
              <span>
                <WalletCards size={16} />
                {formatNaira(estimate)}
              </span>
              <small>
                {tripPhase === "active"
                  ? vehiclePosition
                    ? "Trip started. Tracking follows this device location when permission is on."
                    : "Trip started. Waiting for device location."
                  : routeMessage}
              </small>
            </div>

            <div className="ride-class-selector" aria-label="Ride class">
              {rideClasses.map((option) => {
                const classFare = Math.ceil(
                  Math.max(
                    option.minimumFare,
                    option.baseFare + route.distanceKm * option.perKm + route.durationMinutes * option.perMinute
                  ) + 250
                );

                return (
                  <button
                    className={rideClass === option.name ? "active" : ""}
                    key={option.name}
                    type="button"
                    onClick={() => {
                      setRideClass(option.name);
                      clearActiveTripDraft();
                    }}
                  >
                    <span>{option.name}</span>
                    <strong>{formatNaira(classFare)}</strong>
                  </button>
                );
              })}
            </div>

            <div className="comfort-showcase">
              <div className="comfort-showcase-top">
                <div>
                  <h2>{selectedClass.name}</h2>
                  <p>{selectedClass.detail}</p>
                </div>
                <Image
                  src="/images/fleet/aion-i60-studio-clean.jpg"
                  alt={`${selectedClass.car} ride class`}
                  width={260}
                  height={140}
                  sizes="(max-width: 720px) 44vw, 220px"
                />
              </div>
              <div className="comfort-perk-grid">
                {selectedClass.perks.map((perk) => {
                  const Icon = perk.icon;

                  return (
                    <div className="comfort-perk" key={perk.title}>
                      <Icon size={24} />
                      <strong>{perk.title}</strong>
                      <span>{perk.detail}</span>
                    </div>
                  );
                })}
              </div>
              <div className="comfort-included" aria-label={`${selectedClass.name} benefits`}>
                {selectedClass.included.map((benefit) => (
                  <span key={benefit}>{benefit}</span>
                ))}
              </div>
            </div>

            <div className="ride-music-card" aria-label="Ride music preference">
              <div className="ride-music-heading">
                <span className="ride-music-icon">
                  <Headphones size={19} />
                </span>
                <div>
                  <span>Ride sound</span>
                  <strong>{selectedStationLabel}</strong>
                </div>
                <small>{musicLoading ? "Finding stations" : "Shared with driver"}</small>
              </div>

              <div className="ride-music-moods" aria-label="Music mood">
                {musicMoodOptions.map((option) => (
                  <button
                    className={musicMood === option.tag ? "active" : ""}
                    key={option.tag}
                    type="button"
                    onClick={() => {
                      setMusicMood(option.tag);
                      setMusicQuery("");
                      clearActiveTripDraft();
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <label className="ride-music-search">
                <Search size={15} />
                <input
                  value={musicQuery}
                  placeholder="Search station name"
                  onChange={(event) => {
                    setMusicQuery(event.target.value);
                    clearActiveTripDraft();
                  }}
                />
              </label>

              <div className="ride-station-list">
                {musicStations.slice(0, 3).map((station) => (
                  <button
                    className={selectedStation.id === station.id ? "active" : ""}
                    key={station.id}
                    type="button"
                    onClick={() => {
                      setSelectedStation(station);
                      clearActiveTripDraft();
                    }}
                  >
                    <span>
                      {selectedStation.id === station.id ? <Volume2 size={16} /> : <Radio size={16} />}
                      <strong>{station.name}</strong>
                    </span>
                    <small>{station.subtitle}</small>
                  </button>
                ))}
              </div>

              <div className={`ride-music-player ${musicPlaying ? "active" : ""}`}>
                <span>{musicPlaying ? "Now playing" : musicPlaybackMessage}</span>
                <button type="button" onClick={() => void startRideMusic()} disabled={!selectedStation.streamUrl}>
                  <Volume2 size={15} />
                  Play selected
                </button>
                <audio ref={audioRef} controls preload="none" />
              </div>
            </div>

            <div className="ride-preference-row">
              <ChoiceMenu label="Cabin AC" icon={Snowflake} value={ac} options={acOptions} onChange={setAc} />
              <div className="ride-preference-chip">
                <ThermometerSun size={16} />
                {ac} cabin
              </div>
            </div>

            <button className="ride-confirm-button" type="submit" disabled={routeIsLoading}>
              <CarFront size={19} />
              {routeIsLoading
                ? "Mapping route"
                : tripPhase === "active"
                  ? "Trip active"
                  : `Confirm ${selectedClass.name}`}
              <ArrowRight size={18} />
            </button>

            <div className={`ride-confirmation ${confirmed ? "active" : ""}`}>
              <Check size={17} />
              <span>
                {confirmed
                  ? `${tripPhase === "active" ? "Trip started" : "Ride request ready"} • ${bookingCode} • ${selectedStationLabel}`
                  : "Fare will be verified before payment."}
              </span>
            </div>
          </form>
        </section>
      </div>

      {safetyOpen ? (
        <div className="ride-safety-overlay" role="dialog" aria-modal="true" aria-label="Safety Center">
          <button className="ride-safety-backdrop" type="button" aria-label="Close Safety Center" onClick={() => setSafetyOpen(false)} />
          <aside className="ride-safety-panel">
            <div className="ride-safety-header">
              <div>
                <span>Safety Center</span>
                <strong>{activeTrip ? activeTrip.tripId : "Confirm ride to start"}</strong>
              </div>
              <button type="button" aria-label="Close Safety Center" onClick={() => setSafetyOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ride-safety-trip">
              <span>
                <ShieldCheck size={17} />
                {safetyStatus}
              </span>
              <strong>{activeTrip ? `${activeTrip.pickup} to ${activeTrip.destination}` : "Trip sharing will unlock after confirmation."}</strong>
              <small>
                {activeTrip
                  ? `${activeTrip.driverName} • ${activeTrip.driverPlate} • ${activeTrip.etaMinutes} min ETA`
                  : `${driverProfile.name} • ${driverProfile.plate} • ${selectedClass.name}`}
              </small>
            </div>

            <div className="ride-share-panel">
              <div className="ride-share-title">
                <span>Share contacts</span>
                <strong>
                  {shareNumbers.filter(Boolean).length}/{shareLimit}
                </strong>
              </div>
              <div className="ride-share-inputs">
                {shareNumbers.map((number, index) => (
                  <input
                    key={`${rideClass}-share-${index}`}
                    type="tel"
                    inputMode="tel"
                    placeholder={`Phone ${index + 1}`}
                    value={number}
                    onChange={(event) => {
                      const nextNumbers = [...shareNumbers];
                      nextNumbers[index] = event.target.value;
                      setShareNumbers(nextNumbers);
                    }}
                  />
                ))}
              </div>
              <div className="ride-share-actions">
                <button type="button" onClick={() => void copyTripLink()} disabled={!activeTrip}>
                  <Copy size={16} />
                  Copy link
                </button>
                <button type="button" onClick={sendTripSms} disabled={!activeTrip}>
                  <Send size={16} />
                  Send SMS
                </button>
                <button type="button" onClick={() => void shareNativeTrip()} disabled={!activeTrip}>
                  <Share2 size={16} />
                  Share
                </button>
              </div>
              {shareStatus ? <small>{shareStatus}</small> : null}
            </div>

            <div className="ride-safety-grid">
              <button type="button" onClick={() => setSafetyStatus("Route watch is active.")}>
                <Navigation size={18} />
                <span>Route watch</span>
              </button>
              <button type="button" onClick={() => setSafetyStatus("Arrival check-in armed.")}>
                <Check size={18} />
                <span>Arrive safe</span>
              </button>
              <button type="button" onClick={() => setSafetyStatus("Operations alert queued with trip details.")}>
                <AlertTriangle size={18} />
                <span>Silent alert</span>
              </button>
            </div>

            <div className="ride-emergency-row">
              <a href="tel:112">
                <AlertTriangle size={17} />
                Call 112
              </a>
              <a href="tel:+2348000000000">
                <ShieldCheck size={17} />
                LEEL Ops
              </a>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
