import { brand } from "@leel/shared";

export const appBrand = brand;

export const navItems = [
  { href: "/admin", label: "Admin" },
  { href: "/customer", label: "Customer" },
  { href: "/driver", label: "Driver" },
  { href: "/login", label: "Login" }
] as const;
