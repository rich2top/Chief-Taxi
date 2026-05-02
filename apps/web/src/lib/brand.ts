export const appBrand = {
  name: "LEEL Ride",
  tagline: "Your ride, your control.",
  market: "Abuja",
  company: "LEEL EV Mobility",
  colors: {
    primary: "#FFC400",
    charcoal: "#0B1020",
    background: "#F5F6F8",
    amber: "#F59E0B",
    blue: "#2F6BFF",
    danger: "#DC2626",
    success: "#16A34A"
  }
} as const;

export const navItems = [
  { href: "/admin", label: "Admin" },
  { href: "/customer", label: "Customer" },
  { href: "/driver", label: "Driver" },
  { href: "/login", label: "Login" }
] as const;
