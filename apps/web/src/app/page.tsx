import {
  ArrowRight,
  BatteryCharging,
  BriefcaseBusiness,
  CarFront,
  Check,
  Crown,
  Gem,
  Globe2,
  Headphones,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Music,
  Navigation,
  PhoneCall,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Share2,
  Youtube
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const navItems = [
  { href: "#ride", label: "Ride" },
  { href: "#business", label: "Business" },
  { href: "#safety", label: "Safety" },
  { href: "#fleet", label: "Fleet" },
  { href: "#contact", label: "Contact" }
] as const;

const rideOptions = [
  {
    title: "Regular",
    detail: "A refined daily EV ride with the essentials already set before pickup.",
    price: "Everyday",
    icon: CarFront,
    features: ["Clean cabin", "Music and AC presets", "Live route sharing"]
  },
  {
    title: "Comfort",
    detail: "Extra room, cleaner cabin air, steady AC, and a calmer driver experience.",
    price: "Comfort",
    icon: Gem,
    features: ["Extra legroom", "Odor-free cabin", "Polite driver"]
  },
  {
    title: "Executive",
    detail: "Premium SUV cabin with priority matching, quiet service, and hospitality add-ons.",
    price: "Premium EV",
    icon: Crown,
    features: ["Wet towel", "Premium wipes", "Water and luggage assist"]
  }
];

const controls = [
  { icon: Music, title: "Ride sound", detail: "Pick Afrobeats, Gospel, Jazz, Calm, News, or a live station." },
  { icon: Snowflake, title: "Cabin AC", detail: "Choose Cool, Normal, or Warm before the driver arrives." },
  { icon: Share2, title: "Trip share", detail: "Send a live trip link to trusted contacts based on ride class." },
  { icon: ShieldCheck, title: "Safety Center", detail: "Route watch, silent alert, emergency call, and operations support." }
];

const fleet = [
  {
    name: "Aion Y Plus",
    className: "Regular EV crossover",
    image: "/images/fleet/aion-y-road-clean.jpg",
    detail: "Roomy crossover comfort for daily rides, airport pickups, and easy city access.",
    specs: ["High ride height", "Quiet EV cabin", "City-ready comfort"]
  },
  {
    name: "Aion i60",
    className: "Comfort compact SUV",
    image: "/images/fleet/aion-i60-mood.jpg",
    detail: "A polished SUV profile for business movement, hotel transfers, and executive trips.",
    specs: ["Executive stance", "Smooth cabin", "Premium arrival"]
  },
  {
    name: "Aion V",
    className: "Executive EV SUV",
    image: "/images/fleet/aion-i60-studio-clean.jpg",
    detail: "A confident SUV presence for executive service, family movement, and longer bookings.",
    specs: ["Executive presence", "Spacious SUV", "Long-trip comfort"]
  }
];

const safetyItems = [
  "Live monitored trips",
  "Driver and vehicle identity",
  "Route deviation checks",
  "SOS escalation desk",
  "Passenger trip sharing",
  "Employee-driver accountability"
];

const footerColumns = [
  {
    title: "Products",
    links: ["Ride", "Reserve", "Airport", "Business"]
  },
  {
    title: "Company",
    links: ["About", "Fleet", "Careers", "Partnerships"]
  },
  {
    title: "Support",
    links: ["Help", "Safety", "Contact", "Lost items"]
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Security"]
  }
];

export default function HomePage() {
  return (
    <main className="site-page">
      <header className="site-header">
        <BrandMark />
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="site-actions">
          <Link className="nav-link" href="/login">
            Log in
          </Link>
          <Link className="nav-link" href="/signup">
            Sign up
          </Link>
          <Link className="button primary" href="/customer">
            Book now
          </Link>
        </div>
      </header>

      <section className="hero-section" id="ride">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/media/aion-v-thumb.jpg"
          aria-hidden="true"
        >
          <source src="/media/aion-v.mp4" type="video/mp4" />
        </video>
        <div className="hero-dim" />

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow dark">
              <Sparkles size={15} />
              Electric taxi platform
            </span>
            <h1>Your ride, your control.</h1>
            <p>
              Book an electric ride, set your ride sound and AC, share the trip, and follow every
              movement until drop-off.
            </p>

            <div className="hero-actions">
              <Link className="button primary large" href="/customer">
                Book a test ride
                <ArrowRight size={19} />
              </Link>
              <Link className="button glass large" href="/driver">
                Driver preview
              </Link>
            </div>
          </div>

          <div className="booking-hero-card" id="booking-panel">
            <div className="booking-card-top">
              <span>Live ride setup</span>
              <strong>8 min</strong>
            </div>
            <div className="booking-field">
              <MapPin size={18} />
              <div>
                <span>Pickup</span>
                <strong>Wuse 2</strong>
              </div>
            </div>
            <div className="booking-field">
              <Navigation size={18} />
              <div>
                <span>Destination</span>
                <strong>Nnamdi Azikiwe Airport</strong>
              </div>
            </div>
            <div className="preference-row">
              <span>
                <Music size={15} />
                Afrobeats
              </span>
              <span>
                <Snowflake size={15} />
                Cool AC
              </span>
              <span>
                <ShieldCheck size={15} />
                Safety Center
              </span>
            </div>
            <Link className="button primary wide" href="/customer">
              Open booking
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="quick-strip" aria-label="LEEL Ride strengths">
          <div>
            <strong>Private</strong>
            <span>Ride setup</span>
          </div>
          <div>
            <strong>Control</strong>
            <span>Sound and AC</span>
          </div>
          <div>
            <strong>Live</strong>
            <span>Trip tracking</span>
          </div>
          <div>
            <strong>EV</strong>
            <span>Electric service</span>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="eyebrow">
            <CarFront size={15} />
            Ride classes
          </span>
          <h2>Simple choices, premium standards.</h2>
          <p>Choose the ride class that fits the trip, then set the comfort details before pickup.</p>
        </div>
        <div className="ride-option-grid">
          {rideOptions.map((option) => {
            const Icon = option.icon;
            return (
              <article className="ride-option" key={option.title}>
                <div className="ride-option-top">
                  <span>{option.price}</span>
                  <Icon size={22} />
                </div>
                <h3>{option.title}</h3>
                <p>{option.detail}</p>
                <ul>
                  {option.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="fleet-section" id="fleet">
        <div className="section-heading">
          <span className="eyebrow dark">
            <BatteryCharging size={15} />
            Electric fleet
          </span>
          <h2>Real EVs. Real comfort. Built for city movement.</h2>
          <p>Comfort-focused electric vehicles for daily rides, airport runs, and executive trips.</p>
        </div>
        <div className="fleet-grid">
          {fleet.map((car) => (
            <article className="fleet-card" key={car.name}>
              <div className="fleet-image-frame">
                <Image
                  src={car.image}
                  alt={`${car.name} electric vehicle`}
                  fill
                  sizes="(max-width: 940px) 100vw, 31vw"
                />
                <span className="fleet-image-gloss" />
              </div>
              <div className="fleet-copy">
                <span>{car.className}</span>
                <h3>{car.name}</h3>
                <p>{car.detail}</p>
                <div className="fleet-specs">
                  {car.specs.map((spec) => (
                    <small key={spec}>{spec}</small>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="controls-section">
        <div className="control-showcase" aria-label="Passenger ride control preview">
          <Image
            className="control-showcase-image"
            src="/images/fleet/aion-interior.jpg"
            alt="Aion electric vehicle interior"
            fill
            sizes="(max-width: 940px) 100vw, 46vw"
          />
          <div className="control-showcase-shade" aria-hidden="true" />
          <div className="ride-console">
            <div className="console-top">
              <div>
                <span>LEEL Ride</span>
                <strong>Active trip</strong>
              </div>
              <small>6 min</small>
            </div>

            <div className="console-map" aria-hidden="true">
              <span className="console-route" />
              <span className="console-pin start" />
              <span className="console-pin end" />
              <span className="console-car">
                <CarFront size={15} />
              </span>
            </div>

            <div className="console-trip">
              <span>
                <MapPin size={14} />
                Wuse 2
              </span>
              <span>
                <Navigation size={14} />
                Nnamdi Azikiwe Airport
              </span>
            </div>

            <div className="console-preferences">
              <span>
                <Music size={14} />
                Afrobeats
              </span>
              <span>
                <Snowflake size={14} />
                Cool
              </span>
              <span>
                <ShieldCheck size={14} />
                Shared
              </span>
            </div>

            <div className="console-climate">
              <span className="climate-dial">
                <Snowflake size={16} />
              </span>
              <div>
                <strong>Cabin control</strong>
                <span>Cool AC and ride sound visible to driver</span>
              </div>
              <small>Active</small>
            </div>

            <button className="console-action">
              View live trip
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
        <div className="section-heading align-left">
          <span className="eyebrow">
            <SlidersHorizontal size={15} />
            Passenger controls
          </span>
          <h2>The customer sets the ride before pickup.</h2>
          <p>
            Set ride sound, AC, route visibility, and safety preferences before the car arrives.
            Keep every important detail visible during the trip.
          </p>
          <div className="control-list">
            {controls.map((item) => {
              const Icon = item.icon;
              return (
                <div className="control-item" key={item.title}>
                  <Icon size={20} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="safety-section" id="safety">
        <div>
          <span className="eyebrow dark">
            <ShieldCheck size={15} />
            Safety and accountability
          </span>
          <h2>Every trip leaves a professional record.</h2>
          <p>
            Since drivers are employees, the company can enforce conduct, monitor service quality,
            respond to SOS events, and review every operational action.
          </p>
        </div>
        <div className="safety-list">
          {safetyItems.map((item) => (
            <span key={item}>
              <Check size={17} />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="business-section" id="business">
        <div className="section-heading">
          <span className="eyebrow">
            <BriefcaseBusiness size={15} />
            Business transport
          </span>
          <h2>Built for everyday rides and business movement.</h2>
          <p>Airport rides, staff movement, hotels, schools, events, and executive bookings.</p>
        </div>
        <div className="business-grid">
          <article>
            <h3>Airport transfer</h3>
            <p>Scheduled EV pickup, luggage assistance, and priority routing.</p>
          </article>
          <article>
            <h3>Corporate accounts</h3>
            <p>Monthly billing, approved riders, route history, and account reporting.</p>
          </article>
          <article>
            <h3>School and family rides</h3>
            <p>Trusted drivers, trip sharing, and monitored recurring pickups.</p>
          </article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-visual" aria-hidden="true" />
        <div className="contact-overlay" aria-hidden="true" />
        <div className="contact-copy">
          <span className="eyebrow dark">
            <PhoneCall size={15} />
            Contact us
          </span>
          <h2>Move with LEEL Ride.</h2>
          <p>Corporate transport, airport movement, partnerships, and rider support handled with a premium EV standard.</p>
          <div className="contact-grid">
            <a href="tel:+2340000000000">
              <PhoneCall size={20} />
              +234 000 000 0000
            </a>
            <a href="mailto:hello@leelride.com">
              <Headphones size={20} />
              hello@leelride.com
            </a>
          </div>
          <div className="contact-proof" aria-label="Contact support areas">
            <span>
              <Check size={15} />
              Fleet enquiries
            </span>
            <span>
              <Check size={15} />
              Corporate accounts
            </span>
            <span>
              <Check size={15} />
              Pilot testing
            </span>
          </div>
        </div>
        <form className="contact-form">
          <label>
            Name
            <input placeholder="Your name" />
          </label>
          <label>
            Interest
            <select defaultValue="corporate">
              <option value="corporate">Corporate rides</option>
              <option value="pilot">Pilot testing</option>
              <option value="partnership">Partnership</option>
              <option value="support">Support</option>
            </select>
          </label>
          <label>
            Message
            <textarea placeholder="Tell us what you need" />
          </label>
          <button className="button primary wide" type="button">
            Send message
          </button>
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <BrandMark />
            <div className="footer-locale">
              <Globe2 size={16} />
              <span>English</span>
              <MapPin size={16} />
              <span>Nigeria</span>
            </div>
          </div>

          <div className="footer-columns">
            {footerColumns.map((column) => (
              <div className="footer-column" key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map((link) => (
                  <a href="#ride" key={link}>
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <div className="footer-social" aria-label="Social links">
              <a href="#contact" aria-label="Instagram">
                <Instagram size={17} />
              </a>
              <a href="#contact" aria-label="LinkedIn">
                <Linkedin size={17} />
              </a>
              <a href="#contact" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="mailto:hello@leelride.com" aria-label="Email">
                <Mail size={17} />
              </a>
            </div>
            <div className="footer-legal">
              <span>© 2026 LEEL Ride</span>
              <a href="#contact">Privacy</a>
              <a href="#contact">Terms</a>
              <a href="#contact">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
